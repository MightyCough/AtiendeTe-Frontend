interface Paleta {
  fondo: string
  mantel: string
  a: string
  b: string
  c: string
}

const PLATOS: Record<string, Paleta> = {
  huancaina: { fondo: '#f6e2b8', mantel: '#f8f1dc', a: '#f0c14a', b: '#fffaf0', c: '#3a2a22' },
  tequenos: { fondo: '#f3d7b5', mantel: '#f8efe2', a: '#e2a15a', b: '#f6e7c1', c: '#8c3a22' },
  causa: { fondo: '#f6e7a8', mantel: '#fbf6df', a: '#e6c84a', b: '#7ea14a', c: '#f7f4ea' },
  pota: { fondo: '#f0d2b4', mantel: '#f7ecdf', a: '#d9894a', b: '#f3e1b0', c: '#3f6b4e' },
  lomo: { fondo: '#efd0c2', mantel: '#f8eee8', a: '#8c3d2f', b: '#e6b15a', c: '#f6f1e6' },
  aji: { fondo: '#f6e3a8', mantel: '#fbf6e4', a: '#e2b33a', b: '#f7f3e4', c: '#3d3428' },
  pachamanca: { fondo: '#e7d3bf', mantel: '#f3eadf', a: '#8d4b32', b: '#6d8a52', c: '#c4a574' },
  tallarin: { fondo: '#f3ddc4', mantel: '#f8f0e4', a: '#e0b15a', b: '#c46a3a', c: '#f7f1e4' },
  trucha: { fondo: '#d5e4ea', mantel: '#eef4f6', a: '#d9896a', b: '#f2e2c4', c: '#4f7d6a' },
  suspiro: { fondo: '#f6e4ea', mantel: '#fbf3f6', a: '#f7f3ee', b: '#e7c2a4', c: '#c4845a' },
  picarones: { fondo: '#f6ddc0', mantel: '#fbf3e8', a: '#c47a32', b: '#e8b15a', c: '#6b3a24' },
  mazamorra: { fondo: '#ead4ea', mantel: '#f6eef6', a: '#7a3d78', b: '#e7c06a', c: '#f8f2f8' },
  plato: { fondo: '#efe2d2', mantel: '#f7f1e8', a: '#d7b48a', b: '#f7f1e6', c: '#8c5a3c' },
}

const VASOS: Record<string, { fondo: string; liquido: string; brillo: string }> = {
  chicha: { fondo: '#efe0ee', liquido: '#6b2d5b', brillo: '#e7c0e0' },
  limonada: { fondo: '#e7f0d4', liquido: '#c5d86a', brillo: '#f4f8e4' },
  inca: { fondo: '#f8efc4', liquido: '#f2c21a', brillo: '#fff6cc' },
}

export function ArtePlato({ variante }: { variante: string }) {
  if (variante === 'cafe') return <Taza />
  const vaso = VASOS[variante]
  if (vaso) return <Vaso {...vaso} />
  return <Plato {...(PLATOS[variante] ?? PLATOS.plato)} />
}

function Plato({ fondo, mantel, a, b, c }: Paleta) {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect width="320" height="200" fill={fondo} />
      <circle cx="46" cy="36" r="18" fill="#fff" opacity="0.28" />
      <rect x="28" y="150" width="264" height="10" rx="5" fill="#000" opacity="0.05" />
      <ellipse cx="160" cy="112" rx="112" ry="46" fill={mantel} />
      <ellipse cx="160" cy="108" rx="96" ry="36" fill="#fff" />
      <ellipse cx="138" cy="104" rx="42" ry="18" fill={a} />
      <ellipse cx="176" cy="98" rx="30" ry="16" fill={b} />
      <circle cx="198" cy="112" r="9" fill={c} />
      <ellipse cx="150" cy="118" rx="16" ry="6" fill={c} opacity="0.35" />
    </svg>
  )
}

function Vaso({ fondo, liquido, brillo }: { fondo: string; liquido: string; brillo: string }) {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect width="320" height="200" fill={fondo} />
      <rect x="118" y="148" width="84" height="8" rx="4" fill="#000" opacity="0.06" />
      <path d="M128 42h64l-8 112a16 16 0 0 1-16 14h-16a16 16 0 0 1-16-14L128 42Z" fill="#fff" opacity="0.9" />
      <path d="M132 58h56l-6 90a12 12 0 0 1-12 10h-20a12 12 0 0 1-12-10l-6-90Z" fill={liquido} />
      <path d="M140 66c8 10 8 24 0 36" fill="none" stroke={brillo} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <ellipse cx="160" cy="58" rx="28" ry="6" fill="#fff" opacity="0.45" />
    </svg>
  )
}

function Taza() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect width="320" height="200" fill="#f0e2d4" />
      <ellipse cx="150" cy="156" rx="54" ry="8" fill="#000" opacity="0.06" />
      <path d="M112 70h84v52a28 28 0 0 1-28 28h-28a28 28 0 0 1-28-28V70Z" fill="#fffaf3" />
      <path d="M118 78h72v40a22 22 0 0 1-22 22h-28a22 22 0 0 1-22-22V78Z" fill="#6b3e2a" />
      <path d="M196 88h16a18 18 0 0 1 0 36h-14" fill="none" stroke="#fffaf3" strokeWidth="8" />
      <path d="M150 48c0 10-16 10-16 20M166 42c0 12-16 12-16 22" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}
