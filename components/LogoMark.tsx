export default function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Center dot */}
      <circle cx="14" cy="14" r="2" fill="currentColor" />
      {/* Orbital ring 1 — horizontal ellipse */}
      <ellipse cx="14" cy="14" rx="12" ry="4.5" stroke="currentColor" strokeWidth="1.2" />
      {/* Orbital ring 2 — tilted ~60deg */}
      <ellipse
        cx="14" cy="14" rx="12" ry="4.5"
        stroke="currentColor" strokeWidth="1.2"
        transform="rotate(60 14 14)"
      />
      {/* Orbital ring 3 — tilted ~120deg */}
      <ellipse
        cx="14" cy="14" rx="12" ry="4.5"
        stroke="currentColor" strokeWidth="1.2"
        transform="rotate(120 14 14)"
      />
    </svg>
  )
}
