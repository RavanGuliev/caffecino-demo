import { Link } from "react-router-dom";
import { PiHeartBold, PiHeartFill } from "react-icons/pi";
import { useFavorites } from "../../hooks/useFavorites";
import useLocalized from "../../hooks/useLocalized";

export default function FavoritesLink() {
  const { count } = useFavorites();
  const { t } = useLocalized();
  return (
    <Link
      to="/favorites"
      aria-label={t("fav_title")}
      className="relative grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/15 text-white transition-colors"
    >
      {count > 0 ? <PiHeartFill size={17} className="text-cream" /> : <PiHeartBold size={17} />}
      {count > 0 && (
        <span
          key={count}
          className="absolute -top-1.5 -right-1.5 grid place-items-center min-w-[19px] h-[19px] px-1 rounded-full bg-gold text-[10px] font-extrabold leading-none text-brand-950 ring-2 ring-brand-900 like-pop"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
