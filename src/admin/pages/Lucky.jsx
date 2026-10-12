import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCalendar, FiExternalLink, FiPlus } from "react-icons/fi";
import { PiCloverFill } from "react-icons/pi";
import useLocalized, { formatPrice } from "../../hooks/useLocalized";
import { adminApi } from "../adminApi";
import { useFeedback } from "../components/Feedback";
import Modal from "../components/Modal";
import { EditDelete } from "../components/RowActions";
import TransFields from "../components/TransFields";
import { Button, Card, EmptyState, Field, Input, PageHeader, Select, Spinner, StatusPill, Thumb, Toggle } from "../components/ui";
import useList from "../useList";

const blank = {
  product_id: "", title_az: "", title_en: "", title_ru: "", message_az: "", message_en: "", message_ru: "",
  discount_percent: "", code: "", starts_at: "", ends_at: "", weight: 1, status: true,
};

const todayStr = () => new Date().toISOString().slice(0, 10);

// Tarixə görə vəziyyət: always | active | scheduled | expired
function dateState(o) {
  const d = todayStr();
  if (o.ends_at && o.ends_at < d) return "expired";
  if (o.starts_at && o.starts_at > d) return "scheduled";
  return o.starts_at || o.ends_at ? "active" : "always";
}

function LuckyForm({ item, products, sections, categories, onClose, onSaved }) {
  const { t } = useTranslation("admin");
  const { L } = useLocalized();
  const { toast } = useFeedback();
  const [values, setValues] = useState(() => ({
    ...blank,
    ...(item ? Object.fromEntries(Object.keys(blank).map((k) => [k, item[k] ?? blank[k]])) : {}),
  }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  const product = products.find((p) => String(p.id) === String(values.product_id));
  const discount = Number(values.discount_percent) || 0;

  const submit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const saved = item ? await adminApi.lucky.update(item.id, values) : await adminApi.lucky.create(values);
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
      title={item ? t("lucky.edit") : t("lucky.new")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t("common.cancel")}</Button>
          <Button onClick={submit} loading={saving}>{t("common.save")}</Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <Field label={t("lucky.product")} required error={errors.product_id?.[0]}>
          <Select value={values.product_id} onChange={(e) => set("product_id", e.target.value)} error={errors.product_id}>
            <option value="">{t("common.select")}</option>
            {categories.map((c) =>
              sections.filter((s) => s.category_id === c.id).map((s) => (
                <optgroup key={s.id} label={`${L(c, "name")} / ${L(s, "name")}`}>
                  {products.filter((p) => p.section_id === s.id).map((p) => (
                    <option key={p.id} value={p.id}>{L(p, "name")} — {formatPrice(p.price)}</option>
                  ))}
                </optgroup>
              ))
            )}
          </Select>
        </Field>

        {product && (
          <div className="flex items-center gap-3 rounded-2xl bg-brand-900 p-3 text-white">
            <Thumb src={product.img?.[0]} className="h-14 w-14" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{L(product, "name")}</p>
              <p className="text-xs text-white/60 truncate">{L(product, "description")}</p>
            </div>
            <div className="text-right">
              {discount > 0 ? (
                <>
                  <p className="font-bold text-gold">{formatPrice(product.price * (100 - discount) / 100)}</p>
                  <p className="text-xs text-white/40 line-through">{formatPrice(product.price)}</p>
                </>
              ) : (
                <p className="font-bold">{formatPrice(product.price)}</p>
              )}
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <Field label={t("lucky.discount")} hint={t("lucky.discount_hint")} error={errors.discount_percent?.[0]}>
            <Input type="number" min="0" max="90" value={values.discount_percent ?? ""} onChange={(e) => set("discount_percent", e.target.value)} error={errors.discount_percent} />
          </Field>
          <Field label={t("lucky.code")} hint={t("lucky.code_hint")} error={errors.code?.[0]}>
            <Input value={values.code ?? ""} onChange={(e) => set("code", e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="LUCKY15" className="font-mono tracking-widest" />
          </Field>
          <Field label={t("lucky.weight")} hint={t("lucky.weight_hint")} error={errors.weight?.[0]}>
            <Input type="number" min="1" max="100" value={values.weight} onChange={(e) => set("weight", e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label={t("lucky.starts")} error={errors.starts_at?.[0]}>
            <Input type="date" value={values.starts_at ?? ""} onChange={(e) => set("starts_at", e.target.value)} />
          </Field>
          <Field label={t("lucky.ends")} error={errors.ends_at?.[0]}>
            <Input type="date" value={values.ends_at ?? ""} onChange={(e) => set("ends_at", e.target.value)} />
          </Field>
          <p className="col-span-2 -mt-2 text-xs text-brand-950/45">{t("lucky.dates_hint")}</p>
        </div>

        <div>
          <p className="text-xs text-brand-950/45 mb-2">{t("lucky.texts_hint")}</p>
          <TransFields
            fields={[
              { name: "title", label: t("lucky.title_field") },
              { name: "message", label: t("lucky.message_field"), textarea: true },
            ]}
            values={values}
            onChange={set}
            errors={errors}
          />
        </div>

        <Toggle checked={values.status} onChange={(v) => set("status", v)} label={t("common.visible_on_site")} />
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}

export default function Lucky() {
  const { t } = useTranslation("admin");
  const { L } = useLocalized();
  const { toast, confirm } = useFeedback();
  const fetcher = useCallback(() => adminApi.lucky.list(), []);
  const { items, setItems, loading, reload } = useList(fetcher);
  const [catalog, setCatalog] = useState({ products: [], sections: [], categories: [] });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    Promise.all([adminApi.products.list(), adminApi.sections.list(), adminApi.categories.list()])
      .then(([products, sections, categories]) => setCatalog({ products, sections, categories }))
      .catch((e) => toast(e.message, "error"));
  }, [toast]);

  // Bu gün düşmə ehtimalı (aktiv təkliflərin çəkisinə görə)
  const chances = useMemo(() => {
    const live = items.filter((o) => o.status && o.product?.status && !["expired", "scheduled"].includes(dateState(o)));
    const total = live.reduce((n, o) => n + Math.max(1, o.weight), 0);
    return new Map(live.map((o) => [o.id, Math.round((Math.max(1, o.weight) / total) * 100)]));
  }, [items]);

  const toggle = async (item) => {
    setItems((list) => list.map((x) => (x.id === item.id ? { ...x, status: !x.status } : x)));
    try { await adminApi.lucky.toggle(item.id); } catch (e) { toast(e.message, "error"); reload(); }
  };

  const remove = (item) =>
    confirm({
      message: t("common.confirm_delete", { name: L(item.product, "name") }),
      onConfirm: async () => {
        await adminApi.lucky.remove(item.id);
        setItems((list) => list.filter((x) => x.id !== item.id));
        toast(t("common.deleted"));
      },
    });

  const stateLabel = { always: t("lucky.always"), scheduled: t("lucky.scheduled"), expired: t("lucky.expired") };

  return (
    <>
      <PageHeader
        title={t("lucky.title")}
        subtitle={t("lucky.subtitle")}
        actions={
          <>
            <a href="/?lucky=1" target="_blank" rel="noreferrer">
              <Button variant="secondary"><FiExternalLink /> {t("lucky.preview")}</Button>
            </a>
            <Button onClick={() => setEditing("new")}><FiPlus /> {t("lucky.new")}</Button>
          </>
        }
      />

      {loading ? (
        <div className="py-20 grid place-items-center text-brand-700"><Spinner /></div>
      ) : items.length === 0 ? (
        <Card><EmptyState text={t("common.empty")} action={<Button onClick={() => setEditing("new")}><FiPlus /> {t("lucky.new")}</Button>} /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((o) => {
            const state = dateState(o);
            const chance = chances.get(o.id);
            return (
              <Card key={o.id} className={`overflow-hidden flex flex-col ${o.status && state !== "expired" ? "" : "opacity-60"}`}>
                <div className="relative h-36 bg-brand-900">
                  <img src={o.product?.img?.[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 to-transparent" />
                  {o.discount_percent > 0 && (
                    <span className="absolute top-3 right-3 rounded-full bg-gold px-2.5 py-1 text-xs font-extrabold text-brand-950">-{o.discount_percent}%</span>
                  )}
                  {chance != null && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-xs font-bold text-white ring-1 ring-white/20">
                      <PiCloverFill className="text-gold" /> {t("lucky.chance")}: {chance}%
                    </span>
                  )}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gold truncate">{L(o, "title") || "—"}</p>
                    <p className="font-display text-lg font-bold truncate">{L(o.product, "name")}</p>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {o.code && <span className="rounded-lg border border-dashed border-brand-300 bg-brand-50 px-2 py-1 font-mono font-bold tracking-widest text-brand-800">{o.code}</span>}
                    <span className="inline-flex items-center gap-1 rounded-lg bg-cream px-2 py-1 font-semibold text-brand-950/60">
                      <FiCalendar />
                      {state === "active" ? `${o.starts_at || "…"} → ${o.ends_at || "…"}` : stateLabel[state]}
                    </span>
                    {o.new_price != null && (
                      <span className="font-bold text-brand-800">
                        {formatPrice(o.new_price)} <span className="font-normal text-brand-950/40 line-through">{formatPrice(o.product?.price)}</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <StatusPill active={o.status} onClick={() => toggle(o)} labels={[t("common.active"), t("common.hidden")]} />
                    <EditDelete onEdit={() => setEditing(o)} onDelete={() => remove(o)} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {editing && (
        <LuckyForm
          item={editing === "new" ? null : editing}
          {...catalog}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); reload(); }}
        />
      )}
    </>
  );
}
