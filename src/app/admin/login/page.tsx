"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { C, Input, Btn } from "@/components/ui";
import { store } from "@/store";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 1000));
    if (form.email === "admin@mechanics247.com" && form.password === "admin123") {
      store.setUser({ id: "admin1", name: "Admin User", email: form.email, phone: "9999999999", role: "admin" });
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials. Use: admin@mechanics247.com / admin123");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.brown, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🔧</div>
          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: "#f59e2a", letterSpacing: 1 }}>MECHANICS 24/7</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 4, letterSpacing: 2, fontFamily: "'Oswald',sans-serif" }}>ADMIN PANEL</div>
        </div>

        <div style={{ background: C.white, borderRadius: 20, padding: "36px 40px", boxShadow: "0 24px 64px rgba(0,0,0,.3)" }}>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>Admin Sign In</h2>
          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 28 }}>Restricted access — authorized personnel only</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Admin Email" type="email" value={form.email} onChange={v => set("email", v)} placeholder="admin@mechanics247.com" required />
            <Input label="Password" type="password" value={form.password} onChange={v => set("password", v)} placeholder="Enter admin password" required />

            <div style={{ background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, fontSize: 12, color: C.textSecondary }}>
              💡 Demo credentials:<br />
              <strong>Email:</strong> admin@mechanics247.com<br />
              <strong>Password:</strong> admin123
            </div>

            {error && (
              <div style={{ background: "#fdecea", border: "1px solid #c0392b", borderRadius: 8, padding: 12, fontSize: 13, color: "#c0392b" }}>
                ⚠️ {error}
              </div>
            )}

            <Btn onClick={handleLogin} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 15 }}>
              {loading ? "⏳ Signing in..." : "🔐 Sign In to Admin Panel"}
            </Btn>
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13 }}>
              ← Back to main site
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(255,255,255,.3)", fontFamily: "'Space Mono',monospace" }}>
          MECHANICS 24/7 · ADMIN v1.0 · SECURE
        </p>
      </div>
    </div>
  );
}