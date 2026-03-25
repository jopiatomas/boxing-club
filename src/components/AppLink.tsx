import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  onNavigate?: (href: string) => void
  children: ReactNode
}

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
}

export function AppLink({ href, onNavigate, children, ...props }: AppLinkProps) {
  const isInternalRoute = href.startsWith('/') || href.startsWith('#')

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    props.onClick?.(event)

    if (
      event.defaultPrevented ||
      !isInternalRoute ||
      isModifiedEvent(event) ||
      props.target === '_blank'
    ) {
      return
    }

    event.preventDefault()
    onNavigate?.(href)
  }

  return (
    <a {...props} href={href} onClick={handleClick}>
      {children}
    </a>
  )
}
