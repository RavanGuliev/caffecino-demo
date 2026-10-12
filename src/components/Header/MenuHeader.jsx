import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import LanguageSwitcher from "../UI/LanguageSwitcher";
import useLocalized from "../../hooks/useLocalized";

function MenuHeader({ title, onSearchToggle }) {
  const { t } = useLocalized();
  const btn =
    "grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/15 text-white transition-colors";

  return (
    <header className="sticky top-0 z-40 bg-brand-900/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl h-16 flex items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className={btn} aria-label={t("all_categories")}>
            <IoIosArrowBack size={20} />
          </Link>
          <Link to="/" className="shrink-0">
            <img src="/images/caffecino.png" alt="Caffècino" className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/15" />
          </Link>
          <h1 className="font-display text-lg font-semibold text-white truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onSearchToggle} className={btn} aria-label="Search">
            <GoSearch size={17} />
          </button>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export default MenuHeader;
