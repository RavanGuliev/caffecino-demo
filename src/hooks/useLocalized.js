import { useTranslation } from "react-i18next";

const SUPPORTED = ["az", "en", "ru"];

// API obyektlərindən dilə uyğun sahəni qaytarır: L(item, "name") → item.name_az
export default function useLocalized() {
  const { t, i18n } = useTranslation("landing");
  const raw = (i18n.resolvedLanguage || i18n.language || "az").slice(0, 2);
  const lang = SUPPORTED.includes(raw) ? raw : "az";
  const L = (obj, field) => obj?.[`${field}_${lang}`] ?? obj?.[`${field}_az`] ?? "";
  return { t, i18n, lang, L };
}

export const formatPrice = (n) => `${Number(n).toFixed(2)} ₼`;
