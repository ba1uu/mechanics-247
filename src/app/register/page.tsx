"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { C, Input, Btn } from "@/components/ui";
import { store } from "@/store";

const STATES = ["Andhra Pradesh", "Karnataka", "Tamil Nadu", "Telangana", "Maharashtra", "Gujarat", "Rajasthan", "Uttar Pradesh", "Delhi", "West Bengal"];
const VEHICLE_TYPES = ["Bike / Scooter", "Car", "Auto Rickshaw", "Electric Vehicle", "Truck / Commercial"];
const BRANDS = ["Maruti Suzuki", "Hyundai", "Honda", "Toyota", "Tata", "Bajaj", "Hero", "TVS", "Yamaha", "Royal Enfield", "Mahindra", "Ford", "Other"];
const FUEL = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const ISSUES = ["Puncture", "Battery Dead", "Engine Problem", "Fuel Empty", "AC Issue", "Electrical Fault", "Locked Out", "Brake Problem", "Towing Required", "Other"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [personal, setPersonal] = useState({ name: "", phone: "", email: "", password: "", confirm: "", photo: "" });
  const [address, setAddress] = useState({ state: "", district: "", city: "", pin: "" });
  const [vehicle, setVehicle] = useState({ type: "", brand: "", model: "", number: "", fuel: "" });

  const setP = (k: string, v: string) => setPersonal(f => ({ ...f, [k]: v }));
  const setA = (k: string, v: string) => setAddress(f => ({ ...f, [k]: v }));
  const setV = (k: string, v: string) => setVehicle(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!personal.name) e.name = "Name is required";
      if (!personal.phone || personal.phone.length < 10) e.phone = "Valid phone required";
      if (!personal.email || !personal.email.includes("@")) e.email = "Valid email required";
      if (!personal.password || personal.password.length < 6) e.password = "Min 6 characters";
      if (personal.password !== personal.confirm) e.confirm = "Passwords don't match";
    }
    if (step === 2) {
      if (!address.state) e.state = "State required";
      if (!address.city) e.city = "City required";
      if (!address.pin || address.pin.length < 6) e.pin = "Valid pin code required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOtpChange = (i: number, v: string) => {
    if (v.length > 1) return;
    const newOtp = [...otp];
    newOtp[i] = v;
    setOtp(newOtp);
    if (v && i < 5) (document.getElementById(`reg-otp-${i + 1}`) as HTMLInputElement)?.focus();
    if (i === 5 && v) {
      setTimeout(() => setOtpVerified(true), 500);
    }
  };

  const handleNext = () => {
    if (!validate()) return;
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    store.setUser({ id: "C_" + Date.now(), name: personal.name, email: personal.email, phone: personal.phone, role: "customer", city: address.city, state: address.state });
    if (vehicle.type) {
      store.addVehicle({ id: "V_" + Date.now(), type: vehicle.type, brand: vehicle.brand, model: vehicle.model, number: vehicle.number, fuel: vehicle.fuel });
    }
    setLoading(false);
    router.push("/customer/dashboard");
  };

  const steps = [
    { num: 1, label: "Personal Details" },
    { num: 2, label: "Address" },
    { num: 3, label: "Vehicle Info" },
    { num: 4, label: "OTP Verify" },
  ];

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 720, margin: "0 auto", padding: "80px 24px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 36, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Create Your Account</h1>
          <p style={{ fontSize: 15, color: C.textSecondary }}>Join 1,50,000+ customers getting roadside help in minutes</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div className={`step-dot ${step > s.num ? "done" : step === s.num ? "active" : "pending"}`}>
                  {step > s.num ? "✓" : s.num}
                </div>
                <span style={{ fontSize: 11, color: step >= s.num ? C.amberDark : C.textMuted, fontWeight: 600, fontFamily: "'Oswald',sans-serif", whiteSpace: "nowrap" }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: step > s.num ? C.amber : C.border, margin: "0 8px", marginBottom: 20 }} />}
            </div>
          ))}
        </div>

        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "36px 40px" }}>
          {/* STEP 1: Personal */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "slide-up .3s ease" }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 600, color: C.textPrimary }}>Personal Details</h2>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.cream2, border: `2px dashed ${C.amber}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 28 }}>
                  {personal.photo ? "📸" : "👤"}
                </div>
              </div>
              <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: -12 }}>Click to upload profile photo</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Input label="Full Name" value={personal.name} onChange={v => setP("name", v)} placeholder="Enter your full name" required />
                  {errors.name && <span style={{ fontSize: 12, color: C.red }}>{errors.name}</span>}
                </div>
                <div>
                  <Input label="Mobile Number" type="tel" value={personal.phone} onChange={v => setP("phone", v)} placeholder="+91 98765 43210" required />
                  {errors.phone && <span style={{ fontSize: 12, color: C.red }}>{errors.phone}</span>}
                </div>
                <div>
                  <Input label="Email Address" type="email" value={personal.email} onChange={v => setP("email", v)} placeholder="you@example.com" required />
                  {errors.email && <span style={{ fontSize: 12, color: C.red }}>{errors.email}</span>}
                </div>
                <div>
                  <Input label="Password" type="password" value={personal.password} onChange={v => setP("password", v)} placeholder="Min 6 characters" required />
                  {errors.password && <span style={{ fontSize: 12, color: C.red }}>{errors.password}</span>}
                </div>
                <div>
                  <Input label="Confirm Password" type="password" value={personal.confirm} onChange={v => setP("confirm", v)} placeholder="Repeat password" required />
                  {errors.confirm && <span style={{ fontSize: 12, color: C.red }}>{errors.confirm}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Address */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "slide-up .3s ease" }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 600, color: C.textPrimary }}>Your Address</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Input label="State" type="select" value={address.state} onChange={v => setA("state", v)} options={STATES} required />
                  {errors.state && <span style={{ fontSize: 12, color: C.red }}>{errors.state}</span>}
                </div>
                <div>
                  <Input label="District" value={address.district} onChange={v => setA("district", v)} placeholder="e.g. Nellore" />
                </div>
                <div>
                  <Input label="City" value={address.city} onChange={v => setA("city", v)} placeholder="Your city" required />
                  {errors.city && <span style={{ fontSize: 12, color: C.red }}>{errors.city}</span>}
                </div>
                <div>
                  <Input label="Pin Code" value={address.pin} onChange={v => setA("pin", v)} placeholder="6-digit pin" required />
                  {errors.pin && <span style={{ fontSize: 12, color: C.red }}>{errors.pin}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Vehicle */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "slide-up .3s ease" }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 600, color: C.textPrimary }}>Vehicle Information</h2>
              <p style={{ fontSize: 13, color: C.textMuted }}>Optional — you can add vehicles later from your dashboard</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Input label="Vehicle Type" type="select" value={vehicle.type} onChange={v => setV("type", v)} options={VEHICLE_TYPES} />
                </div>
                <div>
                  <Input label="Vehicle Brand" type="select" value={vehicle.brand} onChange={v => setV("brand", v)} options={BRANDS} />
                </div>
                <div>
                  <Input label="Vehicle Model" value={vehicle.model} onChange={v => setV("model", v)} placeholder="e.g. Swift, Activa" />
                </div>
                <div>
                  <Input label="Vehicle Number" value={vehicle.number} onChange={v => setV("number", v)} placeholder="e.g. AP 15 AB 1234" />
                </div>
                <div>
                  <Input label="Fuel Type" type="select" value={vehicle.fuel} onChange={v => setV("fuel", v)} options={FUEL} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: OTP */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", animation: "slide-up .3s ease" }}>
              <div style={{ fontSize: 56 }}>📱</div>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 600, color: C.textPrimary }}>Verify Your Number</h2>
              <p style={{ fontSize: 14, color: C.textSecondary, textAlign: "center" }}>
                We'll send a 6-digit OTP to <strong style={{ color: C.textPrimary }}>+91 {personal.phone}</strong>
              </p>

              {!otpSent ? (
                <button onClick={() => setOtpSent(true)}
                  style={{ padding: "13px 32px", background: C.amber, color: "white", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, cursor: "pointer", letterSpacing: 1 }}>
                  SEND OTP
                </button>
              ) : (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {otp.map((digit, i) => (
                      <input key={i} id={`reg-otp-${i}`} value={digit} onChange={e => handleOtpChange(i, e.target.value)} maxLength={1}
                        style={{ width: 52, height: 56, textAlign: "center", border: `2px solid ${digit ? C.amber : C.border}`, borderRadius: 10, fontSize: 22, fontWeight: 700, fontFamily: "'Oswald',sans-serif", background: C.cream, outline: "none", transition: "border .2s" }} />
                    ))}
                  </div>
                  {otpVerified && (
                    <div style={{ background: C.greenBg, border: `1px solid ${C.green}`, borderRadius: 8, padding: "10px 20px", color: C.green, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      ✅ OTP Verified Successfully!
                    </div>
                  )}
                  <p style={{ fontSize: 12, color: C.textMuted }}>Didn't receive? <button style={{ background: "none", border: "none", color: C.amber, cursor: "pointer", fontWeight: 600 }}>Resend OTP</button></p>
                  <p style={{ fontSize: 11, color: C.textMuted, background: C.cream2, padding: "8px 16px", borderRadius: 8 }}>💡 Demo: Enter any 6 digits to verify</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
            {step > 1 ? (
              <Btn variant="secondary" onClick={() => setStep(s => s - 1)}>← Back</Btn>
            ) : (
              <div />
            )}
            {step < 4 ? (
              <Btn onClick={handleNext}>Continue →</Btn>
            ) : (
              <Btn onClick={handleSubmit} disabled={loading || (!otpVerified && otpSent)} style={{ minWidth: 160, justifyContent: "center" }}>
                {loading ? "⏳ Creating account..." : "✅ Create Account"}
              </Btn>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: C.textMuted, marginTop: 16 }}>
            Already have an account? <a href="/login" style={{ color: C.amber, fontWeight: 600 }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}