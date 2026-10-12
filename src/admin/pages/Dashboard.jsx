import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PiClover } from "react-icons/pi";
import { FiEye, FiEyeOff, FiGrid, FiLayers, FiPlus, FiSettings, FiShoppingBag, FiStar, FiTag } from "react-icons/fi";
import useLocalized, { formatPrice } from "../../hooks/useLocalized";
import { adminApi } from "../adminApi";
import { useAuth } from "../AuthContext";
import { useFeedback } from "../components/Feedback";
import { Card, PageHeader, Spinner, Thumb } from "../components/ui";

export default function Dashboard() {
  const { t } = useTranslation("admin");
  const { L } = useLocalized();
  const { user } = useAuth();
  const { toast } = useFeedback();
  const [data, setData] = useState(null);

  useEffect(() => {
    adminApi.dashboard().then(setData).catch((e) => toast(e.message, "error"));
  }, [toast]);

  if (!data) {
    return <div className="py-24 grid place-items-center text-brand-700"><Spinner className="h-8 w-8" /></div>;
  }

  const s = data.stats;
  const cards = [
    { key: "categories", value: s.categories, Icon: FiGrid, to: "/admin/categories" },
    { key: "sections", value: s.sections, Icon: FiLayers, to: "/admin/sections" },
    { key: "products", value: s.products, Icon: FiShoppingBag, to: "/admin/products" },
    { key: "active_products", value: s.active_products, Icon: FiEye },
    { key: "hidden_products", value: s.hidden_products, Icon: FiEyeOff },
    { key: "popular", value: s.popular, Icon: FiStar },
    { key: "avg_price", value: formatPrice(s.avg_price), Icon: FiTag },
    { key: "lucky_offers", value: s.lucky_offers, Icon: PiClover, to: "/admin/lucky" },
  ];
  const max = Math.max(1, ...data.per_category.map((c) => c.count));

  return (
    <>
      <PageHeader title={t("dashboard.hello", { name: user?.name })} subtitle={t("dashboard.subtitle")} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(({ key, value, Icon, to }) => {
          const body = (
            <Card className="p-4 h-full hover:ring-brand-300 transition">
              <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-100 text-brand-700">
                <Icon size={18} />
              </span>
              <p className="mt-3 text-2xl font-bold text-brand-950 font-display">{value}</p>
              <p className="text-xs font-semibold text-brand-950/50">{t(`dashboard.${key}`)}</p>
            </Card>
          );
          return to ? <Link key={key} to={to}>{body}</Link> : <div key={key}>{body}</div>;
        })}
      </div>

      <div className="mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <Card className="p-5">
          <h2 className="font-display font-bold text-brand-950">{t("dashboard.per_category")}</h2>
          <div className="mt-4 space-y-3">
            {data.per_category.map((c) => (
              <div key={c.id} className="grid grid-cols-[120px_1fr_32px] sm:grid-cols-[160px_1fr_32px] items-center gap-3 text-sm">
                <span className="truncate font-medium text-brand-950/80">{L(c, "name")}</span>
                <span className="h-2.5 rounded-full bg-brand-50 overflow-hidden">
                  <span className="block h-full rounded-full bg-brand-600" style={{ width: `${(c.count / max) * 100}%` }} />
                </span>
                <span className="text-right font-bold text-brand-950/70 tabular-nums">{c.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-display font-bold text-brand-950">{t("dashboard.quick")}</h2>
            <div className="mt-4 grid gap-2">
              {[
                { to: "/admin/products?new=1", label: t("dashboard.new_product"), Icon: FiPlus },
                { to: "/admin/categories?new=1", label: t("dashboard.new_category"), Icon: FiGrid },
                { to: "/admin/settings", label: t("dashboard.edit_settings"), Icon: FiSettings },
              ].map(({ to, label, Icon }) => (
                <Link key={to} to={to} className="flex items-center gap-3 h-11 px-3 rounded-xl bg-cream text-sm font-semibold text-brand-900 hover:bg-brand-50">
                  <Icon className="text-brand-600" /> {label}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display font-bold text-brand-950">{t("dashboard.latest")}</h2>
            <ul className="mt-3 divide-y divide-sand">
              {data.latest.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-2.5">
                  <Thumb src={p.img?.[0]} className="h-10 w-10" />
                  <span className="flex-1 min-w-0 truncate text-sm font-semibold text-brand-950">{L(p, "name")}</span>
                  <span className="text-sm font-bold text-brand-800">{formatPrice(p.price)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
