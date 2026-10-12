import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { FeedbackProvider } from "./components/Feedback";
import { Spinner } from "./components/ui";
import AdminLayout from "./AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Sections from "./pages/Sections";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Lucky from "./pages/Lucky";
import Users from "./pages/Users";

function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-cream text-brand-700">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}

// Admin panel axtarış motorlarında görünməsin
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Admin — Caffècino";
    return () => {
      meta.remove();
      document.title = prevTitle;
    };
  }, []);
}

export default function AdminApp() {
  useNoIndex();
  return (
    <AuthProvider>
      <FeedbackProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="sections" element={<Sections />} />
            <Route path="products" element={<Products />} />
            <Route path="lucky" element={<Lucky />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<Users />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </FeedbackProvider>
    </AuthProvider>
  );
}
