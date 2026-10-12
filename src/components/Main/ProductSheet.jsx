import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiClock, FiZap } from "react-icons/fi";
import useLocalized, { formatPrice } from "../../hooks/useLocalized";
import SmartImage from "../UI/SmartImage";
import Badge from "../UI/Badge";

export default function ProductSheet({ product, onClose }) {
  const { t, L } = useLocalized();
  const sizes = product.sizes || [];
  const [size, setSize] = useState(sizes.length > 1 ? sizes[1] : sizes[0]);
  const price = size?.price ?? product.price;

  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-brand-950/60 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={L(product, "name")}
    >
      <div className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto scroll-none bg-cream rounded-t-[28px] sm:rounded-[28px] shadow-2xl animate-slide-up sm:animate-pop-in">
        <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 z-10 h-1.5 w-10 rounded-full bg-white/70" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 grid place-items-center h-10 w-10 rounded-full bg-white/90 backdrop-blur text-brand-900 shadow-md hover:bg-white transition"
          aria-label={t("close")}
        >
          <IoClose size={22} />
        </button>

        <SmartImage src={product.img?.[0]} alt={L(product, "name")} className="h-72 sm:h-80 w-full" />

        <div className="relative -mt-6 rounded-t-[28px] bg-cream px-5 pt-6 pb-6 sm:px-6">
          {product.badges?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.badges.map((b) => (
                <Badge key={b} type={b} />
              ))}
            </div>
          )}

          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-[26px] leading-tight font-semibold text-brand-950">
              {L(product, "name")}
            </h2>
            <span className="shrink-0 mt-1 rounded-full bg-brand-800 px-3.5 py-1.5 text-white text-[15px] font-extrabold">
              {formatPrice(price)}
            </span>
          </div>

          <p className="mt-3 text-[15px] leading-relaxed text-brand-950/70">{L(product, "description")}</p>

          {(product.kcal != null || product.time) && (
            <div className="mt-5 flex gap-2">
              {product.kcal != null && (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-brand-800 ring-1 ring-sand">
                  <FiZap className="text-gold" /> {product.kcal} {t("kcal")}
                </span>
              )}
              {product.time && (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-brand-800 ring-1 ring-sand">
                  <FiClock className="text-brand-500" /> ~{product.time} {t("min")}
                </span>
              )}
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-950/50 mb-2.5">{t("size")}</p>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${sizes.length}, minmax(0,1fr))` }}>
                {sizes.map((s) => {
                  const active = s.key === size?.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setSize(s)}
                      className={`rounded-2xl px-3 py-3 text-left transition-all ring-1 ${
                        active
                          ? "bg-brand-800 text-white ring-brand-800 shadow-soft"
                          : "bg-white text-brand-950 ring-sand hover:ring-brand-300"
                      }`}
                    >
                      <span className="block text-lg font-extrabold leading-none">{s.key}</span>
                      <span className={`block text-[11px] mt-1 ${active ? "text-brand-200" : "text-brand-950/50"}`}>
                        {s.ml} ml · {formatPrice(s.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
