import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import useLocalized, { formatPrice } from "../../hooks/useLocalized";
import Badge from "../../components/UI/Badge";
import { adminApi } from "../adminApi";
import { useFeedback } from "../components/Feedback";
import ImageField, { emptyImage, imagePayload } from "../components/ImageField";
import Modal from "../components/Modal";
import { EditDelete, LangDots, MoveButtons } from "../components/RowActions";
import TransFields from "../components/TransFields";
import { Button, Card, EmptyState, Field, Input, PageHeader, Select, Spinner, StatusPill, Thumb, Toggle } from "../components/ui";
import useList, { moveItem } from "../useList";

const BADGES = ["popular", "new", "vegan", "signature"];
const blank = {
  section_id: "", name_az: "", name_en: "", name_ru: "", description_az: "", description_en: "", description_ru: "",
  price: "", kcal: "", prep_time: "", badges: [], sizes: [], status: true,
};

function SectionSelect({ value, onChange, sections, categories, error, allLabel }) {
  const { L } = useLocalized();
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)} error={error}>
      <option value="">{allLabel}</option>
      {categories.map((c) => (
        <optgroup key={c.id} label={L(c, "name")}>
          {sections.filter((s) => s.category_id === c.id).map((s) => (
            <option key={s.id} value={s.id}>{L(s, "name")}</option>
          ))}
        </optgroup>
      ))}
    </Select>
  );
}

