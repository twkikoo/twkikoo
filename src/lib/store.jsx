import { createContext, useCallback, useContext, useMemo, useReducer, useRef, useState } from "react";
import { orderCode } from "./utils";

const StoreContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const existing = state.find((line) => line.slug === action.product.slug);
      if (existing) {
        return state.map((line) =>
          line.slug === action.product.slug ? { ...line, qty: Math.min(line.qty + action.qty, 9) } : line,
        );
      }
      return [...state, { slug: action.product.slug, qty: action.qty, product: action.product }];
    }
    case "qty":
      return state
        .map((line) => (line.slug === action.slug ? { ...line, qty: action.qty } : line))
        .filter((line) => line.qty > 0);
    case "remove":
      return state.filter((line) => line.slug !== action.slug);
    case "clear":
      return [];
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [cartOpen, setCartOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null); // "login" | "signup" | null
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [order, setOrder] = useState(null);
  const toastId = useRef(0);

  const toast = useCallback((message, options = {}) => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message, ...options }]);
    setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), options.duration ?? 3600);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const addToCart = useCallback(
    (product, qty = 1) => {
      dispatch({ type: "add", product, qty });
      toast(`${product.name} — no cesto`, { kind: "cart", product });
    },
    [toast],
  );

  const totals = useMemo(() => {
    const items = cart.reduce((sum, line) => sum + line.qty, 0);
    const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.qty, 0);
    const shipping = subtotal === 0 || subtotal >= 4000 ? 0 : 350;
    return { items, subtotal, shipping, total: subtotal + shipping, freeFrom: 4000 };
  }, [cart]);

  const placeOrder = useCallback(
    (details) => {
      const placed = {
        code: orderCode(),
        placedAt: new Date(),
        lines: cart,
        totals,
        details,
        step: 1,
      };
      setOrder(placed);
      dispatch({ type: "clear" });
      return placed;
    },
    [cart, totals],
  );

  const value = useMemo(
    () => ({
      cart,
      totals,
      addToCart,
      setQty: (slug, qty) => dispatch({ type: "qty", slug, qty }),
      removeFromCart: (slug) => dispatch({ type: "remove", slug }),
      clearCart: () => dispatch({ type: "clear" }),
      cartOpen,
      setCartOpen,
      authMode,
      setAuthMode,
      user,
      setUser,
      toasts,
      toast,
      dismissToast,
      order,
      setOrder,
      placeOrder,
    }),
    [cart, totals, addToCart, cartOpen, authMode, user, toasts, toast, dismissToast, order, placeOrder],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
