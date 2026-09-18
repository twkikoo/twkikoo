import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ResinScene } from "../components/ResinPiece";
import { Icon } from "../components/icons";
import { Badge, Button, Field } from "../components/ui";
import { BRAND } from "../lib/data";
import { ease, spring, springSnap, springSoft } from "../lib/motion";
import { Link, useRouter } from "../lib/router";
import { useStore } from "../lib/store";
import { cn, eur, sleep } from "../lib/utils";

const STEPS = ["Contacto", "Entrega", "Pagamento"];

const DELIVERY = [
  { id: "lisboa", label: "Entrega em mão · Lisboa", note: "Combinamos ponto e hora por mensagem", price: 0 },
  { id: "alverca", label: "Entrega em mão · Alverca do Ribatejo", note: "Ao fim do dia, durante a semana", price: 0 },
  { id: "ctt", label: "Correio registado", note: "2 a 3 dias úteis, com seguimento", price: 350 },
];

const PAYMENTS = [
  { id: "mbway", label: "MB WAY", note: "Confirma no telemóvel" },
  { id: "multibanco", label: "Multibanco", note: "Referência válida 3 dias" },
  { id: "cartao", label: "Cartão", note: "Visa, Mastercard" },
];

function Radio({ active, title, note, price, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
      transition={springSnap}
      className={cn(
        "relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors",
        active ? "border-ink/45 bg-paper" : "border-ink/12 hover:border-ink/25",
      )}
    >
      <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border", active ? "border-ink" : "border-ink/30")}>
        <AnimatePresence>
          {active && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={springSnap}
              className="size-2.5 rounded-full bg-ink"
            />
          )}
        </AnimatePresence>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium">{title}</span>
        <span className="mt-0.5 block text-[12px] text-ink-mute">{note}</span>
      </span>
      {price !== undefined && (
        <span className="shrink-0 text-[13px] tabular-nums">{price === 0 ? "grátis" : eur(price)}</span>
      )}
    </motion.button>
  );
}

