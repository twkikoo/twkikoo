import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { PawLoader } from "../components/PawLoader";
import { ResinPiece } from "../components/ResinPiece";
import { Icon } from "../components/icons";
import { IconButton, Reveal } from "../components/ui";
import { BRAND, JOURNAL } from "../lib/data";
import { ease, spring, springSnap, springSoft } from "../lib/motion";
import { cn } from "../lib/utils";

const KIND_LABEL = {
  photo: "fotografia",
  specimen: "espécime",
  recipe: "receita de cor",
  note: "nota",
  supervisor: "registo do supervisor",
};

const stamp = (iso) => {
  const date = new Date(iso);
  const month = date.toLocaleDateString("pt-PT", { month: "short" }).replace(".", "");
  return `${String(date.getDate()).padStart(2, "0")} ${month.toUpperCase()} ${date.getFullYear()}`;
};

const monthKey = (iso) => iso.slice(0, 7);
const monthName = (iso) =>
  new Date(iso).toLocaleDateString("pt-PT", { month: "long", year: "numeric" });

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
      className={cn(
        "label inline-flex shrink-0 items-center gap-1.5 tabular-nums transition-colors",
        liked ? "text-ember" : "text-ink-mute hover:text-ember",
      )}
    >
      <motion.span animate={{ scale: liked ? [1, 1.4, 1] : 1 }} transition={spring}>
        <Icon.Heart size={13} fill={liked ? "currentColor" : "none"} />
      </motion.span>
      {count + (liked ? 1 : 0)}
    </motion.button>
  );
}

/** Every entry opens the same way: number, date, kind. The log's spine. */
function Dateline({ entry, children }) {
  return (
    <header className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-ink/12 pt-4">
      <span className="label whitespace-nowrap text-ink">
        N.º {String(entry.no).padStart(3, "0")}
        <span className="mx-2 text-ink-mute">·</span>
        <span className="text-ink-soft">{stamp(entry.date)}</span>
      </span>
      <span className="label ml-auto whitespace-nowrap text-ink-mute">{children ?? KIND_LABEL[entry.kind]}</span>
    </header>
  );
}

function Photo({ entry, onOpen }) {
  return (
    <figure>
      <Dateline entry={entry} />
      <button type="button" onClick={() => onOpen(entry)} className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl">
        <motion.img
          src={entry.src}
          alt={entry.caption}
          whileHover={{ scale: 1.03 }}
          transition={springSoft}
          className="aspect-4/5 w-full object-cover"
        />
      </button>
      <figcaption className="mt-4 flex items-start justify-between gap-6">
        <div className="max-w-prose">
          <p className="label text-ink-mute">{entry.place}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{entry.caption}</p>
        </div>
        <Likes count={entry.likes} />
      </figcaption>
    </figure>
  );
}

/** A herbarium plate: the piece on a ruled sheet, with its label underneath. */
function Specimen({ entry }) {
  return (
    <figure>
      <Dateline entry={entry} />
      <div className="rounded-2xl border border-ink/12 bg-paper p-5">
        <div
          className="relative aspect-square overflow-hidden rounded-xl"
          style={{ background: `radial-gradient(120% 90% at 32% 18%, #FFFDF8 0%, ${entry.art.from}12 55%, ${entry.art.to}20 100%)` }}
        >
          <motion.div
            whileHover={{ rotate: -5, scale: 1.04 }}
            transition={springSoft}
            className="absolute inset-[12%]"
          >
            <ResinPiece art={entry.art} seed={entry.id} className="size-full" />
          </motion.div>
        </div>
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-ink/12 pt-4">
          <div>
            <p className="font-display text-xl leading-tight">{entry.name}</p>
            <p className="label mt-1.5 text-ink-mute">{entry.technique}</p>
          </div>
          <Likes count={entry.likes} />
        </div>
      </div>
      <figcaption className="mt-4 max-w-prose text-[15px] leading-relaxed text-ink-soft">{entry.caption}</figcaption>
    </figure>
  );
}

/** A colour recipe, written down the way it was actually mixed. */
function Recipe({ entry }) {
  return (
    <figure>
      <Dateline entry={entry} />
      <p className="font-display text-2xl leading-tight">{entry.title}</p>
      <ul className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-3">
        {entry.colors.map((color) => (
          <motion.li
            key={color.hex}
            whileHover={{ y: -3 }}
            transition={spring}
            className="rounded-xl border border-ink/12 bg-paper p-3"
          >
            <span className="block h-14 rounded-lg" style={{ background: color.hex }} />
            <span className="label mt-3 block text-ink">{color.hex.toUpperCase()}</span>
            <span className="label mt-0.5 block text-ink-mute">{color.name}</span>
          </motion.li>
        ))}
      </ul>
      <figcaption className="mt-4 max-w-prose text-[15px] leading-relaxed text-ink-soft">{entry.caption}</figcaption>
    </figure>
  );
}

/** A note. No card — just the sentence, given room. */
function Note({ entry, wide }) {
  return (
    <figure>
      <Dateline entry={entry} />
      <blockquote className={cn("py-4", wide && "lg:py-10")}>
        <p
          className={cn(
            "max-w-3xl font-display leading-[1.12] tracking-[-0.02em] text-balance italic",
            wide ? "text-[clamp(1.75rem,4vw,3rem)]" : "text-[clamp(1.5rem,2.6vw,2rem)]",
          )}
        >
          {entry.text}
        </p>
        <footer className="label mt-5 text-ink-mute">{entry.note}</footer>
      </blockquote>
    </figure>
  );
}

