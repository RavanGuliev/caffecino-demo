import { createContext, useContext, useEffect, useState } from "react";
import { getSettings } from "../api/api";
import { HERO_IMAGE, cafeInfo } from "../data/mockData";

// Kafe məlumatları (admin paneldən idarə olunur). API cavab verməyənə qədər demo data göstərilir.
const fallback = { ...cafeInfo, hero_image: HERO_IMAGE };
const SettingsContext = createContext(fallback);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(fallback);

  useEffect(() => {
    getSettings()
      .then((s) => {
        // boş dəyərlər fallback-i əzməsin
        const clean = Object.fromEntries(Object.entries(s || {}).filter(([, v]) => v != null && v !== ""));
        setSettings((prev) => ({ ...prev, ...clean }));
      })
      .catch((err) => console.error("Error loading settings:", err));
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
