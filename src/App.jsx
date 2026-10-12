import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Main from "./components/Main/Main";
import Menu from "./components/Main/Menu";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { SettingsProvider } from "./hooks/useSettings";
import LuckyCoffee from "./components/Lucky/LuckyCoffee";
import Favorites from "./components/Favorites/Favorites";
import { NotFound } from "./components/UI/StatusMessage";
// Adında "cookie" olan fayllar bəzi reklam bloklayıcılarda bloklanır
import SaveChoiceBanner from "./components/Favorites/SaveChoiceBanner";
import { FavoritesProvider } from "./hooks/useFavorites";

// Admin panel ayrıca chunk kimi yüklənir — sayt ziyarətçiləri onu yükləmir
const AdminApp = lazy(() => import("./admin/AdminApp"));
const Game = lazy(() => import("./components/Game/Game"));

function SiteLayout() {
  const { pathname } = useLocation();
  const isMenuPage = pathname.startsWith("/menu");

  return (
    <SettingsProvider>
      <FavoritesProvider>
        {!isMenuPage && <Header />}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/menu/:categoryId" element={<Menu />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <LuckyCoffee />
        <SaveChoiceBanner />
      </FavoritesProvider>
    </SettingsProvider>
  );
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function Splash() {
  return (
    <div className="min-h-screen grid place-items-center bg-brand-900">
      <img src="/images/caffecino.png" alt="Caffècino" className="h-20 w-20 rounded-2xl animate-pulse" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Suspense fallback={<Splash />}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<SiteLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
