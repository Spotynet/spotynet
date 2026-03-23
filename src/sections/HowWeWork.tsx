"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { useLang } from "@/context/LanguageContext";

export function HowWeWork() {
  const { t } = useLang();
  const h = t.howWeWork;

  return (
    <section
      id="how-we-work"
      aria-labelledby="how-we-work-heading"
      className="border-t border-[var(--card-border)] bg-[var(--background-2)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <AnimateIn animation="slide-right">
          <p className="section-label"><span aria-hidden>◆</span> {h.label}</p>
          <h2 id="how-we-work-heading" className="font-display mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {h.heading}
          </h2>
          <div className="title-underline" />
          <p className="mt-5 max-w-xl text-[var(--muted-foreground)]">{h.description}</p>
        </AnimateIn>

        <ol className="mt-10 grid gap-5 sm:mt-16 sm:grid-cols-3 sm:gap-8">
          {h.steps.map((step, i) => (
            <AnimateIn key={step.step} as="li" animation="fade-up" delay={i * 150} className="service-card relative overflow-hidden">
              <span className="font-display text-5xl font-bold text-brand-gradient leading-none" style={{ animation: `scaleIn 0.7s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.15}s both` }}>
                {step.step}
              </span>
              <h3 className="font-display mt-5 text-lg font-bold text-[var(--foreground)]">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{step.description}</p>
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[var(--accent-teal)]/5 blur-xl" />
            </AnimateIn>
          ))}
        </ol>
      </div>
    </section>
  );
}
