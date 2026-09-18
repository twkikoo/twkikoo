import { useId, useMemo } from "react";
import { cn, seeded } from "../lib/utils";

/**
 * Every piece in the catalogue is drawn, not photographed.
 *
 * Outlines are parametric; inclusions (speckles, pressed gypsophila) are placed
 * by a seeded RNG so a piece looks identical on every render; hardware is real
 * geometry anchored to the measured top of the shape, so a hoop threads through
 * a donut and a necklace bail actually touches its pendant. The viewBox is
 * computed from those bounds, which is what keeps twelve different silhouettes
 * optically the same size inside a card.
 */

const CENTER = 100;

/** Sample r(θ) into a closed path, measuring its vertical extent as we go. */
function polar(radius, radial, samples = 240) {
  let d = "";
  let top = Infinity;
  let bottom = -Infinity;
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    const r = radius * radial(t);
    const x = CENTER + r * Math.cos(t - Math.PI / 2);
    const y = CENTER + r * Math.sin(t - Math.PI / 2);
    if (y < top) top = y;
    if (y > bottom) bottom = y;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return { d: `${d}Z`, top, bottom };
}

/** Corner-rounded polygon — how the star gets points that are sharp but not spiky. */
function roundedPolygon(points, radius) {
  let d = "";
  let top = Infinity;
  let bottom = -Infinity;
  for (let i = 0; i < points.length; i++) {
    const previous = points[(i - 1 + points.length) % points.length];
    const current = points[i];
    const next = points[(i + 1) % points.length];
    top = Math.min(top, current[1]);
    bottom = Math.max(bottom, current[1]);

    const cut = (from) => {
      const dx = from[0] - current[0];
      const dy = from[1] - current[1];
      const length = Math.hypot(dx, dy);
      const step = Math.min(radius, length / 2) / length;
      return [current[0] + dx * step, current[1] + dy * step];
    };
    const enter = cut(previous);
    const leave = cut(next);
    d += `${i === 0 ? `M${enter[0].toFixed(2)} ${enter[1].toFixed(2)}` : `L${enter[0].toFixed(2)} ${enter[1].toFixed(2)}`}`;
    d += `Q${current[0].toFixed(2)} ${current[1].toFixed(2)} ${leave[0].toFixed(2)} ${leave[1].toFixed(2)}`;
  }
  return { d: `${d}Z`, top: top + radius * 0.3, bottom: bottom - radius * 0.3 };
}

function starPoints(spikes, outer, inner) {
  const points = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const t = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    points.push([CENTER + r * Math.cos(t), CENTER + r * Math.sin(t)]);
  }
  return points;
}

function hole(r) {
  return `M${CENTER} ${CENTER - r}a${r} ${r} 0 1 0 0 ${r * 2}a${r} ${r} 0 1 0 0 ${-r * 2}Z`;
}

const SHAPES = {
  disc: () => polar(68, () => 1),
  donut: () => {
    const base = polar(70, () => 1);
    return { ...base, d: base.d + hole(25) };
  },
  // five fat petals, like the ones on the rack
  flower: () => {
    const base = polar(72, (t) => 0.74 + 0.26 * Math.cos(5 * t));
    return { ...base, d: base.d + hole(20) };
  },
  star: () => {
    const base = roundedPolygon(starPoints(5, 76, 34), 13);
    return { ...base, d: base.d + hole(17) };
  },
  drop: () => ({
    d: "M100 24C127 57 155 85 155 115a55 55 0 1 1-110 0c0-30 28-58 55-91Z",
    top: 24,
    bottom: 170,
  }),
  paw: () => ({
    d: [
      "M100 178c-26 0-44-13-44-31 0-15 15-24 44-24s44 9 44 24c0 18-18 31-44 31Z",
      "M52 96c9 0 15 9 15 21s-6 20-15 20-16-9-16-21 7-20 16-20Z",
      "M80 66c9 0 16 10 16 23s-7 22-16 22-16-10-16-23 7-22 16-22Z",
      "M120 66c9 0 16 10 16 23s-7 22-16 22-16-10-16-23 7-22 16-22Z",
      "M148 96c9 0 16 9 16 21s-7 20-16 20-15-9-15-21 6-20 15-20Z",
    ].join(""),
    top: 66,
    bottom: 178,
  }),
};

/** A pressed gypsophila floret: five petals and a pale heart. */
function Floret({ x, y, s, rotate }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-3.4" rx="2" ry="3.1" fill="#FFFFFF" opacity="0.95" transform={`rotate(${a})`} />
      ))}
      <circle r="1.4" fill="#F6E7B8" />
    </g>
  );
}

