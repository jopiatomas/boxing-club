import { siteContent } from '../data/siteContent'
import { AppLink } from './AppLink'

type SiteHeaderProps = {
  onNavigate: (href: string) => void
}

export function SiteHeader({ onNavigate }: SiteHeaderProps) {
  const { navigation } = siteContent

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(7,18,38,0.9)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <AppLink href="/#inicio" onNavigate={onNavigate} className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-ink)] text-[0.7rem] font-bold uppercase tracking-[0.35em] text-[var(--color-accent)]">
            Logo
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

        <AppLink
          href="/#contacto"
          onNavigate={onNavigate}
          className="rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink)] transition hover:bg-transparent hover:text-[var(--color-accent)]"
        >
          Sumate hoy
        </AppLink>
      </div>
    </header>
  )
}
