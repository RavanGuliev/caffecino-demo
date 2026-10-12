import { FaInstagram, FaTiktok } from "react-icons/fa";
import { useSettings } from "../../hooks/useSettings";

export default function SocialLinks({ className = "" }) {
  const cafeInfo = useSettings();
  const cls =
    "grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/15 text-white transition-colors";
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a href={cafeInfo.instagram} target="_blank" rel="noreferrer" className={cls} aria-label="Instagram">
        <FaInstagram size={16} />
      </a>
      <a href={cafeInfo.tiktok} target="_blank" rel="noreferrer" className={cls} aria-label="TikTok">
        <FaTiktok size={14} />
      </a>
    </div>
  );
}
