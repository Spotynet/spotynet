"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { useLang } from "@/context/LanguageContext";

export function Services() {
  const { t } = useLang();
  const s = t.services;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="border-t border-[var(--card-border)] bg-[var(--background)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <AnimateIn animation="fade-up" className="flex flex-col items-center text-center">
          <p className="section-label"><span aria-hidden>◆</span> {s.label}</p>
          <h2 id="services-heading" className="font-display mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {s.heading}
          </h2>
          <div className="title-underline" />
          <p className="mt-5 max-w-xl text-[var(--muted-foreground)]">{s.description}</p>
        </AnimateIn>

        <ul className="mt-10 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((item, i) => (
            <AnimateIn key={item.title} as="li" animation="scale-in" delay={i * 120} className="service-card group flex flex-col">
              <div className="icon-badge">⬡</div>
              <h3 className="font-display mt-5 text-lg font-bold text-[var(--foreground)]">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{item.description}</p>
              <a
                href="#contact"
                className="mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent-teal)] transition-colors hover:text-[var(--foreground)]"
              >
                {item.link} <span aria-hidden>→</span>
              </a>
            </AnimateIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
