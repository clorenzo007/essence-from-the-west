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
      {label && <p className="luxury-label mb-4">{label}</p>}
      <h2 className="luxury-heading text-4xl md:text-5xl lg:text-6xl">{title}</h2>
      {description && (
        <p className="mt-6 font-sans text-sm font-light leading-relaxed text-luxury-silver md:text-base">
          {description}
        </p>
      )}
    </div>
  )
}
