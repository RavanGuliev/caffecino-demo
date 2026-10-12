import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PiArrowCounterClockwiseBold, PiHeartBold, PiHeartFill, PiPauseFill, PiPlayFill, PiTrophyFill } from "react-icons/pi";
import { useFavorites } from "../../hooks/useFavorites";
import useLocalized from "../../hooks/useLocalized";
import { createGame, GAME_TIME } from "./engine";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const BEST_KEY = "caffecino_game_best";

// Rekord yalnız cookie/yaddaş razılığı verilibsə saxlanılır
function useBestScore() {
  const { consent } = useFavorites();
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
  });
  const save = useCallback(
    (score) => {
      if (score <= best) return false;
      setBest(score);
      if (consent === "accepted") {
        try { localStorage.setItem(BEST_KEY, String(score)); } catch { /* ignore */ }
      }
      return true;
    },
    [best, consent]
  );
  return [best, save];
}

function Legend({ t }) {
  const item = "flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10";
  return (
    <div className="grid gap-2 text-left">
      <div className={item}>
        <span className="h-5 w-4 rounded-[50%] bg-gradient-to-br from-[#9a5d3b] to-[#3e2214] -rotate-12" />
        <span className="flex-1 text-sm">{t("game_bean")}</span>
        <span className="font-display font-bold text-cream">+1</span>
      </div>
      <div className={item}>
        <span className="h-5 w-4 rounded-[50%] bg-gradient-to-br from-[#fff1c9] to-[#a8823f] -rotate-12 shadow-[0_0_12px_rgba(227,194,122,0.8)]" />
        <span className="flex-1 text-sm">{t("game_gold")}</span>
        <span className="font-display font-bold text-gold">+5</span>
      </div>
      <div className={item}>
        <span className="h-5 w-5 rounded-md bg-gradient-to-br from-white/90 to-sky-200/60 ring-1 ring-white" />
        <span className="flex-1 text-sm">{t("game_ice")}</span>
        <span className="font-display font-bold text-love">{t("game_ice_hint")}</span>
      </div>
    </div>
  );
}

