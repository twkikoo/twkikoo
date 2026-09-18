/**
 * Motion vocabulary.
 *
 * Rule of the house: nothing that moves in space uses a duration — springs only.
 * Durations are reserved for things that just fade (opacity, colour, blur),
 * where a spring would be imperceptible overhead.
 */

/** Expo-out. Elements arrive fast, then settle. */
export const ease = [0.16, 1, 0.3, 1];
export const easeIn = [0.7, 0, 0.84, 0];

/** Default: UI that follows the finger — buttons, cards, chips. */
export const spring = { type: "spring", stiffness: 420, damping: 34, mass: 0.9 };

/** Heavier surfaces: drawers, modals, sheets. Weighty but never sloppy. */
export const springSoft = { type: "spring", stiffness: 260, damping: 30, mass: 1 };

/** Instant feedback: presses, toggles, counters. */
export const springSnap = { type: "spring", stiffness: 700, damping: 40, mass: 0.6 };

/** Just barely bouncy — used where a piece should feel like it has weight. */
export const springBouncy = { type: "spring", stiffness: 340, damping: 18, mass: 0.9 };

/** Layout projection between shared elements. */
export const springLayout = { type: "spring", stiffness: 300, damping: 34 };

export const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease },
  },
};

export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease } },
};

/** Parent that releases its children one after another. */
export const stagger = (staggerChildren = 0.06, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Page-level choreography. Out is faster than in — exits should never linger. */
export const pageVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease } },
  exit: { opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: 0.25, ease: easeIn } },
};

/** Press feedback shared by every interactive surface. */
export const press = { whileTap: { scale: 0.97 }, transition: springSnap };
