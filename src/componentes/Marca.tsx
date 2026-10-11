export function Marca() {
  return (
    <span className="inline-flex items-center gap-2 text-tinta">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <rect x="1.5" y="1.5" width="29" height="29" rx="9" fill="none" stroke="#f3ecdf" strokeWidth="1.6" />
        <path
          d="M16 7c-3 0-5.2 2-5.2 4.8 0 2 1.1 3.4 2.2 4.1V18h6v-2.1c1.1-.7 2.2-2.1 2.2-4.1C21.2 9 19 7 16 7Z"
          fill="#f3ecdf"
        />
        <path
          d="M12.4 19.4h7.2M13.6 21.5h4.8M14.8 23.5h2.4"
          stroke="#e7b15a"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-serif text-2xl leading-none">AtiendeTe</span>
    </span>
  )
}
