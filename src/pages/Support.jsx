import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PawSpinner } from "../components/PawLoader";
import { CatMark, Icon } from "../components/icons";
import { Accordion, Badge, Button, Field, Reveal, SectionHead } from "../components/ui";
import { BRAND, FAQ } from "../lib/data";
import { spring, springSnap, springSoft } from "../lib/motion";
import { Link } from "../lib/router";
import { useStore } from "../lib/store";
import { cn, sleep } from "../lib/utils";

const CARDS = [
  { icon: Icon.Truck, title: "Onde está a minha encomenda?", note: "Siga-a passo a passo com o código KIKO-••••", to: "/encomenda/KIKO-4821", cta: "Seguir encomenda" },
  { icon: Icon.Spark, title: "Quero uma peça só minha", note: "Cor, flor, tamanho — respondemos em 24 h com um esboço", to: "#chat", cta: "Pedir um orçamento" },
  { icon: Icon.Heart, title: "Trocas e devoluções", note: "14 dias, sem perguntas difíceis", to: "#faq", cta: "Como funciona" },
];

const REPLIES = [
  "Boa pergunta. Cada peça leva 48 h só a curar, e mais um ou dois dias a lixar e polir. Assim que sair do molde mandamos-lhe uma fotografia.",
  "Conseguimos fazer nessa cor, sim. Diga-nos se prefere translúcida ou opaca e mandamos uma amostra antes de avançar.",
  "Para Lisboa e Alverca do Ribatejo entregamos em mão, sem custos — é só combinarmos ponto e hora.",
  "Fica anotado. O Kiko está neste momento em cima do bloco de notas, mas escrevemos assim que ele sair.",
];

function Chat() {
  const [messages, setMessages] = useState([
    { from: "them", text: "Olá! Somos a Rita e o Tomás — e o Kiko, que está aqui a ver. Em que podemos ajudar?" },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const replyIndex = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, typing]);

  async function send(text) {
    const value = text ?? draft.trim();
    if (!value) return;
    setDraft("");
    setMessages((state) => [...state, { from: "me", text: value }]);
    setTyping(true);
    await sleep(1500);
    setTyping(false);
    setMessages((state) => [...state, { from: "them", text: REPLIES[replyIndex.current++ % REPLIES.length] }]);
  }

  return (
    <div id="chat" className="flex h-[520px] flex-col overflow-hidden rounded-[2rem] bg-paper shadow-lift">
      <header className="flex items-center gap-3 border-b border-ink/8 px-5 py-4">
        <span className="relative grid size-10 place-items-center rounded-full bg-ink text-cream">
          <CatMark size={22} />
          <span className="absolute right-0 bottom-0 size-3 rounded-full bg-jade ring-2 ring-paper" />
        </span>
        <div className="flex-1">
          <p className="text-[14px] font-medium">Atelier {BRAND.name}</p>
          <p className="text-[11px] text-jade">normalmente responde em 20 minutos</p>
        </div>
        <Badge tone="sand">ao vivo</Badge>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={springSoft}
              className={cn("flex", message.from === "me" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed",
                  message.from === "me"
                    ? "rounded-br-md bg-ink text-cream"
                    : "rounded-bl-md bg-sand/80 text-ink",
                )}
              >
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={springSoft}
              className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-sand/80 px-4 py-3 w-fit"
            >
              <PawSpinner size={16} />
              <span className="text-[12px] text-ink-mute">a escrever…</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="border-t border-ink/8 px-4 pt-3 pb-4">
        <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
          {["Quanto tempo demora?", "Fazem cor por medida?", "Entregam em Alverca?"].map((quick) => (
            <motion.button
              key={quick}
              type="button"
              whileTap={{ scale: 0.95 }}
              transition={springSnap}
              onClick={() => send(quick)}
              className="shrink-0 rounded-full border border-ink/15 px-3 py-1.5 text-[12px] text-ink-soft transition-colors hover:border-ink/35 hover:text-ink"
            >
              {quick}
            </motion.button>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Escreva uma mensagem…"
            className="h-11 flex-1 rounded-full border border-ink/12 bg-cream px-4 text-[14px] transition-colors placeholder:text-ink-mute/60 focus:border-ink/40 focus:outline-none"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.9 }}
            transition={springSnap}
            disabled={!draft.trim()}
            aria-label="Enviar"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-cream disabled:opacity-35"
          >
            <Icon.Arrow size={17} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}

function ContactForm() {
  const { toast } = useStore();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    await sleep(1300);
    setBusy(false);
    setSent(true);
    toast("Mensagem enviada. Respondemos em 24 h.");
  }

  return (
    <div className="rounded-[2rem] border border-ink/10 p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springSoft}
            className="grid h-full min-h-80 place-items-center text-center"
          >
            <div>
              <motion.span
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 14 }}
                className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-jade text-white"
              >
                <Icon.Check size={26} />
              </motion.span>
              <h3 className="font-display text-2xl">Recebido.</h3>
              <p className="mx-auto mt-2 max-w-64 text-[14px] text-ink-soft">
                Respondemos em 24 h, salvo se o Kiko se deitar em cima do teclado.
              </p>
              <Button variant="ghost" className="mt-5" onClick={() => setSent(false)}>
                Escrever outra
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={submit}
            className="flex flex-col gap-4"
          >
            <div>
              <h3 className="font-display text-2xl">Prefere escrever?</h3>
              <p className="mt-1.5 text-[14px] text-ink-soft">
                Para encomendas personalizadas, envie também uma imagem de referência se tiver.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome" placeholder="Maria" required />
              <Field label="Email" type="email" placeholder="ola@exemplo.pt" required />
            </div>
            <Field label="Assunto" placeholder="Uma peça com flores do meu jardim" />
            <Field label="Mensagem" as="textarea" placeholder="Conte-nos a ideia…" required />
            <Button type="submit" size="lg" loading={busy} className="mt-1 w-full sm:w-fit">
              Enviar mensagem
              <Icon.Mail size={16} />
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Support() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 pt-32 sm:px-8 sm:pt-40">
      <Reveal>
        <p className="eyebrow mb-4">Apoio</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="max-w-2xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.96] tracking-[-0.03em] text-balance">
            Somos duas pessoas. Respondemos a todas.
          </h1>
          <p className="max-w-xs text-[15px] leading-relaxed text-ink-soft">
            Sem call center, sem robôs. {BRAND.email} ou a caixa de mensagens aqui em baixo.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {CARDS.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.07}>
            <motion.div whileHover={{ y: -4 }} transition={spring} className="flex h-full flex-col rounded-[1.75rem] bg-paper p-6 shadow-soft">
              <span className="mb-5 grid size-11 place-items-center rounded-full bg-sand text-ink">
                <card.icon size={19} />
              </span>
              <h3 className="text-[15px] font-medium">{card.title}</h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-soft">{card.note}</p>
              {card.to.startsWith("#") ? (
                <a href={card.to} className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium">
                  {card.cta}
                  <Icon.Arrow size={14} />
                </a>
              ) : (
                <Link to={card.to} className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium">
                  {card.cta}
                  <Icon.Arrow size={14} />
                </Link>
              )}
            </motion.div>
          </Reveal>
        ))}
      </div>

      <section id="faq" className="mt-28 scroll-mt-28">
        <Reveal>
          <SectionHead eyebrow="Perguntas frequentes" title="O que nos perguntam mais" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10">
            <Accordion items={FAQ} />
          </div>
        </Reveal>
      </section>

      <section className="mt-28 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <Chat />
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </section>
    </div>
  );
}
