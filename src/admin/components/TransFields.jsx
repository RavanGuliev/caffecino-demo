import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Field, Input, Textarea } from "./ui";

const LANGS = [
  { code: "az", flag: "https://flagcdn.com/w40/az.png" },
  { code: "en", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "ru", flag: "https://flagcdn.com/w40/ru.png" },
];

// 3 dilli sahələr: fields = [{ name: "name", label, required, textarea }]
// values = { name_az, name_en, ... }; errors Laravel-dən gələn obyekt
export default function TransFields({ fields, values, onChange, errors = {} }) {
  const { t } = useTranslation("admin");
  const [lang, setLang] = useState("az");

  const langState = (code) => {
    const hasError = fields.some((f) => errors[`${f.name}_${code}`]);
    const missing = fields.some((f) => !String(values[`${f.name}_${code}`] ?? "").trim() && (f.required || values[`${f.name}_az`]));
    return { hasError, missing };
  };

  return (
    <div className="rounded-2xl bg-white ring-1 ring-sand">
      <div className="flex items-center gap-1 p-1.5 border-b border-sand">
        {LANGS.map(({ code, flag }) => {
          const { hasError, missing } = langState(code);
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`relative flex items-center gap-2 h-9 px-3 rounded-xl text-xs font-bold uppercase transition ${
                lang === code ? "bg-brand-800 text-white" : "text-brand-950/60 hover:bg-cream"
              }`}
            >
              <img src={flag} alt="" className="h-4 w-4 rounded-full object-cover" />
              {code}
              {(hasError || missing) && (
                <span
                  title={hasError ? "" : t("common.missing_translation")}
                  className={`h-1.5 w-1.5 rounded-full ${hasError ? "bg-red-500" : "bg-amber-400"}`}
                />
              )}
            </button>
          );
        })}
        <span className="ml-auto pr-2 text-[11px] font-semibold text-brand-950/40 hidden sm:block">{t("common.translations")}</span>
      </div>
      <div className="p-4 space-y-4">
        {fields.map((f) => {
          const key = `${f.name}_${lang}`;
          const Comp = f.textarea ? Textarea : Input;
          return (
            <Field key={key} label={`${f.label} (${lang.toUpperCase()})`} required={f.required && lang === "az"} error={errors[key]?.[0]}>
              <Comp
                value={values[key] ?? ""}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={lang !== "az" ? values[`${f.name}_az`] || "" : ""}
                error={errors[key]}
              />
            </Field>
          );
        })}
      </div>
    </div>
  );
}
