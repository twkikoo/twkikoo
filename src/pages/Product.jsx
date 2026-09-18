import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { ResinPiece, mountFor } from "../components/ResinPiece";
import { Icon } from "../components/icons";
import { Accordion, Badge, Button, Reveal, SectionHead } from "../components/ui";
import { BRAND, PRODUCTS, findProduct } from "../lib/data";
import { ease, spring, springSnap, springSoft } from "../lib/motion";
import { Link, useRouter } from "../lib/router";
import { useStore } from "../lib/store";
import { cn, eur } from "../lib/utils";

/** Four looks at the same piece: on light, the studio shot, on sand, and close up. */
function useViews(product) {
  return useMemo(() => {
    const views = [
      { id: "studio", kind: "art", tint: `radial-gradient(120% 90% at 30% 16%, #FFFDF8 0%, ${product.art.from}12 55%, ${product.art.to}24 100%)`, scale: 1 },
      ...(product.photo ? [{ id: "foto", kind: "photo", src: product.photo }] : []),
      { id: "areia", kind: "art", tint: "linear-gradient(150deg, #F2E9DC 0%, #E8DCCA 100%)", scale: 0.9 },
      { id: "detalhe", kind: "art", tint: `linear-gradient(150deg, ${product.art.from}22, ${product.art.to}3a)`, scale: 1.45 },
    ];
    return views;
  }, [product]);
}

