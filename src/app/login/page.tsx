"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { C, Input, Btn } from "@/components/ui";
import { store } from "@/store";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"customer" | "mechanic" | "admin">("customer");
  const [form, setForm] = useState({ email: "", password: "", phone: "" });
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // Admin demo shortcut
      if (tab === "admin" && form.email === "admin@mechanics247.com" && form.password === "admin123") {
        store.setUser({ id: "admin1", name: "Admin User", email: form.email, phone: "9999999999", role: "admin" });
        router.push("/admin/dashboard");
        return;
      }

      // Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (authError) throw new Error(authError.message);

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) throw new Error("Profile not found. Please register first.");

      if (tab !== "admin" && profile.role !== tab) {
        throw new Error(`This account is a ${profile.role} account, not ${tab}.`);
      }

      store.setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        city: profile.city,
      });

      router.push(`/${profile.role}/dashboard`);

    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, v: string) => {
    if (v.length > 1) return;
    const newOtp = [...otp];
    newOtp[i] = v;
    setOtp(newOtp);
    if (v && i < 5) (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
  };

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <style>{`
        @media (max-width: 768px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-left-panel { display: none !important; }
          .login-right-panel { padding: 100px 20px 40px !important; }
          .login-form-inner { max-width: 100% !important; }
          .otp-input { width: 40px !important; height: 46px !important; font-size: 18px !important; }
          .login-title { font-size: 26px !important; }
          .tab-label { font-size: 11px !important; padding: 9px 4px !important; }
        }
      `}</style>

      <Navbar />
      <div className="login-grid" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", paddingTop: 64 }}>

        <div className="login-left-panel" style={{ background: C.brown, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 30% 40%,rgba(224,123,26,.15) 0%,transparent 60%)` }} />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", color: "white" }}>
            <div style={{ fontSize: 80, marginBottom: 24 }}>🔧</div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 36, fontWeight: 700, color: "#f59e2a", marginBottom: 16 }}>WELCOME BACK!</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.65)", lineHeight: 1.7, maxWidth: 320 }}>
              Log in to access your dashboard, track bookings, and get roadside help anytime.
            </p>
            <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
              {["🛵 8-minute average response", "✅ 50,000+ jobs completed", "⭐ 4.9 star average rating"].map(f => (
                <div key={f} style={{ fontSize: 13, color: "rgba(255,255,255,.7)", textAlign: "left" }}>{f}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="login-right-panel" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
          <div className="login-form-inner" style={{ width: "100%", maxWidth: 440 }}>
            <h1 className="login-title" style={{ fontFamily: "'Oswald',sans-serif", fontSize: 32, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Sign In</h1>
            <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 32 }}>Don't have an account? <a href="/register" style={{ color: C.amber, fontWeight: 600 }}>Register here</a></p>

            <div style={{ display: "flex", background: C.cream2, borderRadius: 10, padding: 4, marginBottom: 28 }}>
              {(["customer", "mechanic", "admin"] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); setError(""); }}
                  className="tab-label"
                  style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: .5, cursor: "pointer", transition: "all .2s", background: tab === t ? C.amber : "transparent", color: tab === t ? "white" : C.textSecondary, textTransform: "uppercase" }}>
                  {t}
                </button>
              ))}
            </div>

            {!otpMode ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {tab !== "admin" && (
                  <Input label="Mobile Number" type="tel" value={form.phone} onChange={v => set("phone", v)} placeholder="+91 98765 43210" />
                )}
                <Input label="Email Address" type="email" value={form.email} onChange={v => set("email", v)} placeholder="you@example.com" />
                <Input label="Password" type="password" value={form.password} onChange={v => set("password", v)} placeholder="Enter your password" />

                {tab === "admin" && (
                  <div style={{ background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, fontSize: 12, color: C.textSecondary }}>
                    💡 Demo: <strong>admin@mechanics247.com</strong> / <strong>admin123</strong>
                  </div>
                )}

                {error && (
                  <div style={{ background: "#fdecea", border: "1px solid #c0392b", borderRadius: 8, padding: 12, fontSize: 13, color: "#c0392b" }}>
                    ⚠️ {error}
                  </div>
                )}

                <Btn onClick={handleLogin} style={{ width: "100%", justifyContent: "center", padding: "13px" }} disabled={loading}>
                  {loading ? "⏳ Signing in..." : `Sign In as ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
                </Btn>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                  <span style={{ fontSize: 12, color: C.textMuted }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                </div>

                <button onClick={() => setOtpMode(true)}
                  style={{ width: "100%", padding: "12px", background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, color: C.textSecondary, cursor: "pointer", letterSpacing: .5 }}>
                  📱 LOGIN WITH OTP
                </button>

                <div style={{ textAlign: "center" }}>
                  <a href="#" style={{ fontSize: 13, color: C.amber, fontWeight: 600 }}>Forgot Password?</a>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Input label="Mobile Number" type="tel" value={form.phone} onChange={v => set("phone", v)} placeholder="+91 98765 43210" />
                <button style={{ padding: "11px", background: C.amber, color: "white", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Send OTP
                </button>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 12 }}>Enter 6-Digit OTP</label>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    {otp.map((digit, i) => (
                      <input key={i} id={`otp-${i}`} value={digit} onChange={e => handleOtpChange(i, e.target.value)} maxLength={1}
                        className="otp-input"
                        style={{ width: 48, height: 52, textAlign: "center", border: `2px solid ${digit ? C.amber : C.border}`, borderRadius: 8, fontSize: 20, fontWeight: 700, fontFamily: "'Oswald',sans-serif", background: C.cream, outline: "none" }} />
                    ))}
                  </div>
                </div>
                <Btn onClick={handleLogin} style={{ width: "100%", justifyContent: "center", padding: "13px" }}>Verify & Login</Btn>
                <button onClick={() => setOtpMode(false)} style={{ background: "none", border: "none", color: C.amber, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back to password login</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}