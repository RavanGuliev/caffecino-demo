import Logo from "../UI/Logo";
import LanguageSwitcher from "../UI/LanguageSwitcher";
import SocialLinks from "../UI/SocialLinks";

function Header() {
  return (
    <header className="sticky top-0 z-40 bg-brand-900/90 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto max-w-6xl h-16 flex items-center justify-between px-4 md:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <SocialLinks className="hidden sm:flex" />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export default Header;
