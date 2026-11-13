import type { ImgHTMLAttributes } from 'react'

/** Fotos del gimnasio con sus variantes generadas por `npm run images`. */
const photos = {
  gimnasio: { widths: [640, 1024, 1600], fallback: 1024, width: 1599, height: 782 },
  fachada: { widths: [640, 1024, 1600], fallback: 1024, width: 1600, height: 617 },
  piki: { widths: [480, 800, 1200], fallback: 800, width: 1200, height: 1600 },
} as const

export type PhotoName = keyof typeof photos

type PhotoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  name: PhotoName
  alt: string
  sizes: string
  /** Para la foto principal visible al cargar: carga inmediata y prioridad alta. */
  priority?: boolean
}

export function Photo({ name, alt, sizes, priority = false, className, ...props }: PhotoProps) {
  const photo = photos[name]
  const srcSet = photo.widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ')

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={`/img/${name}-${photo.fallback}.jpg`}
        alt={alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
        {...props}
      />
    </picture>
  )
}
