"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { C, Btn, Card } from "@/components/ui";
import { store } from "@/store";

const ISSUES = ["Puncture", "Battery Dead", "Engine Problem", "Fuel Empty", "Electrical Issue", "Accident Support", "Brake Failure", "AC Problem", "Locked Out", "Need Towing", "Other"];
const VEHICLE_TYPES = [
  { icon: "🏍️", label: "Bike / Scooter" },
  { icon: "🚗", label: "Car" },
  { icon: "🛺", label: "Auto Rickshaw" },
  { icon: "⚡", label: "Electric Vehicle" },
  { icon: "🚛", label: "Truck" },
];

const FAKE_MECHANICS = [
  { id: "M001", name: "Rajesh Kumar", rating: 4.9, eta: "6 min", distance: "1.2 km", skills: ["Engine", "Electrical"], price: "₹450–₹600", jobs: 234 },
  { id: "M002", name: "Suresh Babu", rating: 4.7, eta: "9 min", distance: "2.1 km", skills: ["Puncture", "Battery"], price: "₹200–₹350", jobs: 189 },
  { id: "M003", name: "Venkat Rao", rating: 4.8, eta: "11 min", distance: "2.8 km", skills: ["Towing", "General"], price: "₹300–₹500", jobs: 312 },
];

export default function CustomerRequest() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState({ vehicle: "", vehicleNum: "AP 15 AB 1234", issue: "", desc: "", location: "Nellore, Andhra Pradesh", mechanic: "" });
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [payMethod, setPayMethod] = useState("UPI");
  const [paid, setPaid] = useState(false);

  const set = (k: string, v: string) => setSelected(s => ({ ...s, [k]: v }));

  const startScan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanDone(true); }, 3000);
  };

  const steps = ["Select Vehicle", "Describe Issue", "Your Location", "Find Mechanic", "Confirm", "Track Live", "Payment", "Review"];

  const confirmBooking = () => {
    store.addBooking({
      id: "BK" + Date.now().toString().slice(-6),
      vehicleId: "v1",
      issue: selected.issue,
      status: "accepted",
      mechanic: selected.mechanic || "Rajesh Kumar",
      amount: 499,
      date: new Date().toISOString().split("T")[0],
      location: selected.location,
    });
    setStep(6);
  };

  return (
    <div style={{ background: C.cream, minHeight: "100vh", fontFamily: "'Inter',sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/customer/dashboard")} style={{ background: "none", border: "none", color: C.textSecondary, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>← Back to Dashboard</button>
        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, color: C.textPrimary }}>New Service Request</div>
        <div style={{ fontSize: 13, color: C.textMuted }}>Step {step} of {steps.length}</div>
      </div>

      {/* Step indicator */}
      <div style={{ background: C.white, padding: "12px 32px", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 0, minWidth: "max-content" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className={`step-dot ${step > i + 1 ? "done" : step === i + 1 ? "active" : "pending"}`} style={{ width: 24, height: 24, fontSize: 11 }}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: step >= i + 1 ? C.amberDark : C.textMuted, whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ width: 32, height: 2, background: step > i + 1 ? C.amber : C.border, margin: "0 8px" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px" }}>

        {/* STEP 1: Select Vehicle */}
        {step === 1 && (
          <div style={{ animation: "slide-up .3s ease" }}>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Select Vehicle Type</h2>
            <p style={{ color: C.textSecondary, marginBottom: 28 }}>What type of vehicle needs assistance?</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 }}>
              {VEHICLE_TYPES.map(v => (
                <div key={v.label} onClick={() => set("vehicle", v.label)}
                  style={{ background: selected.vehicle === v.label ? "rgba(224,123,26,.1)" : C.white, border: `2px solid ${selected.vehicle === v.label ? C.amber : C.border}`, borderRadius: 16, padding: 20, textAlign: "center", cursor: "pointer", transition: "all .2s" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{v.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{v.label}</div>
                  {selected.vehicle === v.label && <div style={{ fontSize: 11, color: C.amber, marginTop: 4, fontWeight: 700 }}>✓ Selected</div>}
                </div>
              ))}
            </div>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", letterSpacing: .5 }}>VEHICLE NUMBER</label>
              <input value={selected.vehicleNum} onChange={e => set("vehicleNum", e.target.value)}
                placeholder="e.g. AP 15 AB 1234"
                style={{ display: "block", width: "100%", marginTop: 8, padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.cream, fontFamily: "'Space Mono',monospace" }} />
            </div>
            <Btn onClick={() => selected.vehicle && setStep(2)} disabled={!selected.vehicle} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>Continue →</Btn>
          </div>
        )}

        {/* STEP 2: Issue */}
        {step === 2 && (
          <div style={{ animation: "slide-up .3s ease" }}>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>What's the Problem?</h2>
            <p style={{ color: C.textSecondary, marginBottom: 24 }}>Select the issue you're facing</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
              {ISSUES.map(issue => (
                <div key={issue} onClick={() => set("issue", issue)}
                  style={{ padding: "14px 12px", textAlign: "center", background: selected.issue === issue ? "rgba(224,123,26,.1)" : C.white, border: `2px solid ${selected.issue === issue ? C.amber : C.border}`, borderRadius: 10, cursor: "pointer", transition: "all .2s", fontSize: 13, fontWeight: 500, color: selected.issue === issue ? C.amberDark : C.textPrimary }}>
                  {issue}
                  {selected.issue === issue && <div style={{ fontSize: 11, color: C.amber, marginTop: 4 }}>✓</div>}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 8 }}>ADDITIONAL DESCRIPTION</label>
              <textarea value={selected.desc} onChange={e => set("desc", e.target.value)}
                placeholder="Describe the problem in detail... (e.g. car won't start, makes clicking sound)"
                rows={4} style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.cream, resize: "vertical" }} />
            </div>
            <div className="upload-zone" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.textSecondary }}>Upload Photos (Optional)</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Drag & drop or click to upload up to 3 photos</div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="secondary" onClick={() => setStep(1)}>← Back</Btn>
              <Btn onClick={() => selected.issue && setStep(3)} disabled={!selected.issue} style={{ flex: 1, justifyContent: "center" }}>Continue →</Btn>
            </div>
          </div>
        )}

        {/* STEP 3: Location */}
        {step === 3 && (
          <div style={{ animation: "slide-up .3s ease" }}>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Confirm Your Location</h2>
            <p style={{ color: C.textSecondary, marginBottom: 24 }}>We'll send the mechanic to this address</p>

            <div style={{ background: "#e8dcc8", borderRadius: 16, height: 260, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(224,123,26,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(224,123,26,.05) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
              <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: 48, animation: "float 2s ease-in-out infinite" }}>📍</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, color: C.brown, marginTop: 8 }}>Your Location</div>
                <div style={{ fontSize: 14, color: C.textSecondary }}>{selected.location}</div>
              </div>
            </div>

            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <input value={selected.location} onChange={e => set("location", e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.cream }} />
            </div>
            <button onClick={() => set("location", "Nellore, Andhra Pradesh (GPS)")}
              style={{ width: "100%", padding: "12px", background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, color: C.textSecondary, marginBottom: 20 }}>
              📍 Use My Current GPS Location
            </button>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="secondary" onClick={() => setStep(2)}>← Back</Btn>
              <Btn onClick={() => { setStep(4); startScan(); }} style={{ flex: 1, justifyContent: "center" }}>Find Mechanics →</Btn>
            </div>
          </div>
        )}

        {/* STEP 4: AI Matching */}
        {step === 4 && (
          <div style={{ animation: "slide-up .3s ease", textAlign: scanning ? "center" : "left" }}>
            {scanning ? (
              <div style={{ padding: "40px 0" }}>
                <div style={{ fontSize: 72, marginBottom: 24, animation: "float 1.5s ease-in-out infinite" }}>🔍</div>
                <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>Finding Mechanics...</h2>
                <p style={{ color: C.textSecondary, marginBottom: 32 }}>Scanning {14} verified mechanics nearby</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {["📡 Scanning area...", "⭐ Checking ratings...", "🕒 Calculating ETA...", "✅ Matching skills..."].map((t, i) => (
                    <span key={i} style={{ padding: "6px 14px", background: C.cream2, borderRadius: 20, fontSize: 12, color: C.textSecondary, animation: `fade-in .3s ease ${i * .3}s both` }}>{t}</span>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Mechanics Found Nearby</h2>
                <p style={{ color: C.textSecondary, marginBottom: 24 }}>3 verified mechanics available for <strong>{selected.issue}</strong></p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                  {FAKE_MECHANICS.map(m => (
                    <div key={m.id} onClick={() => set("mechanic", m.name)}
                      style={{ background: C.white, border: `2px solid ${selected.mechanic === m.name ? C.amber : C.border}`, borderRadius: 16, padding: 20, cursor: "pointer", transition: "all .2s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                          <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.cream2, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, color: C.amberDark }}>{m.name.charAt(0)}</div>
                          <div>
                            <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary }}>{m.name}</div>
                            <div style={{ fontSize: 13, color: C.amber }}>{"★".repeat(Math.round(m.rating))} {m.rating} · {m.jobs} jobs</div>
                            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                              {m.skills.map(s => <span key={s} style={{ padding: "2px 8px", background: C.cream2, borderRadius: 10, fontSize: 11, color: C.textSecondary }}>{s}</span>)}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, fontWeight: 700, color: C.green }}>{m.eta}</div>
                          <div style={{ fontSize: 12, color: C.textMuted }}>{m.distance} away</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.amberDark, marginTop: 4 }}>{m.price}</div>
                        </div>
                      </div>
                      {selected.mechanic === m.name && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
                          <span style={{ fontSize: 12, color: C.amber, fontWeight: 600 }}>✓ Selected</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <Btn variant="secondary" onClick={() => setStep(3)}>← Back</Btn>
                  <Btn onClick={() => selected.mechanic && setStep(5)} disabled={!selected.mechanic} style={{ flex: 1, justifyContent: "center" }}>Confirm Mechanic →</Btn>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 5: Confirm */}
        {step === 5 && (
          <div style={{ animation: "slide-up .3s ease" }}>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 24 }}>Confirm Booking</h2>
            <Card style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Booking Summary</h3>
              {[
                { label: "Vehicle", val: selected.vehicle + " · " + selected.vehicleNum },
                { label: "Issue", val: selected.issue },
                { label: "Location", val: selected.location },
                { label: "Mechanic", val: selected.mechanic },
                { label: "Est. Arrival", val: "8 minutes" },
                { label: "Est. Price", val: "₹350 – ₹600" },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, color: C.textMuted }}>{f.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{f.val}</span>
                </div>
              ))}
            </Card>
            <div style={{ background: "rgba(224,123,26,.08)", border: `1px solid rgba(224,123,26,.2)`, borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 13, color: C.textSecondary }}>
              ℹ️ Final price may vary based on actual repair. You'll get a detailed invoice after service completion.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="secondary" onClick={() => setStep(4)}>← Back</Btn>
              <Btn onClick={confirmBooking} style={{ flex: 1, justifyContent: "center", padding: "14px" }}>✅ Confirm Booking</Btn>
            </div>
          </div>
        )}

        {/* STEP 6: Track */}
        {step === 6 && (
          <div style={{ animation: "slide-up .3s ease", textAlign: "center" }}>
            <div style={{ background: C.greenBg, border: `1px solid ${C.green}`, borderRadius: 20, padding: 32, marginBottom: 24 }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.green, marginBottom: 8 }}>Booking Confirmed!</h2>
              <p style={{ fontSize: 15, color: C.textSecondary }}>Your mechanic is on the way</p>
            </div>
            <Card style={{ marginBottom: 20, textAlign: "left" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.cream2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, fontFamily: "'Oswald',sans-serif", color: C.amberDark }}>R</div>
                <div>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, color: C.textPrimary }}>{selected.mechanic}</div>
                  <div style={{ fontSize: 13, color: C.amber }}>★★★★★ 4.9 · Engine Specialist</div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.green }}>~8 min</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>ETA</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "✅ Booking Confirmed", done: true },
                  { label: "✅ Mechanic Accepted", done: true },
                  { label: "🔵 En Route", active: true },
                  { label: "○ Arrived" },
                  { label: "○ Repair Started" },
                  { label: "○ Repair Complete" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: s.active ? "rgba(224,123,26,.08)" : "transparent", borderRadius: 8, fontSize: 14, fontWeight: s.active ? 600 : 400, color: s.done || s.active ? C.textPrimary : C.textMuted }}>
                    {s.label}
                    {s.active && <span style={{ fontSize: 11, color: C.amber, fontFamily: "'Oswald',sans-serif", marginLeft: "auto" }}>CURRENT</span>}
                  </div>
                ))}
              </div>
            </Card>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ flex: 1, padding: "12px", background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>📞 Call Mechanic</button>
              <button style={{ flex: 1, padding: "12px", background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>💬 Chat</button>
              <Btn onClick={() => router.push("/customer/track")} style={{ flex: 1, justifyContent: "center" }}>📍 Live Track</Btn>
            </div>
            <button onClick={() => setStep(7)} style={{ marginTop: 16, width: "100%", padding: "12px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13, color: C.textSecondary }}>
              Skip to Payment →
            </button>
          </div>
        )}

        {/* STEP 7: Payment */}
        {step === 7 && !paid && (
          <div style={{ animation: "slide-up .3s ease" }}>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 24 }}>Payment</h2>
            <Card style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Order Summary</h3>
              {[{ label: "Labour charges", val: "₹350" }, { label: "Parts / Materials", val: "₹120" }, { label: "Platform fee (8%)", val: "₹29" }].map(f => (
                <div key={f.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, color: C.textSecondary }}>{f.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{f.val}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0" }}>
                <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700 }}>TOTAL</span>
                <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 700, color: C.amberDark }}>₹499</span>
              </div>
            </Card>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 600, color: C.textSecondary, marginBottom: 12, letterSpacing: .5 }}>SELECT PAYMENT METHOD</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[{ icon: "📱", label: "UPI" }, { icon: "💳", label: "Card" }, { icon: "🏦", label: "Net Banking" }, { icon: "💵", label: "Cash" }].map(m => (
                  <div key={m.label} onClick={() => setPayMethod(m.label)}
                    style={{ padding: "16px 12px", textAlign: "center", background: payMethod === m.label ? "rgba(224,123,26,.1)" : C.white, border: `2px solid ${payMethod === m.label ? C.amber : C.border}`, borderRadius: 12, cursor: "pointer", transition: "all .2s" }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <Btn onClick={() => { setPaid(true); setStep(8); }} style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 16 }}>
              💳 Pay ₹499 via {payMethod}
            </Btn>
          </div>
        )}

        {/* STEP 8: Review */}
        {step === 8 && (
          <div style={{ animation: "slide-up .3s ease", textAlign: "center" }}>
            <div style={{ background: C.greenBg, border: `1px solid ${C.green}`, borderRadius: 20, padding: 32, marginBottom: 24 }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 32, fontWeight: 700, color: C.green, marginBottom: 8 }}>Payment Successful!</h2>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, color: C.textSecondary }}>₹499 paid · Receipt sent to {store.getUser()?.email || "your email"}</div>
            </div>

            <Card style={{ marginBottom: 20, textAlign: "left" }}>
              <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 16, textAlign: "center" }}>Rate Your Mechanic</h3>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} onClick={() => setRating(n)} style={{ fontSize: 36, cursor: "pointer", color: n <= rating ? C.amber : C.border, transition: "all .1s" }}>★</div>
                  ))}
                </div>
                {rating > 0 && <p style={{ fontSize: 14, color: C.textSecondary, marginTop: 8 }}>{["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][rating]}</p>}
              </div>
              <textarea value={review} onChange={e => setReview(e.target.value)} placeholder="Share your experience with the mechanic..."
                rows={3} style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.cream, resize: "vertical" }} />
              <Btn onClick={() => router.push("/customer/dashboard")} disabled={rating === 0} style={{ width: "100%", justifyContent: "center", marginTop: 16, padding: "13px" }}>
                Submit Review & Finish
              </Btn>
            </Card>

            <button onClick={() => router.push("/customer/dashboard")} style={{ background: "none", border: "none", color: C.amber, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              Skip → Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}