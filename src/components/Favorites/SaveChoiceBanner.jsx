import { useFavorites } from "../../hooks/useFavorites";
import useLocalized from "../../hooks/useLocalized";

export default function SaveChoiceBanner() {
  const { consent, accept, decline } = useFavorites();
  const { t } = useLocalized();
  if (consent) return null;

  return (
    <div
      className="fixed inset-x-3 bottom-3 sm:left-auto sm:right-4 sm:bottom-4 sm:w-[380px] z-[85] animate-slide-up"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      role="dialog"
      aria-label={t("cookie_title")}
    >
      <div className="rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-black/5">
        <p className="font-display text-base font-bold text-brand-950">{t("cookie_title")}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-brand-950/65">{t("cookie_text")}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={decline}
            className="h-11 rounded-2xl bg-cream text-sm font-bold text-brand-900/70 hover:bg-sand transition"
          >
            {t("cookie_decline")}
          </button>
          <button
            onClick={accept}
            className="h-11 rounded-2xl bg-brand-800 text-sm font-bold text-white hover:bg-brand-700 transition"
          >
            {t("cookie_accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
