"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  const links = [
    { href: "#services", label: t.footer.services },
    { href: "#how-we-work", label: t.footer.process },
    { href: "#work", label: t.footer.work },
    { href: "#contact", label: t.footer.contact },
  ];

  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--background-2)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3">
            <Image
              src="/Logot Spotynet Horizontal.png"
              alt="Spotynet"
              width={120}
              height={30}
              className="h-6 w-auto object-contain opacity-80"
            />
            <p className="text-xs text-[var(--muted-foreground)]">
              © {year} Spotynet. {t.footer.copyright}
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium uppercase tracking-widest text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
