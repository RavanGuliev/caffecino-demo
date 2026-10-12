import { Link } from "react-router-dom";

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0" aria-label="Caffècino">
      <img
        src="/icon-192.png"
        alt=""
        className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl object-cover ring-1 ring-white/15 shadow-sm"
      />
      {!compact && (
        <span className="leading-none max-[339px]:hidden">
          <span className="block font-display text-[14px] sm:text-[19px] font-semibold tracking-[0.14em] sm:tracking-[0.18em] text-white">
            CAFFECINO
          </span>
          <span className="block text-[7px] sm:text-[9px] font-semibold tracking-[0.28em] sm:tracking-[0.32em] text-brand-300 mt-1">
            THE ART OF COFFEE
          </span>
        </span>
      )}
    </Link>
  );
}
