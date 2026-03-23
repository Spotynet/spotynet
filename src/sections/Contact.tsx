"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";
import { useLang } from "@/context/LanguageContext";

export function Contact() {
  const { t } = useLang();
  const c = t.contact;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-[var(--card-border)] bg-[var(--background)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-xl">
        <AnimateIn animation="fade-up">
          <p className="section-label"><span aria-hidden>◆</span> {c.label}</p>
          <h2 id="contact-heading" className="font-display mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {c.heading}
          </h2>
          <div className="title-underline" />
          <p className="mt-5 text-[var(--muted-foreground)]">{c.description}</p>
        </AnimateIn>

        <form action="#" method="post" className="mt-10 space-y-5">
          <AnimateIn animation="fade-up" delay={100} className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                {c.nameLbl}
              </label>
              <input
                id="contact-name" name="name" type="text" required
                className="mt-2 w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 transition-all focus:border-[var(--accent-teal)]/60 focus:outline-none focus:ring-1 focus:ring-[var(--accent-teal)]/40 focus:shadow-[0_0_16px_rgba(0,200,188,0.1)]"
                placeholder={c.namePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                {c.emailLbl}
              </label>
              <input
                id="contact-email" name="email" type="email" required
                className="mt-2 w-full rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 transition-all focus:border-[var(--accent-teal)]/60 focus:outline-none focus:ring-1 focus:ring-[var(--accent-teal)]/40 focus:shadow-[0_0_16px_rgba(0,200,188,0.1)]"
                placeholder={c.emailPlaceholder}
              />
            </div>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={200}>
            <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
              {c.messageLbl}
            </label>
            <textarea
              id="contact-message" name="message" rows={5} required
              className="mt-2 w-full resize-y rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 transition-all focus:border-[var(--accent-teal)]/60 focus:outline-none focus:ring-1 focus:ring-[var(--accent-teal)]/40 focus:shadow-[0_0_16px_rgba(0,200,188,0.1)]"
              placeholder={c.messagePlaceholder}
            />
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={300}>
            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--foreground)] px-6 py-3.5 text-sm font-semibold text-[var(--background)] transition-all hover:bg-white hover:shadow-[0_0_28px_rgba(240,240,248,0.25)] sm:w-auto sm:px-10"
            >
              {c.submit}
            </button>
          </AnimateIn>
        </form>
      </div>
    </section>
  );
}
