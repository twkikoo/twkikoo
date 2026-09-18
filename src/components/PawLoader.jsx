import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ease, spring, springBouncy, springSoft } from "../lib/motion";
import { cn } from "../lib/utils";

/**
 * Kiko amassa pão.
 *
 * The kneading is not a keyframe loop — each beat flips the paws between two
 * states and a real spring carries them there, so the squash overshoots and
 * settles the way a paw actually would. Reduced motion gets a still paw.
 */

const PALETTES = {
  ember: { pad: "#D1462F", bean: "#F08E6E", rim: "#A32E1C" },
  honey: { pad: "#E7A11A", bean: "#FFD07A", rim: "#B87708" },
  ink: { pad: "#221E1A", bean: "#6F6359", rim: "#000000" },
};

function Paw({ pressed, tone = "ember", flip = false }) {
  const c = PALETTES[tone] ?? PALETTES.ember;
  return (
    <motion.g
      animate={{
        y: pressed ? 7 : 0,
        scaleY: pressed ? 0.9 : 1,
        scaleX: pressed ? 1.07 : 1,
        rotate: (pressed ? 3 : -2) * (flip ? -1 : 1),
      }}
      transition={springBouncy}
      style={{ originX: "32px", originY: "58px" }}
    >
      {/* contact shadow — spreads as the paw lands */}
      <motion.ellipse
        cx="32"
        cy="61"
        rx="16"
        ry="3"
        fill={c.rim}
        animate={{ scaleX: pressed ? 1.16 : 0.9, opacity: pressed ? 0.22 : 0.1 }}
        transition={springBouncy}
        style={{ originX: "32px", originY: "61px" }}
      />
      {/* toe beans — outer toes splay on the press */}
      <motion.g animate={{ scaleX: pressed ? 1.08 : 1 }} transition={springBouncy} style={{ originX: "32px", originY: "26px" }}>
        <ellipse cx="14" cy="25" rx="5.3" ry="6.7" fill={c.pad} transform="rotate(-18 14 25)" />
        <ellipse cx="24.6" cy="17.6" rx="5.5" ry="7.3" fill={c.pad} />
        <ellipse cx="39.4" cy="17.6" rx="5.5" ry="7.3" fill={c.pad} />
        <ellipse cx="50" cy="25" rx="5.3" ry="6.7" fill={c.pad} transform="rotate(18 50 25)" />
      </motion.g>
      {/* main pad */}
      <ellipse cx="32" cy="45" rx="15.6" ry="12.6" fill={c.pad} />
      <ellipse cx="27" cy="40" rx="6.4" ry="4.4" fill={c.bean} opacity="0.5" transform="rotate(-18 27 40)" />
    </motion.g>
  );
}

/** The paws themselves, at any size. */
export function PawLoader({ size = 72, tone = "ember", className }) {
  const reduce = useReducedMotion();
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setBeat((b) => b + 1), 330);
    return () => clearInterval(id);
  }, [reduce]);

  const leftPressed = !reduce && beat % 2 === 0;

  return (
    <svg
      viewBox="0 0 150 68"
      width={size * 2}
      height={size}
      className={cn("overflow-visible", className)}
      role="img"
      aria-label="A carregar"
    >
      <g transform="translate(6 0)">
        <Paw pressed={leftPressed} tone={tone} />
      </g>
      <g transform="translate(80 0)">
        <Paw pressed={!leftPressed && !reduce} tone={tone} flip />
      </g>
    </svg>
  );
}

/** One paw, pulsing. For buttons and other tight spaces where two paws turn to mush. */
export function PawSpinner({ size = 18, tone = "ink", className }) {
  const reduce = useReducedMotion();
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setBeat((b) => b + 1), 300);
    return () => clearInterval(id);
  }, [reduce]);

  const c = PALETTES[tone] ?? PALETTES.ink;

  return (
    <motion.svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      animate={{ scale: beat % 2 === 0 ? 0.86 : 1, rotate: beat % 2 === 0 ? -6 : 4 }}
      transition={springBouncy}
      aria-hidden="true"
    >
      <ellipse cx="14" cy="25" rx="5.3" ry="6.7" fill={c.pad} transform="rotate(-18 14 25)" />
      <ellipse cx="24.6" cy="17.6" rx="5.5" ry="7.3" fill={c.pad} />
      <ellipse cx="39.4" cy="17.6" rx="5.5" ry="7.3" fill={c.pad} />
      <ellipse cx="50" cy="25" rx="5.3" ry="6.7" fill={c.pad} transform="rotate(18 50 25)" />
      <ellipse cx="32" cy="45" rx="15.6" ry="12.6" fill={c.pad} />
    </motion.svg>
  );
}

const MESSAGES = [
  "a amassar pão…",
  "a misturar pigmento…",
  "a prensar flores…",
  "a esperar que cure…",
  "a tirar o gato da bancada…",
];

/** Full-screen veil shown between routes and during simulated work. */
export function PawCurtain({ show, message }) {
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (!show) return;
    setLine(Math.floor(Math.random() * MESSAGES.length));
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="curtain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease }}
          className="fixed inset-0 z-[90] grid place-items-center bg-cream/75 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -6, opacity: 0 }}
            transition={springSoft}
            className="flex flex-col items-center gap-5"
          >
            <PawLoader size={58} />
            <motion.p
              key={message ?? line}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.05 }}
              className="font-display text-lg text-ink-soft italic"
            >
              {message ?? MESSAGES[line]}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
