"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { C, Input, Btn } from "@/components/ui";
import { store } from "@/store";
import { supabase } from "@/lib/supabase";

const STATES = ["Andhra Pradesh", "Karnataka", "Tamil Nadu", "Telangana", "Maharashtra", "Gujarat", "Rajasthan", "Uttar Pradesh", "Delhi", "West Bengal"];
const VEHICLE_TYPES = ["Bike / Scooter", "Car", "Auto Rickshaw", "Electric Vehicle", "Truck / Commercial"];
const BRANDS = ["Maruti Suzuki", "Hyundai", "Honda", "Toyota", "Tata", "Bajaj", "Hero", "TVS", "Yamaha", "Royal Enfield", "Mahindra", "Ford", "Other"];
const FUEL = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

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

  const handleNext = () => {
    if (!validate()) return;
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setServerError("");

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: personal.email,
        password: personal.password,
      });

      if (authError) {
        // Handle specific auth errors cleanly
        if (
          authError.message.toLowerCase().includes("already registered") ||
          authError.message.toLowerCase().includes("already been registered") ||
          authError.message.toLowerCase().includes("user already exists") ||
          authError.message.toLowerCase().includes("duplicate")
        ) {
          setServerError("This email is already registered. Please login instead.");
          setStep(1); // Send them back to step 1
          setLoading(false);
          return;
        }
        throw new Error(authError.message);
      }

      const userId = authData.user?.id;
      if (!userId) throw new Error("Failed to create user. Please try again.");

      // 2. Save profile — use upsert so it never throws duplicate key
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        name: personal.name,
        phone: personal.phone,
        email: personal.email,
        role: "customer",
        city: address.city,
        state: address.state,
      }, { onConflict: "id" });

      if (profileError) {
        // If duplicate email in profiles, still proceed — auth user was created
        if (!profileError.message.toLowerCase().includes("duplicate")) {
          throw new Error(profileError.message);
        }
      }

      // 3. Save vehicle if provided
      if (vehicle.type) {
        await supabase.from("vehicles").insert({
          user_id: userId,
          type: vehicle.type,
          brand: vehicle.brand,
          model: vehicle.model,
          number: vehicle.number,
          fuel: vehicle.fuel,
        });
      }

      // 4. Update local store
      store.setUser({
        id: userId,
        name: personal.name,
        email: personal.email,
        phone: personal.phone,
        role: "customer",
        city: address.city,
        state: address.state,
      });

      router.push("/customer/dashboard");

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "Personal Details" },
    { num: 2, label: "Address" },
    { num: 3, label: "Vehicle Info" },
    { num: 4, label: "Confirm" },
  ];

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <style>{`
        .step-dot { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 700; }
        .step-dot.done { background: ${C.amber}; color: white; }
        .step-dot.active { background: ${C.amber}; color: white; box-shadow: 0 0 0 4px rgba(224,123,26,.2); }
        .step-dot.pending { background: ${C.cream2}; color: ${C.textMuted}; border: 2px solid ${C.border}; }
        @media (max-width: 600px) {
          .register-card { padding: 24px 16px !important; }
          .register-grid { grid-template-columns: 1fr !important; }
          .step-label { display: none; }
        }
      `}</style>

      <Navbar />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px 60px" }}>
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
                <span className="step-label" style={{ fontSize: 11, color: step >= s.num ? C.amberDark : C.textMuted, fontWeight: 600, fontFamily: "'Oswald',sans-serif", whiteSpace: "nowrap" }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: step > s.num ? C.amber : C.border, margin: "0 8px", marginBottom: 20 }} />}
            </div>
          ))}
        </div>

        <div className="register-card" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "36px 40px" }}>

          {/* STEP 1 */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 600, color: C.textPrimary }}>Personal Details</h2>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.cream2, border: `2px dashed ${C.amber}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 28 }}>
                  {personal.photo ? "📸" : "👤"}
                </div>
              </div>
              <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: -12 }}>Click to upload profile photo</p>
              <div className="register-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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

          {/* STEP 2 */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 600, color: C.textPrimary }}>Your Address</h2>
              <div className="register-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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

          {/* STEP 3 */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 600, color: C.textPrimary }}>Vehicle Information</h2>
              <p style={{ fontSize: 13, color: C.textMuted }}>Optional — you can add vehicles later from your dashboard</p>
              <div className="register-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><Input label="Vehicle Type" type="select" value={vehicle.type} onChange={v => setV("type", v)} options={VEHICLE_TYPES} /></div>
                <div><Input label="Vehicle Brand" type="select" value={vehicle.brand} onChange={v => setV("brand", v)} options={BRANDS} /></div>
                <div><Input label="Vehicle Model" value={vehicle.model} onChange={v => setV("model", v)} placeholder="e.g. Swift, Activa" /></div>
                <div><Input label="Vehicle Number" value={vehicle.number} onChange={v => setV("number", v)} placeholder="e.g. AP 15 AB 1234" /></div>
                <div><Input label="Fuel Type" type="select" value={vehicle.fuel} onChange={v => setV("fuel", v)} options={FUEL} /></div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
              <div style={{ fontSize: 56 }}>✅</div>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 600, color: C.textPrimary }}>Almost Done!</h2>
              <p style={{ fontSize: 14, color: C.textSecondary, textAlign: "center", maxWidth: 380 }}>
                Review your details and click <strong>Create Account</strong> to complete registration.
              </p>
              <div style={{ width: "100%", background: C.cream2, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Name", value: personal.name },
                  { label: "Email", value: personal.email },
                  { label: "Phone", value: personal.phone },
                  { label: "City", value: `${address.city}, ${address.state}` },
                  vehicle.type ? { label: "Vehicle", value: `${vehicle.brand} ${vehicle.model} (${vehicle.type})` } : null,
                ].filter(Boolean).map((row) => {
                  const r = row as { label: string; value: string };
                  return (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                      <span style={{ color: C.textMuted }}>{r.label}</span>
                      <span style={{ color: C.textPrimary, fontWeight: 600 }}>{r.value}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: "#fffbea", border: "1px solid #f59e0b", borderRadius: 8, padding: "10px 16px", fontSize: 12, color: "#92400e", textAlign: "center" }}>
                📱 Phone OTP verification coming soon
              </div>
            </div>
          )}

          {/* Server error */}
          {serverError && (
            <div style={{ marginTop: 16, background: "#fdecea", border: "1px solid #c0392b", borderRadius: 8, padding: 14, fontSize: 13, color: "#c0392b", display: "flex", flexDirection: "column", gap: 8 }}>
              <div>⚠️ {serverError}</div>
              {serverError.includes("already registered") && (
                <a href="/login" style={{ color: "#c0392b", fontWeight: 700, textDecoration: "underline", fontSize: 13 }}>
                  → Click here to login instead
                </a>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
            {step > 1 ? (
              <Btn variant="secondary" onClick={() => setStep(s => s - 1)}>← Back</Btn>
            ) : <div />}
            {step < 4 ? (
              <Btn onClick={handleNext}>Continue →</Btn>
            ) : (
              <Btn onClick={handleSubmit} disabled={loading} style={{ minWidth: 180, justifyContent: "center" }}>
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