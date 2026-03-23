"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

export function Header() {
  const [open, setOpen] = useState(false);
  const { lang, toggle, t } = useLang();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-2xl">
        <nav className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" onClick={close} className="shrink-0 transition-opacity hover:opacity-80">
            <Image
              src="/Logot Spotynet Horizontal.png"
              alt="Spotynet"
              width={130}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#services" className="text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]">
              {t.nav.services}
            </Link>
            <Link href="#how-we-work" className="text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]">
              {t.nav.process}
            </Link>
            <Link href="#work" className="text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]">
              {t.nav.work}
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language toggle */}
            <button
              onClick={toggle}
              aria-label={lang === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
              className="flex items-center gap-1 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-2.5 py-1.5 transition-all hover:border-[var(--accent-teal)]/40"
            >
              <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${lang === "en" ? "text-[var(--accent-teal)]" : "text-[var(--muted-foreground)]"}`}>
                EN
              </span>
              <span className="text-[10px] text-[var(--card-border)]">/</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${lang === "es" ? "text-[var(--accent-teal)]" : "text-[var(--muted-foreground)]"}`}>
                ES
              </span>
            </button>

            {/* Desktop CTA */}
            <Link
              href="#contact"
              className="hidden rounded-lg border border-[var(--foreground)]/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--foreground)] transition-all hover:border-[var(--accent-teal)]/50 hover:text-[var(--accent-teal)] hover:shadow-[0_0_14px_var(--glow-teal)] md:inline-flex"
            >
              {t.nav.cta}
            </Link>

            {/* Hamburger */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg border border-[var(--card-border)] bg-[var(--card)] transition-colors hover:border-[var(--accent-teal)]/40 md:hidden"
            >
              <span className={`block h-[1.5px] w-5 bg-[var(--foreground)] transition-all duration-200 origin-center ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
              <span className={`block h-[1.5px] w-5 bg-[var(--foreground)] transition-all duration-200 ${open ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-[1.5px] w-5 bg-[var(--foreground)] transition-all duration-200 origin-center ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[var(--background)] px-4 pt-[60px] pb-10 md:hidden">
          <nav className="flex flex-1 flex-col justify-center gap-2">
            {[
              { href: "#services", label: t.nav.services },
              { href: "#how-we-work", label: t.nav.process },
              { href: "#work", label: t.nav.work },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="rounded-xl px-4 py-4 text-2xl font-bold tracking-tight text-[var(--foreground)] transition-colors hover:bg-[var(--card)] hover:text-[var(--accent-teal)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="#contact"
            onClick={close}
            className="w-full rounded-xl bg-[var(--foreground)] py-4 text-center text-sm font-semibold text-[var(--background)] transition-all hover:bg-white"
          >
            {t.nav.cta}
          </Link>
        </div>
      )}
    </>
  );
}
