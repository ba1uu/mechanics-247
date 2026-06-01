"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { store } from "@/store";
import { C } from "@/components/ui";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(store.getUser());
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("m247-dark");
    if (saved === "true") {
      setDark(true);
      document.body.style.filter = "invert(1) hue-rotate(180deg)";
      const style = document.createElement("style");
      style.id = "dark-mode-img-fix";
      style.textContent = "img,video,iframe,canvas{ filter:invert(1) hue-rotate(180deg); }";
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    setUser(store.getUser());
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("m247-dark", String(next));
    if (next) {
      document.body.style.filter = "invert(1) hue-rotate(180deg)";
      const style = document.getElementById("dark-mode-img-fix") || document.createElement("style");
      style.id = "dark-mode-img-fix";
      style.textContent = "img,video,iframe,canvas{ filter:invert(1) hue-rotate(180deg); }";
      document.head.appendChild(style);
    } else {
      document.body.style.filter = "";
      const el = document.getElementById("dark-mode-img-fix");
      if (el) el.remove();
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Become a Mechanic", href: "/become-mechanic" },
    { label: "Support", href: "/support" },
    { label: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    store.logout();
    setUser(null);
    router.push("/");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(253,246,237,0.97)" : "rgba(253,246,237,0.92)",
        borderBottom: `1px solid ${C.border}`,
        backdropFilter: "blur(12px)",
        transition: "all .3s",
        boxShadow: scrolled ? "0 2px 20px rgba(92,46,10,.08)" : "none",
      }}>

        {/* ── DESKTOP ── */}
        <div className="nav-desktop" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div onClick={() => router.push("/")} style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, color: C.amberDark, letterSpacing: 1, cursor: "pointer", flexShrink: 0 }}>
            🔧 MECHANICS<span style={{ color: C.terra }}>24/7</span>
          </div>
          <div style={{ display: "flex", gap: 2, alignItems: "center", flex: 1, justifyContent: "center" }}>
            {navLinks.map(link => (
              <button key={link.href} onClick={() => router.push(link.href)}
                style={{ padding: "6px 10px", background: isActive(link.href) ? "rgba(224,123,26,0.1)" : "transparent", color: isActive(link.href) ? C.amberDark : C.textSecondary, border: "none", borderRadius: 6, fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>
                {link.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {/* Dark toggle — pure CSS, no emoji */}
            <button onClick={toggleDark} title={dark ? "Light mode" : "Dark mode"}
              style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative", flexShrink: 0, padding: 0, background: dark ? C.amberDark : "rgba(92,46,10,.2)", transition: "background .3s" }}>
              <span style={{ position: "absolute", top: 3, left: dark ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left .3s", display: "block" }} />
            </button>
            {user ? (
              <>
                <button onClick={() => router.push(user.role === "admin" ? "/admin/dashboard" : user.role === "mechanic" ? "/mechanic/dashboard" : "/customer/dashboard")}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 13 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>{user.name.charAt(0).toUpperCase()}</span>
                  {user.name.split(" ")[0]}
                </button>
                <button onClick={handleLogout} style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13, color: C.textSecondary }}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => router.push("/login")} style={{ padding: "7px 14px", background: "transparent", border: `1.5px solid ${C.amber}`, borderRadius: 7, fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, color: C.amberDark, cursor: "pointer", letterSpacing: .5 }}>LOGIN</button>
                <button onClick={() => router.push("/register")} style={{ padding: "7px 14px", background: C.amber, border: "none", borderRadius: 7, fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", letterSpacing: .5 }}>REGISTER</button>
                <button onClick={() => router.push("/admin/login")} style={{ padding: "7px 12px", background: C.brown, border: "none", borderRadius: 7, fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, color: "white", cursor: "pointer", letterSpacing: .5 }}>ADMIN</button>
              </>
            )}
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="nav-mobile" style={{ display: "none" }}>
          {/* Row 1: Logo + dark toggle */}
          <div style={{ padding: "0 16px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div onClick={() => router.push("/")} style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, color: C.amberDark, cursor: "pointer" }}>
              🔧 MECHANICS<span style={{ color: C.terra }}>24/7</span>
            </div>
            {/* Pure CSS dark toggle — no emoji */}
            <button onClick={toggleDark}
              style={{ width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer", position: "relative", padding: 0, flexShrink: 0, background: dark ? C.amberDark : "rgba(92,46,10,.2)", transition: "background .3s" }}>
              <span style={{ position: "absolute", top: 2, left: dark ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left .3s", display: "block" }} />
            </button>
          </div>

          {/* Row 2: Full-width scrollable strip — starts from left edge */}
          <div style={{ borderTop: `1px solid ${C.border}`, overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch" as any }}>
            <div style={{ display: "inline-flex", gap: 6, padding: "8px 12px 10px 12px", alignItems: "center" }}>
              {navLinks.map(link => (
                <button key={link.href} onClick={() => router.push(link.href)}
                  style={{ padding: "5px 13px", background: isActive(link.href) ? "rgba(224,123,26,.12)" : "transparent", color: isActive(link.href) ? C.amberDark : C.textSecondary, border: `1px solid ${isActive(link.href) ? "rgba(224,123,26,.4)" : "rgba(0,0,0,.1)"}`, borderRadius: 20, fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {link.label}
                </button>
              ))}
              <span style={{ width: 1, height: 22, background: C.border, flexShrink: 0 }} />
              {user ? (
                <>
                  <button onClick={() => router.push(user.role === "admin" ? "/admin/dashboard" : user.role === "mechanic" ? "/mechanic/dashboard" : "/customer/dashboard")}
                    style={{ padding: "5px 13px", background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 20, fontFamily: "'Inter',sans-serif", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                    👤 {user.name.split(" ")[0]}
                  </button>
                  <button onClick={handleLogout} style={{ padding: "5px 13px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 20, fontSize: 13, color: C.textSecondary, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => router.push("/login")} style={{ padding: "5px 14px", background: "transparent", border: `1.5px solid ${C.amber}`, borderRadius: 20, fontFamily: "'Oswald',sans-serif", fontSize: 12, fontWeight: 600, color: C.amberDark, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>LOGIN</button>
                  <button onClick={() => router.push("/register")} style={{ padding: "5px 14px", background: C.amber, border: "none", borderRadius: 20, fontFamily: "'Oswald',sans-serif", fontSize: 12, fontWeight: 600, color: "white", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>REGISTER</button>
                  <button onClick={() => router.push("/admin/login")} style={{ padding: "5px 12px", background: C.brown, border: "none", borderRadius: 20, fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, color: "white", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>ADMIN</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: block !important; }
        }
        .nav-mobile ::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}