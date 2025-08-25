"use client";
import { useEffect, useRef, useState } from "react";
import { fetchISS, ISSPosition } from "@/lib/fetchISS";

export default function Home() {
  const [position, setPosition] = useState<ISSPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // --- Fetch ISS every 10s ---
  useEffect(() => {
    const getData = async () => {
      try {
        const pos = await fetchISS();
        setPosition(pos);
        setLastUpdated(new Date());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
    const interval = setInterval(getData, 10_000);
    return () => clearInterval(interval);
  }, []);

  // --- Starfield background ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    type Star = { x: number; y: number; z: number; size: number; tw: number };
    const STAR_COUNT = Math.min(500, Math.floor((width * height) / 3000));
    let stars: Star[] = [];

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars = new Array(STAR_COUNT).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2, // depth 0.2~1.0
        size: Math.random() * 1.5 + 0.3,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // Deep space gradient backdrop (subtle)
      const g = ctx.createRadialGradient(
        width * 0.7,
        height * 0.3,
        Math.min(width, height) * 0.1,
        width * 0.5,
        height * 0.6,
        Math.max(width, height)
      );
      g.addColorStop(0, "rgba(64, 35, 150, 0.35)");
      g.addColorStop(0.4, "rgba(12, 22, 60, 0.6)");
      g.addColorStop(1, "rgba(2, 6, 23, 0.95)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // Orbit rings
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      const cx = width * 0.5;
      const cy = height * 0.55;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, width * (0.18 + i * 0.06), height * (0.08 + i * 0.03), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Stars with parallax + twinkle
      for (const s of stars) {
        const twinkle = 0.6 + 0.4 * Math.sin(s.tw + t * 0.002 * (1.5 - s.z));
        const size = s.size * (1.5 - s.z) * twinkle;
        ctx.globalAlpha = 0.8 * (1.4 - s.z);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(s.x, s.y, size, size);
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const onResize = () => init();

    init();
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const lastUpdatedText = lastUpdated
    ? new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(lastUpdated)
    : "—";

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[#020617] text-white">
      {/* starfield background */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

      {/* nebula glow blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full blur-3xl"
           style={{
             background:
               "radial-gradient(closest-side, rgba(99,102,241,0.25), rgba(99,102,241,0) 70%)",
           }} />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[40rem] w-[40rem] rounded-full blur-3xl"
           style={{
             background:
               "radial-gradient(closest-side, rgba(34,197,94,0.18), rgba(34,197,94,0) 70%)",
           }} />

      <main className="relative mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center px-6 py-16">
        {/* Title */}
        <h1 className="mb-6 bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent drop-shadow">
          International Space Station Tracker
        </h1>

        {/* Status pill */}
        <div className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs text-white/80">Auto‑refresh every 10s</span>
          <span className="mx-2 text-white/20">•</span>
          <span className="text-xs text-white/70">Last updated: {lastUpdatedText}</span>
        </div>

        {/* Card */}
        <section className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(99,102,241,0.15)] backdrop-blur">
          {loading ? (
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Spinner />
              <p>Linking to low Earth orbit…</p>
            </div>
          ) : position ? (
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
              {/* ISS emblem */}
              <div className="flex flex-col items-center justify-center">
                <ISSBadge />
                <p className="mt-3 text-sm text-white/70">~ 90 min per orbit • ~ 28,000 km/h</p>
              </div>

              {/* Readouts */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm uppercase tracking-widest text-white/60">Current Position</p>
                <div className="mt-3 grid grid-cols-2 gap-4 font-mono text-lg">
                  <Metric label="Latitude" value={`${position.latitude.toFixed(2)}°`} />
                  <Metric label="Longitude" value={`${position.longitude.toFixed(2)}°`} />
                </div>
                <div className="mt-4 text-xs text-white/60">
                  Coordinates update automatically. Data source: Open Notify / where the ISS at.
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-rose-300">Couldn’t reach the telemetry service. Please try again.</p>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-white/50">
          Made with <span className="align-[-2px]">🚀</span> in the cosmos.
        </footer>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4 shadow-inner">
      <p className="text-[10px] uppercase tracking-widest text-white/60">{label}</p>
      <p className="mt-1 text-2xl text-white/90">{value}</p>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white/70"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function ISSBadge() {
  return (
    <div className="relative">
      {/* glow */}
      <div className="absolute -inset-6 -z-10 rounded-full bg-indigo-500/20 blur-2xl" />
      <svg
        viewBox="0 0 160 160"
        className="h-28 w-28 drop-shadow"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <radialGradient id="grad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="60%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#34d399" />
          </radialGradient>
        </defs>
        {/* planet */}
        <circle cx="80" cy="80" r="55" fill="url(#grad)" opacity="0.25" />
        {/* simple ISS glyph */}
        <g stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round">
          <path d="M40 80h80" />
          <path d="M80 40v80" />
          <path d="M57 57l46 46" />
          <path d="M57 103l46-46" />
          <path d="M30 70h20" />
          <path d="M110 90h20" />
          <path d="M70 30v20" />
          <path d="M90 110v20" />
        </g>
      </svg>
    </div>
  );
}
