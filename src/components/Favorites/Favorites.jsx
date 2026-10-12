import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { PiHeartFill, PiTrashBold } from "react-icons/pi";
import { getProductsByIds } from "../../api/api";
import { useFavorites } from "../../hooks/useFavorites";
import useLocalized from "../../hooks/useLocalized";
import Cards from "../Main/Cards";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function Favorites() {
  const { ids, remove, clear, consent, accept } = useFavorites();
  const { t } = useLocalized();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const key = ids.join(",");
  useDocumentTitle(t("fav_title"));

  useEffect(() => {
    const list = key ? key.split(",").map(Number) : [];
    if (!list.length) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let alive = true;
    getProductsByIds(list)
      .then((data) => {
        if (!alive) return;
        // menyudan silinmiş/gizlədilmiş məhsulları bəyənmələrdən təmizlə
        const found = new Set(data.map((p) => p.id));
        const missing = list.filter((id) => !found.has(id));
        if (missing.length) remove(missing);
        setProducts(data);
      })
      .catch((err) => console.error("Favorites error:", err))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [key, remove]);

  // bəyənmə sırası ilə (son bəyənilən birinci)
  const ordered = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);

  return (
    <main className="min-h-[70vh] px-4 md:px-6 pt-8 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <span className="grid place-items-center h-12 w-12 rounded-2xl bg-love-soft text-love shrink-0">
              <PiHeartFill size={24} />
            </span>
            <div>
              <h1 className="font-display text-[26px] md:text-[30px] font-semibold text-brand-950 leading-tight">{t("fav_title")}</h1>
              <p className="text-sm text-brand-950/55">
                {ordered.length > 0 ? `${ordered.length} ${t("items")} · ` : ""}{t("fav_sub")}
              </p>
            </div>
          </div>
          {ordered.length > 0 && (
            <button
              onClick={clear}
              aria-label={t("fav_clear")}
              className="shrink-0 inline-flex items-center gap-2 h-10 px-3.5 rounded-full bg-white ring-1 ring-sand text-sm font-semibold text-brand-950/60 hover:text-love hover:ring-love/30 transition"
            >
              <PiTrashBold size={16} /> <span className="hidden sm:inline">{t("fav_clear")}</span>
            </button>
          )}
        </div>

        {consent === "declined" && ids.length > 0 && (
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
            <p className="flex-1 text-sm text-amber-900">{t("fav_not_saved")}</p>
            <button onClick={accept} className="self-start h-9 px-4 rounded-full bg-brand-800 text-white text-sm font-bold hover:bg-brand-700">
              {t("fav_enable")}
            </button>
          </div>
        )}

        {loading && ids.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {ids.slice(0, 8).map((id) => (
              <div key={id} className="rounded-3xl bg-white p-2 ring-1 ring-sand">
                <div className="aspect-[4/3.4] rounded-[18px] skeleton" />
                <div className="h-4 w-3/4 rounded-full skeleton mt-3" />
                <div className="h-4 w-1/3 rounded-full skeleton mt-4 mb-1" />
              </div>
            ))}
          </div>
        ) : ordered.length === 0 ? (
          <div className="py-16 text-center animate-rise">
            <span className="relative mx-auto grid place-items-center h-28 w-28 rounded-full bg-love-soft/70">
              <span className="absolute inset-3 rounded-full bg-love-soft" />
              <span className="lucky-float relative grid place-items-center h-14 w-14 rounded-2xl bg-white text-love shadow-[0_8px_24px_rgb(229_72_77/0.25)]">
                <PiHeartFill size={28} />
              </span>
            </span>
            <h2 className="mt-5 font-display text-xl font-semibold text-brand-950">{t("fav_empty")}</h2>
            <p className="mt-2 text-sm text-brand-950/55 max-w-xs mx-auto">{t("fav_empty_hint")}</p>
            <Link to="/" className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-brand-800 text-white text-sm font-bold hover:bg-brand-700">
              {t("fav_browse")} <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {ordered.map((p) => <Cards key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </main>
  );
}
