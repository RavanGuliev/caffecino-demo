import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import useLocalized, { formatPrice } from "../../hooks/useLocalized";
import SmartImage from "../UI/SmartImage";
import Badge from "../UI/Badge";
import ProductSheet from "./ProductSheet";

// variant: "grid" (default) | "row" (axtarış nəticələri üçün)
function Cards({ product, variant = "grid", style }) {
  const [isOpen, setIsOpen] = useState(false);
  const { L } = useLocalized();
  const name = L(product, "name");
  const description = L(product, "description");
  const firstBadge = product.badges?.[0];
  const fromPrice = product.sizes?.length ? Math.min(...product.sizes.map((s) => s.price)) : product.price;

  return (
    <>
      {variant === "row" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-white ring-1 ring-sand hover:ring-brand-300 text-left transition"
        >
          <SmartImage src={product.img?.[0]} alt={name} className="h-16 w-16 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-[15px] text-brand-950 truncate">{name}</h4>
            <p className="text-xs text-brand-950/55 line-clamp-1">{description}</p>
          </div>
          <span className="shrink-0 pr-1 font-extrabold text-brand-800 text-sm">{formatPrice(fromPrice)}</span>
        </button>
      ) : (
        <article
          onClick={() => setIsOpen(true)}
          style={style}
          className="group cursor-pointer flex flex-col bg-white rounded-3xl p-2 shadow-card ring-1 ring-black/[0.03] hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300 animate-rise"
        >
          <div className="relative">
            <SmartImage
              src={product.img?.[0]}
              alt={name}
              className="aspect-[4/3.4] w-full rounded-[18px]"
              imgClassName="group-hover:scale-105 transition-transform duration-500"
            />
            {firstBadge && (
              <div className="absolute top-2 left-2">
                <Badge type={firstBadge} solid />
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 px-1.5 pt-3 pb-1">
            <h4 className="text-[15px] font-bold leading-snug text-brand-950">{name}</h4>
            <p className="mt-1 text-xs leading-relaxed text-brand-950/55 line-clamp-2">{description}</p>
            <div className="mt-auto pt-3 flex items-center justify-between">
              <span className="text-[15px] font-extrabold text-brand-800">
                {formatPrice(fromPrice)}
              </span>
              <span className="grid place-items-center h-8 w-8 rounded-full bg-brand-800 text-white group-hover:bg-brand-600 transition-colors">
                <FiPlus size={16} />
              </span>
            </div>
          </div>
        </article>
      )}

      {isOpen && <ProductSheet product={product} onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default Cards;
