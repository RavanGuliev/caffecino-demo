import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiClock, FiInstagram, FiMail, FiPhone, FiWifi } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";
import { adminApi } from "../adminApi";
import { useFeedback } from "../components/Feedback";
import ImageField, { emptyImage } from "../components/ImageField";
import TransFields from "../components/TransFields";
import { Button, Card, Field, Input, PageHeader, Spinner } from "../components/ui";

function IconInput({ Icon, error, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-600" size={15} />
      <Input className="pl-10" error={error} {...props} />
    </div>
  );
}

export default function Settings() {
  const { t } = useTranslation("admin");
  const { toast } = useFeedback();
  const [values, setValues] = useState(null);
  const [hero, setHero] = useState(emptyImage);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    adminApi.settings.get().then(setValues).catch((e) => toast(e.message, "error"));
  }, [toast]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const payload = { ...values };
    if (hero.file) payload.hero_image_file = hero.file;
    else if (hero.url) payload.hero_image = hero.url;
    else if (hero.remove) payload.hero_image = null;
    else delete payload.hero_image; // dəyişməyibsə göndərmə
    try {
      setValues(await adminApi.settings.save(payload));
      setHero(emptyImage);
      toast(t("common.saved"));
    } catch (err) {
      setErrors(err.errors || {});
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!values) return <div className="py-24 grid place-items-center text-brand-700"><Spinner className="h-8 w-8" /></div>;

  const err = (k) => errors[k]?.[0];

  return (
    <form onSubmit={save}>
      <PageHeader
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
        actions={<Button type="submit" loading={saving}>{t("common.save")}</Button>}
      />

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5 space-y-4">
          <h2 className="font-display font-bold text-brand-950">{t("settings.contact")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t("settings.phone")} error={err("phone")}>
              <IconInput Icon={FiPhone} value={values.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="+994 50 000 00 00" />
            </Field>
            <Field label={t("settings.email")} error={err("email")}>
              <IconInput Icon={FiMail} type="email" value={values.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="info@caffecino.az" error={errors.email} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t("settings.hours")} error={err("hours")}>
              <IconInput Icon={FiClock} value={values.hours || ""} onChange={(e) => set("hours", e.target.value)} placeholder="08:00 – 23:00" />
            </Field>
            <Field label={t("settings.wifi")} error={err("wifi")}>
              <IconInput Icon={FiWifi} value={values.wifi || ""} onChange={(e) => set("wifi", e.target.value)} />
            </Field>
          </div>
          <TransFields fields={[{ name: "address", label: t("settings.address") }]} values={values} onChange={set} errors={errors} />
        </Card>

        <div className="space-y-5">
          <Card className="p-5 space-y-4">
            <h2 className="font-display font-bold text-brand-950">{t("settings.social")}</h2>
            <Field label={t("settings.instagram")} error={err("instagram")}>
              <IconInput Icon={FiInstagram} value={values.instagram || ""} onChange={(e) => set("instagram", e.target.value)} error={errors.instagram} />
            </Field>
            <Field label={t("settings.tiktok")} error={err("tiktok")}>
              <IconInput Icon={FaTiktok} value={values.tiktok || ""} onChange={(e) => set("tiktok", e.target.value)} error={errors.tiktok} />
            </Field>
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="font-display font-bold text-brand-950">{t("settings.hero")}</h2>
            <ImageField label={t("settings.hero_image")} current={values.hero_image} value={hero} onChange={setHero} error={err("hero_image_file") || err("hero_image")} />
          </Card>
        </div>

        <Card className="p-5 space-y-4 lg:col-span-2">
          <h2 className="font-display font-bold text-brand-950">{t("settings.texts")}</h2>
          <TransFields
            fields={[
              { name: "hero_title", label: t("settings.hero_title") },
              { name: "hero_text", label: t("settings.hero_text"), textarea: true },
              { name: "footer_text", label: t("settings.footer_text"), textarea: true },
            ]}
            values={values}
            onChange={set}
            errors={errors}
          />
        </Card>
      </div>
    </form>
  );
}
