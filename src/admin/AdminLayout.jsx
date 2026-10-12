import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiExternalLink, FiGrid, FiHome, FiLayers, FiLogOut, FiMenu, FiSettings, FiShoppingBag, FiUsers, FiX } from "react-icons/fi";
import { PiClover } from "react-icons/pi";
import LanguageSwitcher from "../components/UI/LanguageSwitcher";
import { useAuth } from "./AuthContext";

const NAV = [
  { to: "/admin", key: "dashboard", Icon: FiHome, end: true },
  { to: "/admin/categories", key: "categories", Icon: FiGrid },
  { to: "/admin/sections", key: "sections", Icon: FiLayers },
  { to: "/admin/products", key: "products", Icon: FiShoppingBag },
  { to: "/admin/lucky", key: "lucky", Icon: PiClover },
  { to: "/admin/settings", key: "settings", Icon: FiSettings },
  { to: "/admin/users", key: "users", Icon: FiUsers },
];

function Sidebar({ onNavigate }) {
  const { t } = useTranslation("admin");
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-brand-900 text-white">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5">
        <img src="/icon-192.png" alt="" className="h-9 w-9 rounded-xl ring-1 ring-white/15" />
        <div className="leading-tight">
          <p className="font-display text-sm font-bold tracking-[0.14em]">CAFFECINO</p>
          <p className="text-[11px] text-brand-300">{t("brand")}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 h-11 px-3.5 rounded-xl text-sm font-semibold transition ${
                isActive ? "bg-cream text-brand-900 shadow-soft" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.Icon size={18} />
            {t(`nav.${item.key}`)}
          </NavLink>
        ))}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 h-11 px-3.5 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white"
        >
          <FiExternalLink size={18} />
          {t("nav.view_site")}
        </a>
      </nav>

      <div className="p-3 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="grid place-items-center h-9 w-9 rounded-full bg-brand-600 text-sm font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-[11px] text-white/50 truncate">{user?.email}</p>
            </div>
          </div>
          <LanguageSwitcher up />
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-white/5 text-sm font-semibold text-white/80 hover:bg-red-500/90 hover:text-white transition"
        >
          <FiLogOut /> {t("nav.logout")}
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-cream">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-40">
        <Sidebar />
      </aside>

      {/* Mobil üst panel */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-brand-900">
        <button onClick={() => setOpen(true)} className="grid place-items-center h-9 w-9 rounded-full bg-white/10 text-white">
          <FiMenu size={18} />
        </button>
        <span className="font-display text-sm font-bold tracking-[0.14em] text-white">CAFFECINO</span>
        <LanguageSwitcher />
      </header>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in">
          <div className="w-72 max-w-[85%] h-full shadow-2xl relative">
            <Sidebar onNavigate={() => setOpen(false)} />
            <button onClick={() => setOpen(false)} className="absolute top-3.5 -right-12 grid place-items-center h-9 w-9 rounded-full bg-white text-brand-900">
              <FiX />
            </button>
          </div>
          <div className="flex-1 bg-brand-950/50" onClick={() => setOpen(false)} />
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 md:px-8 py-6 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
