import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { PawLoader } from "../components/PawLoader";
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard";
import { Icon } from "../components/icons";
import { Reveal } from "../components/ui";
import { CATEGORIES, PRODUCTS } from "../lib/data";
import { ease, spring, springSnap, springSoft } from "../lib/motion";
import { cn, eur } from "../lib/utils";

const SORTS = [
  { id: "curadoria", label: "Curadoria da casa" },
  { id: "novidade", label: "Mais recentes" },
  { id: "barato", label: "Preço: do menor" },
  { id: "caro", label: "Preço: do maior" },
];

const TONES = [
  { id: "todos", label: "Todas as cores", swatch: null },
  { id: "quente", label: "Quentes", swatch: ["#D1462F", "#E7A11A"] },
  { id: "verde", label: "Verdes", swatch: ["#17877A", "#B9CB8A"] },
  { id: "frio", label: "Frios", swatch: ["#1580CE", "#3E1BA6"] },
  { id: "suave", label: "Suaves", swatch: ["#E8917F", "#EBD7AE"] },
];

const TONE_MATCH = {
  quente: ["#F2573E", "#FFE9A8", "#FFE08A", "#FFD979", "#F4A83C"],
  verde: ["#2AA394", "#EAF1D6"],
  frio: ["#3BB6F0"],
  suave: ["#FBD9D0", "#FFF6E3"],
};

function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onClick);
    return () => document.removeEventListener("pointerdown", onClick);
  }, []);

  const current = SORTS.find((sort) => sort.id === value);

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        transition={springSnap}
        onClick={() => setOpen((state) => !state)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-[13px] transition-colors hover:border-ink/35"
      >
        <Icon.Filter size={15} className="text-ink-mute" />
        {current.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring}>
          <Icon.Chevron size={14} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.14 } }}
            transition={springSoft}
            style={{ originY: 0, originX: 1 }}
            className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl bg-paper p-1.5 shadow-float"
          >
            {SORTS.map((sort) => (
              <li key={sort.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(sort.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors",
                    sort.id === value ? "bg-ink/6 text-ink" : "text-ink-soft hover:bg-ink/4",
                  )}
                >
                  {sort.label}
                  {sort.id === value && <Icon.Check size={15} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Shop() {
  const [category, setCategory] = useState("todos");
  const [tone, setTone] = useState("todos");
  const [sort, setSort] = useState("curadoria");
  const [loading, setLoading] = useState(false);
  const first = useRef(true);

  // Every filter change "fetches" — that is where the paw earns its keep.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 520);
    return () => clearTimeout(id);
  }, [category, tone, sort]);

  const results = useMemo(() => {
    let list = PRODUCTS.filter((product) => category === "todos" || product.category === category);
    if (tone !== "todos") {
      list = list.filter((product) => TONE_MATCH[tone]?.includes(product.art.from));
    }
    const sorters = {
      barato: (a, b) => a.price - b.price,
      caro: (a, b) => b.price - a.price,
      novidade: (a, b) => (b.badge === "Novo") - (a.badge === "Novo"),
      curadoria: () => 0,
    };
    return [...list].sort(sorters[sort]);
  }, [category, tone, sort]);

  const cheapest = results.length ? Math.min(...results.map((product) => product.price)) : 0;

  return (
    <div className="mx-auto max-w-[1280px] px-5 pt-32 sm:px-8 sm:pt-40">
      <Reveal>
        <p className="eyebrow mb-4">A colecção</p>
        <h1 className="max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.96] tracking-[-0.03em] text-balance">
          Doze peças. Nenhuma delas feita duas vezes da mesma maneira.
        </h1>
        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft">
          Escolha por tipo ou por cor. Tudo o que está aqui é feito depois de encomendado, salvo o que diga o contrário.
        </p>
      </Reveal>

      {/* filters */}
      <div className="sticky top-[68px] z-20 -mx-5 mt-12 bg-cream/80 px-5 py-4 backdrop-blur-lg sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
            {CATEGORIES.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                transition={springSnap}
                onClick={() => setCategory(item.id)}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2 text-[13px] whitespace-nowrap transition-colors",
                  category === item.id ? "text-cream" : "text-ink-soft hover:text-ink",
                )}
              >
                {category === item.id && (
                  <motion.span layoutId="shop-category" transition={springSoft} className="absolute inset-0 rounded-full bg-ink" />
                )}
                <span className="relative">{item.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1 sm:flex">
              {TONES.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  title={item.label}
                  aria-label={item.label}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springSnap}
                  onClick={() => setTone(item.id)}
                  className={cn(
                    "relative grid size-8 place-items-center rounded-full",
                    tone === item.id && "ring-2 ring-ink ring-offset-2 ring-offset-cream",
                  )}
                >
                  {item.swatch ? (
                    <span
                      className="size-5 rounded-full"
                      style={{ background: `linear-gradient(135deg, ${item.swatch[0]}, ${item.swatch[1]})` }}
                    />
                  ) : (
                    <span className="size-5 rounded-full border border-ink/25 bg-cream" />
                  )}
                </motion.button>
              ))}
            </div>
            <SortMenu value={sort} onChange={setSort} />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-ink-mute">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${results.length}-${loading}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2, ease }}
            >
              {loading
                ? "a procurar na gaveta…"
                : `${results.length} ${results.length === 1 ? "peça" : "peças"}${
                    results.length ? ` · desde ${eur(cheapest)}` : ""
                  }`}
            </motion.span>
          </AnimatePresence>
          {(category !== "todos" || tone !== "todos") && (
            <motion.button
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              type="button"
              onClick={() => {
                setCategory("todos");
                setTone("todos");
              }}
              className="underline underline-offset-4 transition-colors hover:text-ink"
            >
              limpar filtros
            </motion.button>
          )}
        </div>
      </div>

      {/* grid */}
      <div className="mt-10 min-h-[60vh] pb-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4"
            >
              {[...Array(4)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={springSoft}
              className="grid place-items-center rounded-[2rem] border border-dashed border-ink/15 py-24 text-center"
            >
              <PawLoader size={40} tone="ink" />
              <p className="mt-6 font-display text-2xl">Nada com esses filtros.</p>
              <p className="mt-2 max-w-sm text-sm text-ink-soft">
                Ou fizemos poucas peças dessa cor, ou o Kiko escondeu-as. Experimente limpar os filtros.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {results.map((product, index) => (
                  <ProductCard key={product.slug} product={product} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
