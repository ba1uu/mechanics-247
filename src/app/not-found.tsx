"use client";
import { useRouter } from "next/navigation";
import { C } from "@/components/ui";

export default function NotFound() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: C.cream, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter',sans-serif", textAlign: "center" }}>
      {/* Animated wrench */}
      <div style={{ fontSize: 80, marginBottom: 8, display: "inline-block", animation: "float 3s ease-in-out infinite" }}>🔧</div>

      {/* 404 */}
      <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 120, fontWeight: 700, color: C.cream2, lineHeight: 1, marginBottom: -20, userSelect: "none", textShadow: `2px 2px 0 ${C.cream2}` }}>
        404
      </div>

      <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 36, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>
        Page Not Found
      </h1>

      <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 420, lineHeight: 1.7, marginBottom: 36 }}>
        Looks like this page broke down on the road. Don't worry — our mechanics are good at fixing things, but this URL is beyond repair.
      </p>

      {/* Quick links */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
        <button onClick={() => router.push("/")}
          style={{ padding: "12px 28px", background: C.amber, color: "white", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: 1 }}>
          🏠 Back to Home
        </button>
        <button onClick={() => router.push("/support")}
          style={{ padding: "12px 28px", background: "transparent", color: C.amberDark, border: `1.5px solid ${C.amber}`, borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: 1 }}>
          💬 Get Support
        </button>
      </div>

      {/* Helpful links */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 32px", maxWidth: 480, width: "100%" }}>
        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, color: C.textMuted, letterSpacing: 1, marginBottom: 16 }}>MAYBE YOU WERE LOOKING FOR</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "🆘", label: "Get Help Now", href: "/register" },
            { icon: "🔧", label: "Become a Mechanic", href: "/become-mechanic" },
            { icon: "📋", label: "Our Services", href: "/services" },
            { icon: "🔐", label: "Login", href: "/login" },
            { icon: "📞", label: "Contact Us", href: "/contact" },
            { icon: "👑", label: "Admin Panel", href: "/admin/login" },
          ].map(link => (
            <button key={link.href} onClick={() => router.push(link.href)}
              style={{ padding: "10px 14px", background: C.cream, border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 500, color: C.textSecondary, display: "flex", alignItems: "center", gap: 8, transition: "all .2s", textAlign: "left" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.amber; (e.currentTarget as HTMLElement).style.color = C.amberDark; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.textSecondary; }}>
              <span>{link.icon}</span> {link.label}
            </button>
          ))}
        </div>
      </div>

      <p style={{ marginTop: 32, fontSize: 12, color: C.textMuted, fontFamily: "'Space Mono',monospace" }}>
        ERROR CODE: 404 · MECHANICS 24/7
      </p>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      `}</style>
    </div>
  );
}