export function ResinPiece({ art, seed = "kiko", mount = "auto", className, title }) {
  const uid = useId().replace(/:/g, "");
  const shape = art?.shape ?? "disc";
  const resolvedMount = mount === "auto" ? (shape === "drop" ? "hook" : "hoop") : mount;
  const hasMetal = Boolean(art?.hardware) && art.hardware !== "none" && resolvedMount !== "none";

  const { geometry, speckles, florets } = useMemo(() => {
    const rand = seeded(`${seed}-${shape}`);
    const scatter = (count, maxR) =>
      Array.from({ length: count }, () => {
        const t = rand() * Math.PI * 2;
        const r = Math.sqrt(rand()) * maxR;
        return {
          x: CENTER + r * Math.cos(t),
          y: CENTER + r * Math.sin(t),
          s: 0.6 + rand() * 0.7,
          rotate: rand() * 360,
          r: 2.4 + rand() * 4,
        };
      });
    return {
      geometry: (SHAPES[shape] ?? SHAPES.disc)(),
      speckles: art?.speckles ? scatter(art.speckles, 50) : [],
      florets: art?.flowers ? scatter(art.flowers, shape === "drop" ? 32 : 42) : [],
    };
  }, [art?.speckles, art?.flowers, seed, shape]);

  const metal = art?.hardware === "silver" ? "#C4CACE" : "#D8B349";
  const metalDark = art?.hardware === "silver" ? "#8E979D" : "#A4801F";

  // Hardware hangs off the measured top edge, so nothing ever floats detached.
  const top = geometry.top;
  const hoopCenter = top - 11;
  const HARDWARE_TOP = {
    hoop: hoopCenter - 34,
    hook: top - 44,
    chain: top - 74,
    ring: top - 44,
    none: top,
  };

  const contentTop = (hasMetal ? HARDWARE_TOP[resolvedMount] : top) - 6;
  const contentBottom = geometry.bottom + (art?.satellite ? 66 : 0) + 8;

  return (
    <svg
      viewBox={`0 ${contentTop} 200 ${contentBottom - contentTop}`}
      className={cn("overflow-visible", className)}
      role="img"
      aria-label={title ?? "Peça em resina"}
    >
      <defs>
        <linearGradient id={`fill-${uid}`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={art?.from ?? "#F2573E"} />
          <stop offset="100%" stopColor={art?.to ?? "#B4241A"} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.36" cy="0.26" r="0.5">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`metal-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="38%" stopColor={metal} />
          <stop offset="100%" stopColor={metalDark} />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <path d={geometry.d} clipRule="evenodd" />
        </clipPath>
        <filter id={`cast-${uid}`} x="-40%" y="-30%" width="180%" height="170%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#6B4A2C" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* hardware first — the piece sits in front of it, so hoops read as threaded */}
      {hasMetal && resolvedMount === "hoop" && (
        <circle
          cx="100"
          cy={hoopCenter}
          r="30"
          fill="none"
          stroke={`url(#metal-${uid})`}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
      )}
      {hasMetal && resolvedMount === "hook" && (
        <g fill="none" stroke={`url(#metal-${uid})`} strokeWidth="4.5" strokeLinecap="round">
          <path d={`M100 ${top - 6}V${top - 26}a14 14 0 1 0-28 0`} />
          <circle cx="100" cy={top - 4} r="5.5" fill={`url(#metal-${uid})`} stroke="none" />
        </g>
      )}
      {hasMetal && resolvedMount === "chain" && (
        <g fill="none" stroke={`url(#metal-${uid})`} strokeLinecap="round">
          <path d={`M100 ${top - 22}L62 ${top - 74}M100 ${top - 22}L138 ${top - 74}`} strokeWidth="2.2" />
          <path d={`M100 ${top - 22}c-13 0-13 22 0 22s13-22 0-22Z`} strokeWidth="4" />
        </g>
      )}
      {hasMetal && resolvedMount === "ring" && (
        <circle cx="100" cy={top - 18} r="23" fill="none" stroke={`url(#metal-${uid})`} strokeWidth="5.5" />
      )}

      <g filter={`url(#cast-${uid})`}>
        <path d={geometry.d} fill={`url(#fill-${uid})`} fillRule="evenodd" />
        <g clipPath={`url(#clip-${uid})`}>
          {speckles.map((dot, i) => (
            <circle key={`s${i}`} cx={dot.x} cy={dot.y} r={dot.r} fill={art?.accent ?? "#FFFFFF"} opacity="0.9" />
          ))}
          {florets.map((flower, i) => (
            <Floret key={`f${i}`} {...flower} />
          ))}
          {/* a single soft crescent of light — resin is translucent, not chrome */}
          <rect x="0" y="0" width="200" height="200" fill={`url(#glow-${uid})`} />
          <ellipse cx="70" cy="54" rx="17" ry="7.5" fill="#FFFFFF" opacity="0.2" transform="rotate(-32 70 54)" />
        </g>
        <path d={geometry.d} fill="none" fillRule="evenodd" stroke="#000000" strokeOpacity="0.09" strokeWidth="1.4" />
      </g>

      {/* the little satellite disc that hangs under the cobalt pair */}
      {art?.satellite && (
        <g>
          <circle
            cx="100"
            cy={geometry.bottom + 8}
            r="9"
            fill="none"
            stroke={`url(#metal-${uid})`}
            strokeWidth="3.5"
          />
          <circle cx="100" cy={geometry.bottom + 40} r="24" fill={art.accent ?? "#3E1BA6"} />
          <ellipse
            cx="92"
            cy={geometry.bottom + 32}
            rx="8"
            ry="4.5"
            fill="#FFFFFF"
            opacity="0.28"
            transform={`rotate(-30 92 ${geometry.bottom + 32})`}
          />
        </g>
      )}
    </svg>
  );
}

/** Mount style per category, so a colar never turns up wearing an earring hoop. */
export function mountFor(product) {
  if (product.category === "colares" || product.category === "conjuntos") return "chain";
  if (product.category === "acessorios") return product.art.shape === "paw" ? "ring" : "none";
  return "auto";
}

/** A piece on its warm studio backdrop — the standard card/thumbnail presentation. */
export function ResinScene({ product, className, tint }) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background:
          tint ?? `radial-gradient(120% 90% at 30% 18%, #FFFDF8 0%, ${product.art.from}14 55%, ${product.art.to}22 100%)`,
      }}
    >
      <ResinPiece
        art={product.art}
        seed={product.slug}
        mount={mountFor(product)}
        title={product.name}
        className="absolute inset-[9%]"
      />
    </div>
  );
}
