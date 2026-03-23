"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { useLang } from "@/context/LanguageContext";

export function WhyUs() {
  const { t } = useLang();
  const w = t.whyUs;

  return (
    <section
      id="why-us"
      aria-labelledby="why-us-heading"
      className="border-t border-[var(--card-border)] bg-[var(--background)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <AnimateIn animation="slide-right">
          <p className="section-label"><span aria-hidden>◆</span> {w.label}</p>
          <h2 id="why-us-heading" className="font-display mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {w.heading}
          </h2>
          <div className="title-underline" />
          <p className="mt-5 max-w-xl text-[var(--muted-foreground)]">{w.description}</p>
        </AnimateIn>

        <ul className="mt-10 grid gap-5 sm:mt-16 sm:grid-cols-3">
          {w.points.map((point, i) => (
            <AnimateIn key={point.title} as="li" animation="scale-in" delay={i * 120} className="service-card group relative overflow-hidden">
              <div className="icon-badge">{point.icon}</div>
              <h3 className="font-display mt-5 text-lg font-bold text-[var(--foreground)]">{point.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{point.description}</p>
              <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-[var(--accent)]/5 blur-2xl" style={{ animation: `pulseGlowBlue 4s ease-in-out ${i * 0.7}s infinite` }} />
            </AnimateIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
