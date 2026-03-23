"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

export function Hero() {
  const { t } = useLang();
  const h = t.hero;

  return (
    <section className="relative min-h-screen bg-grid px-4 pt-[60px] sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--gradient-start)]/60 via-transparent to-[var(--background)] pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-60px)] max-w-6xl flex-col justify-center gap-12 py-16 lg:flex-row lg:items-center lg:gap-16 lg:py-20">

        {/* Left — text */}
        <div className="flex-1">
          <p className="section-label mb-5" style={{ animation: "fadeDown 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
            <span aria-hidden>◆</span> {h.label}
          </p>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block" style={{ animation: "fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
              {h.line1}
            </span>
            <span className="block" style={{ animation: "fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.35s both" }}>
              {h.line2}
            </span>
            <span className="block text-brand-gradient" style={{ animation: "fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}>
              {h.line3}
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base" style={{ animation: "fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.65s both" }}>
            {h.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4" style={{ animation: "fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}>
            <a
              href="#contact"
              className="rounded-lg bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition-all hover:bg-white hover:shadow-[0_0_28px_rgba(240,240,248,0.3)] sm:px-6 sm:py-3"
            >
              {h.cta1}
            </a>
            <a
              href="#work"
              className="flex items-center gap-2 rounded-lg border border-[var(--foreground)]/20 px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-all hover:border-[var(--foreground)]/40 hover:bg-[var(--foreground)]/5 sm:px-6 sm:py-3"
            >
              {h.cta2} <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        {/* Right — animated geometric */}
        <div className="hidden flex-1 items-center justify-center sm:flex">
          <div className="hero-geo relative h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80">
            <div className="absolute inset-0 rounded-2xl" style={{ animation: "pulseGlowBlue 4s ease-in-out infinite" }} />
            <div className="absolute -inset-3 rounded-3xl border border-[var(--accent-teal)]/10" style={{ animation: "rotateSlow 20s linear infinite" }} />
            <div className="hero-geo-frame absolute inset-0 rounded-2xl border border-[var(--accent)]/25" />
            <div
              className="absolute inset-4 rounded-xl"
              style={{
                backgroundImage: "linear-gradient(rgba(0,200,188,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,188,0.08) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="hero-scan-line" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-[var(--accent)]/25 blur-xl" style={{ animation: "pulseGlowBlue 3s ease-in-out infinite" }} />
              <Image src="/Isotipo Spotynet.png" alt="" width={64} height={64} className="absolute h-14 w-14 object-contain opacity-70" style={{ animation: "fadeIn 1s ease 1s both" }} aria-hidden />
            </div>
            <span className="hero-corner absolute left-0 top-0 h-5 w-5 rounded-tl-xl border-l-2 border-t-2 border-[var(--accent-teal)]" />
            <span className="hero-corner absolute right-0 top-0 h-5 w-5 rounded-tr-xl border-r-2 border-t-2 border-[var(--accent-teal)]" style={{ animationDelay: "0.3s" }} />
            <span className="hero-corner absolute bottom-0 left-0 h-5 w-5 rounded-bl-xl border-b-2 border-l-2 border-[var(--accent-teal)]" style={{ animationDelay: "0.6s" }} />
            <span className="hero-corner absolute bottom-0 right-0 h-5 w-5 rounded-br-xl border-b-2 border-r-2 border-[var(--accent-teal)]" style={{ animationDelay: "0.9s" }} />
          </div>
        </div>

      </div>
    </section>
  );
}
