interface Props {
  className?: string
}

export function IconoMas({ className = 'h-5 w-5' }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconoMenos({ className = 'h-5 w-5' }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M4 10h12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconoCerrar({ className = 'h-5 w-5' }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M5 5l10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconoCampana({ className = 'h-5 w-5' }: Props) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path
        d="M10 3.2a4.2 4.2 0 0 0-4.2 4.2c0 2.2-.7 3.2-1.3 3.8h11c-.6-.6-1.3-1.6-1.3-3.8A4.2 4.2 0 0 0 10 3.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M8 14.2a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
