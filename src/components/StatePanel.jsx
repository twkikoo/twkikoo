import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PRODUCTS } from "../lib/data";
import { spring, springSnap, springSoft } from "../lib/motion";
import { useRouter } from "../lib/router";
import { useStore } from "../lib/store";
import { cn } from "../lib/utils";
import { PawSpinner } from "./PawLoader";
import { Icon } from "./icons";

/**
 * The mockup's control room.
 *
 * There is no backend, so every state the site can be in has to be reachable by
 * hand: each page, the drawers, the modals, a full cart, the loader. ⌘K opens it.
 */

const VIEWS = [
  ["Home", "/"],
  ["Loja", "/loja"],
  ["Página de produto", "/loja/conjunto-gota-jade"],
  ["Diário / galeria", "/diario"],
  ["Checkout", "/checkout"],
  ["Seguir encomenda", "/encomenda/CK-4821"],
  ["Apoio e FAQ", "/apoio"],
];

export function StatePanel({ onForceLoading }) {
  const [open, setOpen] = useState(false);
  const { route, navigate } = useRouter();
  const { setCartOpen, setAuthMode, addToCart, clearCart, totals, user } = useStore();

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((state) => !state);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const actions = [
    ["Abrir cesto", () => setCartOpen(true)],
    ["Encher o cesto", () => [PRODUCTS[0], PRODUCTS[4], PRODUCTS[7]].forEach((product) => addToCart(product))],
    ["Esvaziar cesto", () => clearCart()],
    [user ? "Ver conta" : "Modal de login", () => setAuthMode(user ? "account" : "login")],
    ["Modal de registo", () => setAuthMode("signup")],
    ["Mostrar loading", () => onForceLoading(1600)],
  ];

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: open ? 0 : 1, y: open ? 12 : 0 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        transition={springSnap}
        className="fixed bottom-5 left-5 z-[86] hidden items-center gap-2 rounded-full bg-ink/92 px-4 py-2.5 text-[12px] text-cream shadow-float backdrop-blur-sm md:inline-flex"
      >
        <PawSpinner size={15} tone="honey" />
        Estados
        <kbd className="ml-1 rounded bg-cream/15 px-1.5 py-0.5 text-[10px] tracking-wide">⌘K</kbd>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[86] bg-ink/20 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.16 } }}
              transition={springSoft}
              style={{ originY: 1, originX: 0 }}
              className="fixed bottom-5 left-5 z-[87] w-[min(340px,calc(100vw-2.5rem))] overflow-hidden rounded-[1.75rem] bg-cream shadow-float"
            >
              <header className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
                <div>
                  <p className="text-[13px] font-medium">Navegar o protótipo</p>
                  <p className="text-[11px] text-ink-mute">sem backend · {totals.items} no cesto</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-ink-mute transition-colors hover:text-ink"
                  aria-label="Fechar"
                >
                  <Icon.Close size={18} />
                </button>
              </header>

              <div className="max-h-[60vh] overflow-y-auto p-3">
                <p className="eyebrow px-2 pt-1 pb-2">Vistas</p>
                <div className="flex flex-col">
                  {VIEWS.map(([label, to]) => {
                    const active = route.path === to;
                    return (
                      <motion.button
                        key={to}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        transition={springSnap}
                        onClick={() => {
                          setOpen(false);
                          navigate(to);
                        }}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors",
                          active ? "bg-ink text-cream" : "text-ink-soft hover:bg-ink/5 hover:text-ink",
                        )}
                      >
                        {label}
                        <Icon.Arrow size={14} className={active ? "opacity-70" : "opacity-30"} />
                      </motion.button>
                    );
                  })}
                </div>

                <p className="eyebrow px-2 pt-5 pb-2">Estados</p>
                <div className="flex flex-wrap gap-1.5 px-1 pb-1">
                  {actions.map(([label, action]) => (
                    <motion.button
                      key={label}
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      transition={spring}
                      onClick={() => {
                        setOpen(false);
                        action();
                      }}
                      className="rounded-full border border-ink/15 px-3 py-1.5 text-[12px] text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
