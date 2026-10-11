export function Marca({ clara = false }: { clara?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${clara ? 'text-papel' : 'text-tinta'}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <rect width="32" height="32" rx="10" fill={clara ? '#f3ecdf' : '#243228'} />
        <path
          d="M16 7c-3 0-5.2 2-5.2 4.8 0 2 1.1 3.4 2.2 4.1V18h6v-2.1c1.1-.7 2.2-2.1 2.2-4.1C21.2 9 19 7 16 7Z"
          fill={clara ? '#243228' : '#f3ecdf'}
        />
        <path
          d="M12.4 19.4h7.2M13.6 21.5h4.8M14.8 23.5h2.4"
          stroke="#e7b15a"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-serif text-xl tracking-tight">AtiendeTe</span>
    </span>
  )
}
