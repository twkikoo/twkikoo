import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { PawLoader } from "../components/PawLoader";
import { ResinPiece } from "../components/ResinPiece";
import { CatMark, Icon } from "../components/icons";
import { Badge, IconButton, Reveal } from "../components/ui";
import { BRAND, JOURNAL } from "../lib/data";
import { ease, spring, springSnap, springSoft } from "../lib/motion";
import { cn } from "../lib/utils";

const TAGS = ["tudo", ...new Set(JOURNAL.map((post) => post.tag))];

function Likes({ count }) {
  const [liked, setLiked] = useState(false);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      transition={springSnap}
      onClick={(event) => {
        event.stopPropagation();
        setLiked((state) => !state);
      }}
      className="flex items-center gap-1.5 text-[12px] text-ink-mute transition-colors hover:text-ember"
    >
      <motion.span animate={{ scale: liked ? [1, 1.45, 1] : 1, color: liked ? "#D1462F" : "currentColor" }} transition={spring}>
        <Icon.Heart size={14} fill={liked ? "currentColor" : "none"} />
      </motion.span>
      <span className="tabular-nums">{count + (liked ? 1 : 0)}</span>
    </motion.button>
  );
}

function Tile({ post, onOpen }) {
  const shell =
    "group mb-5 break-inside-avoid overflow-hidden rounded-[1.5rem] bg-paper shadow-soft transition-shadow hover:shadow-lift";

  if (post.kind === "photo") {
    return (
      <motion.figure layout className={cn(shell, "cursor-zoom-in")} onClick={() => onOpen(post)}>
        <div className="overflow-hidden">
          <motion.img
            src={post.src}
            alt={post.caption}
            whileHover={{ scale: 1.045 }}
            transition={springSoft}
            className="w-full object-cover"
          />
        </div>
        <figcaption className="flex items-start justify-between gap-3 p-4">
          <p className="text-[13px] leading-snug text-ink-soft">{post.caption}</p>
          <Likes count={post.likes} />
        </figcaption>
      </motion.figure>
    );
  }

  if (post.kind === "art") {
    return (
      <motion.figure layout className={shell}>
        <div
          className="relative aspect-square p-9"
          style={{ background: `radial-gradient(120% 90% at 30% 18%, #FFFDF8 0%, ${post.art.from}14 55%, ${post.art.to}26 100%)` }}
        >
          <motion.div whileHover={{ rotate: -6, scale: 1.05 }} transition={springSoft} className="size-full">
            <ResinPiece art={post.art} seed={post.id} className="size-full" />
          </motion.div>
        </div>
        <figcaption className="flex items-start justify-between gap-3 p-4">
          <p className="text-[13px] leading-snug text-ink-soft">{post.caption}</p>
          <Likes count={post.likes} />
        </figcaption>
      </motion.figure>
    );
  }

  if (post.kind === "quote") {
    return (
      <motion.blockquote layout className={cn(shell, "bg-ink p-8 text-cream")}>
        <span className="font-display text-5xl leading-none text-honey">“</span>
        <p className="mt-2 font-display text-2xl leading-snug text-balance">{post.text}</p>
        <footer className="mt-6 text-[11px] tracking-[0.18em] text-cream/40 uppercase">{BRAND.name}</footer>
      </motion.blockquote>
    );
  }

  if (post.kind === "swatch") {
    return (
      <motion.figure layout className={shell}>
        <div className="flex h-44">
          {post.colors.map((color) => (
            <motion.span
              key={color}
              whileHover={{ flexGrow: 2.4 }}
              transition={springSoft}
              className="flex-1"
              style={{ background: color }}
            />
          ))}
        </div>
        <figcaption className="p-4 text-[13px] leading-snug text-ink-soft">{post.caption}</figcaption>
      </motion.figure>
    );
  }

  if (post.kind === "note") {
    return (
      <motion.figure layout className={cn(shell, "bg-sand p-8")}>
        <p className="font-display text-6xl leading-none tracking-[-0.03em] text-ink/70">{post.title}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{post.text}</p>
      </motion.figure>
    );
  }

  // the cat tile — an animated portrait rather than a photo we do not have
  return (
    <motion.figure layout className={cn(shell, "overflow-hidden")}>
      <div className="relative grid aspect-4/5 place-items-center bg-[radial-gradient(120%_90%_at_35%_20%,#FFF6E3_0%,#E8DCCA_100%)]">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="text-ink"
        >
          <CatMark size={132} />
        </motion.div>
        <motion.div
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-6 bottom-6"
        >
          <PawLoader size={26} tone="ember" />
        </motion.div>
      </div>
      <figcaption className="flex items-start justify-between gap-3 p-4">
        <p className="text-[13px] leading-snug text-ink-soft">{post.caption}</p>
        <Likes count={post.likes} />
      </figcaption>
    </motion.figure>
  );
}

