"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { C, Btn } from "@/components/ui";

type Step = "email" | "otp" | "newpass" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const handleOtpChange = (i: number, v: string) => {
    if (v.length > 1) return;
    const newOtp = [...otp];
    newOtp[i] = v;
    setOtp(newOtp);
    if (v && i < 5) (document.getElementById(`fp-otp-${i + 1}`) as HTMLInputElement)?.focus();
    if (i === 5 && v) setTimeout(() => setStep("newpass"), 400);
  };

  const sendOtp = async () => {
    setError("");
    if (!email || !email.includes("@")) { setError("Please enter a valid email address"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep("otp");
    // Start resend timer
    setResendTimer(60);
    const t = setInterval(() => {
      setResendTimer(prev => { if (prev <= 1) { clearInterval(t); return 0; } return prev - 1; });
    }, 1000);
  };

  const resetPassword = async () => {
    setError("");
    if (!password || password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep("done");
  };

  const strengthScore = (p: string) => {
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const strength = strengthScore(password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][strength];
  const strengthColor = ["", C.red, C.orange, C.amberLight, C.green, C.green][strength];

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
        <div style={{ width: "100%", maxWidth: 460 }}>

          {/* Steps indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
            {(["email", "otp", "newpass", "done"] as Step[]).map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: step === s ? C.amber : ["done", "newpass", "otp"].indexOf(s) < ["done", "newpass", "otp"].indexOf(step) || step === "done" ? C.green : C.cream2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: step === s || step === "done" ? "white" : C.textMuted, fontFamily: "'Oswald',sans-serif", transition: "all .3s" }}>
                  {i + 1}
                </div>
                {i < 3 && <div style={{ width: 32, height: 2, background: C.border }} />}
              </div>
            ))}
          </div>

          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "36px 40px", boxShadow: "0 8px 32px rgba(92,46,10,.07)" }}>

            {/* STEP 1: Email */}
            {step === "email" && (
              <div style={{ animation: "slide-up .3s ease" }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔑</div>
                  <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Forgot Password?</h1>
                  <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>No worries! Enter your registered email and we'll send you a reset OTP.</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 8 }}>EMAIL ADDRESS</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendOtp()}
                      placeholder="you@example.com"
                      style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.cream, outline: "none" }}
                      onFocus={e => e.target.style.borderColor = C.amber}
                      onBlur={e => e.target.style.borderColor = C.border} />
                  </div>

                  {error && <div style={{ background: "#fdecea", border: "1px solid #c0392b", borderRadius: 8, padding: 12, fontSize: 13, color: "#c0392b" }}>⚠️ {error}</div>}

                  <Btn onClick={sendOtp} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
                    {loading ? "⏳ Sending OTP..." : "📧 Send Reset OTP"}
                  </Btn>
                </div>
              </div>
            )}

            {/* STEP 2: OTP */}
            {step === "otp" && (
              <div style={{ animation: "slide-up .3s ease", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📱</div>
                <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Check Your Email</h2>
                <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 8, lineHeight: 1.6 }}>
                  We sent a 6-digit OTP to<br /><strong style={{ color: C.textPrimary }}>{email}</strong>
                </p>
                <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 28 }}>💡 Demo: enter any 6 digits</p>

                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                  {otp.map((digit, i) => (
                    <input key={i} id={`fp-otp-${i}`} value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)} maxLength={1}
                      style={{ width: 52, height: 56, textAlign: "center", border: `2px solid ${digit ? C.amber : C.border}`, borderRadius: 10, fontSize: 22, fontWeight: 700, fontFamily: "'Oswald',sans-serif", background: C.cream, outline: "none", transition: "border .2s" }} />
                  ))}
                </div>

                <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
                  Didn't receive it?{" "}
                  {resendTimer > 0 ? (
                    <span style={{ color: C.textMuted }}>Resend in {resendTimer}s</span>
                  ) : (
                    <button onClick={sendOtp} style={{ background: "none", border: "none", color: C.amber, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Resend OTP</button>
                  )}
                </div>

                <button onClick={() => setStep("email")} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13 }}>← Change email</button>
              </div>
            )}

            {/* STEP 3: New Password */}
            {step === "newpass" && (
              <div style={{ animation: "slide-up .3s ease" }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
                  <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Set New Password</h2>
                  <p style={{ fontSize: 14, color: C.textSecondary }}>Choose a strong password for your account</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 8 }}>NEW PASSWORD</label>
                    <div style={{ position: "relative" }}>
                      <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        style={{ width: "100%", padding: "12px 40px 12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.cream, outline: "none" }} />
                      <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: C.textMuted }}>
                        {showPass ? "🙈" : "👁️"}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {password.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                          {[1, 2, 3, 4, 5].map(n => (
                            <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: n <= strength ? strengthColor : C.cream2, transition: "all .3s" }} />
                          ))}
                        </div>
                        <div style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 8 }}>CONFIRM PASSWORD</label>
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                      placeholder="Repeat password"
                      style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${confirm && confirm === password ? C.green : confirm ? C.red : C.border}`, borderRadius: 8, fontSize: 14, background: C.cream, outline: "none" }} />
                    {confirm && confirm !== password && <div style={{ fontSize: 12, color: C.red, marginTop: 4 }}>Passwords don't match</div>}
                    {confirm && confirm === password && <div style={{ fontSize: 12, color: C.green, marginTop: 4 }}>✓ Passwords match</div>}
                  </div>

                  {error && <div style={{ background: "#fdecea", border: "1px solid #c0392b", borderRadius: 8, padding: 12, fontSize: 13, color: "#c0392b" }}>⚠️ {error}</div>}

                  <Btn onClick={resetPassword} disabled={loading || !password || password !== confirm} style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
                    {loading ? "⏳ Updating..." : "🔒 Reset Password"}
                  </Btn>
                </div>
              </div>
            )}

            {/* STEP 4: Done */}
            {step === "done" && (
              <div style={{ animation: "slide-up .3s ease", textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>Password Reset!</h2>
                <p style={{ fontSize: 15, color: C.textSecondary, marginBottom: 32, lineHeight: 1.7 }}>
                  Your password has been updated successfully. You can now log in with your new password.
                </p>
                <Btn onClick={() => router.push("/login")} style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 15 }}>
                  → Go to Login
                </Btn>
              </div>
            )}
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: C.textMuted }}>
            Remember your password? <a href="/login" style={{ color: C.amber, fontWeight: 600 }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}