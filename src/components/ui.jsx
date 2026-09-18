import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ease, fadeUp, spring, springSnap, springSoft, stagger } from "../lib/motion";
import { cn } from "../lib/utils";
import { Icon } from "./icons";
import { PawSpinner } from "./PawLoader";

const VARIANTS = {
  primary: "bg-ink text-cream hover:bg-ink/90",
  accent: "bg-ember text-white hover:bg-ember/92",
  outline: "border border-ink/20 text-ink hover:border-ink/45 hover:bg-ink/[0.03]",
  ghost: "text-ink hover:bg-ink/[0.05]",
  paper: "bg-paper text-ink shadow-soft hover:shadow-lift",
};

const SIZES = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-[15px]",
};

export function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  ...rest
}) {
  const MotionTag = motion.create(Tag);
  return (
    <MotionTag
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.975, y: 0 }}
      transition={springSnap}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em]",
        "transition-colors duration-200 select-none disabled:pointer-events-none disabled:opacity-45",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={loading || rest.disabled}
      {...rest}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={springSnap}
            className="inline-flex items-center gap-2"
          >
            <PawSpinner size={16} tone={variant === "primary" || variant === "accent" ? "honey" : "ink"} />
            <span className="opacity-80">um segundo…</span>
          </motion.span>
        ) : (
          <motion.span
            key="label"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={springSnap}
            className="inline-flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </MotionTag>
  );
}

export function IconButton({ label, className, children, ...rest }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      transition={springSnap}
      className={cn(
        "grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function Badge({ children, tone = "sand", upper = true, className }) {
  const tones = {
    sand: "bg-sand text-ink-soft",
    ink: "bg-ink text-cream",
    ember: "bg-ember/12 text-ember",
    jade: "bg-jade/12 text-jade",
    honey: "bg-honey/16 text-[#8a5f04]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium",
        upper ? "font-mono text-[10px] tracking-[0.08em] uppercase" : "tracking-normal",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Fade + rise on first scroll into view. Fires once; re-animating on scroll-back is noise. */
export function Reveal({ children, delay = 0, className, style, y = 22 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/** Staggered list container — pair with <Reveal> children or `variants={fadeUp}`. */
export function RevealGroup({ children, className, gap = 0.07, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger(gap, delay)}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const RevealItem = ({ children, className }) => (
  <motion.div variants={fadeUp} className={className}>
    {children}
  </motion.div>
);

export function SectionHead({ eyebrow, title, note, action, className }) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-6", className)}>
      <div className="max-w-xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-display text-4xl leading-[1.05] text-balance sm:text-5xl">{title}</h2>
        {note && <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">{note}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, hint, className, as = "input", ...rest }) {
  const Tag = as;
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-[13px] font-medium text-ink-soft">{label}</span>
      <Tag
        className={cn(
          "w-full rounded-2xl border border-ink/12 bg-paper px-4 py-3 text-[15px] text-ink",
          "placeholder:text-ink-mute/60 transition-all duration-200",
          "hover:border-ink/25 focus:border-ink/50 focus:ring-4 focus:ring-ink/[0.06] focus:outline-none",
          as === "textarea" && "min-h-32 resize-y",
        )}
        {...rest}
      />
      {hint && <span className="mt-1.5 block text-xs text-ink-mute">{hint}</span>}
    </label>
  );
}

export function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : index)}
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span
                className={cn(
                  "font-display text-xl transition-colors sm:text-2xl",
                  isOpen ? "text-ink" : "text-ink-soft group-hover:text-ink",
                )}
              >
                {item.q}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0, backgroundColor: isOpen ? "#221E1A" : "rgba(34,30,26,0)" }}
                transition={spring}
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full border border-ink/15",
                  isOpen ? "text-cream" : "text-ink",
                )}
              >
                <Icon.Chevron size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={springSoft}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pr-12 pb-7 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function Marquee({ items, duration = 42 }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative flex overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="animate-marquee flex shrink-0 items-center gap-10" style={{ "--marquee-duration": `${duration}s` }}>
        {doubled.map((item, index) => (
          <span key={index} className="flex shrink-0 items-center gap-10 font-display text-2xl text-ink-soft italic">
            {item}
            <span className="text-honey not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
