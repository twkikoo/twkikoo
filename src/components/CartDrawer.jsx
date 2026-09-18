import { AnimatePresence, motion } from "framer-motion";
import { BRAND } from "../lib/data";
import { ease, spring, springSnap, springSoft } from "../lib/motion";
import { useRouter } from "../lib/router";
import { useStore } from "../lib/store";
import { cn, eur } from "../lib/utils";
import { ResinScene } from "./ResinPiece";
import { Icon } from "./icons";
import { Button, IconButton } from "./ui";

function QtyStepper({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-ink/12 p-0.5">
      <motion.button
        type="button"
        whileTap={{ scale: 0.86 }}
        transition={springSnap}
        onClick={() => onChange(value - 1)}
        className="grid size-7 place-items-center rounded-full text-ink-soft hover:bg-ink/6 hover:text-ink"
        aria-label="Menos um"
      >
        <Icon.Minus size={14} />
      </motion.button>
      <span className="w-5 text-center text-[13px] tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={springSnap}
            className="inline-block"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.button
        type="button"
        whileTap={{ scale: 0.86 }}
        transition={springSnap}
        onClick={() => onChange(Math.min(value + 1, 9))}
        className="grid size-7 place-items-center rounded-full text-ink-soft hover:bg-ink/6 hover:text-ink"
        aria-label="Mais um"
      >
        <Icon.Plus size={14} />
      </motion.button>
    </div>
  );
}

export function CartDrawer() {
  const { cart, totals, cartOpen, setCartOpen, setQty, removeFromCart } = useStore();
  const { navigate } = useRouter();

  const progress = Math.min(totals.subtotal / totals.freeFrom, 1);
  const missing = Math.max(totals.freeFrom - totals.subtotal, 0);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[80] bg-ink/30 backdrop-blur-[3px]"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={springSoft}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 120 || info.velocity.x > 600) setCartOpen(false);
            }}
            className="fixed inset-y-0 right-0 z-[81] flex w-full max-w-[440px] flex-col bg-cream shadow-float sm:rounded-l-[2rem]"
            aria-label="Cesto de compras"
          >
            <header className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
              <div>
                <h2 className="font-display text-2xl">O seu cesto</h2>
                <p className="mt-0.5 text-xs text-ink-mute">
                  {totals.items === 0 ? "ainda vazio" : `${totals.items} ${totals.items === 1 ? "peça" : "peças"}`}
                </p>
              </div>
              <IconButton label="Fechar cesto" onClick={() => setCartOpen(false)}>
                <Icon.Close size={20} />
              </IconButton>
            </header>

            {cart.length > 0 && (
              <div className="border-b border-ink/8 px-6 py-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-ink-soft">
                    {missing > 0 ? (
                      <>
                        Faltam <strong className="font-semibold text-ink">{eur(missing)}</strong> para envio grátis por
                        correio
                      </>
                    ) : (
                      <span className="font-medium text-jade">Envio por correio grátis 🎉</span>
                    )}
                  </span>
                  <Icon.Truck size={16} className="text-ink-mute" />
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-linen">
                  <motion.div
                    animate={{ scaleX: progress }}
                    initial={{ scaleX: 0 }}
                    transition={springSoft}
                    style={{ originX: 0 }}
                    className="h-full rounded-full bg-jade"
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring}
                  className="grid h-full place-items-center text-center"
                >
                  <div>
                    <p className="font-display text-xl text-ink-soft">Nada por aqui.</p>
                    <p className="mx-auto mt-2 max-w-64 text-sm text-ink-mute">
                      O Kiko já verificou duas vezes. Está mesmo vazio.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => {
                        setCartOpen(false);
                        navigate("/loja");
                      }}
                    >
                      Ver a colecção
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <ul className="flex flex-col gap-3">
                  <AnimatePresence initial={false} mode="popLayout">
                    {cart.map((line) => (
                      <motion.li
                        key={line.slug}
                        layout
                        initial={{ opacity: 0, x: 24, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 40, scale: 0.92, transition: { duration: 0.2 } }}
                        transition={springSoft}
                        className="flex gap-4 rounded-3xl bg-paper p-3 shadow-soft"
                      >
                        <ResinScene product={line.product} className="size-20 shrink-0 rounded-2xl" />
                        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{line.product.name}</p>
                              <p className="mt-0.5 text-xs text-ink-mute">{eur(line.product.price)} cada</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(line.slug)}
                              className="shrink-0 text-ink-mute transition-colors hover:text-ember"
                              aria-label={`Remover ${line.product.name}`}
                            >
                              <Icon.Close size={15} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <QtyStepper value={line.qty} onChange={(qty) => setQty(line.slug, qty)} />
                            <span className="text-sm font-medium tabular-nums">{eur(line.product.price * line.qty)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <motion.footer
              layout
              transition={springSoft}
              className={cn("border-t border-ink/8 px-6 pt-5 pb-6", cart.length === 0 && "hidden")}
            >
              <dl className="mb-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-ink-soft">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">{eur(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <dt>Entrega</dt>
                  <dd>grátis em mão</dd>
                </div>
                <div className="flex justify-between border-t border-ink/8 pt-2 text-base font-medium">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{eur(totals.subtotal)}</dd>
                </div>
              </dl>
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  setCartOpen(false);
                  navigate("/checkout");
                }}
              >
                Finalizar encomenda
                <Icon.Arrow size={17} />
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-mute">
                <Icon.Truck size={13} />
                {BRAND.shipping}
              </p>
            </motion.footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