export function Journal() {
  const [tag, setTag] = useState("tudo");
  const [lightbox, setLightbox] = useState(null);

  const posts = useMemo(() => (tag === "tudo" ? JOURNAL : JOURNAL.filter((post) => post.tag === tag)), [tag]);

  return (
    <div className="mx-auto max-w-[1280px] px-5 pt-32 sm:px-8 sm:pt-40">
      <Reveal>
        <p className="eyebrow mb-4">Diário do atelier</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="max-w-2xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.96] tracking-[-0.03em] text-balance">
            A bancada, as flores e o supervisor.
          </h1>
          <p className="max-w-xs text-[15px] leading-relaxed text-ink-soft">
            Fotografias do processo, cores que estamos a tentar acertar e o Kiko a dormir onde não deve.
          </p>
        </div>
      </Reveal>

      <div className="no-scrollbar mt-10 flex gap-1.5 overflow-x-auto pb-1">
        {TAGS.map((item) => (
          <motion.button
            key={item}
            type="button"
            whileTap={{ scale: 0.96 }}
            transition={springSnap}
            onClick={() => setTag(item)}
            className={cn(
              "relative shrink-0 rounded-full px-4 py-2 text-[13px] whitespace-nowrap transition-colors",
              tag === item ? "text-cream" : "text-ink-soft hover:text-ink",
            )}
          >
            {tag === item && (
              <motion.span layoutId="journal-tag" transition={springSoft} className="absolute inset-0 rounded-full bg-ink" />
            )}
            <span className="relative">{item}</span>
          </motion.button>
        ))}
      </div>

      <motion.div layout className="mt-8 columns-1 gap-5 pb-8 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
              transition={springSoft}
            >
              <Tile post={post} onOpen={setLightbox} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {lightbox && (
          <div className="fixed inset-0 z-[88] grid place-items-center p-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              onClick={() => setLightbox(null)}
              className="absolute inset-0 bg-ink/70 backdrop-blur-md"
            />
            <motion.figure
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12, transition: { duration: 0.18 } }}
              transition={springSoft}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.35}
              onDragEnd={(_, info) => Math.abs(info.offset.y) > 120 && setLightbox(null)}
              className="relative max-h-[86vh] w-full max-w-[560px] overflow-hidden rounded-[2rem] bg-cream shadow-float"
            >
              <div className="absolute top-3 right-3 z-10">
                <IconButton label="Fechar" onClick={() => setLightbox(null)} className="bg-cream/80 backdrop-blur">
                  <Icon.Close size={19} />
                </IconButton>
              </div>
              <img src={lightbox.src} alt={lightbox.caption} className="max-h-[70vh] w-full object-cover" />
              <figcaption className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-[14px] text-ink-soft">{lightbox.caption}</p>
                  <Badge tone="sand" upper={false} className="mt-2">
                    #{lightbox.tag}
                  </Badge>
                </div>
                <Likes count={lightbox.likes} />
              </figcaption>
            </motion.figure>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
