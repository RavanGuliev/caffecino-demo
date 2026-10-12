import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminApi, getToken, setToken } from "./adminApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!getToken());

  useEffect(() => {
    if (!getToken()) return;
    adminApi.me().then(setUser).catch(() => setToken(null)).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener("admin:unauthorized", onUnauthorized);
    return () => window.removeEventListener("admin:unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user } = await adminApi.login(email, password);
    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    try { await adminApi.logout(); } catch { /* token artıq etibarsız ola bilər */ }
    setToken(null);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, setUser, ready, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
