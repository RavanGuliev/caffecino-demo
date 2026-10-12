import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Bəyənmələr cookie-də saxlanılır — yalnız istifadəçi cookie-ni qəbul edibsə.
// İmtina edərsə, bəyənmələr yalnız səhifə açıq olduğu müddətdə (yaddaşda) qalır.
const CONSENT_COOKIE = "caffecino_consent";
const LIKES_COOKIE = "caffecino_likes";
const ONE_YEAR = 60 * 60 * 24 * 365;
const MAX_LIKES = 100;

const readCookie = (name) =>
  document.cookie.split("; ").find((c) => c.startsWith(`${name}=`))?.split("=")[1] ?? null;

const writeCookie = (name, value, maxAge = ONE_YEAR) => {
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; SameSite=Lax`;
};

const readLikes = () =>
  (readCookie(LIKES_COOKIE) || "")
    .split(".")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [consent, setConsent] = useState(() => readCookie(CONSENT_COOKIE)); // accepted | declined | null
  const [ids, setIds] = useState(() => (readCookie(CONSENT_COOKIE) === "accepted" ? readLikes() : []));

  // Sayt bir neçə tabda açıq ola bilər: dəyişiklikdən əvvəl cookie-dəki ən təzə siyahını götür
  const update = useCallback(
    (fn) => {
      setIds((prev) => {
        const base = consent === "accepted" ? readLikes() : prev;
        const next = fn(base);
        if (consent === "accepted") writeCookie(LIKES_COOKIE, next.join("."));
        return next;
      });
    },
    [consent]
  );

  // Başqa tabda edilən dəyişikliklər bu taba qayıdanda görünsün
  useEffect(() => {
    if (consent !== "accepted") return;
    const sync = () => document.visibilityState === "visible" && setIds(readLikes());
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("focus", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("focus", sync);
    };
  }, [consent]);

  const toggle = useCallback(
    (id) => update((list) => (list.includes(id) ? list.filter((x) => x !== id) : [id, ...list].slice(0, MAX_LIKES))),
    [update]
  );

  const remove = useCallback((removeIds) => update((list) => list.filter((x) => !removeIds.includes(x))), [update]);

  const clear = useCallback(() => update(() => []), [update]);

  const accept = useCallback(() => {
    writeCookie(CONSENT_COOKIE, "accepted");
    setConsent("accepted");
    setIds((prev) => {
      // bu ziyarətdə bəyənilənlər + əvvəlki yadda saxlananlar
      const merged = [...new Set([...prev, ...readLikes()])].slice(0, MAX_LIKES);
      writeCookie(LIKES_COOKIE, merged.join("."));
      return merged;
    });
  }, []);

  const decline = useCallback(() => {
    writeCookie(CONSENT_COOKIE, "declined");
    writeCookie(LIKES_COOKIE, "", 0); // köhnə bəyənmələri sil
    setConsent("declined");
  }, []);

  // Footer-dəki "Cookie seçimləri" — paneli yenidən göstərir (bəyənmələr qərar verilənə qədər qalır)
  const reopenConsent = useCallback(() => setConsent(null), []);

  const value = useMemo(
    () => ({ ids, count: ids.length, isLiked: (id) => ids.includes(id), toggle, remove, clear, consent, accept, decline, reopenConsent }),
    [ids, toggle, remove, clear, consent, accept, decline, reopenConsent]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => useContext(FavoritesContext);
