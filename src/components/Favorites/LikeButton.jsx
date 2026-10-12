import { useState } from "react";
import { PiHeartBold, PiHeartFill } from "react-icons/pi";
import { useFavorites } from "../../hooks/useFavorites";
import useLocalized from "../../hooks/useLocalized";

// size: "sm" (kart üzərində) | "lg" (məhsul pəncərəsində)
export default function LikeButton({ productId, size = "sm", className = "" }) {
  const { isLiked, toggle } = useFavorites();
  const { t } = useLocalized();
  const [pop, setPop] = useState(0);
  const liked = isLiked(productId);

  const dims = size === "lg" ? "h-10 w-10" : "h-9 w-9";
  const icon = size === "lg" ? 20 : 17;
  const position = /\babsolute\b/.test(className) ? "" : "relative";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation(); // kartın özü pəncərəni açmasın
        toggle(productId);
        if (!liked) setPop((n) => n + 1);
      }}
      aria-pressed={liked}
      aria-label={liked ? t("unlike") : t("like")}
      className={`${position} grid place-items-center ${dims} rounded-full bg-white/95 backdrop-blur shadow-[0_2px_8px_rgb(13_36_27/0.12)] ring-1 ring-black/5 transition-transform duration-200 hover:scale-105 active:scale-90 ${className}`}
    >
      {liked ? (
        <PiHeartFill key={pop} size={icon} className="text-love like-pop" />
      ) : (
        <PiHeartBold size={icon} className="text-brand-900/80" />
      )}
      {pop > 0 && liked && <span key={`r${pop}`} className="like-ring pointer-events-none absolute inset-0 rounded-full" />}
    </button>
  );
}
