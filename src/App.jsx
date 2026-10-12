import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Main from "./components/Main/Main";
import Menu from "./components/Main/Menu";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function Layout() {
  const { pathname } = useLocation();
  const isMenuPage = pathname.startsWith("/menu");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <>
      {!isMenuPage && <Header />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/menu/:categoryId" element={<Menu />} />
        <Route path="*" element={<Main />} />
      </Routes>
      <Footer />
    </>
  );
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
      <Suspense fallback={<Splash />}>
        <Layout />
      </Suspense>
    </BrowserRouter>
  );
}
