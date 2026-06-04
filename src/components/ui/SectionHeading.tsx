import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  label?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  label,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {label && <p className="ro-label mb-4 text-ro-gold">{label}</p>}
      <h2 className="ro-heading text-4xl md:text-5xl lg:text-6xl">{title}</h2>
      {description && (
        <p className="mt-6 font-sans text-sm font-light leading-relaxed text-ro-muted md:text-base">
          {description}
        </p>
      )}
      <div className="mt-6 h-px w-12 bg-ro-gold/40" aria-hidden />
    </div>
  )
}
