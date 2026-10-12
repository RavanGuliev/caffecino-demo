import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight, FiClock, FiMapPin, FiWifi } from "react-icons/fi";
import { getFullCategory, getPopularProducts } from "../../api/api";
import { HERO_IMAGE, cafeInfo } from "../../data/mockData";
import useLocalized from "../../hooks/useLocalized";
import SmartImage from "../UI/SmartImage";
import Cards from "./Cards";

function Hero() {
  const { t, L } = useLocalized();
  return (
    <section className="px-3 md:px-6 pt-3">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-brand-900 min-h-[440px] md:min-h-[480px] flex">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/70 to-brand-900/20 md:bg-gradient-to-r md:from-brand-950 md:via-brand-950/80 md:to-transparent" />
        <div className="relative mt-auto md:my-auto w-full p-6 md:p-12 md:max-w-xl animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-200 ring-1 ring-white/15">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
            </span>
            {t("open_now")} · {cafeInfo.hours}
          </span>
          <h1 className="mt-4 font-display text-[40px] md:text-6xl leading-[1.05] font-semibold text-white">
            {t("hero_title")}
          </h1>
          <p className="mt-4 text-[15px] md:text-base leading-relaxed text-brand-100/80 max-w-md">{t("hero_text")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#categories"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-cream text-brand-900 font-bold text-sm hover:bg-white transition shadow-soft"
            >
              {t("view_menu")} <FiArrowRight />
            </a>
            <span className="inline-flex items-center gap-2 text-sm text-brand-100/80">
              <FiMapPin className="text-brand-300" /> {L(cafeInfo, "address")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ title, subtitle, right }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <h2 className="font-display text-[28px] md:text-[32px] font-semibold text-brand-950 leading-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-brand-950/55">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function CategoryCard({ item, index }) {
  const { t, L } = useLocalized();
  return (
    <Link
      to={`/menu/${item.id}`}
      className="group relative block overflow-hidden rounded-[26px] bg-brand-900 aspect-[4/5] sm:aspect-[4/4.4] shadow-card hover:shadow-soft transition-shadow animate-rise"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <SmartImage
        src={item.img?.[0]}
        alt={L(item, "name")}
        className="absolute inset-0"
        imgClassName="group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-950/30 to-transparent" />
      <span className="absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-full bg-white/15 backdrop-blur text-white ring-1 ring-white/20 group-hover:bg-cream group-hover:text-brand-900 transition">
        <FiArrowUpRight />
      </span>
      <div className="absolute inset-x-0 bottom-0 p-4">
        {item.count != null && (
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-300">
            {item.count} {t("items")}
          </span>
        )}
        <h3 className="mt-0.5 font-display text-xl md:text-2xl font-semibold text-white leading-tight">{L(item, "name")}</h3>
        {L(item, "subtitle") && <p className="mt-1 text-xs text-white/65 line-clamp-1">{L(item, "subtitle")}</p>}
      </div>
    </Link>
  );
}

function InfoStrip() {
  const { t, L } = useLocalized();
  const items = [
    { icon: <FiClock size={20} />, label: t("hours"), value: `${t("every_day")} · ${cafeInfo.hours}` },
    { icon: <FiMapPin size={20} />, label: t("address"), value: L(cafeInfo, "address") },
    { icon: <FiWifi size={20} />, label: t("wifi"), value: cafeInfo.wifi },
  ];
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto max-w-6xl grid gap-3 sm:grid-cols-3">
        {items.map(({ icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 rounded-3xl bg-white p-4 ring-1 ring-sand">
            <span className="grid place-items-center h-12 w-12 rounded-2xl bg-brand-100 text-brand-700 shrink-0">
              {icon}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-950/45">{label}</p>
              <p className="text-sm font-bold text-brand-950 truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Main() {
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLocalized();

  useEffect(() => {
    (async () => {
      try {
        const [cats, pop] = await Promise.all([getFullCategory(), getPopularProducts()]);
        setCategories(cats.filter((c) => c.status));
        setPopular(pop);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="min-h-[90vh] pb-16">
      <Hero />

      <section id="categories" className="scroll-mt-20 px-4 md:px-6 pt-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title={t("category")} subtitle={t("categories_sub")} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] sm:aspect-[4/4.4] rounded-[26px] skeleton" />
                ))
              : categories.map((item, i) => <CategoryCard key={item.id} item={item} index={i} />)}
          </div>
        </div>
      </section>

      {popular.length > 0 && (
        <section className="px-4 md:px-6 pt-14">
          <div className="mx-auto max-w-6xl">
            <SectionTitle title={t("popular")} subtitle={t("popular_sub")} />
            <div className="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2">
              {popular.map((p) => (
                <div key={p.id} className="snap-start shrink-0 w-[46%] sm:w-[32%] md:w-[24%] lg:w-[19%] flex">
                  <Cards product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="pt-14">
        <InfoStrip />
      </div>
    </main>
  );
}
