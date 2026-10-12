import { useTranslation } from "react-i18next";
import { FaFire, FaLeaf, FaStar } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const STYLES = {
  popular: { cls: "bg-amber-50 text-amber-800 ring-amber-200", Icon: FaFire },
  new: { cls: "bg-brand-100 text-brand-800 ring-brand-200", Icon: HiSparkles },
  vegan: { cls: "bg-lime-50 text-lime-800 ring-lime-200", Icon: FaLeaf },
  signature: { cls: "bg-brand-900 text-gold ring-brand-900", Icon: FaStar },
};

export default function Badge({ type, solid = false }) {
  const { t } = useTranslation("landing");
  const s = STYLES[type];
  if (!s) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${s.cls} ${solid ? "shadow-sm" : ""}`}
    >
      <s.Icon className="text-[9px]" />
      {t(`badge_${type}`)}
    </span>
  );
}