function ProductForm({ item, sections, categories, defaultSection, onClose, onSaved }) {
  const { t } = useTranslation("admin");
  const { toast } = useFeedback();
  const [values, setValues] = useState(() => ({
    ...blank,
    section_id: defaultSection || "",
    ...(item ? { ...item, kcal: item.kcal ?? "", prep_time: item.time ?? "" } : {}),
  }));
  const [image, setImage] = useState(emptyImage);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  const toggleBadge = (b) => set("badges", values.badges.includes(b) ? values.badges.filter((x) => x !== b) : [...values.badges, b]);
  const setSize = (i, k, v) => set("sizes", values.sizes.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)));
  const addSize = () => {
    const next = ["S", "M", "L", "XL"][values.sizes.length] || "";
    set("sizes", [...values.sizes, { key: next, ml: "", price: values.price || "" }]);
  };

  const submit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setErrors({});
    const payload = {
      ...Object.fromEntries(Object.keys(blank).map((k) => [k, values[k]])),
      sizes: values.sizes.map((s) => ({ key: s.key, ml: s.ml === "" ? null : Number(s.ml), price: s.price === "" ? null : Number(s.price) })),
      ...imagePayload(image),
    };
    try {
      const saved = item ? await adminApi.products.update(item.id, payload) : await adminApi.products.create(payload);
      toast(t("common.saved"));
      onSaved(saved);
    } catch (err) {
      setErrors(err.errors || {});
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const sizeErr = Object.keys(errors).find((k) => k.startsWith("sizes"));

  return (
    <Modal
      open
      size="lg"
      title={item ? t("products.edit") : t("products.new")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t("common.cancel")}</Button>
          <Button onClick={submit} loading={saving}>{t("common.save")}</Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t("products.section")} required error={errors.section_id?.[0]}>
            <SectionSelect value={values.section_id} onChange={(v) => set("section_id", v)} sections={sections} categories={categories} error={errors.section_id} allLabel={t("common.select")} />
          </Field>
          <Field label={t("products.price")} required error={errors.price?.[0]}>
            <Input type="number" step="0.01" min="0" value={values.price} onChange={(e) => set("price", e.target.value)} error={errors.price} />
          </Field>
        </div>

        <TransFields
          fields={[
            { name: "name", label: t("common.name"), required: true },
            { name: "description", label: t("products.description"), textarea: true },
          ]}
          values={values}
          onChange={set}
          errors={errors}
        />

        <ImageField label={t("common.image")} current={item?.img?.[0]} value={image} onChange={setImage} error={errors.image?.[0] || errors.image_url?.[0]} />

        <div className="grid grid-cols-2 gap-4">
          <Field label={t("products.kcal")} error={errors.kcal?.[0]}>
            <Input type="number" min="0" value={values.kcal} onChange={(e) => set("kcal", e.target.value)} />
          </Field>
          <Field label={t("products.prep_time")} error={errors.prep_time?.[0]}>
            <Input type="number" min="0" value={values.prep_time} onChange={(e) => set("prep_time", e.target.value)} />
          </Field>
        </div>

        <Field label={t("products.badges")}>
          <div className="flex flex-wrap gap-2">
            {BADGES.map((b) => {
              const on = values.badges.includes(b);
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBadge(b)}
                  className={`rounded-full p-1 ring-2 transition ${on ? "ring-brand-500" : "ring-transparent opacity-50 hover:opacity-100"}`}
                >
                  <Badge type={b} />
                </button>
              );
            })}
          </div>
        </Field>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-brand-950/70">{t("products.sizes")}</span>
            <Button type="button" variant="ghost" size="sm" onClick={addSize} disabled={values.sizes.length >= 6}>
              <FiPlus /> {t("products.add_size")}
            </Button>
          </div>
          {values.sizes.length === 0 ? (
            <p className="text-xs text-brand-950/45">{t("products.sizes_hint")}</p>
          ) : (
            <div className="space-y-2">
              {values.sizes.map((s, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                  <Input value={s.key} onChange={(e) => setSize(i, "key", e.target.value)} placeholder={t("products.size_key")} />
                  <Input type="number" min="0" value={s.ml ?? ""} onChange={(e) => setSize(i, "ml", e.target.value)} placeholder={t("products.size_ml")} />
                  <Input type="number" step="0.01" min="0" value={s.price ?? ""} onChange={(e) => setSize(i, "price", e.target.value)} placeholder={t("products.size_price")} />
                  <Button type="button" variant="danger-ghost" size="icon" onClick={() => set("sizes", values.sizes.filter((_, idx) => idx !== i))}>
                    <FiTrash2 />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {sizeErr && <p className="text-xs text-red-600 mt-1">{errors[sizeErr][0]}</p>}
        </div>

        <Toggle checked={values.status} onChange={(v) => set("status", v)} label={t("common.visible_on_site")} />
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}

export default function Products() {
  const { t } = useTranslation("admin");
  const { L } = useLocalized();
  const { toast, confirm } = useFeedback();
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const fetcher = useCallback(() => adminApi.products.list(), []);
  const { items, setItems, loading, reload } = useList(fetcher);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    Promise.all([adminApi.categories.list(), adminApi.sections.list()])
      .then(([c, s]) => { setCategories(c); setSections(s); })
      .catch((e) => toast(e.message, "error"));
  }, [toast]);

  useEffect(() => {
    if (params.get("new")) {
      setEditing("new");
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  // Filtrlər + bölmələr üzrə qruplaşdırma (kateqoriya və bölmə sırası ilə)
  const groups = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    const filtered = items.filter((p) =>
      (!sectionId || String(p.section_id) === sectionId) &&
      (!categoryId || String(p.category_id) === categoryId) &&
      (status === "" || String(p.status) === status) &&
      (!q || ["az", "en", "ru"].some((l) => p[`name_${l}`]?.toLocaleLowerCase().includes(q))));
    const catOrder = new Map(categories.map((c, i) => [c.id, i]));
    return sections
      .slice()
      .sort((a, b) => (catOrder.get(a.category_id) ?? 0) - (catOrder.get(b.category_id) ?? 0) || a.sort_order - b.sort_order)
      .map((s) => ({ section: s, list: filtered.filter((p) => p.section_id === s.id) }))
      .filter((g) => g.list.length > 0);
  }, [items, sections, categories, categoryId, sectionId, status, query]);

  const total = groups.reduce((n, g) => n + g.list.length, 0);
  const sectionOptions = categoryId ? sections.filter((s) => String(s.category_id) === categoryId) : sections;

  const move = async (group, i, dir) => {
    const next = moveItem(group, i, dir);
    if (!next) return;
    const ids = new Set(next.map((x) => x.id));
    let k = 0;
    setItems((all) => all.map((x) => (ids.has(x.id) ? next[k++] : x)));
    try { await adminApi.products.reorder(next.map((x) => x.id)); } catch (e) { toast(e.message, "error"); reload(); }
  };

  const toggle = async (item) => {
    setItems((list) => list.map((x) => (x.id === item.id ? { ...x, status: !x.status } : x)));
    try { await adminApi.products.toggle(item.id); } catch (e) { toast(e.message, "error"); reload(); }
  };

  const remove = (item) =>
    confirm({
      message: t("common.confirm_delete", { name: L(item, "name") }),
      onConfirm: async () => {
        await adminApi.products.remove(item.id);
        setItems((list) => list.filter((x) => x.id !== item.id));
        toast(t("common.deleted"));
      },
    });

  const filtering = query || status !== "";

  return (
    <>
      <PageHeader
        title={t("products.title")}
        subtitle={`${t("products.subtitle")} · ${items.length}`}
        actions={<Button onClick={() => setEditing("new")}><FiPlus /> {t("products.new")}</Button>}
      />

      <Card className="p-3 mb-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex items-center gap-2 h-10 px-3 rounded-xl ring-1 ring-sand focus-within:ring-2 focus-within:ring-brand-500">
          <FiSearch className="text-brand-950/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("common.search")} className="w-full bg-transparent text-sm outline-none" />
        </label>
        <Select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setSectionId(""); }}>
          <option value="">{t("products.category")}: {t("common.all")}</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{L(c, "name")}</option>)}
        </Select>
        <Select value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
          <option value="">{t("products.section")}: {t("common.all")}</option>
          {sectionOptions.map((s) => <option key={s.id} value={s.id}>{L(s, "name")}</option>)}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">{t("common.status")}: {t("common.all")}</option>
          <option value="true">{t("common.active")}</option>
          <option value="false">{t("common.hidden")}</option>
        </Select>
      </Card>

      {loading ? (
        <div className="py-20 grid place-items-center text-brand-700"><Spinner /></div>
      ) : total === 0 ? (
        <Card><EmptyState text={items.length ? t("common.no_results") : t("common.empty")} /></Card>
      ) : (
        <div className="space-y-5">
          {groups.map(({ section, list }) => (
            <Card key={section.id} className="overflow-hidden">
              <div className="px-4 py-3 bg-brand-50/60 border-b border-sand flex items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
                  {L(categories.find((c) => c.id === section.category_id), "name")} <span className="text-brand-950/30">/</span> {L(section, "name")}
                </p>
                <span className="text-xs font-semibold text-brand-950/40">{list.length}</span>
              </div>
              <ul className="divide-y divide-sand">
                {list.map((p, i) => (
                  <li key={p.id} className={`flex items-center gap-3 px-3 sm:px-4 py-3 hover:bg-cream/60 ${p.status ? "" : "opacity-60"}`}>
                    {!filtering && (
                      <div className="hidden sm:block">
                        <MoveButtons first={i === 0} last={i === list.length - 1} onUp={() => move(list, i, -1)} onDown={() => move(list, i, 1)} />
                      </div>
                    )}
                    <Thumb src={p.img?.[0]} className="h-12 w-12" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setEditing(p)} className="font-semibold text-brand-950 truncate hover:text-brand-600 text-left">{L(p, "name")}</button>
                        <LangDots item={p} />
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {p.badges.map((b) => <Badge key={b} type={b} />)}
                        {p.sizes.length > 0 && (
                          <span className="rounded-full bg-brand-950/5 px-2 py-0.5 text-[10px] font-bold text-brand-950/60">
                            {p.sizes.map((s) => s.key).join(" / ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-brand-800 text-sm tabular-nums whitespace-nowrap">{formatPrice(p.price)}</span>
                    <div className="hidden md:block">
                      <StatusPill active={p.status} onClick={() => toggle(p)} labels={[t("common.active"), t("common.hidden")]} />
                    </div>
                    <EditDelete onEdit={() => setEditing(p)} onDelete={() => remove(p)} />
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <ProductForm
          item={editing === "new" ? null : editing}
          sections={sections}
          categories={categories}
          defaultSection={sectionId}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); reload(); }}
        />
      )}
    </>
  );
}
