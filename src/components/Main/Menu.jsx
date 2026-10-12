import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getFullCategory, getProductsByCategory } from "../../api/api";
import useLocalized from "../../hooks/useLocalized";
import MenuHeader from "../Header/MenuHeader";
import SmartImage from "../UI/SmartImage";
import Cards from "./Cards";
import SearchOverlay from "./SearchOverlay";
import { ErrorState, NotFound } from "../UI/StatusMessage";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const HEADER_H = 64; // MenuHeader hündürlüyü
const TABS_H = 60; // bölmə tablarının hündürlüyü

function CategorySwitcher({ categories }) {
  const { L } = useLocalized();
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.querySelector("[aria-current='page']")?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [categories]);

  return (
    <div ref={ref} className="flex gap-2 overflow-x-auto hide-scrollbar px-4 md:px-6 py-4">
      {categories.map((c) => (
        <NavLink
          key={c.id}
          to={`/menu/${c.id}`}
          replace
          className={({ isActive }) =>
            `shrink-0 flex items-center gap-2 h-11 pl-1.5 pr-4 rounded-full text-sm font-bold transition-all ${
              isActive
                ? "bg-cream text-brand-900 shadow-soft"
                : "bg-white/10 text-white/85 ring-1 ring-white/15 hover:bg-white/20"
            }`
          }
        >
          <SmartImage src={c.img?.[0]} alt="" className="h-8 w-8 rounded-full" />
          {L(c, "name")}
        </NavLink>
      ))}
    </div>
  );
}

export default function Menu() {
  const { categoryId } = useParams();
  const { t, L } = useLocalized();
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // null | "notfound" | "network"
  const [reloadKey, setReloadKey] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [active, setActive] = useState("");
  const tabsRef = useRef(null);
  const lockRef = useRef(false);

  const category = categories.find((c) => String(c.id) === String(categoryId));
  useDocumentTitle(category ? L(category, "name") : null, category ? L(category, "subtitle") : undefined);

  useEffect(() => {
    getFullCategory()
      .then((cats) => setCategories(cats.filter((c) => c.status)))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await getProductsByCategory(categoryId);
        const filtered = data
          .filter((s) => s.status)
          .map((s) => ({ ...s, products: s.products.filter((p) => p.status) }))
          .filter((s) => s.products.length > 0);
        setSections(filtered);
        setActive(filtered[0]?.slug || "");
      } catch (err) {
        console.error("Error loading menu:", err);
        setSections([]);
        setError(err.status === 404 ? "notfound" : "network");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [categoryId, reloadKey]);

  // Scroll zamanı aktiv bölməni təyin et
  useEffect(() => {
    if (!sections.length) return;
    const onScroll = () => {
      if (lockRef.current) return;
      let current = sections[0].slug;
      for (const s of sections) {
        const el = document.getElementById(s.slug);
        if (el && el.getBoundingClientRect().top - HEADER_H - TABS_H - 24 <= 0) current = s.slug;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  // Aktiv tab görünən sahədə qalsın
  useEffect(() => {
    const el = tabsRef.current?.querySelector(`[data-slug="${active}"]`);
    if (el) {
      const box = tabsRef.current;
      box.scrollTo({ left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
    }
  }, [active]);

  const scrollToSection = (slug) => {
    const el = document.getElementById(slug);
    if (!el) return;
    setActive(slug);
    lockRef.current = true;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_H - TABS_H - 8, behavior: "smooth" });
    setTimeout(() => (lockRef.current = false), 700);
  };

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  if (error === "notfound") {
    return (
      <>
        <MenuHeader title="" onSearchToggle={() => setSearchOpen(true)} />
        <NotFound />
        {searchOpen && <SearchOverlay onClose={closeSearch} />}
      </>
    );
  }
  const totalItems = sections.reduce((n, s) => n + s.products.length, 0);

  return (
    <>
      <MenuHeader title={category ? L(category, "name") : ""} onSearchToggle={() => setSearchOpen(true)} />

      {/* Kateqoriya banneri + kateqoriyalar arası keçid */}
      <section className="relative bg-brand-900 overflow-hidden">
        {category?.img?.[0] && (
          <img src={category.img[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 blur-[2px] scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/60 to-brand-900" />
        <div className="relative mx-auto max-w-6xl">
          <div className="px-4 md:px-6 pt-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-300">
              {isLoading ? " " : `${totalItems} ${t("items")}`}
            </p>
            <h2 className="mt-1 font-display text-4xl md:text-5xl font-semibold text-white">
              {category ? L(category, "name") : " "}
            </h2>
            {category && L(category, "subtitle") && (
              <p className="mt-1 text-sm text-white/65">{L(category, "subtitle")}</p>
            )}
          </div>
          <CategorySwitcher categories={categories} />
        </div>
      </section>

      <main className="min-h-[60vh] pb-16">
        {isLoading ? (
          <div className="mx-auto max-w-6xl px-4 md:px-6 pt-6">
            <div className="h-6 w-40 rounded-full skeleton mb-5" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-white p-2 ring-1 ring-sand">
                  <div className="aspect-[4/3.4] rounded-[18px] skeleton" />
                  <div className="h-4 w-3/4 rounded-full skeleton mt-3" />
                  <div className="h-3 w-full rounded-full skeleton mt-2" />
                  <div className="h-4 w-1/3 rounded-full skeleton mt-4 mb-1" />
                </div>
              ))}
            </div>
          </div>
        ) : error === "network" ? (
          <ErrorState onRetry={() => setReloadKey((k) => k + 1)} />
        ) : sections.length === 0 ? (
          <div className="grid place-items-center min-h-[50vh] px-6 text-center">
            <div>
              <img src="/icon-192.png" alt="" className="mx-auto h-20 w-20 rounded-2xl opacity-80" />
              <h2 className="mt-5 font-display text-2xl text-brand-900">{t("will_soon")}</h2>
            </div>
          </div>
        ) : (
          <>
            {/* Bölmə tabları */}
            <nav
              className="sticky z-30 bg-cream/90 backdrop-blur-md border-b border-sand"
              style={{ top: HEADER_H }}
            >
              <div
                ref={tabsRef}
                className="mx-auto max-w-6xl flex gap-2 overflow-x-auto hide-scrollbar px-4 md:px-6 py-3"
              >
                {sections.map((sec) => (
                  <button
                    key={sec.slug}
                    data-slug={sec.slug}
                    onClick={() => scrollToSection(sec.slug)}
                    className={`shrink-0 h-9 px-4 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                      active === sec.slug
                        ? "bg-brand-800 text-white shadow-soft"
                        : "bg-white text-brand-950/60 ring-1 ring-sand hover:text-brand-900"
                    }`}
                  >
                    {L(sec, "name")}
                  </button>
                ))}
              </div>
            </nav>

            <div className="mx-auto max-w-6xl px-4 md:px-6 pt-6 space-y-10">
              {sections.map((sec) => (
                <section key={sec.slug}>
                  <div id={sec.slug} className="flex items-baseline gap-3 mb-4">
                    <h2 className="font-display text-2xl font-semibold text-brand-950">{L(sec, "name")}</h2>
                    <span className="text-xs font-bold text-brand-950/35">{sec.products.length}</span>
                    <span className="flex-1 h-px bg-sand" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {sec.products.map((prod, i) => (
                      <Cards key={prod.id} product={prod} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </main>

      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </>
  );
}
