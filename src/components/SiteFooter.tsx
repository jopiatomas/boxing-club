import { siteContent } from '../data/siteContent'
import { AppLink } from './AppLink'

type SiteFooterProps = {
  onNavigate: (href: string) => void
}

export function SiteFooter({ onNavigate }: SiteFooterProps) {
  const { footer } = siteContent

  return (
    <footer className="border-t border-white/10 bg-black/35">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <p className="font-display text-2xl uppercase tracking-[0.2em] text-white">
            Piki Team
          </p>
          <p className="mt-2 max-w-xl text-sm text-white/65">
            {footer.copy}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.24em] text-white/60">
          {footer.links.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              onNavigate={onNavigate}
              className="transition hover:text-[var(--color-accent)]"
            >
              {item.label}
            </AppLink>
          ))}
        </div>
      </div>
    </footer>
  )
}
