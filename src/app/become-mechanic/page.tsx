"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { C, Input, Btn, Card } from "@/components/ui";

const SKILLS = ["Engine Repair", "Puncture", "Battery", "EV Specialist", "AC Repair", "Towing", "Electrical", "Body Work", "Brake Service", "Wheel Alignment", "Fuel System", "General Repair"];
const VEHICLE_TYPES = ["Bike / Scooter", "Car", "Auto Rickshaw", "Electric Vehicle", "Truck / Commercial"];
const STATES = ["Andhra Pradesh", "Karnataka", "Tamil Nadu", "Telangana", "Maharashtra", "Gujarat", "Rajasthan", "Uttar Pradesh", "Delhi", "West Bengal"];
const LANGUAGES = ["Telugu", "Tamil", "Hindi", "English", "Kannada", "Malayalam", "Marathi", "Bengali"];

export default function BecomeMechanicPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [personal, setPersonal] = useState({ name: "", phone: "", email: "", dob: "", photo: "" });
  const [professional, setProfessional] = useState({ workshopName: "", experience: "", workshopType: "mobile", serviceRadius: "10", languages: [] as string[], skills: [] as string[], vehicleTypes: [] as string[] });
  const [docs, setDocs] = useState({ aadhaar: "", license: "", certification: "", selfie: "" });
  const [bank, setBank] = useState({ accountName: "", accountNumber: "", ifsc: "", upi: "" });
  const [location, setLocation] = useState({ address: "", city: "", state: "", pin: "", lat: "", lng: "" });
  const [availability, setAvailability] = useState({ mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false, startTime: "08:00", endTime: "20:00" });

  const setP = (k: string, v: string) => setPersonal(f => ({ ...f, [k]: v }));
  const setPro = (k: string, v: any) => setProfessional(f => ({ ...f, [k]: v }));
  const setD = (k: string, v: string) => setDocs(f => ({ ...f, [k]: v }));
  const setB = (k: string, v: string) => setBank(f => ({ ...f, [k]: v }));
  const setL = (k: string, v: string) => setLocation(f => ({ ...f, [k]: v }));
  const setAv = (k: string, v: any) => setAvailability(f => ({ ...f, [k]: v }));

  const toggleArray = (arr: string[], val: string) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!personal.name) e.name = "Required";
      if (!personal.phone || personal.phone.length < 10) e.phone = "Valid phone required";
      if (!personal.email || !personal.email.includes("@")) e.email = "Valid email required";
    }
    if (step === 2) {
      if (professional.skills.length === 0) e.skills = "Select at least one skill";
      if (!professional.experience) e.experience = "Required";
    }
    if (step === 4) {
      if (!bank.accountName) e.accountName = "Required";
      if (!bank.accountNumber) e.accountNumber = "Required";
      if (!bank.ifsc) e.ifsc = "Required";
    }
    if (step === 5) {
      if (!location.city) e.city = "Required";
      if (!location.state) e.state = "Required";
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
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setSubmitted(true);
  };

  const steps = [
    { num: 1, label: "Personal" },
    { num: 2, label: "Skills" },
    { num: 3, label: "Documents" },
    { num: 4, label: "Bank Details" },
    { num: 5, label: "Location" },
    { num: 6, label: "Review" },
  ];

  if (submitted) {
    return (
      <div style={{ background: C.cream, minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 72, marginBottom: 24, animation: "float 3s ease-in-out infinite" }}>🎉</div>
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 40, fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>Application Submitted!</h1>
          <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 500, lineHeight: 1.7, marginBottom: 32 }}>
            Thank you, <strong>{personal.name}</strong>! Your mechanic application is under review. Our team will verify your documents and call you within <strong>24 hours</strong>.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, maxWidth: 600, marginBottom: 40 }}>
            {[
              { icon: "📞", title: "Step 1", desc: "Verification call within 24 hrs" },
              { icon: "✅", title: "Step 2", desc: "Document verification — 2 days" },
              { icon: "🚀", title: "Step 3", desc: "Profile goes live, start earning!" },
            ].map((s, i) => (
              <Card key={i} style={{ textAlign: "center", padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 600, color: C.amberDark, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{s.desc}</div>
              </Card>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => router.push("/")} style={{ padding: "12px 28px", background: C.amber, color: "white", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Back to Home</button>
            <button onClick={() => router.push("/login")} style={{ padding: "12px 28px", background: "transparent", border: `1.5px solid ${C.amber}`, color: C.amberDark, borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Login as Mechanic</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* Hero banner */}
      <div style={{ background: `linear-gradient(135deg, ${C.brown}, ${C.terra})`, padding: "80px 60px 40px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 44, fontWeight: 700, color: "white", marginBottom: 12 }}>
          🔧 Become a Mechanic Partner
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,.8)", maxWidth: 560, margin: "0 auto" }}>
          Earn ₹40,000+/month. Work your own hours. Join 2,800+ verified mechanics across India.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 28 }}>
          {["💰 Earn ₹40K+/month", "⏰ Flexible hours", "📱 Easy app", "🔒 Safe & verified"].map(f => (
            <span key={f} style={{ fontSize: 13, color: "rgba(255,255,255,.75)", fontWeight: 500 }}>{f}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 60px" }}>
        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40, overflowX: "auto" }}>
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
            <div style={{ animation: "slide-up .3s ease" }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700, color: C.textPrimary, marginBottom: 24 }}>Personal Information</h2>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: C.cream2, border: `2px dashed ${C.amber}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 32 }}>👤</div>
              </div>
              <p style={{ textAlign: "center", fontSize: 12, color: C.textMuted, marginTop: -12, marginBottom: 20 }}>Click to upload profile photo</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <Input label="Full Name" value={personal.name} onChange={v => setP("name", v)} placeholder="Your full name" required />
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
                  <Input label="Date of Birth" type="date" value={personal.dob} onChange={v => setP("dob", v)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Skills */}
          {step === 2 && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700, color: C.textPrimary, marginBottom: 24 }}>Skills & Services</h2>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 10 }}>SPECIALIZATIONS <span style={{ color: C.terra }}>*</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SKILLS.map(s => (
                    <div key={s} onClick={() => setPro("skills", toggleArray(professional.skills, s))}
                      style={{ padding: "8px 16px", borderRadius: 20, border: `2px solid ${professional.skills.includes(s) ? C.amber : C.border}`, background: professional.skills.includes(s) ? "rgba(224,123,26,.1)" : C.cream, cursor: "pointer", fontSize: 13, fontWeight: 500, color: professional.skills.includes(s) ? C.amberDark : C.textSecondary, transition: "all .2s" }}>
                      {professional.skills.includes(s) ? "✓ " : ""}{s}
                    </div>
                  ))}
                </div>
                {errors.skills && <span style={{ fontSize: 12, color: C.red }}>{errors.skills}</span>}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 10 }}>VEHICLE TYPES HANDLED</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {VEHICLE_TYPES.map(v => (
                    <div key={v} onClick={() => setPro("vehicleTypes", toggleArray(professional.vehicleTypes, v))}
                      style={{ padding: "8px 16px", borderRadius: 20, border: `2px solid ${professional.vehicleTypes.includes(v) ? C.amber : C.border}`, background: professional.vehicleTypes.includes(v) ? "rgba(224,123,26,.1)" : C.cream, cursor: "pointer", fontSize: 13, fontWeight: 500, color: professional.vehicleTypes.includes(v) ? C.amberDark : C.textSecondary, transition: "all .2s" }}>
                      {professional.vehicleTypes.includes(v) ? "✓ " : ""}{v}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <Input label="Years of Experience" type="select" value={professional.experience} onChange={v => setPro("experience", v)} options={["Less than 1 year", "1–2 years", "3–5 years", "5–10 years", "10+ years"]} required />
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 8 }}>WORKSHOP TYPE</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {["mobile", "workshop"].map(t => (
                      <div key={t} onClick={() => setPro("workshopType", t)}
                        style={{ flex: 1, padding: "10px", textAlign: "center", border: `2px solid ${professional.workshopType === t ? C.amber : C.border}`, borderRadius: 8, cursor: "pointer", background: professional.workshopType === t ? "rgba(224,123,26,.1)" : C.cream, fontSize: 13, fontWeight: 500 }}>
                        {t === "mobile" ? "🛵 Mobile" : "🏪 Workshop"}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 10 }}>LANGUAGES SPOKEN</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {LANGUAGES.map(l => (
                    <div key={l} onClick={() => setPro("languages", toggleArray(professional.languages, l))}
                      style={{ padding: "6px 14px", borderRadius: 20, border: `2px solid ${professional.languages.includes(l) ? C.amber : C.border}`, background: professional.languages.includes(l) ? "rgba(224,123,26,.1)" : C.cream, cursor: "pointer", fontSize: 12, color: professional.languages.includes(l) ? C.amberDark : C.textSecondary, transition: "all .2s" }}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Documents */}
          {step === 3 && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Document Upload</h2>
              <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>All documents are encrypted and stored securely. Used only for verification.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { key: "aadhaar", label: "Aadhaar Card", icon: "🪪", required: true },
                  { key: "license", label: "Driving License", icon: "📋", required: true },
                  { key: "certification", label: "Mechanic Certification", icon: "🏅", required: false },
                  { key: "selfie", label: "Profile Selfie", icon: "🤳", required: true },
                ].map(doc => (
                  <div key={doc.key} onClick={() => setD(doc.key as any, "uploaded")}
                    className="upload-zone" style={{ background: docs[doc.key as keyof typeof docs] ? "rgba(45,122,58,.05)" : "transparent", borderColor: docs[doc.key as keyof typeof docs] ? C.green : undefined }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{docs[doc.key as keyof typeof docs] ? "✅" : doc.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: docs[doc.key as keyof typeof docs] ? C.green : C.textSecondary }}>
                      {docs[doc.key as keyof typeof docs] ? "Uploaded!" : doc.label}
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                      {docs[doc.key as keyof typeof docs] ? "Click to replace" : `Click to upload${doc.required ? " (Required)" : " (Optional)"}`}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: 14, background: C.cream2, borderRadius: 10, fontSize: 13, color: C.textSecondary }}>
                💡 Demo mode: Click each box to simulate document upload
              </div>
            </div>
          )}

          {/* STEP 4: Bank */}
          {step === 4 && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Bank Details</h2>
              <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>Your earnings will be transferred to this account daily.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Input label="Account Holder Name" value={bank.accountName} onChange={v => setB("accountName", v)} placeholder="Name as per bank records" required />
                {errors.accountName && <span style={{ fontSize: 12, color: C.red }}>{errors.accountName}</span>}
                <Input label="Account Number" value={bank.accountNumber} onChange={v => setB("accountNumber", v)} placeholder="Enter account number" required />
                {errors.accountNumber && <span style={{ fontSize: 12, color: C.red }}>{errors.accountNumber}</span>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <Input label="IFSC Code" value={bank.ifsc} onChange={v => setB("ifsc", v.toUpperCase())} placeholder="e.g. SBIN0001234" required />
                    {errors.ifsc && <span style={{ fontSize: 12, color: C.red }}>{errors.ifsc}</span>}
                  </div>
                  <Input label="UPI ID (Optional)" value={bank.upi} onChange={v => setB("upi", v)} placeholder="yourname@upi" />
                </div>
                <div style={{ padding: 14, background: "rgba(45,122,58,.08)", border: `1px solid ${C.green}`, borderRadius: 10, fontSize: 13, color: C.green }}>
                  🔒 Your bank details are encrypted with 256-bit SSL. We never share your financial information.
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Location & Availability */}
          {step === 5 && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700, color: C.textPrimary, marginBottom: 24 }}>Location & Availability</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div style={{ gridColumn: "1/-1" }}>
                  <Input label="Workshop / Home Address" value={location.address} onChange={v => setL("address", v)} placeholder="Full address" />
                </div>
                <div>
                  <Input label="City" value={location.city} onChange={v => setL("city", v)} placeholder="Your city" required />
                  {errors.city && <span style={{ fontSize: 12, color: C.red }}>{errors.city}</span>}
                </div>
                <div>
                  <Input label="State" type="select" value={location.state} onChange={v => setL("state", v)} options={STATES} required />
                  {errors.state && <span style={{ fontSize: 12, color: C.red }}>{errors.state}</span>}
                </div>
                <Input label="Pin Code" value={location.pin} onChange={v => setL("pin", v)} placeholder="6-digit pin code" />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 12 }}>WORKING DAYS</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const).map(day => (
                    <div key={day} onClick={() => setAv(day, !availability[day])}
                      style={{ flex: 1, padding: "10px 4px", textAlign: "center", border: `2px solid ${availability[day] ? C.amber : C.border}`, borderRadius: 8, cursor: "pointer", background: availability[day] ? "rgba(224,123,26,.1)" : C.cream, fontSize: 12, fontWeight: 600, color: availability[day] ? C.amberDark : C.textMuted, transition: "all .2s", textTransform: "capitalize" }}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Start Time" type="time" value={availability.startTime} onChange={v => setAv("startTime", v)} />
                <Input label="End Time" type="time" value={availability.endTime} onChange={v => setAv("endTime", v)} />
              </div>
            </div>
          )}

          {/* STEP 6: Review */}
          {step === 6 && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 26, fontWeight: 700, color: C.textPrimary, marginBottom: 24 }}>Review & Submit</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Name", val: personal.name || "—" },
                  { label: "Phone", val: personal.phone || "—" },
                  { label: "Email", val: personal.email || "—" },
                  { label: "Experience", val: professional.experience || "—" },
                  { label: "Skills", val: professional.skills.join(", ") || "—" },
                  { label: "City", val: location.city || "—" },
                  { label: "Bank Account", val: bank.accountNumber ? "****" + bank.accountNumber.slice(-4) : "—" },
                ].map(f => (
                  <div key={f.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13, color: C.textMuted }}>{f.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{f.val}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 13, color: C.textSecondary, lineHeight: 1.7 }}>
                ✅ By submitting, you agree to our <a href="#" style={{ color: C.amber }}>Terms of Service</a> and <a href="#" style={{ color: C.amber }}>Mechanic Agreement</a>. Platform commission is <strong>8%</strong> per completed job.
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            {step > 1 ? <Btn variant="secondary" onClick={() => setStep(s => s - 1)}>← Back</Btn> : <div />}
            {step < 6
              ? <Btn onClick={handleNext}>Continue →</Btn>
              : <Btn onClick={handleSubmit} disabled={loading} style={{ minWidth: 180, justifyContent: "center" }}>
                  {loading ? "⏳ Submitting..." : "🚀 Submit Application"}
                </Btn>
            }
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: C.textMuted, marginTop: 16 }}>
            Already registered? <a href="/login" style={{ color: C.amber, fontWeight: 600 }}>Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}