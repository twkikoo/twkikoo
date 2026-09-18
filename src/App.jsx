import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { AuthModal } from "./components/AuthModal";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { PawCurtain } from "./components/PawLoader";
import { StatePanel } from "./components/StatePanel";
import { Toaster } from "./components/Toaster";
import { Button } from "./components/ui";
import { pageVariants } from "./lib/motion";
import { Link, RouterProvider, useRouter } from "./lib/router";
import { StoreProvider } from "./lib/store";
import { sleep } from "./lib/utils";
import { Checkout } from "./pages/Checkout";
import { Home } from "./pages/Home";
import { Journal } from "./pages/Journal";
import { Product } from "./pages/Product";
import { Shop } from "./pages/Shop";
import { Support } from "./pages/Support";
import { Tracking } from "./pages/Tracking";

const PAGES = {
  home: Home,
  shop: Shop,
  product: Product,
  journal: Journal,
  checkout: Checkout,
  tracking: Tracking,
  support: Support,
};

function NotFound() {
  return (
    <div className="mx-auto grid max-w-lg place-items-center px-5 pt-48 pb-24 text-center">
      <h1 className="font-display text-[clamp(3rem,10vw,6rem)] leading-none">404</h1>
      <p className="mt-4 text-ink-soft">Esta página não existe. O Kiko jura que não foi ele.</p>
      <Button as={Link} to="/" className="mt-8">
        Voltar ao início
      </Button>
    </div>
  );
}

function Shell({ loading, forceLoading }) {
  const { route } = useRouter();
  const Page = PAGES[route.name] ?? NotFound;

  return (
    <div className="grain relative min-h-screen">
      <Navbar />

      <main>
        <AnimatePresence mode="wait">
          <motion.div key={route.path} variants={pageVariants} initial="hidden" animate="show" exit="exit">
            <Page />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      <CartDrawer />
      <AuthModal />
      <Toaster />
      <StatePanel onForceLoading={forceLoading} />
      <PawCurtain show={loading} />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  // A short boot so the first thing anyone sees is Kiko kneading.
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(id);
  }, []);

  const forceLoading = useCallback(async (ms = 1400) => {
    setLoading(true);
    await sleep(ms);
    setLoading(false);
  }, []);

  /**
   * Navigation choreography: the curtain comes down, the route swaps underneath
   * it, and it lifts once the incoming page has had a moment to settle.
   */
  const onNavigate = useCallback(async () => {
    setLoading(true);
    await sleep(380);
    setTimeout(() => setLoading(false), 320);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <RouterProvider onNavigate={onNavigate}>
          <Shell loading={loading} forceLoading={forceLoading} />
        </RouterProvider>
      </StoreProvider>
    </MotionConfig>
  );
}
