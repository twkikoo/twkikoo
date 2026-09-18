import { AnimatePresence, motion } from "framer-motion";
import { springSoft } from "../lib/motion";
import { useStore } from "../lib/store";
import { eur } from "../lib/utils";
import { ResinScene } from "./ResinPiece";
import { Icon } from "./icons";

/**
 * Bottom-centre stack. New toasts push in from below with a spring; each one is
 * swipe-to-dismiss, because a toast that can't be dismissed is an ad.
 */
export function Toaster() {
  const { toasts, dismissToast, setCartOpen } = useStore();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[95] flex flex-col items-center gap-2 p-5">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.94, transition: { duration: 0.18 } }}
            transition={springSoft}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => info.offset.y > 40 && dismissToast(toast.id)}
            className="pointer-events-auto flex w-full max-w-[380px] items-center gap-3 rounded-2xl bg-ink p-2.5 pr-4 text-cream shadow-float"
          >
            {toast.product ? (
              <ResinScene product={toast.product} className="size-11 shrink-0 rounded-xl" />
            ) : (
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cream/12">
                <Icon.Check size={18} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">{toast.message}</p>
              {toast.product && <p className="text-[11px] text-cream/55">{eur(toast.product.price)}</p>}
            </div>
            {toast.kind === "cart" && (
              <button
                type="button"
                onClick={() => {
                  dismissToast(toast.id);
                  setCartOpen(true);
                }}
                className="shrink-0 text-[12px] font-medium text-honey underline underline-offset-4"
              >
                ver cesto
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