/** The cat's shift, written up as a logbook page. */
function Supervisor({ entry }) {
  return (
    <figure>
      <Dateline entry={entry} />
      <div className="rounded-2xl border border-ink/12 bg-sand/50 p-5">
        <div className="flex justify-center py-3">
          <PawLoader size={42} />
        </div>
        <ul className="mt-4 flex flex-col gap-2 border-t border-ink/12 pt-4">
          {entry.log.map((line) => (
            <li key={line} className="label text-ink-soft">
              {line}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-4 flex items-start justify-between gap-4">
        <p className="text-[15px] leading-relaxed text-ink-soft">{entry.caption}</p>
        <Likes count={entry.likes} />
      </figcaption>
    </figure>
  );
}

const ENTRY = { photo: Photo, specimen: Specimen, recipe: Recipe, note: Note, supervisor: Supervisor };

export function Journal() {
  const [lightbox, setLightbox] = useState(null);
  const [activeMonth, setActiveMonth] = useState(monthKey(JOURNAL[0].date));
  const bands = useRef({});

  const months = useMemo(() => {
    const seen = new Map();
    for (const entry of JOURNAL) {
      const key = monthKey(entry.date);
      if (!seen.has(key)) seen.set(key, { key, label: monthName(entry.date), count: 0, first: entry.id });
      seen.get(key).count += 1;
    }
    return [...seen.values()];
  }, []);

  // Highlight the month the reader is actually in. Measured from scroll position
  // rather than an observer band, which a jump-scroll can skip over entirely.
  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.3;
      let current = null;
      for (const [key, node] of Object.entries(bands.current)) {
        if (node && node.getBoundingClientRect().top <= line) current = key;
      }
      setActiveMonth(current ?? monthKey(JOURNAL[0].date));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  let cursor = null;

  return (
    <div className="mx-auto max-w-[1280px] px-5 pt-32 sm:px-8 sm:pt-40">
      <Reveal>
        <p className="eyebrow mb-4">Diário do atelier</p>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h1 className="max-w-2xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.96] tracking-[-0.03em] text-balance">
            Caderno de bancada.
          </h1>
          <p className="max-w-xs text-[15px] leading-relaxed text-ink-soft">
            Tudo o que passa pela mesa fica anotado: o que corre bem, o que fica com bolhas, e as horas a que o{" "}
            {BRAND.cat} decide sentar-se em cima.
          </p>
        </div>
      </Reveal>

      <div className="mt-16 gap-12 lg:grid lg:grid-cols-[9rem_1fr] lg:gap-16">
        {/* month index */}
        <nav className="hidden lg:block">
          <div className="sticky top-28">
            <p className="label mb-4 text-ink-mute">Índice</p>
            <ul className="flex flex-col gap-1">
              {months.map((month) => (
                <li key={month.key}>
                  <a
                    href={`#${month.key}`}
                    onClick={(event) => {
                      event.preventDefault();
                      bands.current[month.key]?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={cn(
                      "group flex items-baseline justify-between gap-2 py-1.5 text-[13px] transition-colors",
                      activeMonth === month.key ? "text-ink" : "text-ink-mute hover:text-ink-soft",
                    )}
                  >
                    <span className="relative capitalize">
                      {month.label.replace(/ de \d+/, "")}
                      <motion.span
                        animate={{ scaleX: activeMonth === month.key ? 1 : 0 }}
                        transition={springSoft}
                        style={{ originX: 0 }}
                        className="absolute -bottom-0.5 left-0 h-px w-full bg-ink"
                      />
                    </span>
                    <span className="label text-ink-mute tabular-nums">{month.count}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="label mt-8 text-ink-mute/70">
              {JOURNAL.length} entradas
              <br />
              desde {BRAND.since}
            </p>
          </div>
        </nav>

        {/* the mosaic */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 pb-8 lg:grid-cols-12">
          {JOURNAL.map((entry) => {
            const key = monthKey(entry.date);
            const opensMonth = key !== cursor;
            cursor = key;
            const Component = ENTRY[entry.kind];

            return (
              <div key={entry.id} className="contents">
                {opensMonth && (
                  <div
                    id={key}
                    data-month={key}
                    ref={(node) => {
                      bands.current[key] = node;
                    }}
                    className="col-span-full scroll-mt-28 pt-4 first:pt-0"
                  >
                    <div className="flex items-baseline gap-5">
                      <h2 className="font-display text-3xl capitalize">{monthName(entry.date).replace(/ de \d+/, "")}</h2>
                      <span className="label text-ink-mute">{new Date(entry.date).getFullYear()}</span>
                      <span className="h-px flex-1 bg-ink/12" />
                    </div>
                  </div>
                )}
                <Reveal
                  className={cn("entry", (entry.kind === "note" || entry.kind === "recipe") && "lg:self-center")}
                  style={{ "--span": entry.span }}
                >
                  <Component entry={entry} onOpen={setLightbox} wide={entry.span === 12} />
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>

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
              className="relative max-h-[86vh] w-full max-w-[560px] overflow-hidden rounded-3xl bg-cream shadow-float"
            >
              <div className="absolute top-3 right-3 z-10">
                <IconButton label="Fechar" onClick={() => setLightbox(null)} className="bg-cream/80 backdrop-blur">
                  <Icon.Close size={19} />
                </IconButton>
              </div>
              <img src={lightbox.src} alt={lightbox.caption} className="max-h-[68vh] w-full object-cover" />
              <figcaption className="p-6">
                <div className="label flex items-center justify-between gap-4 text-ink-mute">
                  <span>
                    N.º {String(lightbox.no).padStart(3, "0")} · {stamp(lightbox.date)}
                  </span>
                  <Likes count={lightbox.likes} />
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{lightbox.caption}</p>
                <p className="label mt-3 text-ink-mute">{lightbox.place}</p>
              </figcaption>
            </motion.figure>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
