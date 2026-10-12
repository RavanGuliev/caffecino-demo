import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiImage, FiTrash2, FiUpload } from "react-icons/fi";
import { Field, Input } from "./ui";

// value: { file, url, remove, current } — current = mövcud şəklin linki
export default function ImageField({ label, current, value, onChange, error }) {
  const { t } = useTranslation("admin");
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!value.file) return setPreview(null);
    const url = URL.createObjectURL(value.file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value.file]);

  const shown = value.remove ? null : preview || value.url || current;

  return (
    <Field label={label} error={error}>
      <div className="flex gap-4 items-start">
        <div className="relative h-28 w-28 shrink-0 rounded-2xl bg-sand/60 ring-1 ring-sand overflow-hidden grid place-items-center">
          {shown ? (
            <img src={shown} alt="" className="h-full w-full object-cover" />
          ) : (
            <FiImage className="text-brand-950/25" size={28} />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-brand-50 text-brand-800 text-xs font-bold ring-1 ring-brand-200 hover:bg-brand-100"
            >
              <FiUpload /> {t("common.upload")}
            </button>
            {shown && (
              <button
                type="button"
                onClick={() => onChange({ file: null, url: "", remove: true })}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-xl text-red-600 text-xs font-bold hover:bg-red-50"
              >
                <FiTrash2 /> {t("common.remove_image")}
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange({ file, url: "", remove: false });
              e.target.value = "";
            }}
          />
          <Input
            value={value.url}
            onChange={(e) => onChange({ file: null, url: e.target.value, remove: false })}
            placeholder={`https://… (${t("common.or_url")})`}
            className="text-xs"
          />
          <p className="text-[11px] text-brand-950/45">{t("common.image_hint")}</p>
        </div>
      </div>
    </Field>
  );
}

export const emptyImage = { file: null, url: "", remove: false };

// Form göndərilərkən API-yə uyğun sahələr
export const imagePayload = (v) => ({
  ...(v.file ? { image: v.file } : {}),
  ...(v.url ? { image_url: v.url } : {}),
  ...(v.remove ? { remove_image: true } : {}),
});
