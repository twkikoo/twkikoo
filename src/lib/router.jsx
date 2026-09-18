import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * A ~60 line router.
 *
 * A real router would work, but page transitions are the point of this site and
 * owning the navigation means we own the exact moment the paw loader appears,
 * the moment the outgoing page starts leaving, and the scroll restore.
 */

const ROUTES = [
  { name: "home", pattern: "/" },
  { name: "shop", pattern: "/loja" },
  { name: "product", pattern: "/loja/:slug" },
  { name: "journal", pattern: "/diario" },
  { name: "checkout", pattern: "/checkout" },
  { name: "tracking", pattern: "/encomenda/:code" },
  { name: "support", pattern: "/apoio" },
];

function match(pathname) {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  for (const route of ROUTES) {
    const segs = route.pattern.split("/").filter(Boolean);
    if (segs.length !== parts.length) continue;
    const params = {};
    const ok = segs.every((seg, i) => {
      if (seg.startsWith(":")) {
        params[seg.slice(1)] = decodeURIComponent(parts[i]);
        return true;
      }
      return seg === parts[i];
    });
    if (ok) return { name: route.name, path: pathname, params };
  }
  return { name: "notFound", path: pathname, params: {} };
}

/**
 * Where index.html actually lives. Served from "/" this is empty; served from a
 * sub-path (a preview host, a project page) it is that prefix, and every route
 * hangs off it. Detected by asking whether the landing path is a route we know.
 */
const BASE = (() => {
  const here = window.location.pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "");
  return here && match(here).name === "notFound" ? here : "";
})();

/** A route path as the browser should see it. */
export const href = (path) => BASE + path;

/** A browser path as the app should see it. */
function locate(pathname) {
  const rest = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  return match(rest || "/");
}

const RouterContext = createContext(null);

export function RouterProvider({ children, onNavigate }) {
  const [route, setRoute] = useState(() => locate(window.location.pathname));
  const pending = useRef(0);

  useEffect(() => {
    const onPop = () => setRoute(locate(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback(
    async (to, { replace = false } = {}) => {
      const target = href(to);
      if (target === window.location.pathname) return;
      // The host decides how long the paw kneads before the next page lands.
      const ticket = ++pending.current;
      await onNavigate?.(to);
      // A newer navigation started while this one was loading — let that one win.
      if (ticket !== pending.current) return;
      try {
        window.history[replace ? "replaceState" : "pushState"]({}, "", target);
      } catch {
        // Some sandboxed hosts deny the history API; route in memory instead.
      }
      setRoute(match(to));
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [onNavigate],
  );

  const value = useMemo(() => ({ route, navigate }), [route, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used inside <RouterProvider>");
  return ctx;
}

/** An anchor that behaves like an anchor (cmd-click, middle-click, right-click) but routes in-app. */
export function Link({ to, children, className, onClick, ...rest }) {
  const { navigate } = useRouter();
  return (
    <a
      href={href(to)}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        onClick?.(event);
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
