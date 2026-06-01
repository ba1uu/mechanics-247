"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ─── Dark Mode Context ───────────────────────────────────────
const DarkModeContext = createContext({ dark: false, toggle: () => {} });
export const useDarkMode = () => useContext(DarkModeContext);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("m247_dark");
    if (saved === "true") { setDark(true); document.documentElement.setAttribute("data-theme", "dark"); }
  }, []);

  const toggle = () => {
    setDark(d => {
      const next = !d;
      localStorage.setItem("m247_dark", String(next));
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      return next;
    });
  };

  return <DarkModeContext.Provider value={{ dark, toggle }}>{children}</DarkModeContext.Provider>;
}

// ─── Dark Mode Toggle Button ─────────────────────────────────
export function DarkModeToggle() {
  const { dark, toggle } = useDarkMode();
  return (
    <button onClick={toggle}
      style={{ width: 40, height: 40, borderRadius: 10, background: dark ? "#2a1a08" : "#faefd8", border: `1px solid ${dark ? "#5c2e0a" : "rgba(224,123,26,.2)"}`, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

// ─── Skeleton Components ──────────────────────────────────────
const shimmer = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const skeletonBase: React.CSSProperties = {
  background: "linear-gradient(90deg, #f5e4c0 25%, #faefd8 50%, #f5e4c0 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
  borderRadius: 8,
};

export function SkeletonLine({ width = "100%", height = 16, style = {} }: { width?: string | number; height?: number; style?: React.CSSProperties }) {
  return (
    <>
      <style>{shimmer}</style>
      <div style={{ ...skeletonBase, width, height, ...style }} />
    </>
  );
}

export function SkeletonCard({ height = 120 }: { height?: number }) {
  return (
    <div style={{ background: "#fffaf3", border: "1px solid rgba(224,123,26,.12)", borderRadius: 16, padding: 24, height }}>
      <style>{shimmer}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SkeletonLine width="60%" height={20} />
        <SkeletonLine width="90%" height={14} />
        <SkeletonLine width="75%" height={14} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 4 }: { rows?: number }) {
  return (
    <div style={{ background: "#fffaf3", border: "1px solid rgba(224,123,26,.12)", borderRadius: 16, padding: 24 }}>
      <style>{shimmer}</style>
      {/* Header */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid #faefd8" }}>
        {[30, 20, 15, 15, 20].map((w, i) => (
          <div key={i} style={{ ...skeletonBase, flex: w, height: 14 }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #faefd8" }}>
          {[30, 20, 15, 15, 20].map((w, j) => (
            <div key={j} style={{ ...skeletonBase, flex: w, height: 12 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
      <style>{shimmer}</style>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ background: "#fffaf3", border: "1px solid rgba(224,123,26,.12)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ ...skeletonBase, width: 40, height: 12 }} />
            <div style={{ ...skeletonBase, width: 32, height: 32, borderRadius: "50%" }} />
          </div>
          <div style={{ ...skeletonBase, width: "70%", height: 28, marginBottom: 8 }} />
          <div style={{ ...skeletonBase, width: "50%", height: 12 }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div style={{ background: "#fffaf3", border: "1px solid rgba(224,123,26,.12)", borderRadius: 16, padding: 28 }}>
      <style>{shimmer}</style>
      <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #faefd8" }}>
        <div style={{ ...skeletonBase, width: 72, height: 72, borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ ...skeletonBase, width: "50%", height: 20, marginBottom: 8 }} />
          <div style={{ ...skeletonBase, width: "70%", height: 14, marginBottom: 6 }} />
          <div style={{ ...skeletonBase, width: "40%", height: 12 }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ background: "#faefd8", borderRadius: 8, padding: 14 }}>
            <div style={{ ...skeletonBase, width: "40%", height: 10, marginBottom: 8 }} />
            <div style={{ ...skeletonBase, width: "70%", height: 14 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page Loading Screen ──────────────────────────────────────
export function PageLoader() {
  return (
    <div style={{ minHeight: "100vh", background: "#fdf6ed", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <style>{shimmer}</style>
      <div style={{ fontSize: 48, animation: "float 1.5s ease-in-out infinite" }}>🔧</div>
      <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: "#b85f0a", letterSpacing: 1 }}>Loading...</div>
      <div style={{ width: 200, height: 4, background: "#faefd8", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ ...skeletonBase, width: "100%", height: "100%" }} />
      </div>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  );
}