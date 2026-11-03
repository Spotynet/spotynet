"use client";

import Image from "next/image";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { useLang } from "@/context/LanguageContext";
import { projects } from "@/data/projects";

export function Work() {
  const { t } = useLang();
  const w = t.work;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative overflow-hidden border-t border-[var(--card-border)] bg-[var(--background-2)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[var(--accent-teal)]/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-[var(--accent)]/[0.05] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <AnimateIn animation="slide-right" className="flex items-end justify-between gap-6">
          <div>
            <p className="section-label">
              <span aria-hidden>◆</span> {w.label}
            </p>
            <h2
              id="work-heading"
              className="font-display mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl"
            >
              {w.heading}
            </h2>
            <div className="title-underline" />
          </div>
          <a
            href="#work-projects"
            className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent-teal)]"
          >
            {w.allProjects}
          </a>
        </AnimateIn>

        <ul id="work-projects" className="work-grid mt-10 scroll-mt-24 sm:mt-16">
          {projects.map((project, i) => {
            const copy = w.projects[project.id];
            const index = String(i + 1).padStart(2, "0");
            const href = "href" in project ? project.href : undefined;

            return (
              <AnimateIn
                key={project.id}
                as="li"
                animation="fade-up"
                delay={Math.min(i, 5) * 100}
                className="work-card group"
              >
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10"
                    aria-label={`${copy.title} — ${w.viewProject}`}
                  >
                    <span className="sr-only">{copy.title}</span>
                  </a>
                ) : null}

                <Image
                  src={project.image}
                  alt={`${copy.title} — ${copy.result}`}
                  fill
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i === 0}
                />

                <div className="work-card-overlay" />
                <div className="work-card-shine" aria-hidden />
                <span className="work-corner work-corner-tl" aria-hidden />
                <span className="work-corner work-corner-br" aria-hidden />

                <div className="absolute inset-x-0 bottom-0 z-[1] p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="work-index">{index}</span>
                    <span className="work-category">{copy.category}</span>
                  </div>
                  <h3 className="font-display mt-3 text-xl font-bold tracking-tight text-[var(--foreground)] transition-all duration-300 group-hover:text-brand-gradient">
                    {copy.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted-foreground)] sm:text-sm">
                    {copy.result}
                  </p>
                  {href ? (
                    <span className="work-cta mt-4">
                      {w.viewProject} <span aria-hidden>↗</span>
                    </span>
                  ) : null}
                </div>
              </AnimateIn>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
