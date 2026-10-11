export function Circuito() {
  return (
    <div className="pizarra-fondo" aria-hidden>
      <svg className="circuito" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path
          className="trazo"
          d="M28 36 H1412 M28 36 V864 M1412 36 V864 M28 864 H1412 M28 180 H150 V36 M1412 220 H1260 V36 M28 700 H170 V864 M1412 640 H1240 V864"
        />
        <path
          className="luz"
          d="M28 36 H1412 V864 H28 V36"
        />
        <circle cx="150" cy="36" r="5" fill="#e7b15a" />
        <circle cx="1412" cy="220" r="5" fill="#c24e24" />
        <circle cx="28" cy="700" r="5" fill="#f3ecdf" />
        <circle cx="1240" cy="864" r="5" fill="#e7b15a" />
      </svg>
    </div>
  )
}
