import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { PawLoader, PawSpinner } from "../components/PawLoader";
import { ResinScene } from "../components/ResinPiece";
import { Icon } from "../components/icons";
import { Badge, Button } from "../components/ui";
import { BRAND, PRODUCTS, TRACKING_STEPS } from "../lib/data";
import { ease, spring, springSnap, springSoft } from "../lib/motion";
import { Link, useRouter } from "../lib/router";
import { useStore } from "../lib/store";
import { cn, eur } from "../lib/utils";

/** Anyone landing on a tracking link without having ordered gets a plausible one. */
const DEMO = {
  code: "CK-4821",
  placedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
  lines: [
    { slug: "conjunto-gota-jade", qty: 1, product: PRODUCTS.find((p) => p.slug === "conjunto-gota-jade") },
    { slug: "estrela-ambar", qty: 2, product: PRODUCTS.find((p) => p.slug === "estrela-ambar") },
  ],
  details: { delivery: "lisboa", name: "Maria" },
  step: 2,
};

export function Tracking() {
  const { route } = useRouter();
  const { order, setOrder } = useStore();

  const base = order?.code === route.params.code ? order : DEMO;
  const [step, setStep] = useState(base.step ?? 1);

  const lines = base.lines ?? [];
  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.product.price * line.qty, 0),
    [lines],
  );

  const progress = (step - 1) / (TRACKING_STEPS.length - 1);
  const eta = new Date(base.placedAt.getTime() + 1000 * 60 * 60 * 24 * 5);

  function advance() {
    const next = Math.min(step + 1, TRACKING_STEPS.length);
    setStep(next);
    if (order?.code === base.code) setOrder({ ...order, step: next });
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 pt-32 pb-8 sm:px-8 sm:pt-40">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={springSoft}>
        <div className="flex flex-wrap items-center gap-3">
          <p className="eyebrow">Encomenda</p>
          <Badge tone={step === TRACKING_STEPS.length ? "jade" : "honey"}>
            {step === TRACKING_STEPS.length ? "entregue" : "em curso"}
          </Badge>
        </div>
        <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1] tracking-[-0.03em] tabular-nums">
          {base.code}
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
          Feita em{" "}
          {base.placedAt.toLocaleDateString("pt-PT", { day: "numeric", month: "long" })}. Previsão de entrega:{" "}
          <strong className="font-medium text-ink">
            {eta.toLocaleDateString("pt-PT", { day: "numeric", month: "long" })}
          </strong>
          .
        </p>
      </motion.div>

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* timeline */}
        <div className="relative">
          <div className="absolute top-3 bottom-8 left-[19px] w-px bg-ink/12" />
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: progress }}
            transition={{ ...springSoft, delay: 0.2 }}
            style={{ originY: 0 }}
            className="absolute top-3 bottom-8 left-[19px] w-px bg-ink"
          />

          <ol className="flex flex-col gap-9">
            {TRACKING_STEPS.map((item, index) => {
              const state = index + 1 < step ? "done" : index + 1 === step ? "active" : "todo";
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: 0.1 + index * 0.08 }}
                  className="relative flex gap-5"
                >
                  <motion.span
                    animate={{
                      backgroundColor: state === "todo" ? "#FBF6EE" : "#221E1A",
                      borderColor: state === "todo" ? "rgba(34,30,26,0.18)" : "#221E1A",
                      scale: state === "active" ? 1.1 : 1,
                    }}
                    transition={spring}
                    className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {state === "done" ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={springSnap}
                          className="text-cream"
                        >
                          <Icon.Check size={16} />
                        </motion.span>
                      ) : state === "active" ? (
                        <motion.span key="paw" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springSnap}>
                          <PawSpinner size={17} tone="honey" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="dot"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="size-1.5 rounded-full bg-ink/25"
                        />
                      )}
                    </AnimatePresence>

                    {state === "active" && (
                      <motion.span
                        animate={{ scale: [1, 1.7], opacity: [0.35, 0] }}
                        transition={{ duration: 1.9, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full bg-ink"
                      />
                    )}
                  </motion.span>

                  <div className={cn("pt-1.5 transition-opacity", state === "todo" && "opacity-45")}>
                    <p className="text-[15px] font-medium">{item.label}</p>
                    <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-ink-soft">{item.note}</p>
                    {state === "active" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...spring, delay: 0.15 }}
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-honey/15 px-3 py-1.5 text-[12px] text-[#8a5f04]"
                      >
                        <span className="relative flex size-1.5">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-honey opacity-70" />
                          <span className="relative inline-flex size-1.5 rounded-full bg-honey" />
                        </span>
                        a acontecer agora
                      </motion.div>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-7">
            {step < TRACKING_STEPS.length ? (
              <Button variant="outline" onClick={advance}>
                Simular passo seguinte
                <Icon.Arrow size={16} />
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setStep(1)}>
                Recomeçar simulação
              </Button>
            )}
            <Button as={Link} to="/apoio" variant="ghost" className="text-ink-soft">
              <Icon.Chat size={16} />
              Falar connosco
            </Button>
          </div>
        </div>

        {/* order card */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: 0.1 }}
          className="h-fit rounded-[2rem] bg-paper p-6 shadow-soft lg:sticky lg:top-24"
        >
          <AnimatePresence mode="wait">
            {step === TRACKING_STEPS.length ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={springSoft}
                className="mb-6 flex flex-col items-center rounded-2xl bg-jade/10 py-7 text-center"
              >
                <PawLoader size={34} tone="honey" />
                <p className="mt-3 font-display text-xl text-jade">Entregue. Obrigado.</p>
                <p className="mt-1 max-w-56 text-[12px] text-ink-soft">
                  Mande-nos uma fotografia — adoramos ver as peças na rua.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="working"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease }}
                className="mb-6 flex items-center gap-4 rounded-2xl bg-sand/70 p-4"
              >
                <PawLoader size={26} />
                <div>
                  <p className="text-[13px] font-medium">{TRACKING_STEPS[step - 1].label}</p>
                  <p className="text-[11px] text-ink-mute">actualizado há poucos minutos</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <h2 className="font-display text-xl">O que vem a caminho</h2>
          <ul className="mt-5 flex flex-col gap-4">
            {lines.map((line) => (
              <li key={line.slug} className="flex items-center gap-3">
                <div className="relative">
                  <ResinScene product={line.product} className="size-14 rounded-xl" />
                  <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-ink text-[10px] text-cream tabular-nums">
                    {line.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <Link to={`/loja/${line.slug}`} className="truncate text-[13px] font-medium hover:underline">
                    {line.product.name}
                  </Link>
                  <p className="text-[11px] text-ink-mute">{eur(line.product.price)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between border-t border-ink/10 pt-5 text-[14px] font-medium">
            <span>Total pago</span>
            <span className="tabular-nums">{eur(subtotal)}</span>
          </div>

          <div className="mt-6 rounded-2xl bg-sand/60 p-4">
            <p className="flex items-start gap-2 text-[12px] leading-relaxed text-ink-soft">
              <Icon.Truck size={15} className="mt-0.5 shrink-0" />
              {base.details?.delivery === "ctt" ? "Correio registado com seguimento." : BRAND.shipping}
            </p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
