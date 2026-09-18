import { motion } from "framer-motion";
import { useState } from "react";
import { BRAND } from "../lib/data";
import { spring } from "../lib/motion";
import { Link } from "../lib/router";
import { useStore } from "../lib/store";
import { CatMark, Icon } from "./icons";
import { Button, Field, Reveal } from "./ui";

const COLUMNS = [
  {
    title: "Loja",
    links: [
      ["Tudo", "/loja"],
      ["Brincos", "/loja"],
      ["Colares", "/loja"],
      ["Acessórios", "/loja"],
    ],
  },
  {
    title: "Casa",
    links: [
      ["Diário do atelier", "/diario"],
      ["Perguntas frequentes", "/apoio"],
      ["Seguir encomenda", "/encomenda/CK-4821"],
      ["Falar connosco", "/apoio"],
    ],
  },
];

export function Footer() {
  const { toast } = useStore();
  const [email, setEmail] = useState("");

  return (
    <footer className="relative mt-32 overflow-hidden border-t border-ink/10 bg-sand/60 pt-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <Reveal>
            <Link to="/" className="flex items-center gap-2.5">
              <CatMark size={28} />
              <span className="font-display text-2xl lowercase">{BRAND.name}</span>
            </Link>
            <p className="mt-5 max-w-xs font-display text-lg leading-snug text-ink-soft italic">{BRAND.tagline}</p>
            <p className="mt-6 flex items-start gap-2 text-sm text-ink-soft">
              <Icon.Truck size={17} className="mt-0.5 shrink-0 text-ink-mute" />
              {BRAND.shipping}
            </p>
          </Reveal>

          {COLUMNS.map((column, columnIndex) => (
            <Reveal key={column.title} delay={0.08 + columnIndex * 0.06}>
              <h3 className="eyebrow mb-5">{column.title}</h3>
              <ul className="flex flex-col gap-3">
                {column.links.map(([label, to]) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="group inline-flex items-center gap-1.5 text-[15px] text-ink-soft transition-colors hover:text-ink"
                    >
                      {label}
                      <motion.span className="opacity-0 transition-opacity group-hover:opacity-100">
                        <Icon.Arrow size={13} />
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <h3 className="eyebrow mb-5">Cartas do atelier</h3>
            <p className="mb-4 text-[15px] leading-relaxed text-ink-soft">
              Uma vez por mês: peças novas, flores da época e fotografias do Kiko a atrapalhar.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setEmail("");
                toast("Subscrito. Escrevemos pouco, prometemos.");
              }}
              className="flex flex-col gap-2.5"
            >
              <Field
                label=""
                type="email"
                required
                placeholder="o-seu@email.pt"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Button type="submit" variant="outline" className="w-full">
                Subscrever
                <Icon.Mail size={16} />
              </Button>
            </form>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 py-7 text-xs text-ink-mute">
          <p>
            © {new Date().getFullYear()} {BRAND.name} — feito à mão, em casa.
          </p>
          <div className="flex gap-5">
            <a href="#" className="transition-colors hover:text-ink">
              {BRAND.instagram}
            </a>
            <a href={`mailto:${BRAND.email}`} className="transition-colors hover:text-ink">
              {BRAND.email}
            </a>
            <span>Mockup sem backend</span>
          </div>
        </div>
      </div>

      {/* oversized wordmark, cropped by the viewport */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ...spring, stiffness: 120, damping: 24 }}
        className="pointer-events-none -mb-[0.22em] select-none px-5 text-center font-display text-[22vw] leading-none tracking-[-0.04em] text-ink/[0.07] lowercase"
      >
        {BRAND.name}
      </motion.p>
    </footer>
  );
}
