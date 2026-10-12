import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiLock, FiMail } from "react-icons/fi";
import LanguageSwitcher from "../../components/UI/LanguageSwitcher";
import { useAuth } from "../AuthContext";
import { Button } from "../components/ui";
import { HERO_IMAGE } from "../../data/mockData";

export default function Login() {
  const { t } = useTranslation("admin");
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (err) {
      setError(err.errors?.email?.[0] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = "flex items-center gap-3 h-12 px-4 rounded-2xl bg-white ring-1 ring-sand focus-within:ring-2 focus-within:ring-brand-500 transition";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream">
      <div className="relative hidden lg:block overflow-hidden bg-brand-900">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/50 to-transparent" />
        <div className="absolute bottom-0 p-12 text-white">
          <img src="/images/caffecino.png" alt="" className="h-14 w-14 rounded-2xl ring-1 ring-white/20" />
          <p className="mt-6 font-display text-4xl font-bold tracking-[0.12em]">CAFFÈCINO</p>
          <p className="mt-2 text-sm tracking-[0.3em] text-brand-300">THE ART OF COFFEE</p>
        </div>
      </div>

      <div className="flex flex-col px-6 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-900/70 hover:text-brand-900">
            <FiArrowLeft /> {t("login.back")}
          </Link>
          <div className="rounded-full bg-brand-900 p-0.5">
            <LanguageSwitcher />
          </div>
        </div>

        <form onSubmit={submit} className="my-auto mx-auto w-full max-w-sm py-10 animate-rise">
          <img src="/images/caffecino.png" alt="" className="lg:hidden h-14 w-14 rounded-2xl mb-6" />
          <h1 className="font-display text-3xl font-bold text-brand-950">{t("login.title")}</h1>
          <p className="mt-2 text-sm text-brand-950/55">{t("login.subtitle")}</p>

          <div className="mt-8 space-y-3">
            <label className={inputWrap}>
              <FiMail className="text-brand-600" />
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.email")}
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <label className={inputWrap}>
              <FiLock className="text-brand-600" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("login.password")}
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
          </div>

          {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <Button type="submit" loading={loading} className="mt-6 w-full h-12 justify-center rounded-2xl">
            {t("login.submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}
