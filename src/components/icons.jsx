const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Svg({ children, size = 20, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...rest}>
      {children}
    </svg>
  );
}

export const Icon = {
  Bag: (p) => (
    <Svg {...p}>
      <path d="M6 8h12l-1 11.5a1.5 1.5 0 0 1-1.5 1.4h-9A1.5 1.5 0 0 1 5 19.5Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </Svg>
  ),
  Search: (p) => (
    <Svg {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Svg>
  ),
  Close: (p) => (
    <Svg {...p}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Svg>
  ),
  Arrow: (p) => (
    <Svg {...p}>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </Svg>
  ),
  ArrowLeft: (p) => (
    <Svg {...p}>
      <path d="M20 12H4m6 6-6-6 6-6" />
    </Svg>
  ),
  Check: (p) => (
    <Svg {...p}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Svg>
  ),
  Plus: (p) => (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  Minus: (p) => (
    <Svg {...p}>
      <path d="M5 12h14" />
    </Svg>
  ),
  Chevron: (p) => (
    <Svg {...p}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  ),
  User: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </Svg>
  ),
  Heart: (p) => (
    <Svg {...p}>
      <path d="M12 20s-7-4.3-7-9a3.8 3.8 0 0 1 7-2.1A3.8 3.8 0 0 1 19 11c0 4.7-7 9-7 9Z" />
    </Svg>
  ),
  Menu: (p) => (
    <Svg {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  ),
  Truck: (p) => (
    <Svg {...p}>
      <path d="M3 16V6h11v10M14 9h4l3 3.5V16h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </Svg>
  ),
  Spark: (p) => (
    <Svg {...p}>
      <path d="M12 3.5c.9 4 2.6 5.7 6.5 6.5-4 .9-5.6 2.6-6.5 6.5-.9-4-2.6-5.6-6.5-6.5 4-.8 5.6-2.5 6.5-6.5Z" />
    </Svg>
  ),
  Chat: (p) => (
    <Svg {...p}>
      <path d="M20 12.5c0 3.6-3.6 6.5-8 6.5a9.7 9.7 0 0 1-2.6-.35L5 20.5l.9-3.2A6.2 6.2 0 0 1 4 12.5C4 8.9 7.6 6 12 6s8 2.9 8 6.5Z" />
    </Svg>
  ),
  Mail: (p) => (
    <Svg {...p}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 8 8 5 8-5" />
    </Svg>
  ),
  Lock: (p) => (
    <Svg {...p}>
      <rect x="4.5" y="10" width="15" height="10" rx="2.5" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </Svg>
  ),
  Filter: (p) => (
    <Svg {...p}>
      <path d="M4 7h16M7 12h10M10 17h4" />
    </Svg>
  ),
};

/** Kiko himself — used as a quiet mark rather than a mascot sticker. */
export function CatMark({ size = 28, className, ...rest }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true" {...rest}>
      <path
        fill="currentColor"
        d="M12 26c0-2.6.4-5 1-7.2.6-2.4.5-5 .2-7.6-.1-1.2 1.1-2 2.1-1.4l7.5 4.6a25 25 0 0 1 18.4 0l7.5-4.6c1-.6 2.2.2 2.1 1.4-.3 2.6-.4 5.2.2 7.6.6 2.2 1 4.6 1 7.2 0 12.5-9 21.4-20 21.4S12 38.5 12 26Z"
      />
      <circle cx="24" cy="27" r="3.1" fill="#FBF6EE" />
      <circle cx="40" cy="27" r="3.1" fill="#FBF6EE" />
      <path fill="#FBF6EE" d="M32 34.5c1.9 0 3 1 3 2s-1.3 2.4-3 2.4-3-1.3-3-2.4 1.1-2 3-2Z" />
    </svg>
  );
}
