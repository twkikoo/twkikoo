import { motion } from "framer-motion";
import { useState } from "react";
import { spring, springSnap } from "../lib/motion";
import { Link } from "../lib/router";
import { useStore } from "../lib/store";
import { cn, eur } from "../lib/utils";
import { ResinPiece, mountFor } from "./ResinPiece";
import { Icon } from "./icons";
import { Badge } from "./ui";

export function ProductCard({ product, index = 0 }) {
  const { addToCart } = useStore();
  const [hover, setHover] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ ...spring, delay: Math.min(index * 0.04, 0.24) }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="group relative"
    >
      <Link to={`/loja/${product.slug}`} className="block">
        <motion.div
          animate={{ y: hover ? -6 : 0 }}
          transition={spring}
          className={cn(
            "relative aspect-[4/5] overflow-hidden rounded-[1.5rem] ring-1 ring-ink/10 transition-shadow",
            hover ? "shadow-lift" : "shadow-none",
          )}
          style={{
            background: `radial-gradient(120% 90% at 32% 16%, #FFFDF8 0%, ${product.art.from}12 52%, ${product.art.to}26 100%)`,
          }}
        >
          <span className="label absolute top-4 left-4 z-10 text-ink-mute">{product.ref}</span>
          {product.badge && (
            <div className="absolute top-3.5 right-4 z-10">
              <Badge tone="ink">{product.badge}</Badge>
            </div>
          )}

          <motion.div
            animate={{ scale: hover ? 1.06 : 1, rotate: hover ? -3 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="absolute inset-0 p-7"
          >
            <ResinPiece
              art={product.art}
              seed={product.slug}
              mount={mountFor(product)}
              title={product.name}
              className="size-full"
            />
          </motion.div>

          {/* quick add — slides up out of the card edge */}
          <motion.button
            type="button"
            initial={false}
            animate={{ y: hover ? 0 : 56, opacity: hover ? 1 : 0 }}
            transition={spring}
            whileTap={{ scale: 0.94 }}
            onClick={(event) => {
              // the whole card is a link — keep the click from reaching it
              event.preventDefault();
              event.stopPropagation();
              addToCart(product);
            }}
            className="absolute inset-x-4 bottom-4 flex h-11 items-center justify-center gap-2 rounded-full bg-ink/92 text-[13px] font-medium text-cream backdrop-blur-sm"
          >
            <Icon.Plus size={15} />
            Juntar ao cesto
          </motion.button>
        </motion.div>

        <div className="px-1 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[15px] leading-snug font-medium tracking-[-0.01em]">{product.name}</h3>
            <span className="shrink-0 font-mono text-[13px] tabular-nums">{eur(product.price)}</span>
          </div>
          <p className="mt-1 line-clamp-1 text-[13px] text-ink-mute">{product.tagline}</p>
        </div>
      </Link>
    </motion.article>
  );
}

/** Skeleton used while the shop pretends to fetch. */
export function ProductCardSkeleton({ className }) {
  return (
    <div className={cn("animate-none", className)}>
      <div className="skeleton aspect-[4/5] rounded-[1.75rem]" />
      <div className="flex items-start justify-between gap-4 px-1 pt-4">
        <div className="flex-1">
          <div className="skeleton h-3.5 w-2/3 rounded-full" />
          <div className="skeleton mt-2 h-3 w-1/2 rounded-full" />
        </div>
        <div className="skeleton h-3.5 w-12 rounded-full" />
      </div>
    </div>
  );
}