export function Checkout() {
  const { cart, totals, placeOrder, toast } = useStore();
  const { navigate } = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [delivery, setDelivery] = useState("lisboa");
  const [payment, setPayment] = useState("mbway");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", note: "" });

  const shipping = DELIVERY.find((option) => option.id === delivery).price;
  const total = totals.subtotal + shipping;

  const set = (key) => (event) => setForm((state) => ({ ...state, [key]: event.target.value }));

  function go(next) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  async function submit() {
    setBusy(true);
    await sleep(1400); // paw kneads; nothing is actually sent anywhere
    const placed = placeOrder({ ...form, delivery, payment, shipping });
    setBusy(false);
    toast("Encomenda registada. Vamos misturar resina.");
    navigate(`/encomenda/${placed.code}`);
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto grid max-w-lg place-items-center px-5 pt-48 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={springSoft}>
          <h1 className="font-display text-4xl">O cesto está vazio.</h1>
          <p className="mt-3 text-ink-soft">Difícil pagar o que não existe. Escolha uma peça primeiro.</p>
          <Button as={Link} to="/loja" className="mt-8">
            Ver a colecção
            <Icon.Arrow size={16} />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 pt-32 pb-8 sm:px-8 sm:pt-40">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={springSoft}>
        <p className="eyebrow mb-3">Finalizar</p>
        <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1] tracking-[-0.03em]">
          Quase. Faltam três campos.
        </h1>
      </motion.div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div>
          {/* stepper */}
          <div className="flex items-center gap-2">
            {STEPS.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => index < step && go(index)}
                className={cn(
                  "relative flex-1 rounded-full px-3 py-2.5 text-center text-[12px] font-medium transition-colors",
                  index === step ? "text-cream" : index < step ? "text-ink" : "text-ink-mute",
                  index < step && "cursor-pointer",
                )}
              >
                {index === step && (
                  <motion.span layoutId="checkout-step" transition={springSoft} className="absolute inset-0 rounded-full bg-ink" />
                )}
                <span className="relative inline-flex items-center gap-1.5">
                  {index < step && <Icon.Check size={13} />}
                  {label}
                </span>
              </button>
            ))}
          </div>

          <div className="relative mt-8 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -28, transition: { duration: 0.16, ease } }}
                transition={springSoft}
                className="flex flex-col gap-4"
              >
                {step === 0 && (
                  <>
                    <Field label="Nome" placeholder="Maria Antunes" value={form.name} onChange={set("name")} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Email" type="email" placeholder="ola@exemplo.pt" value={form.email} onChange={set("email")} />
                      <Field label="Telemóvel" placeholder="9•• ••• •••" value={form.phone} onChange={set("phone")} />
                    </div>
                    <p className="text-[12px] text-ink-mute">
                      Usamos o telemóvel só para combinar a entrega em mão. Nada de mensagens promocionais.
                    </p>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="flex flex-col gap-2.5">
                      {DELIVERY.map((option) => (
                        <Radio
                          key={option.id}
                          active={delivery === option.id}
                          title={option.label}
                          note={option.note}
                          price={option.price}
                          onClick={() => setDelivery(option.id)}
                        />
                      ))}
                    </div>
                    <AnimatePresence initial={false}>
                      {delivery === "ctt" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={springSoft}
                          className="overflow-hidden"
                        >
                          <Field
                            label="Morada"
                            as="textarea"
                            placeholder="Rua, número, andar&#10;Código postal e localidade"
                            value={form.address}
                            onChange={set("address")}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Field
                      label="Nota para o atelier (opcional)"
                      as="textarea"
                      placeholder="É um presente? Quer uma cor diferente? Diga."
                      value={form.note}
                      onChange={set("note")}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="flex flex-col gap-2.5">
                      {PAYMENTS.map((option) => (
                        <Radio
                          key={option.id}
                          active={payment === option.id}
                          title={option.label}
                          note={option.note}
                          onClick={() => setPayment(option.id)}
                        />
                      ))}
                    </div>
                    <AnimatePresence initial={false} mode="wait">
                      {payment === "cartao" && (
                        <motion.div
                          key="card"
                          initial={{ opacity: 0, y: -8, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={springSoft}
                          className="grid gap-4 overflow-hidden sm:grid-cols-[2fr_1fr_1fr]"
                        >
                          <Field label="Número" placeholder="4242 4242 4242 4242" className="sm:col-span-1" />
                          <Field label="Validade" placeholder="12/28" />
                          <Field label="CVC" placeholder="123" />
                        </motion.div>
                      )}
                      {payment === "mbway" && (
                        <motion.p
                          key="mbway"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={spring}
                          className="rounded-2xl bg-sand/70 p-4 text-[13px] text-ink-soft"
                        >
                          Enviamos o pedido para <strong className="font-medium">{form.phone || "o seu telemóvel"}</strong>.
                          Tem cinco minutos para confirmar na aplicação.
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <label className="mt-2 flex items-start gap-3 text-[13px] text-ink-soft">
                      <input type="checkbox" defaultChecked className="mt-0.5 size-4 accent-[#221E1A]" />
                      Aceito que cada peça é feita à mão e pode variar ligeiramente das fotografias.
                    </label>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => (step === 0 ? navigate("/loja") : go(step - 1))}
              className="text-ink-soft"
            >
              <Icon.ArrowLeft size={16} />
              {step === 0 ? "Continuar a ver" : "Voltar"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button size="lg" onClick={() => go(step + 1)}>
                Continuar
                <Icon.Arrow size={17} />
              </Button>
            ) : (
              <Button size="lg" loading={busy} onClick={submit}>
                Pagar {eur(total)}
                <Icon.Lock size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* summary */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: 0.08 }}
          className="h-fit rounded-[2rem] bg-paper p-6 shadow-soft lg:sticky lg:top-24"
        >
          <h2 className="font-display text-xl">A sua encomenda</h2>
          <ul className="mt-5 flex flex-col gap-4">
            {cart.map((line) => (
              <li key={line.slug} className="flex items-center gap-3">
                <div className="relative">
                  <ResinScene product={line.product} className="size-14 rounded-xl" />
                  <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-ink text-[10px] text-cream tabular-nums">
                    {line.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{line.product.name}</p>
                  <p className="text-[11px] text-ink-mute">feito em {line.product.made}</p>
                </div>
                <span className="text-[13px] tabular-nums">{eur(line.product.price * line.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 flex flex-col gap-2 border-t border-ink/10 pt-5 text-[13px]">
            <div className="flex justify-between text-ink-soft">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{eur(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ink-soft">
              <dt>Entrega</dt>
              <dd className="tabular-nums">{shipping === 0 ? "grátis" : eur(shipping)}</dd>
            </div>
            <div className="mt-1 flex justify-between border-t border-ink/10 pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd className="tabular-nums">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={total}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={springSnap}
                    className="inline-block"
                  >
                    {eur(total)}
                  </motion.span>
                </AnimatePresence>
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-2 border-t border-ink/10 pt-5">
            <Badge tone="jade" upper={false} className="w-fit">
              <Icon.Truck size={13} />
              {BRAND.shipping}
            </Badge>
            <p className="text-[11px] leading-relaxed text-ink-mute">
              Mockup sem backend: nenhum pagamento é processado e nenhum dado sai do seu navegador.
            </p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
