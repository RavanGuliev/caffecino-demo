import { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { searchProduct } from "../../api/api";
import useLocalized from "../../hooks/useLocalized";
import Cards from "./Cards";

export default function SearchOverlay({ onClose }) {
  const { t } = useLocalized();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const handler = setTimeout(() => {
      searchProduct(query.trim())
        .then((data) => setResults((data.products || []).filter((p) => p.status)))
        .catch((err) => console.error("Search error:", err))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const short = query.trim().length < 2;

  return (
    <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-sm animate-fade-in" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mx-auto mt-3 sm:mt-16 w-[calc(100%-1.5rem)] max-w-lg rounded-[28px] bg-cream shadow-2xl animate-pop-in overflow-hidden">
        <div className="flex items-center gap-2 p-3 border-b border-sand">
          <div className="flex-1 flex items-center gap-2 h-12 px-4 rounded-2xl bg-white ring-1 ring-sand focus-within:ring-2 focus-within:ring-brand-500 transition">
            <GoSearch className="text-brand-700 shrink-0" size={18} />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_placeholder")}
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-brand-950/40"
            />
          </div>
          <button
            onClick={onClose}
            className="grid place-items-center h-12 w-12 rounded-2xl bg-brand-800 text-white hover:bg-brand-700 transition"
            aria-label={t("close")}
          >
            <IoClose size={22} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-3 space-y-2">
          {short && <p className="py-10 text-center text-sm text-brand-950/50">{t("search_hint")}</p>}
          {!short && loading && results.length === 0 &&
            [0, 1, 2].map((i) => <div key={i} className="h-[84px] rounded-2xl skeleton" />)}
          {!short && results.map((p) => <Cards key={p.id} product={p} variant="row" />)}
          {!short && !loading && results.length === 0 && (
            <p className="py-10 text-center text-sm text-brand-950/50">{t("not_found")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
