import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  id?: string
  children?: ReactNode
  as?: 'h1' | 'h2'
}

/** Encabezado de sección: etiqueta en celeste + título tipo afiche + cuerdas del ring. */
export function SectionHeading({ eyebrow, title, id, children, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="label text-celeste">{eyebrow}</p>
      <Tag id={id} className="heading mt-3 text-title text-paper">
        {title}
      </Tag>
      <div className="ropes mt-5 w-20" aria-hidden="true">
        <span />
      </div>
      {children ? <div className="mt-5 text-lg text-muted">{children}</div> : null}
    </div>
  )
}
