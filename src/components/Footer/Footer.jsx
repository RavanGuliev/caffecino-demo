import { FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { useSettings } from "../../hooks/useSettings";
import { useFavorites } from "../../hooks/useFavorites";
import useLocalized from "../../hooks/useLocalized";
import Logo from "../UI/Logo";
import SocialLinks from "../UI/SocialLinks";

function Footer() {
  const { t, L, lang } = useLocalized();
  const cafeInfo = useSettings();
  const { reopenConsent } = useFavorites();
  const row = "flex items-center gap-3 text-sm text-brand-100/80";
  const icon = "grid place-items-center h-8 w-8 rounded-full bg-white/5 text-brand-300 shrink-0";

  return (
    <footer className="relative bg-brand-950 text-white overflow-hidden">
      <div className="grain absolute inset-0 pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6 pt-12 pb-24 sm:pb-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-100/60">{cafeInfo[`footer_text_${lang}`] || t("footer_text")}</p>
            <SocialLinks className="mt-5" />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-300/80 mb-4">{t("visit_us")}</p>
            <p className={row}><span className={icon}><FiMapPin /></span>{L(cafeInfo, "address")}</p>
            <a href={`tel:${(cafeInfo.phone || "").replace(/\s/g, "")}`} className={`${row} hover:text-white`}>
              <span className={icon}><FiPhone /></span>{cafeInfo.phone}
            </a>
            {cafeInfo.email && (
              <a href={`mailto:${cafeInfo.email}`} className={`${row} hover:text-white break-all`}>
                <span className={icon}><FiMail /></span>{cafeInfo.email}
              </a>
            )}
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-300/80 mb-4">{t("hours")}</p>
            <p className={row}><span className={icon}><FiClock /></span>{t("every_day")} · {cafeInfo.hours}</p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-2 justify-between text-xs text-brand-100/40">
          <p>
            © {new Date().getFullYear()} Caffècino. {t("rights")}.
            <button onClick={reopenConsent} className="ml-3 underline underline-offset-2 hover:text-brand-100/80">
              {t("cookie_settings")}
            </button>
          </p>
          <p className="tracking-[0.3em]">THE ART OF COFFEE</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
