import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { PawLoader } from "../components/PawLoader";
import { ProductCard } from "../components/ProductCard";
import { ResinPiece } from "../components/ResinPiece";
import { CatMark, Icon } from "../components/icons";
import { Badge, Button, Marquee, Reveal, RevealGroup, RevealItem, SectionHead } from "../components/ui";
import atelier01 from "../assets/atelier-01.webp";
import atelier02 from "../assets/atelier-02.webp";
import { BRAND, JOURNAL, PRODUCTS } from "../lib/data";
import { ease, spring, springSoft } from "../lib/motion";
import { Link } from "../lib/router";

const FLOATERS = [
  { slug: "estrela-ambar", size: 104, x: "-13%", y: "8%", depth: 26, rotate: -12 },
  { slug: "donut-confetti", size: 88, x: "88%", y: "-4%", depth: -34, rotate: 10 },
  { slug: "brincos-gota-jade", size: 96, x: "92%", y: "58%", depth: 44, rotate: 8 },
  { slug: "lua-cobalto", size: 82, x: "-11%", y: "63%", depth: -22, rotate: -6 },
];

/** A piece suspended beside the hero photo: pointer parallax plus a slow idle drift. */
function Floater({ floater, index, sx, sy }) {
  const product = PRODUCTS.find((item) => item.slug === floater.slug);
  const x = useTransform(sx, (value) => value * floater.depth);
  const y = useTransform(sy, (value) => value * floater.depth);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ ...springSoft, delay: 0.45 + index * 0.1 }}
      style={{ left: floater.x, top: floater.y, width: floater.size, x, y, rotate: floater.rotate }}
      className="absolute hidden drop-shadow-[0_18px_28px_rgba(107,74,44,0.22)] sm:block"
    >
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}>
        <ResinPiece art={product.art} seed={product.slug} title={product.name} className="w-full" />
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // pointer parallax — tiny, just enough to make the pieces feel suspended
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 20 });
  const sy = useSpring(py, { stiffness: 90, damping: 20 });

  return (
    <section
      ref={ref}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width - 0.5);
        py.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      className="relative overflow-hidden px-5 pt-32 pb-16 sm:px-8 sm:pt-40"
    >
      {/* warm light pooling behind the composition */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-18%] left-1/2 h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#F7E6C4_0%,#FBF6EE00_78%)] opacity-80" />
        <div className="absolute top-[22%] right-[6%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,#E8917F33_0%,transparent_75%)]" />
      </div>

      <div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <motion.div style={{ y: textY, opacity: fade }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }}>
            <Badge tone="sand" upper={false} className="mb-6 py-1.5">
              <span className="text-[13px]">{BRAND.tagline}</span>
            </Badge>
          </motion.div>

          <h1 className="font-display text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.94] tracking-[-0.03em] text-balance">
            {["Flores que não", "murcham, cores", "que não se repetem."].map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease, delay: 0.12 + index * 0.08 }}
                  className="block"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.45 }}
            className="mt-7 max-w-md text-[16px] leading-relaxed text-ink-soft"
          >
            Brincos e colares em resina, feitos peça a peça na mesa da cozinha. Cada um leva 48 horas a curar — e nenhum
            sai igual ao anterior.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.55 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button as={Link} to="/loja" size="lg">
              Ver a colecção
              <Icon.Arrow size={17} />
            </Button>
            <Button as={Link} to="/diario" variant="outline" size="lg">
              Conhecer o Kiko
              <CatMark size={17} />
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.7 }}
            className="mt-12 flex gap-10 border-t border-ink/10 pt-6"
          >
            {[
              ["48 h", "de cura, sem atalhos"],
              ["100 %", "feito à mão, em casa"],
              ["0", "peças exactamente iguais"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-3xl tracking-[-0.02em]">{value}</dt>
                <dd className="mt-1 max-w-24 text-xs leading-snug text-ink-mute">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div style={{ y: photoY }} className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ ...springSoft, delay: 0.2 }}
            className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-sand shadow-lift"
          >
            <img
              src={atelier01}
              alt="Brincos de resina vermelhos e amarelos pendurados num expositor de madeira"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-ink/10 ring-inset" />
          </motion.div>

          {FLOATERS.map((floater, index) => (
            <Floater key={floater.slug} floater={floater} index={index} sx={sx} sy={sy} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="mx-auto mt-24 max-w-[1280px] px-5 sm:px-8">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lift sm:aspect-[5/4]">
            <img
              src={atelier02}
              alt="Conjunto de colar e brincos em resina verde com gipsófila seca"
              className="size-full object-cover"
            />
          </div>
        </Reveal>
        <div>
          <Reveal delay={0.08}>
            <p className="eyebrow mb-4">A casa</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] tracking-[-0.025em] text-balance">
              Somos dois, uma bancada pequena e um gato com opinião.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-6 flex flex-col gap-4 text-[15px] leading-relaxed text-ink-soft">
              <p>
                Começámos a misturar resina numa noite de Janeiro para fazer um par de brincos que não encontrávamos em
                lado nenhum. Três anos depois, continuamos a fazer tudo em casa: apanhamos as flores, prensamo-las entre
                páginas de um dicionário velho, misturamos os pigmentos à mão e esperamos.
              </p>
              <p>
                Não há máquinas, não há lotes de cem. Há tardes inteiras a lixar uma peça do grão 400 ao 3000, e há o
                Kiko a passar pela bancada a ver se está tudo em ordem.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Resina epóxi", "Flores prensadas por nós", "Prata 925 e aço cirúrgico", "Embalado em algodão"].map(
                (item) => (
                  <Badge key={item} tone="sand" upper={false}>
                    {item}
                  </Badge>
                ),
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Featured() {
  const featured = PRODUCTS.slice(0, 4);
  return (
    <section className="mx-auto mt-32 max-w-[1280px] px-5 sm:px-8">
      <Reveal>
        <SectionHead
          eyebrow="Acabadas de curar"
          title="As peças que saíram esta semana"
          note="Feitas em quantidades pequenas. Quando acabam, voltamos a fazer — mas nunca exactamente iguais."
          action={
            <Button as={Link} to="/loja" variant="outline">
              Ver as 12 peças
              <Icon.Arrow size={16} />
            </Button>
          }
        />
      </Reveal>
      <RevealGroup className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {featured.map((product, index) => (
          <RevealItem key={product.slug}>
            <ProductCard product={product} index={index} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

function CatSection() {
  return (
    <section className="mt-32 px-5 sm:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[2.5rem] bg-ink px-6 py-20 text-cream sm:px-16">
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
            {[...Array(7)].map((_, index) => (
              <CatMark
                key={index}
                size={90 + (index % 3) * 40}
                className="absolute"
                style={{
                  left: `${(index * 15 + 4) % 92}%`,
                  top: `${(index * 29) % 74}%`,
                  transform: `rotate(${index * 23 - 40}deg)`,
                }}
              />
            ))}
          </div>

          <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="eyebrow mb-5 text-cream/45">Direcção criativa</p>
              <h2 className="max-w-xl font-display text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.02] tracking-[-0.025em] text-balance">
                O Kiko não faz brincos. Mas é ele que decide quais ficam.
              </h2>
              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-cream/65">
                Dorme em cima dos moldes, derruba pigmento e senta-se exactamente em cima da peça que estamos a
                fotografar. Chamámos-lhe director criativo para não termos de discutir mais.
              </p>
              <p className="mt-8 font-display text-xl text-honey italic">{BRAND.tagline}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button as={Link} to="/diario" variant="paper">
                  Ver o diário
                  <Icon.Arrow size={16} />
                </Button>
                <Button as={Link} to="/loja/porta-chaves-kiko" variant="ghost" className="text-cream hover:bg-cream/10">
                  A pata em resina
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-cream/[0.06] px-10 py-9 ring-1 ring-cream/10">
              <PawLoader size={56} tone="honey" />
              <p className="text-center text-[13px] text-cream/50">
                a amassar pão
                <br />
                <span className="text-cream/30">(é assim que carregamos as páginas)</span>
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Process() {
  const steps = [
    ["Apanhar", "Gipsófila, trevo, erva-de-são-roberto. Prensadas duas semanas entre páginas."],
    ["Verter", "Pigmento misturado à mão, camada a camada, flor a flor. Sem pressa."],
    ["Lixar", "Do grão 400 ao 3000, à mão, até a superfície ficar como vidro."],
  ];
  return (
    <section className="mx-auto mt-32 max-w-[1280px] px-5 sm:px-8">
      <Reveal>
        <SectionHead eyebrow="Como se faz" title="Três gestos, quarenta e oito horas." />
      </Reveal>
      <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[2rem] bg-ink/10 sm:grid-cols-3">
        {steps.map(([title, text], index) => (
          <RevealItem key={title} className="bg-cream p-8 sm:p-10">
            <span className="font-display text-5xl text-ink/15 tabular-nums">0{index + 1}</span>
            <h3 className="mt-5 font-display text-2xl">{title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{text}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

function JournalStrip() {
  const shots = JOURNAL.filter((post) => post.kind === "photo");
  return (
    <section className="mt-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <SectionHead
            eyebrow="Diário"
            title="A bancada, esta semana"
            action={
              <Button as={Link} to="/diario" variant="ghost">
                Ver tudo
                <Icon.Arrow size={16} />
              </Button>
            }
          />
        </Reveal>
      </div>
      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8">
        {[...shots, ...shots].slice(0, 6).map((post, index) => (
          <motion.figure
            key={`${post.id}-${index}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ ...spring, delay: (index % 3) * 0.06 }}
            className="w-[76vw] shrink-0 snap-start sm:w-[340px]"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-soft">
              <motion.img
                src={post.src}
                alt={post.caption}
                whileHover={{ scale: 1.05 }}
                transition={springSoft}
                className="size-full object-cover"
              />
            </div>
            <figcaption className="mt-3 px-1 text-[13px] text-ink-mute">{post.caption}</figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <div className="mt-8 border-y border-ink/10 bg-paper/50">
        <Marquee
          items={["resina epóxi", "flores prensadas em casa", "prata 925", "48 h de cura", "entregas em mão", "feito em Lisboa"]}
        />
      </div>
      <Story />
      <Featured />
      <CatSection />
      <Process />
      <JournalStrip />
    </>
  );
}
