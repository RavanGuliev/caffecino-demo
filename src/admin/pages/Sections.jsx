import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import useLocalized from "../../hooks/useLocalized";
import { adminApi } from "../adminApi";
import { useFeedback } from "../components/Feedback";
import Modal from "../components/Modal";
import { EditDelete, LangDots, MoveButtons } from "../components/RowActions";
import TransFields from "../components/TransFields";
import { Button, Card, EmptyState, Field, Input, PageHeader, Select, Spinner, StatusPill, Toggle } from "../components/ui";
import useList, { moveItem } from "../useList";

const blank = { category_id: "", name_az: "", name_en: "", name_ru: "", slug: "", status: true };

function SectionForm({ item, categories, defaultCategory, onClose, onSaved }) {
  const { t } = useTranslation("admin");
  const { L } = useLocalized();
  const { toast } = useFeedback();
  const [values, setValues] = useState(() => ({ ...blank, category_id: defaultCategory || "", ...(item || {}) }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setErrors({});
    const payload = Object.fromEntries(Object.keys(blank).map((k) => [k, values[k]]));
    try {
      const saved = item ? await adminApi.sections.update(item.id, payload) : await adminApi.sections.create(payload);
      toast(t("common.saved"));
      onSaved(saved);
    } catch (err) {
      setErrors(err.errors || {});
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={item ? t("sections.edit") : t("sections.new")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t("common.cancel")}</Button>
          <Button onClick={submit} loading={saving}>{t("common.save")}</Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <Field label={t("sections.category")} required error={errors.category_id?.[0]}>
          <Select value={values.category_id} onChange={(e) => set("category_id", e.target.value)} error={errors.category_id}>
            <option value="">{t("common.select")}</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{L(c, "name")}</option>)}
          </Select>
        </Field>
        <TransFields fields={[{ name: "name", label: t("common.name"), required: true }]} values={values} onChange={set} errors={errors} />
        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <Field label={t("common.slug")} hint={t("common.slug_hint")} error={errors.slug?.[0]}>
            <Input value={values.slug} onChange={(e) => set("slug", e.target.value)} placeholder="espresso-bar" error={errors.slug} />
          </Field>
          <div className="pb-6">
            <Toggle checked={values.status} onChange={(v) => set("status", v)} label={t("common.visible_on_site")} />
          </div>
        </div>
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}

export default function Sections() {
  const { t } = useTranslation("admin");
  const { L } = useLocalized();
  const { toast, confirm } = useFeedback();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const fetcher = useCallback(() => adminApi.sections.list({ category_id: categoryId }), [categoryId]);
  const { items, setItems, loading, reload } = useList(fetcher);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    adminApi.categories.list().then(setCategories).catch((e) => toast(e.message, "error"));
  }, [toast]);

  // Kateqoriyalar üzrə qruplaşdır (kateqoriya sırası ilə)
  const groups = useMemo(() => {
    const order = new Map(categories.map((c, i) => [c.id, i]));
    const map = new Map();
    items.forEach((s) => {
      if (!map.has(s.category_id)) map.set(s.category_id, []);
      map.get(s.category_id).push(s);
    });
    return [...map.entries()]
      .sort((a, b) => (order.get(a[0]) ?? 999) - (order.get(b[0]) ?? 999))
      .map(([id, list]) => ({ category: categories.find((c) => c.id === id) || list[0].category, list }));
  }, [items, categories]);

  const move = async (group, i, dir) => {
    const next = moveItem(group, i, dir);
    if (!next) return;
    // qrupun elementlərini ümumi siyahıda eyni yerlərdə yeni sıra ilə əvəz et
    const ids = new Set(next.map((x) => x.id));
    let k = 0;
    setItems((all) => all.map((x) => (ids.has(x.id) ? next[k++] : x)));
    try { await adminApi.sections.reorder(next.map((x) => x.id)); } catch (e) { toast(e.message, "error"); reload(); }
  };

  const toggle = async (item) => {
    setItems((list) => list.map((x) => (x.id === item.id ? { ...x, status: !x.status } : x)));
    try { await adminApi.sections.toggle(item.id); } catch (e) { toast(e.message, "error"); reload(); }
  };

  const remove = (item) =>
    confirm({
      message: item.products_count
        ? t("categories.confirm_delete_with_products", { name: L(item, "name"), count: item.products_count })
        : t("common.confirm_delete", { name: L(item, "name") }),
      onConfirm: async () => {
        await adminApi.sections.remove(item.id);
        setItems((list) => list.filter((x) => x.id !== item.id));
        toast(t("common.deleted"));
      },
    });

  return (
    <>
      <PageHeader
        title={t("sections.title")}
        subtitle={t("sections.subtitle")}
        actions={
          <>
            <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-52">
              <option value="">{t("common.all")}</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{L(c, "name")}</option>)}
            </Select>
            <Button onClick={() => setEditing("new")}><FiPlus /> {t("sections.new")}</Button>
          </>
        }
      />

      {loading ? (
        <div className="py-20 grid place-items-center text-brand-700"><Spinner /></div>
      ) : items.length === 0 ? (
        <Card><EmptyState text={t("common.empty")} /></Card>
      ) : (
        <div className="space-y-5">
          {groups.map(({ category, list }) => (
            <Card key={category?.id} className="overflow-hidden">
              <div className="px-4 py-3 bg-brand-50/60 border-b border-sand">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-700">{L(category, "name")}</p>
              </div>
              <ul className="divide-y divide-sand">
                {list.map((s, i) => (
                  <li key={s.id} className="flex items-center gap-3 px-4 py-3 hover:bg-cream/60">
                    <MoveButtons first={i === 0} last={i === list.length - 1} onUp={() => move(list, i, -1)} onDown={() => move(list, i, 1)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-brand-950 truncate">{L(s, "name")}</p>
                        <LangDots item={s} />
                      </div>
                      <p className="text-xs text-brand-950/50">{s.products_count} {t("common.items")} · #{s.slug}</p>
                    </div>
                    <StatusPill active={s.status} onClick={() => toggle(s)} labels={[t("common.active"), t("common.hidden")]} />
                    <EditDelete onEdit={() => setEditing(s)} onDelete={() => remove(s)} />
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <SectionForm
          item={editing === "new" ? null : editing}
          categories={categories}
          defaultCategory={categoryId}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); reload(); }}
        />
      )}
    </>
  );
}
