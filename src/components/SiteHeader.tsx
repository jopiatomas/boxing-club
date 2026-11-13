import { useEffect, useState } from "react";
import { siteContent } from "../data/siteContent";
import { AppLink } from "./AppLink";
import { Logo } from "./Logo";
import { Icon } from "./ui/Icon";

type SiteHeaderProps = {
  activePath: string;
  onNavigate: (href: string) => void;
};

export function SiteHeader({ activePath, onNavigate }: SiteHeaderProps) {
  const { navigation } = siteContent;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onVideos = activePath === "/videos";

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }
    function handleResize() {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  function go(href: string) {
    setIsMenuOpen(false);
    onNavigate(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-900/95 backdrop-blur supports-[backdrop-filter]:bg-ink-900/85">
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <AppLink href="/" onNavigate={go} className="flex items-center gap-3" aria-label="Piki Team, inicio">
          <Logo size={44} className="h-11 w-auto" />
          <span className="flex flex-col leading-none">
            <span className="heading text-[1.5rem] text-paper">Piki Team</span>
            <span className="label mt-1 hidden text-[0.6875rem] text-muted sm:block">Gimnasio de boxeo</span>
          </span>
        </AppLink>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              onNavigate={go}
              className="label rounded-[var(--radius-xs)] px-3 py-2 text-[0.9375rem] text-muted transition-colors hover:text-paper"
            >
              {item.label}
            </AppLink>
          ))}
          <AppLink
            href="/videos"
            onNavigate={go}
            aria-current={onVideos ? "page" : undefined}
            className="btn btn-primary btn-sm ml-3"
          >
            <Icon name="play" size={16} />
            Videos
          </AppLink>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {!onVideos ? (
            <AppLink href="/videos" onNavigate={go} className="btn btn-primary btn-sm">
              <Icon name="play" size={16} />
              Videos
            </AppLink>
          ) : null}
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="menu-movil"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="btn btn-secondary btn-sm px-3"
          >
            <Icon name={isMenuOpen ? "x" : "menu"} />
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav id="menu-movil" aria-label="Menú" className="border-t border-ink-700 bg-ink-900 md:hidden">
          <ul className="container-x flex flex-col py-3">
            {[...navigation, { label: "Videos", href: "/videos" }].map((item) => (
              <li key={item.href}>
                <AppLink
                  href={item.href}
                  onNavigate={go}
                  className="heading flex min-h-14 items-center justify-between border-b border-ink-800 text-2xl text-paper last:border-0"
                >
                  {item.label}
                  <Icon name="arrowRight" className="text-celeste" />
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
