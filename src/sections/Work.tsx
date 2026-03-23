"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { useLang } from "@/context/LanguageContext";

export function Work() {
  const { t } = useLang();
  const w = t.work;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="border-t border-[var(--card-border)] bg-[var(--background-2)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <AnimateIn animation="slide-right" className="flex items-end justify-between">
          <div>
            <p className="section-label"><span aria-hidden>◆</span> {w.label}</p>
            <h2 id="work-heading" className="font-display mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              {w.heading}
            </h2>
            <div className="title-underline" />
          </div>
          <a href="#contact" className="hidden text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] sm:block">
            {w.allProjects}
          </a>
        </AnimateIn>

        <ul className="mt-10 grid gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {w.projects.map((project, i) => (
            <AnimateIn key={project.title} as="li" animation="fade-up" delay={i * 130} className="work-card group">
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-teal)]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" style={{ top: "40%" }} />
              <div className="work-card-overlay" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="rounded-md border border-[var(--card-border)] bg-[var(--background)]/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--accent-teal)] backdrop-blur-sm">
                  {project.category}
                </span>
                <h3 className="font-display mt-3 text-lg font-bold text-[var(--foreground)] transition-all group-hover:text-brand-gradient">
                  {project.title}
                </h3>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{project.result}</p>
              </div>
            </AnimateIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
