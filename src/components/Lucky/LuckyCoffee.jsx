import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FiArrowRight, FiCheck, FiCopy } from "react-icons/fi";
import { PiCloverFill } from "react-icons/pi";
import { getLucky } from "../../api/api";
import useLocalized, { formatPrice } from "../../hooks/useLocalized";

// "Şans kofesi": sayta girən müştəriyə gündə bir dəfə təsadüfi təklif göstərilir.
// Günün nəticəsi localStorage-da saxlanılır ki, yenidən açanda eyni kofe görünsün.
const STORE_KEY = "lucky_coffee";
const today = () => new Date().toISOString().slice(0, 10);

const readStore = () => {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    return s?.date === today() ? s : null;
  } catch {
    return null;
  }
};
const writeStore = (data) => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ date: today(), ...data }));
  } catch { /* private rejim */ }
};

const CONFETTI_COLORS = ["#c8a464", "#a3cbb6", "#f7f5ee", "#6aa98a", "#e9d8a6"];

function Confetti({ burst }) {
  // burst dəyişəndə yeni partlayış
  const pieces = Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * Math.PI * 2;
    const dist = 90 + ((i * 37) % 70);
    return {
      i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 30,
      r: (i * 47) % 360,
      c: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      d: (i % 5) * 40,
      w: i % 3 === 0 ? 10 : 6,
    };
  });
  return (
    <div key={burst} className="pointer-events-none absolute left-1/2 top-1/2">
      {pieces.map((p) => (
        <span
          key={p.i}
          className="lucky-confetti absolute block rounded-[2px]"
          style={{
            width: p.w,
            height: 6,
            background: p.c,
            "--x": `${p.x}px`,
            "--y": `${p.y}px`,
            "--r": `${p.r}deg`,
            animationDelay: `${p.d}ms`,
          }}
        />
      ))}
    </div>
  );
}

