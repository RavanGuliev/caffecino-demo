import { Link } from "react-router-dom";

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Caffècino">
      <img
        src="/images/caffecino.png"
        alt=""
        className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/15 shadow-sm"
      />
      {!compact && (
        <span className="leading-none max-[379px]:hidden">
          <span className="block font-display text-[19px] font-semibold tracking-[0.18em] text-white">
            CAFFÈCINO
          </span>
          <span className="block text-[9px] font-semibold tracking-[0.32em] text-brand-300 mt-1">
            THE ART OF COFFEE
          </span>
        </span>
      )}
    </Link>
  );
}
