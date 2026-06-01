"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { C, Card } from "@/components/ui";

export default function ServicesPage() {
  const router = useRouter();

  const services = [
    { icon: "🔩", title: "Puncture Repair", price: "From ₹149", time: "15–30 min", desc: "On-spot tyre puncture repair anywhere. We carry all tyre sizes and tools. Tubeless and tube repairs both available.", features: ["All tyre types", "On-spot repair", "Sealant included", "Wheel balancing"] },
    { icon: "🔋", title: "Battery Jump Start", price: "From ₹199", time: "10–20 min", desc: "Dead battery? Our mechanics carry jump packs and replacement batteries for all vehicle types.", features: ["Jump start service", "Battery testing", "Battery replacement", "Alternator check"] },
    { icon: "⚙️", title: "Engine Repair", price: "From ₹499", time: "30–120 min", desc: "Certified engine specialists for complex issues. From overheating to timing belt failures.", features: ["Diagnosis included", "Certified mechanics", "Spare parts sourced", "Warranty on repair"] },
    { icon: "⛽", title: "Fuel Delivery", price: "From ₹99", time: "10–20 min", desc: "Ran out of petrol, diesel, or CNG? We deliver emergency fuel to your exact location.", features: ["Petrol & Diesel", "CNG available", "Any quantity", "Quick delivery"] },
    { icon: "🚗", title: "Towing Service", price: "From ₹799", time: "20–40 min", desc: "Safe flatbed towing to nearest workshop or location of your choice, anywhere in the city.", features: ["Flatbed truck", "All vehicle types", "GPS tracked", "Workshop tie-ups"] },
    { icon: "❄️", title: "AC Repair", price: "From ₹399", time: "30–90 min", desc: "AC not cooling? Our technicians diagnose gas leaks, compressor issues, and more on-spot.", features: ["Gas refill", "Leak detection", "Compressor check", "Filter cleaning"] },
    { icon: "⚡", title: "EV Specialist", price: "From ₹299", time: "20–60 min", desc: "Certified EV mechanics for electric scooters, cars, and bikes. Battery and charging system experts.", features: ["EV certified", "Battery diagnostics", "Charging port repair", "Software update"] },
    { icon: "🔓", title: "Lockout Assist", price: "From ₹249", time: "15–30 min", desc: "Locked your keys inside? Our trained locksmiths open your vehicle safely without damage.", features: ["No damage entry", "All car models", "Key duplication", "Lock replacement"] },
    { icon: "🔌", title: "Electrical Repair", price: "From ₹349", time: "30–90 min", desc: "Wiring issues, fuse problems, sensor faults — our electrical specialists fix it on the spot.", features: ["Wiring repair", "Fuse replacement", "Sensor diagnosis", "ECU check"] },
    { icon: "🛑", title: "Brake Service", price: "From ₹449", time: "30–60 min", desc: "Brake failure is dangerous. Get immediate brake pad, disc, and fluid service on-spot.", features: ["Brake pad check", "Disc inspection", "Fluid top-up", "Emergency fix"] },
    { icon: "🛞", title: "Wheel Alignment", price: "From ₹299", time: "20–40 min", desc: "Pulling to one side? Our mechanics carry portable alignment tools for on-spot service.", features: ["Toe adjustment", "Steering check", "Tyre rotation", "Balance check"] },
    { icon: "🧰", title: "General Repair", price: "From ₹199", time: "Varies", desc: "Anything else? Our general mechanics can handle most on-road issues and minor repairs.", features: ["On-spot diagnosis", "Wide skill set", "Quick turnaround", "Honest pricing"] },
  ];

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${C.cream2}, ${C.cream})`, padding: "120px 60px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 3, color: C.amber, display: "block", marginBottom: 12 }}>WHAT WE OFFER</span>
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 52, fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>
            Every breakdown, <span style={{ color: C.amber }}>covered</span>
          </h1>
          <p style={{ fontSize: 17, color: C.textSecondary, lineHeight: 1.7 }}>
            12 specialised services. 2,800+ verified mechanics. Available 24/7 across 40+ cities. Transparent pricing, no hidden charges.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section style={{ padding: "60px", background: C.white }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {services.map((s, i) => (
              <Card key={i} style={{ transition: "all .2s" }} onClick={() => router.push("/register")}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(224,123,26,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 19, fontWeight: 600, color: C.textPrimary }}>{s.title}</div>
                    <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.amber }}>{s.price}</span>
                      <span style={{ fontSize: 12, color: C.textMuted }}>⏱ {s.time}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, marginBottom: 14 }}>{s.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {s.features.map(f => (
                    <span key={f} style={{ padding: "3px 10px", background: C.cream2, borderRadius: 20, fontSize: 11, color: C.textSecondary }}>✓ {f}</span>
                  ))}
                </div>
                <button onClick={() => router.push("/register")} style={{ width: "100%", padding: "10px", background: C.amber, color: "white", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: 1 }}>
                  BOOK NOW →
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section style={{ padding: "60px", background: C.cream2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 36, fontWeight: 700, color: C.textPrimary, marginBottom: 16 }}>
            Transparent Pricing, <span style={{ color: C.amber }}>Always</span>
          </h2>
          <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.7, marginBottom: 40 }}>
            You see the price estimate before confirming. No surprise charges. A detailed invoice is generated after every job.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { icon: "💰", title: "Upfront Estimate", desc: "See price range before booking" },
              { icon: "🧾", title: "Detailed Invoice", desc: "Labour + parts breakdown always" },
              { icon: "🔒", title: "No Hidden Charges", desc: "What you see is what you pay" },
            ].map((f, i) => (
              <Card key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: C.textSecondary }}>{f.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px", background: C.brown, textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 40, fontWeight: 700, color: "white", marginBottom: 16 }}>Need Help Right Now?</h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", marginBottom: 32 }}>Register and get a verified mechanic in under 8 minutes</p>
        <button onClick={() => router.push("/register")} style={{ padding: "16px 40px", background: C.amber, color: "white", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
          🆘 GET HELP NOW
        </button>
      </section>
    </div>
  );
}