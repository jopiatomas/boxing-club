type LogoProps = {
  size?: number
  className?: string
}

export function Logo({ size = 44, className = '' }: LogoProps) {
  return (
    <picture>
      <source type="image/webp" srcSet="/img/logo-96.webp 1x, /img/logo-192.webp 2x" />
      <img
        src="/img/logo-96.png"
        alt=""
        width={Math.round(size * (702 / 812))}
        height={size}
        className={className}
      />
    </picture>
  )
}