function LuckyModal({ data, initialPhase, onClose, onRevealed }) {
  const { t, L } = useLocalized();
  const navigate = useNavigate();
  const [phase, setPhase] = useState(initialPhase); // intro | rolling | reveal
  const [frame, setFrame] = useState(0);
  const [copied, setCopied] = useState(false);
  const timers = useRef([]);

  const { offer, reel = [], category_id: categoryId } = data;
  const product = offer.product;
  const frames = reel.length ? reel : [product.img?.[0]];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const list = timers.current;
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      list.forEach(clearTimeout);
    };
  }, [onClose]);

  // Slot-maşın effekti: şəkillər əvvəl sürətli, sonra yavaş dəyişir
  const spin = () => {
    setPhase("rolling");
    let elapsed = 0;
    const steps = 18;
    for (let i = 0; i < steps; i++) {
      elapsed += 60 + i * i * 1.6;
      timers.current.push(setTimeout(() => setFrame(i), elapsed));
    }
    timers.current.push(
      setTimeout(() => {
        setPhase("reveal");
        onRevealed();
      }, elapsed + 280)
    );
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard icazəsi yoxdur */ }
  };

  const goToProduct = () => {
    onClose();
    if (categoryId) navigate(`/menu/${categoryId}`);
  };

  const title = L(offer, "title") || t("lucky_default_title");
  const message = L(offer, "message") || L(product, "description");
  const revealed = phase === "reveal";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-brand-950/70 backdrop-blur-md p-0 sm:p-4 animate-fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={t("lucky_chip")}
    >
      <div className="relative w-full sm:max-w-sm overflow-hidden rounded-t-[32px] sm:rounded-[32px] bg-gradient-to-b from-brand-800 via-brand-900 to-brand-950 text-white shadow-2xl animate-slide-up sm:animate-pop-in">
        <div className="grain absolute inset-0 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between px-5 pt-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-200 ring-1 ring-white/15">
            <PiCloverFill className="text-gold" /> {t("lucky_chip")}
          </span>
          <button
            onClick={onClose}
            className="grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/15"
            aria-label={t("close")}
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Dairəvi şəkil + fırlanan halqa */}
        <div className="relative mx-auto mt-6 h-52 w-52">
          <div className={`absolute inset-0 rounded-full border-2 border-dashed border-gold/60 ${revealed ? "lucky-spin-slow" : phase === "rolling" ? "lucky-spin-fast" : "lucky-spin-slow"}`} />
          <div className="absolute inset-3 rounded-full bg-brand-950/60 ring-4 ring-white/10 overflow-hidden">
            {phase === "intro" && (
              <div className="h-full w-full grid place-items-center">
                <span className="lucky-float font-display text-7xl font-bold text-gold">?</span>
              </div>
            )}
            {phase === "rolling" && (
              <img src={frames[frame % frames.length]} alt="" className="h-full w-full object-cover blur-[1px] scale-110" />
            )}
            {revealed && (
              <img src={product.img?.[0]} alt={L(product, "name")} className="h-full w-full object-cover animate-pop-in" />
            )}
          </div>
          {revealed && offer.discount_percent > 0 && (
            <span className="absolute -right-1 top-3 grid place-items-center h-16 w-16 rounded-full bg-gold text-brand-950 font-display font-extrabold text-lg rotate-12 shadow-lg animate-pop-in">
              -{offer.discount_percent}%
            </span>
          )}
          {revealed && <Confetti burst={offer.id} />}
        </div>

        <div className="relative px-6 pt-6 pb-6 text-center" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
          {phase !== "reveal" ? (
            <>
              <h2 className="font-display text-2xl font-bold leading-tight">{t("lucky_intro_title")}</h2>
              <p className="mt-2 text-sm text-white/65">{t("lucky_intro_text")}</p>
              <button
                onClick={spin}
                disabled={phase === "rolling"}
                className="mt-6 w-full py-3.5 rounded-2xl bg-gold text-brand-950 font-bold text-[15px] shadow-lg hover:brightness-105 active:scale-[0.98] transition disabled:opacity-80"
              >
                {phase === "rolling" ? t("lucky_rolling") : (
                  <span className="inline-flex items-center gap-2"><PiCloverFill /> {t("lucky_spin")}</span>
                )}
              </button>
              <button onClick={onClose} className="mt-3 text-sm font-semibold text-white/50 hover:text-white">
                {t("lucky_later")}
              </button>
            </>
          ) : (
            <div className="animate-rise">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{title}</p>
              <h2 className="mt-2 font-display text-[28px] font-bold leading-tight">{L(product, "name")}</h2>
              {message && <p className="mt-2 text-sm leading-relaxed text-white/70">{message}</p>}

              <div className="mt-4 flex items-baseline justify-center gap-2">
                {offer.new_price != null ? (
                  <>
                    <span className="font-display text-3xl font-bold text-gold">{formatPrice(offer.new_price)}</span>
                    <span className="text-base text-white/40 line-through">{formatPrice(product.price)}</span>
                  </>
                ) : (
                  <span className="font-display text-3xl font-bold">{formatPrice(product.price)}</span>
                )}
              </div>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">{t("lucky_today_only")}</p>

              {offer.code && (
                <button
                  onClick={copyCode}
                  className="mt-5 w-full flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-gold/50 bg-white/5 px-4 py-3 text-left hover:bg-white/10 transition"
                >
                  <span>
                    <span className="block text-[11px] text-white/55">{t("lucky_code")}</span>
                    <span className="block font-display text-xl font-bold tracking-[0.2em] text-gold">{offer.code}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70">
                    {copied ? <><FiCheck className="text-brand-300" /> {t("lucky_copied")}</> : <FiCopy size={16} />}
                  </span>
                </button>
              )}

              <button
                onClick={goToProduct}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-cream text-brand-900 font-bold text-[15px] hover:bg-white active:scale-[0.98] transition"
              >
                {t("lucky_cta")} <FiArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LuckyCoffee() {
  const { t } = useLocalized();
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // ?lucky=1 — müştəriyə demo göstərmək üçün yaddaşı sıfırlayır
    const params = new URLSearchParams(window.location.search);
    if (params.has("lucky")) {
      try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
    }

    const stored = readStore();
    if (stored?.data) {
      setData(stored.data);
      setRevealed(!!stored.revealed);
      return;
    }

    let timer;
    getLucky()
      .then((res) => {
        if (!res?.offer?.product) return;
        setData(res);
        writeStore({ data: res, revealed: false });
        timer = setTimeout(() => setOpen(true), 900); // sayt yüklənəndən bir az sonra açılsın
      })
      .catch((err) => console.error("Lucky offer error:", err));
    return () => clearTimeout(timer);
  }, []);

  const handleRevealed = useCallback(() => {
    setRevealed(true);
    writeStore({ data, revealed: true });
  }, [data]);

  const close = useCallback(() => setOpen(false), []);
  const { pathname } = useLocation();

  // oyun zamanı modal və düymə mane olmasın
  if (!data || pathname === "/game") return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-40 right-4 bottom-4 inline-flex items-center gap-2 h-12 pl-3 pr-4 rounded-full bg-brand-800 text-white shadow-soft ring-1 ring-white/10 hover:bg-brand-700 transition animate-pop-in"
          style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
          aria-label={t("lucky_fab")}
        >
          <span className="relative grid place-items-center h-7 w-7 rounded-full bg-gold text-brand-950">
            {!revealed && <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-60" />}
            <PiCloverFill className="relative" size={16} />
          </span>
          <span className="text-sm font-bold">{t("lucky_fab")}</span>
        </button>
      )}
      {open && (
        <LuckyModal data={data} initialPhase={revealed ? "reveal" : "intro"} onClose={close} onRevealed={handleRevealed} />
      )}
    </>
  );
}
