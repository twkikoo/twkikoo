import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BRAND } from "../lib/data";
import { ease, spring, springSoft } from "../lib/motion";
import { useStore } from "../lib/store";
import { sleep } from "../lib/utils";
import { PawLoader } from "./PawLoader";
import { CatMark, Icon } from "./icons";
import { Button, Field, IconButton } from "./ui";

const TABS = [
  { id: "login", label: "Entrar" },
  { id: "signup", label: "Criar conta" },
];

export function AuthModal() {
  const { authMode, setAuthMode, user, setUser, toast } = useStore();
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const open = Boolean(authMode);
  const mode = authMode === "account" ? "account" : authMode;

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => event.key === "Escape" && setAuthMode(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setAuthMode]);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    await sleep(1100); // the paw kneads while we pretend to talk to a server
    setBusy(false);
    setUser({ name: name || email.split("@")[0] || "amiga", email: email || "ola@exemplo.pt" });
    setAuthMode(null);
    toast(mode === "signup" ? "Conta criada. Bem-vinda à casa do Kiko." : "Sessão iniciada.");
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85] grid place-items-center px-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            onClick={() => setAuthMode(null)}
            className="absolute inset-0 bg-ink/35 backdrop-blur-md"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.94, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12, transition: { duration: 0.18 } }}
            transition={springSoft}
            className="relative w-full max-w-[420px] overflow-hidden rounded-[2rem] bg-cream shadow-float"
          >
            <div className="absolute top-4 right-4 z-10">
              <IconButton label="Fechar" onClick={() => setAuthMode(null)}>
                <Icon.Close size={19} />
              </IconButton>
            </div>

            {mode === "account" ? (
              <div className="p-8 text-center">
                <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-ink text-cream">
                  <CatMark size={26} />
                </span>
                <h2 className="font-display text-3xl">Olá, {user?.name}.</h2>
                <p className="mt-2 text-sm text-ink-soft">{user?.email}</p>
                <div className="mt-6 grid gap-2 text-left">
                  {[
                    ["Encomendas", "Acompanhe o que está a curar no atelier."],
                    ["Moradas", "Lisboa · Alverca do Ribatejo"],
                    ["Favoritos", "3 peças guardadas"],
                  ].map(([label, note], index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: 0.05 + index * 0.05 }}
                      className="flex items-center justify-between rounded-2xl bg-paper px-4 py-3 shadow-soft"
                    >
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-ink-mute">{note}</p>
                      </div>
                      <Icon.Arrow size={16} className="text-ink-mute" />
                    </motion.div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-6 w-full"
                  onClick={() => {
                    setUser(null);
                    setAuthMode(null);
                    toast("Sessão terminada. Até já.");
                  }}
                >
                  Terminar sessão
                </Button>
              </div>
            ) : (
              <>
                <div className="px-8 pt-9 pb-6 text-center">
                  <span className="mx-auto mb-4 flex w-fit">
                    <PawLoader size={30} tone="honey" />
                  </span>
                  <h2 className="font-display text-3xl leading-tight text-balance">
                    {mode === "signup" ? "Criar conta no atelier" : "Que bom ver-te outra vez"}
                  </h2>
                  <p className="mx-auto mt-2 max-w-72 text-sm text-ink-soft">
                    {mode === "signup"
                      ? "Guardamos as suas moradas e o histórico das peças. Nada mais."
                      : "Entre para acompanhar encomendas e guardar favoritos."}
                  </p>
                </div>

                <div className="mx-8 mb-6 flex rounded-full bg-ink/[0.06] p-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setAuthMode(tab.id)}
                      className="relative flex-1 rounded-full py-2 text-[13px] font-medium"
                    >
                      {authMode === tab.id && (
                        <motion.span
                          layoutId="auth-tab"
                          transition={springSoft}
                          className="absolute inset-0 rounded-full bg-paper shadow-soft"
                        />
                      )}
                      <span className={authMode === tab.id ? "relative text-ink" : "relative text-ink-mute"}>
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </div>

                <form onSubmit={submit} className="flex flex-col gap-3 px-8 pb-8">
                  <AnimatePresence initial={false} mode="popLayout">
                    {mode === "signup" && (
                      <motion.div
                        key="name"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={springSoft}
                      >
                        <Field
                          label="Como lhe chamamos?"
                          placeholder="Maria"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Field
                    label="Email"
                    type="email"
                    placeholder="ola@exemplo.pt"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <Field label="Palavra-passe" type="password" placeholder="••••••••" />
                  <Button type="submit" size="lg" loading={busy} className="mt-2 w-full">
                    {mode === "signup" ? "Criar conta" : "Entrar"}
                    <Icon.Arrow size={17} />
                  </Button>
                  <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-mute">
                    <Icon.Lock size={12} />
                    Mockup sem servidor — nada é enviado nem guardado.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
