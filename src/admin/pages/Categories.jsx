import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import useLocalized from "../../hooks/useLocalized";
import { adminApi } from "../adminApi";
import { useFeedback } from "../components/Feedback";
import ImageField, { emptyImage, imagePayload } from "../components/ImageField";
import Modal from "../components/Modal";
import { EditDelete, LangDots, MoveButtons } from "../components/RowActions";
import TransFields from "../components/TransFields";
import { Button, Card, EmptyState, Field, Input, PageHeader, Spinner, StatusPill, Thumb, Toggle } from "../components/ui";
import useList, { moveItem } from "../useList";

const blank = { name_az: "", name_en: "", name_ru: "", subtitle_az: "", subtitle_en: "", subtitle_ru: "", slug: "", status: true };

function CategoryForm({ item, onClose, onSaved }) {
  const { t } = useTranslation("admin");
  const { toast } = useFeedback();
  const [values, setValues] = useState(() => ({ ...blank, ...(item || {}) }));
  const [image, setImage] = useState(emptyImage);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setErrors({});
    const payload = {
      ...Object.fromEntries(Object.keys(blank).map((k) => [k, values[k]])),
      ...imagePayload(image),
    };
    try {
      const saved = item ? await adminApi.categories.update(item.id, payload) : await adminApi.categories.create(payload);
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
      size="lg"
      title={item ? t("categories.edit") : t("categories.new")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t("common.cancel")}</Button>
          <Button onClick={submit} loading={saving}>{t("common.save")}</Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <TransFields
          fields={[
            { name: "name", label: t("common.name"), required: true },
            { name: "subtitle", label: t("categories.subtitle_field") },
          ]}
          values={values}
          onChange={set}
          errors={errors}
        />
        <ImageField label={t("common.image")} current={item?.img?.[0]} value={image} onChange={setImage} error={errors.image?.[0] || errors.image_url?.[0]} />
        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <Field label={t("common.slug")} hint={t("common.slug_hint")} error={errors.slug?.[0]}>
            <Input value={values.slug} onChange={(e) => set("slug", e.target.value)} placeholder="coffee" error={errors.slug} />
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

export default function Categories() {
  const { t } = useTranslation("admin");
  const { L } = useLocalized();
  const { toast, confirm } = useFeedback();
  const [params, setParams] = useSearchParams();
  const fetcher = useCallback(() => adminApi.categories.list(), []);
  const { items, setItems, loading, reload } = useList(fetcher);
  const [editing, setEditing] = useState(null); // null | "new" | item

  useEffect(() => {
    if (params.get("new")) {
      setEditing("new");
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  const move = async (i, dir) => {
    const next = moveItem(items, i, dir);
    if (!next) return;
    setItems(next);
    try { await adminApi.categories.reorder(next.map((x) => x.id)); } catch (e) { toast(e.message, "error"); reload(); }
  };

  const toggle = async (item) => {
    setItems((list) => list.map((x) => (x.id === item.id ? { ...x, status: !x.status } : x)));
    try { await adminApi.categories.toggle(item.id); } catch (e) { toast(e.message, "error"); reload(); }
  };

  const remove = (item) =>
    confirm({
      message: item.count
        ? t("categories.confirm_delete_with_products", { name: L(item, "name"), count: item.count })
        : t("common.confirm_delete", { name: L(item, "name") }),
      onConfirm: async () => {
        await adminApi.categories.remove(item.id);
        setItems((list) => list.filter((x) => x.id !== item.id));
        toast(t("common.deleted"));
      },
    });

  return (
    <>
      <PageHeader
        title={t("categories.title")}
        subtitle={t("categories.subtitle")}
        actions={<Button onClick={() => setEditing("new")}><FiPlus /> {t("categories.new")}</Button>}
      />

      <Card className="overflow-hidden">
        {loading ? (
          <div className="py-20 grid place-items-center text-brand-700"><Spinner /></div>
        ) : items.length === 0 ? (
          <EmptyState text={t("common.empty")} />
        ) : (
          <ul className="divide-y divide-sand">
            {items.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-cream/60">
                <MoveButtons first={i === 0} last={i === items.length - 1} onUp={() => move(i, -1)} onDown={() => move(i, 1)} />
                <Thumb src={c.img?.[0]} className="h-12 w-12" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-brand-950 truncate">{L(c, "name")}</p>
                    <LangDots item={c} />
                  </div>
                  <p className="text-xs text-brand-950/50 truncate">
                    {c.sections_count} {t("common.sections_count")} · {c.count} {t("common.items")} · /{c.slug}
                  </p>
                </div>
                <StatusPill active={c.status} onClick={() => toggle(c)} labels={[t("common.active"), t("common.hidden")]} />
                <EditDelete onEdit={() => setEditing(c)} onDelete={() => remove(c)} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      {editing && (
        <CategoryForm
          item={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); reload(); }}
        />
      )}
    </>
  );
}
