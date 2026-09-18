import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { BRAND } from "../lib/data";
import { ease, spring, springSnap, springSoft } from "../lib/motion";
import { Link, useRouter } from "../lib/router";
import { useStore } from "../lib/store";
import { cn } from "../lib/utils";
import { CatMark, Icon } from "./icons";
import { IconButton } from "./ui";

const NAV = [
  { to: "/", label: "Início", match: "home" },
  { to: "/loja", label: "Loja", match: ["shop", "product"] },
  { to: "/diario", label: "Diário", match: "journal" },
  { to: "/apoio", label: "Apoio", match: "support" },
];

export function Navbar() {
  const { route } = useRouter();
  const { totals, setCartOpen, setAuthMode, user } = useStore();
  const [stuck, setStuck] = useState(false);
  const [menu, setMenu] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setStuck(value > 24));

  const isActive = (item) =>
    Array.isArray(item.match) ? item.match.includes(route.name) : item.match === route.name;

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ ...springSoft, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <motion.div
          animate={{
            backgroundColor: stuck ? "rgba(251,246,238,0.82)" : "rgba(251,246,238,0)",
            borderColor: stuck ? "rgba(34,30,26,0.08)" : "rgba(34,30,26,0)",
            backdropFilter: stuck ? "blur(16px)" : "blur(0px)",
          }}
          transition={{ duration: 0.35, ease }}
          className="border-b"
        >
          <nav className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8">
            <Link to="/" className="group flex items-center gap-2.5" aria-label={`${BRAND.name} — início`}>
              <motion.span
                whileHover={{ rotate: -10, scale: 1.08 }}
                transition={spring}
                className="text-ink"
              >
                <CatMark size={26} />
              </motion.span>
              <span className="font-display text-[19px] tracking-[-0.02em] lowercase">{BRAND.name}</span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    isActive(item) ? "text-ink" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {isActive(item) && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={springSoft}
                      className="absolute inset-0 -z-10 rounded-full bg-ink/[0.07]"
                    />
                  )}
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-0.5">
              <IconButton label="Conta" onClick={() => setAuthMode(user ? "account" : "login")} className="hidden sm:grid">
                {user ? (
                  <span className="grid size-7 place-items-center rounded-full bg-ink text-[11px] font-medium text-cream">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                ) : (
                  <Icon.User size={19} />
                )}
              </IconButton>

              <motion.button
                type="button"
                onClick={() => setCartOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                transition={springSnap}
                aria-label={`Cesto, ${totals.items} artigos`}
                className="relative grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
              >
                <Icon.Bag size={19} />
                <AnimatePresence>
                  {totals.items > 0 && (
                    <motion.span
                      key="count"
                      initial={{ scale: 0, y: 4 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 640, damping: 22 }}
                      className="absolute -top-0.5 -right-0.5 grid size-[18px] place-items-center rounded-full bg-ember text-[10px] font-semibold text-white tabular-nums"
                    >
                      {totals.items}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <IconButton label="Menu" onClick={() => setMenu(true)} className="md:hidden">
                <Icon.Menu size={20} />
              </IconButton>
            </div>
          </nav>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenu(false)}
              className="fixed inset-0 z-[70] bg-ink/25 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={springSoft}
              className="fixed inset-x-0 top-0 z-[71] rounded-b-[2rem] bg-cream p-6 pt-5 shadow-float md:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg lowercase">{BRAND.name}</span>
                <IconButton label="Fechar" onClick={() => setMenu(false)}>
                  <Icon.Close size={20} />
                </IconButton>
              </div>
              <div className="flex flex-col">
                {NAV.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.06 + index * 0.05 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setMenu(false)}
                      className="block border-b border-ink/8 py-4 font-display text-3xl"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  setAuthMode(user ? "account" : "login");
                }}
                className="mt-6 text-sm text-ink-soft underline underline-offset-4"
              >
                {user ? `Sessão de ${user.name}` : "Entrar / Criar conta"}
              </button>
              <p className="mt-6 text-xs text-ink-mute">{BRAND.shipping}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
