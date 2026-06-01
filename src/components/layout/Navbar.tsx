"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { store } from "@/store";
import { C } from "@/components/ui";
import { DarkModeToggle } from "@/components/ui/skeleton";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(store.getUser());
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUser(store.getUser());
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

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
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          {/* Logo */}
          <div onClick={() => router.push("/")} style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, color: C.amberDark, letterSpacing: 1, cursor: "pointer", flexShrink: 0 }}>
            🔧 MECHANICS<span style={{ color: C.terra }}>24/7</span>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: "flex", gap: 2, alignItems: "center", flex: 1, justifyContent: "center" }}>
            {navLinks.map(link => (
              <button key={link.href} onClick={() => router.push(link.href)}
                style={{ padding: "6px 10px", background: isActive(link.href) ? `rgba(224,123,26,0.1)` : "transparent", color: isActive(link.href) ? C.amberDark : C.textSecondary, border: "none", borderRadius: 6, fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <DarkModeToggle />

            {user ? (
              <>
                <button onClick={() => router.push(user.role === "admin" ? "/admin/dashboard" : user.role === "mechanic" ? "/mechanic/dashboard" : "/customer/dashboard")}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 13 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  {user.name.split(" ")[0]}
                </button>
                <button onClick={handleLogout} style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13, color: C.textSecondary }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => router.push("/login")}
                  style={{ padding: "7px 14px", background: "transparent", border: `1.5px solid ${C.amber}`, borderRadius: 7, fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, color: C.amberDark, cursor: "pointer", letterSpacing: .5 }}>
                  LOGIN
                </button>
                <button onClick={() => router.push("/register")}
                  style={{ padding: "7px 14px", background: C.amber, border: "none", borderRadius: 7, fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", letterSpacing: .5 }}>
                  REGISTER
                </button>
                <button onClick={() => router.push("/admin/login")}
                  style={{ padding: "7px 12px", background: C.brown, border: "none", borderRadius: 7, fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, color: "white", cursor: "pointer", letterSpacing: .5 }}>
                  ADMIN
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}