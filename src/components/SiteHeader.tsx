import { useEffect, useState } from "react";
import { siteContent } from "../data/siteContent";
import { AppLink } from "./AppLink";

type SiteHeaderProps = {
  onNavigate: (href: string) => void;
};

export function SiteHeader({ onNavigate }: SiteHeaderProps) {
  const { navigation } = siteContent;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleNavigation(href: string) {
    setIsMobileMenuOpen(false);
    onNavigate(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(7,18,38,0.9)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <AppLink
          href="/#inicio"
          onNavigate={onNavigate}
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center">
            <img src="logo.png" className="rounded-full" />
          </div>
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.18em] text-white">
              Piki Team
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/55">
              Boxeo y preparación
            </p>
          </div>
        </AppLink>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              onNavigate={onNavigate}
              className="text-sm uppercase tracking-[0.24em] text-white/70 transition hover:text-[var(--color-accent)]"
            >
              {item.label}
            </AppLink>
          ))}
        </nav>

        <button
          type="button"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="inline-flex items-center gap-3 rounded-full border border-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] lg:hidden"
        >
          Menu
          <span className="flex w-4 flex-col gap-1">
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
          </span>
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-white/10 bg-[rgba(7,18,38,0.98)] lg:hidden">
          <nav
            id="mobile-navigation"
            className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-5"
          >
            {navigation.map((item) => (
              <AppLink
                key={item.href}
                href={item.href}
                onNavigate={handleNavigation}
                className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4 text-sm uppercase tracking-[0.24em] text-white/80 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                {item.label}
              </AppLink>
            ))}

            <AppLink
              href="/#contacto"
              onNavigate={handleNavigation}
              className="mt-2 rounded-2xl border border-accent bg-[var(--color-accent)] px-4 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-ink)]"
            >
              Contacto
            </AppLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
