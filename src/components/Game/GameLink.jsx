import { Link } from "react-router-dom";
import { PiGameControllerBold } from "react-icons/pi";
import useLocalized from "../../hooks/useLocalized";

export default function GameLink() {
  const { t } = useLocalized();
  return (
    <Link
      to="/game"
      aria-label={t("game_nav")}
      className="grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/15 text-white transition-colors"
    >
      <PiGameControllerBold size={18} />
    </Link>
  );
}
