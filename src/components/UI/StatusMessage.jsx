import { Link } from "react-router-dom";
import { PiArrowCounterClockwiseBold, PiCoffeeBold, PiWifiSlashBold } from "react-icons/pi";
import useLocalized from "../../hooks/useLocalized";
import useDocumentTitle from "../../hooks/useDocumentTitle";

// API cavab verməyəndə göstərilir
export function ErrorState({ onRetry }) {
  const { t } = useLocalized();
  return (
    <div className="py-14 px-6 text-center animate-rise" role="alert">
      <span className="mx-auto grid place-items-center h-16 w-16 rounded-2xl bg-sand text-brand-800">
        <PiWifiSlashBold size={28} />
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold text-brand-950">{t("error_title")}</h2>
      <p className="mt-1.5 text-sm text-brand-950/55 max-w-xs mx-auto">{t("error_text")}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-brand-800 text-white text-sm font-bold hover:bg-brand-700 transition"
        >
          <PiArrowCounterClockwiseBold /> {t("retry")}
        </button>
      )}
    </div>
  );
}

export function NotFound() {
  const { t } = useLocalized();
  useDocumentTitle(t("not_found_title"));
  return (
    <main className="min-h-[70vh] grid place-items-center px-6 py-16 text-center">
      <div className="animate-rise">
        <p className="font-display text-[96px] leading-none font-bold text-brand-800/15">404</p>
        <span className="-mt-10 mx-auto grid place-items-center h-16 w-16 rounded-2xl bg-brand-800 text-cream shadow-soft relative">
          <PiCoffeeBold size={30} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-brand-950">{t("not_found_title")}</h1>
        <p className="mt-2 text-sm text-brand-950/55 max-w-xs mx-auto">{t("not_found_text")}</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-brand-800 text-white text-sm font-bold hover:bg-brand-700 transition"
        >
          {t("go_home")}
        </Link>
      </div>
    </main>
  );
}
