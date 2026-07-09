const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const HomeIcon = (p: { className?: string }) => (
  <svg {...base} className={p.className}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
  </svg>
);

export const CompassIcon = (p: { className?: string }) => (
  <svg {...base} className={p.className}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5z" />
  </svg>
);

export const BookmarkIcon = (p: { className?: string; filled?: boolean }) => (
  <svg {...base} className={p.className} fill={p.filled ? "currentColor" : "none"}>
    <path d="M6 4h12v17l-6-4-6 4z" />
  </svg>
);

export const UserIcon = (p: { className?: string }) => (
  <svg {...base} className={p.className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5" />
  </svg>
);

export const SearchIcon = (p: { className?: string }) => (
  <svg {...base} className={p.className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const CalendarIcon = (p: { className?: string }) => (
  <svg {...base} className={p.className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const PinIcon = (p: { className?: string }) => (
  <svg {...base} className={p.className}>
    <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const ExternalIcon = (p: { className?: string }) => (
  <svg {...base} className={p.className}>
    <path d="M14 5h5v5M19 5l-8 8" />
    <path d="M19 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
  </svg>
);

export const LogoMark = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={p.className} fill="currentColor">
    <path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
  </svg>
);