function Gallery({ product }) {
  const views = useViews(product);
  const [active, setActive] = useState(0);

  useEffect(() => setActive(0), [product.slug]);
  const view = views[active];

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] ring-1 ring-ink/10">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={view.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease }}
            className="absolute inset-0 grid place-items-center overflow-hidden"
            style={{ background: view.kind === "art" ? view.tint : undefined }}
          >
            {view.kind === "photo" ? (
              <img src={view.src} alt={product.name} className="size-full object-cover" />
            ) : (
              // definite box + preserveAspectRatio does the fitting; a percentage
              // height inside a centred grid would resolve against nothing
              <motion.div
                initial={{ y: 14 }}
                animate={{ y: 0 }}
                transition={springSoft}
                className="absolute inset-0 p-8"
                style={{ scale: view.scale }}
              >
                <ResinPiece
                  art={product.art}
                  seed={product.slug}
                  mount={mountFor(product)}
                  title={product.name}
                  className="size-full"
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {product.badge && (
          <div className="absolute top-5 left-5 z-10">
            <Badge tone="ink">{product.badge}</Badge>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        {views.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={springSnap}
            onClick={() => setActive(index)}
            aria-label={`Ver ${item.id}`}
            className={cn(
              "relative size-20 shrink-0 overflow-hidden rounded-2xl transition-shadow",
              active === index ? "shadow-lift" : "shadow-soft opacity-70 hover:opacity-100",
            )}
            style={{ background: item.kind === "art" ? item.tint : undefined }}
          >
            {item.kind === "photo" ? (
              <img src={item.src} alt="" className="size-full object-cover" />
            ) : (
              <span className="block size-full p-2" style={{ scale: Math.min(item.scale, 1) }}>
                <ResinPiece art={product.art} seed={product.slug} mount={mountFor(product)} className="size-full" />
              </span>
            )}
            {active === index && (
              <motion.span
                layoutId="thumb-ring"
                transition={springSoft}
                className="absolute inset-0 rounded-2xl ring-2 ring-ink ring-inset"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function Product() {
  const { route, navigate } = useRouter();
  const { addToCart, setCartOpen } = useStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = findProduct(route.params.slug);

  useEffect(() => {
    setQty(1);
    setAdded(false);
  }, [route.params.slug]);

  if (!product) {
    return (
      <div className="mx-auto grid max-w-lg place-items-center px-5 pt-48 pb-24 text-center">
        <h1 className="font-display text-4xl">Esta peça não existe.</h1>
        <p className="mt-3 text-ink-soft">Talvez tenha sido vendida, talvez o Kiko a tenha empurrado da mesa.</p>
        <Button className="mt-8" onClick={() => navigate("/loja")}>
          Voltar à loja
        </Button>
      </div>
    );
  }

  const related = PRODUCTS.filter(
    (item) => item.slug !== product.slug && (item.category === product.category || item.art.from === product.art.from),
  ).slice(0, 4);

  function handleAdd() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 pt-28 sm:px-8 sm:pt-36">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Link
          to="/loja"
          className="inline-flex items-center gap-2 text-[13px] text-ink-mute transition-colors hover:text-ink"
        >
          <Icon.ArrowLeft size={15} />
          Loja
        </Link>
      </motion.div>

      <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: 0.05 }}
        >
          <Gallery product={product} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: 0.14 }}
          className="pb-4"
        >
          <p className="eyebrow mb-3">
            {product.ref}
            <span className="mx-2 opacity-50">·</span>
            {product.category}
          </p>
          <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1] tracking-[-0.03em] text-balance">
            {product.name}
          </h1>
          <p className="mt-4 text-lg text-ink-soft">{product.tagline}</p>

          <div className="mt-7 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="font-display text-3xl tabular-nums">{eur(product.price)}</span>
            <span className="label text-ink-mute">
              {product.batch}
              <span className="mx-2 opacity-50">·</span>
              feito em {product.made}
              <span className="mx-2 opacity-50">·</span>
              {product.category === "conjuntos" ? "colar + brincos" : "par completo"}
            </span>
          </div>

          <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-ink-soft">{product.story}</p>

          {/* qty + add */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <div className="flex h-14 items-center gap-2 rounded-full border border-ink/15 px-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.88 }}
                transition={springSnap}
                onClick={() => setQty((value) => Math.max(1, value - 1))}
                className="grid size-10 place-items-center rounded-full text-ink-soft hover:bg-ink/6 hover:text-ink"
                aria-label="Menos um"
              >
                <Icon.Minus size={16} />
              </motion.button>
              <span className="w-7 text-center tabular-nums">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={qty}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={springSnap}
                    className="inline-block"
                  >
                    {qty}
                  </motion.span>
                </AnimatePresence>
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.88 }}
                transition={springSnap}
                onClick={() => setQty((value) => Math.min(9, value + 1))}
                className="grid size-10 place-items-center rounded-full text-ink-soft hover:bg-ink/6 hover:text-ink"
                aria-label="Mais um"
              >
                <Icon.Plus size={16} />
              </motion.button>
            </div>

            <Button size="lg" onClick={handleAdd} className="min-w-52 flex-1 sm:flex-none">
              <AnimatePresence mode="popLayout" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={springSnap}
                    className="inline-flex items-center gap-2"
                  >
                    <Icon.Check size={17} />
                    No cesto
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={springSnap}
                    className="inline-flex items-center gap-2"
                  >
                    Juntar ao cesto · {eur(product.price * qty)}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <Button variant="outline" size="lg" onClick={() => setCartOpen(true)} className="px-5">
              <Icon.Bag size={18} />
            </Button>
          </div>

          <p className="mt-4 flex items-center gap-2 text-[13px] text-ink-mute">
            <Icon.Truck size={15} />
            {BRAND.shipping}
          </p>

          <div className="mt-10">
            <Accordion
              items={[
                { q: "Materiais e medidas", a: product.details.join(" · ") },
                {
                  q: "Como cuidar",
                  a: "Evite sol directo por horas seguidas e água muito quente. Limpe com um pano macio e guarde na bolsinha de algodão que vai na encomenda.",
                },
                {
                  q: "Entregas e devoluções",
                  a: `${BRAND.shipping}. Para o resto do país, correio registado a 3,50 € — grátis acima de 40 €. Tem 14 dias para trocar ou devolver.`,
                },
              ]}
            />
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <Reveal>
            <SectionHead eyebrow="A condizer" title="Costumam sair juntas" />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((item, index) => (
              <ProductCard key={item.slug} product={item} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
