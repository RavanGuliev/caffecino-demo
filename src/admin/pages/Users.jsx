import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import { adminApi } from "../adminApi";
import { useAuth } from "../AuthContext";
import { useFeedback } from "../components/Feedback";
import Modal from "../components/Modal";
import { EditDelete } from "../components/RowActions";
import { Button, Card, Field, Input, PageHeader, Spinner } from "../components/ui";
import useList from "../useList";

function UserForm({ item, onClose, onSaved }) {
  const { t } = useTranslation("admin");
  const { toast } = useFeedback();
  const [values, setValues] = useState({ name: item?.name || "", email: item?.email || "", password: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const saved = item ? await adminApi.users.update(item.id, values) : await adminApi.users.create(values);
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
      size="sm"
      title={item ? t("users.edit") : t("users.new")}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>{t("common.cancel")}</Button>
          <Button onClick={submit} loading={saving}>{t("common.save")}</Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label={t("users.name")} required error={errors.name?.[0]}>
          <Input value={values.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
        </Field>
        <Field label={t("users.email")} required error={errors.email?.[0]}>
          <Input type="email" value={values.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
        </Field>
        <Field label={t("users.password")} required={!item} hint={item ? t("users.password_hint") : null} error={errors.password?.[0]}>
          <Input type="password" autoComplete="new-password" value={values.password} onChange={(e) => set("password", e.target.value)} error={errors.password} />
        </Field>
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  );
}

export default function Users() {
  const { t, i18n } = useTranslation("admin");
  const { user: me, setUser } = useAuth();
  const { toast, confirm } = useFeedback();
  const fetcher = useCallback(() => adminApi.users.list(), []);
  const { items, setItems, loading, reload } = useList(fetcher);
  const [editing, setEditing] = useState(null);

  const remove = (u) =>
    confirm({
      message: t("common.confirm_delete", { name: u.name }),
      onConfirm: async () => {
        await adminApi.users.remove(u.id);
        setItems((list) => list.filter((x) => x.id !== u.id));
        toast(t("common.deleted"));
      },
    });

  return (
    <>
      <PageHeader
        title={t("users.title")}
        subtitle={t("users.subtitle")}
        actions={<Button onClick={() => setEditing("new")}><FiPlus /> {t("users.new")}</Button>}
      />
      <Card className="overflow-hidden">
        {loading ? (
          <div className="py-20 grid place-items-center text-brand-700"><Spinner /></div>
        ) : (
          <ul className="divide-y divide-sand">
            {items.map((u) => (
              <li key={u.id} className="flex items-center gap-3 px-4 py-3">
                <span className="grid place-items-center h-10 w-10 rounded-full bg-brand-100 text-brand-800 font-bold shrink-0">
                  {u.name?.[0]?.toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-950 truncate">
                    {u.name} {u.id === me?.id && <span className="ml-1 rounded-full bg-brand-800 px-2 py-0.5 text-[10px] text-white align-middle">{t("users.you")}</span>}
                  </p>
                  <p className="text-xs text-brand-950/50 truncate">{u.email}</p>
                </div>
                <span className="hidden sm:block text-xs text-brand-950/45">
                  {t("users.created")}: {new Date(u.created_at).toLocaleDateString(i18n.resolvedLanguage)}
                </span>
                <EditDelete onEdit={() => setEditing(u)} onDelete={() => remove(u)} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      {editing && (
        <UserForm
          item={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            if (saved.id === me?.id) setUser({ ...me, ...saved });
            setEditing(null);
            reload();
          }}
        />
      )}
    </>
  );
}