export default function Game() {
  const { t } = useLocalized();
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [screen, setScreen] = useState("start"); // start | playing | paused | over
  const [hud, setHud] = useState({ score: 0, time: GAME_TIME, lives: 3, multiplier: 1, caught: 0 });
  const [result, setResult] = useState(null);
  const [best, saveBest] = useBestScore();
  useDocumentTitle(t("game_title"), t("game_promo_text"));
  const saveBestRef = useRef(saveBest);
  saveBestRef.current = saveBest;

  useEffect(() => {
    const game = createGame(canvasRef.current, {
      onUpdate: (d) => {
        if ("paused" in d) setScreen(d.paused ? "paused" : "playing");
        else setHud(d);
      },
      onEnd: (r) => {
        const isRecord = saveBestRef.current(r.score);
        setResult({ ...r, isRecord });
        setScreen("over");
      },
    });
    gameRef.current = game;
    return () => game.destroy();
  }, []);

  const start = () => {
    setResult(null);
    setScreen("playing");
    gameRef.current?.start();
  };

  const overlay = "absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-white bg-brand-950/70 backdrop-blur-sm animate-fade-in";
  const primaryBtn = "w-full max-w-xs inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gold text-brand-950 font-bold text-[15px] shadow-lg hover:brightness-105 active:scale-[0.98] transition";
  const timePct = (hud.time / GAME_TIME) * 100;

  return (
    <main className="px-3 md:px-6 pt-3 pb-10">
      <div
        className="relative mx-auto max-w-md overflow-hidden rounded-[28px] bg-brand-950 shadow-soft select-none"
        style={{ height: "min(720px, calc(100svh - 64px - 1.5rem))", minHeight: 460 }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />

        {/* HUD */}
        {(screen === "playing" || screen === "paused") && (
          <div className="absolute inset-x-0 top-0 z-10 p-3 pointer-events-none">
            <div className="flex items-center justify-between gap-2">
              <div className="rounded-2xl bg-black/25 backdrop-blur px-3.5 py-1.5 ring-1 ring-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{t("game_score")}</p>
                <p key={hud.score} className="font-display text-2xl font-bold leading-none text-white tabular-nums like-pop">{hud.score}</p>
              </div>
              {hud.multiplier > 1 && (
                <span key={hud.multiplier} className="rounded-full bg-gold px-3 py-1 font-display text-sm font-extrabold text-brand-950 like-pop">
                  x{hud.multiplier} {t("game_combo")}
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 rounded-full bg-black/25 backdrop-blur px-2.5 py-2 ring-1 ring-white/10">
                  {[0, 1, 2].map((i) =>
                    i < hud.lives ? (
                      <PiHeartFill key={i} size={16} className="text-love" />
                    ) : (
                      <PiHeartBold key={i} size={16} className="text-white/30" />
                    )
                  )}
                </div>
                <button
                  onClick={() => gameRef.current?.pause()}
                  className="pointer-events-auto grid place-items-center h-9 w-9 rounded-full bg-black/25 backdrop-blur ring-1 ring-white/10 text-white"
                  aria-label={t("game_paused")}
                >
                  <PiPauseFill size={16} />
                </button>
              </div>
            </div>
            <div className="mt-2.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${hud.time <= 10 ? "bg-love" : "bg-brand-300"}`}
                style={{ width: `${timePct}%` }}
              />
            </div>
          </div>
        )}

        {screen === "start" && (
          <div className={overlay}>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-200 ring-1 ring-white/15">
              Caffècino Arcade
            </span>
            <h1 className="mt-4 font-display text-[34px] font-bold leading-tight">{t("game_title")}</h1>
            <p className="mt-2 text-sm text-white/65 max-w-xs">{t("game_sub")}</p>
            <div className="mt-6 w-full max-w-xs">
              <Legend t={t} />
            </div>
            <p className="mt-4 text-xs text-white/45">👆 {t("game_tip")}</p>
            <button onClick={start} className={`${primaryBtn} mt-5`}>
              <PiPlayFill /> {t("game_play")}
            </button>
            {best > 0 && (
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/60">
                <PiTrophyFill className="text-gold" /> {t("game_best")}: <b className="text-white">{best}</b>
              </p>
            )}
          </div>
        )}

        {screen === "paused" && (
          <div className={overlay}>
            <h2 className="font-display text-3xl font-bold">{t("game_paused")}</h2>
            <button onClick={() => gameRef.current?.resume()} className={`${primaryBtn} mt-6`}>
              <PiPlayFill /> {t("game_resume")}
            </button>
            <button onClick={start} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white">
              <PiArrowCounterClockwiseBold /> {t("game_restart")}
            </button>
          </div>
        )}

        {screen === "over" && result && (
          <div className={overlay}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-200">
              {result.reason === "time" ? t("game_time_up") : t("game_over")}
            </p>
            {result.isRecord && (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-sm font-extrabold text-brand-950 animate-pop-in">
                <PiTrophyFill /> {t("game_new_best")}
              </span>
            )}
            <p className="mt-3 font-display text-7xl font-bold leading-none animate-pop-in">{result.score}</p>
            <p className="mt-2 text-sm text-white/60">{t("game_score")}</p>

            <div className="mt-6 grid grid-cols-2 gap-2 w-full max-w-xs">
              <div className="rounded-2xl bg-white/5 py-3 ring-1 ring-white/10">
                <p className="font-display text-xl font-bold">{result.caught}</p>
                <p className="text-[11px] text-white/50">{t("game_caught")}</p>
              </div>
              <div className="rounded-2xl bg-white/5 py-3 ring-1 ring-white/10">
                <p className="font-display text-xl font-bold text-gold">{best}</p>
                <p className="text-[11px] text-white/50">{t("game_best")}</p>
              </div>
            </div>

            <button onClick={start} className={`${primaryBtn} mt-6`}>
              <PiArrowCounterClockwiseBold /> {t("game_again")}
            </button>
            <Link to="/" className="mt-3 text-sm font-semibold text-white/60 hover:text-white">
              {t("game_back_menu")}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
