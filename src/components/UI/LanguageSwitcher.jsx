import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import useLocalized from "../../hooks/useLocalized";

const LANGUAGES = {
  az: { label: "AZ", name: "Azərbaycan", flagUrl: "https://flagcdn.com/w40/az.png" },
  en: { label: "EN", name: "English", flagUrl: "https://flagcdn.com/w40/gb.png" },
  ru: { label: "RU", name: "Русский", flagUrl: "https://flagcdn.com/w40/ru.png" },
};

export default function LanguageSwitcher({ up = false, align = "right" }) {
  const { i18n, lang } = useLocalized();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (stored && LANGUAGES[stored] && stored !== lang) i18n.changeLanguage(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (!open) return;
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const choose = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 h-9 pl-1.5 pr-2.5 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/15 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <img src={LANGUAGES[lang].flagUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
        <span className="text-white text-xs font-bold max-[399px]:hidden">{LANGUAGES[lang].label}</span>
        <FaAngleDown className={`text-white/80 transition-transform ${open ? "rotate-180" : ""}`} size={12} />
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute ${align === "left" ? "left-0" : "right-0"} ${up ? "bottom-full mb-2" : "mt-2"} w-44 rounded-2xl bg-white p-1.5 shadow-soft ring-1 ring-black/5 z-50 animate-pop-in`}
        >
          {Object.entries(LANGUAGES).map(([code, l]) => (
            <li key={code}>
              <button
                onClick={() => choose(code)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                  code === lang ? "bg-brand-50 text-brand-800 font-bold" : "hover:bg-cream text-brand-950"
                }`}
              >
                <img src={l.flagUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
                {l.name}
                {code === lang && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
