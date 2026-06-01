"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { C } from "@/components/ui";

function StoryAnimation({ C }: { C: Record<string, string> }) {
  const [scene, setScene] = useState(0);
  const scenes = [
    { bg: "#ecdfc8", label: "Car breaks down...", labelColor: C.terra },
    { bg: "#dde8f0", label: "Opens Mechanics 24/7", labelColor: "#1a6fa8" },
    { bg: "#e0e8d8", label: "Mechanic on the way!", labelColor: "#2d7a2d" },
    { bg: "#ede0d4", label: "Mechanic fixing it...", labelColor: C.amberDark },
    { bg: "#d8eddd", label: "All good! Problem solved ✓", labelColor: "#1d7a3a" },
  ];

  useEffect(() => {
    const t = setInterval(() => setScene(s => (s + 1) % 5), 2800);
    return () => clearInterval(t);
  }, []);

  // Layout constants — road sits at y=108, vehicles sit on road, humans float above vehicles
  // Box height: 155px. Zones: label strip 0-22px, action zone 22-108px, road 108-118px, dot strip 118-130px (outside, clipped), bottom label 130-155px
  // Human emojis: top=28 (just below label strip, clear of everything)
  // Vehicles: top=62 (vertically centered between label and road)
  // Small badges: bottom=30, in corners (away from center emojis)

  const H = 152;
  const roadY = H - 40;       // 112 — road line y
  const carY = roadY - 26;    // 86  — car center y (sits on road)
  const humanY = 28;          // 28  — human emoji top (below label bar)
  const motoY = roadY - 20;   // 92  — motorbike center y

  return (
    <div style={{ borderRadius: 14, height: H, position: "relative", overflow: "hidden", marginBottom: 20, transition: "background .6s ease", background: scenes[scene].bg }}>

      {/* Sky gradient top half */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: roadY, background: "rgba(255,255,255,.18)", pointerEvents: "none" }} />

      {/* Road surface */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "rgba(92,60,20,.12)", pointerEvents: "none" }} />
      {/* Road dashes */}
      <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, height: 3, background: "repeating-linear-gradient(90deg,rgba(92,46,10,.3) 0,rgba(92,46,10,.3) 22px,transparent 22px,transparent 44px)", pointerEvents: "none" }} />

      {/* ── SCENE 0: Breakdown ── */}
      <div style={{ position: "absolute", inset: 0, opacity: scene === 0 ? 1 : 0, transition: "opacity .5s", pointerEvents: "none" }}>
        {/* Human above car */}
        <div style={{ position: "absolute", top: humanY, left: "calc(50% - 14px)", fontSize: 26, animation: scene === 0 ? "bounce-cry .6s ease-in-out infinite alternate" : "none", lineHeight: 1 }}>😰</div>
        {/* Car on road */}
        <div style={{ position: "absolute", top: carY, left: "50%", fontSize: 38, transform: "translateX(-50%)", animation: scene === 0 ? "car-shake .4s ease-in-out infinite alternate" : "none", lineHeight: 1 }}>🚗</div>
        {/* Smoke puffs above car */}
        {[0, 0.3, 0.6].map((d, i) => (
          <div key={i} style={{ position: "absolute", top: humanY - 6, left: `${47 + i * 4}%`, width: 9, height: 9, background: "rgba(120,80,40,.28)", borderRadius: "50%", animation: scene === 0 ? `smoke-puff 1.1s ease-out ${d}s infinite` : "none" }} />
        ))}
        {/* SOS badge — bottom right corner */}
        <div style={{ position: "absolute", bottom: 8, right: 14, background: C.terra, color: "white", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, fontFamily: "'Oswald',sans-serif", letterSpacing: .3, animation: "sos-pulse 1s infinite" }}>SOS</div>
      </div>

      {/* ── SCENE 1: Opens app ── */}
      <div style={{ position: "absolute", inset: 0, opacity: scene === 1 ? 1 : 0, transition: "opacity .5s", pointerEvents: "none" }}>
        {/* Human holding phone */}
        <div style={{ position: "absolute", top: humanY, left: "calc(35% - 14px)", fontSize: 26, lineHeight: 1 }}>🧍</div>
        {/* Car */}
        <div style={{ position: "absolute", top: carY, left: "35%", fontSize: 36, transform: "translateX(-50%)", lineHeight: 1 }}>🚗</div>
        {/* Phone app card floating right */}
        <div style={{ position: "absolute", top: humanY + 2, left: "58%", background: "white", borderRadius: 8, padding: "5px 9px", boxShadow: "0 3px 10px rgba(0,0,0,.13)", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 16 }}>📱</span>
          <div>
            <div style={{ fontSize: 8, fontFamily: "'Oswald',sans-serif", fontWeight: 700, color: C.amberDark, letterSpacing: .5, lineHeight: 1.2 }}>MECHANICS</div>
            <div style={{ fontSize: 8, fontFamily: "'Oswald',sans-serif", fontWeight: 700, color: C.amberDark, letterSpacing: .5, lineHeight: 1.2 }}>24/7</div>
          </div>
        </div>
        {/* Location pin on road */}
        <div style={{ position: "absolute", top: carY - 4, left: "calc(35% + 18px)", fontSize: 16, animation: "ping-dot 1s ease-in-out infinite", lineHeight: 1 }}>📍</div>
        {/* Sent badge */}
        <div style={{ position: "absolute", bottom: 8, right: 12, background: "#1a6fa8", color: "white", borderRadius: 6, padding: "3px 8px", fontSize: 9, fontFamily: "'Oswald',sans-serif", fontWeight: 600, letterSpacing: .4 }}>SOS SENT ✓</div>
      </div>

      {/* ── SCENE 2: Mechanic riding ── */}
      <div style={{ position: "absolute", inset: 0, opacity: scene === 2 ? 1 : 0, transition: "opacity .5s", pointerEvents: "none" }}>
        {/* Mechanic human on left */}
        <div style={{ position: "absolute", top: humanY, left: "calc(18% - 10px)", fontSize: 24, lineHeight: 1 }}>👨‍🔧</div>
        {/* Motorbike */}
        <div style={{ position: "absolute", top: motoY, left: "18%", fontSize: 28, transform: "translateX(-50%)", animation: "moto-ride .35s ease-in-out infinite alternate", lineHeight: 1 }}>🏍️</div>
        {/* Driver human on right */}
        <div style={{ position: "absolute", top: humanY, left: "calc(72% - 10px)", fontSize: 24, lineHeight: 1 }}>🧍</div>
        {/* Stranded car */}
        <div style={{ position: "absolute", top: carY, left: "72%", fontSize: 34, transform: "translateX(-50%)", lineHeight: 1 }}>🚗</div>
        {/* Dashed route */}
        <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width="100%" height={H}>
          <line x1="30%" y1={roadY - 10} x2="62%" y2={roadY - 10} stroke="rgba(45,122,45,.45)" strokeWidth="1.5" strokeDasharray="7 5" />
          <polygon points="0,-5 10,0 0,5" fill="rgba(45,122,45,.6)" transform={`translate(calc(62% * 1), ${roadY - 10}) rotate(0)`} />
        </svg>
        {/* ETA badge */}
        <div style={{ position: "absolute", bottom: 8, right: 12, background: "#2d7a2d", color: "white", borderRadius: 6, padding: "3px 8px", fontSize: 9, fontFamily: "'Oswald',sans-serif", fontWeight: 600, letterSpacing: .4 }}>⚡ ETA 8 MIN</div>
      </div>

      {/* ── SCENE 3: Repairing ── */}
      <div style={{ position: "absolute", inset: 0, opacity: scene === 3 ? 1 : 0, transition: "opacity .5s", pointerEvents: "none" }}>
        {/* Mechanic human left */}
        <div style={{ position: "absolute", top: humanY, left: "calc(28% - 14px)", fontSize: 26, lineHeight: 1 }}>👨‍🔧</div>
        {/* Driver human right — relieved face */}
        <div style={{ position: "absolute", top: humanY, left: "calc(62% - 10px)", fontSize: 24, lineHeight: 1 }}>😮</div>
        {/* Car */}
        <div style={{ position: "absolute", top: carY, left: "58%", fontSize: 36, transform: "translateX(-50%)", lineHeight: 1 }}>🚗</div>
        {/* Motorbike parked left */}
        <div style={{ position: "absolute", top: motoY, left: "20%", fontSize: 26, transform: "translateX(-50%)", lineHeight: 1 }}>🏍️</div>
        {/* Wrench spinning between them */}
        <div style={{ position: "absolute", top: carY + 4, left: "42%", fontSize: 22, transform: "translateX(-50%)", animation: "wrench-spin .5s linear infinite", lineHeight: 1 }}>🔧</div>
        {/* Repairing badge */}
        <div style={{ position: "absolute", bottom: 8, right: 12, background: C.amberDark, color: "white", borderRadius: 6, padding: "3px 8px", fontSize: 9, fontFamily: "'Oswald',sans-serif", fontWeight: 600, letterSpacing: .4 }}>🔧 REPAIRING...</div>
      </div>

      {/* ── SCENE 4: Both happy ── */}
      <div style={{ position: "absolute", inset: 0, opacity: scene === 4 ? 1 : 0, transition: "opacity .5s", pointerEvents: "none" }}>
        {/* Mechanic happy left */}
        <div style={{ position: "absolute", top: humanY, left: "calc(24% - 14px)", fontSize: 26, animation: scene === 4 ? "happy-bounce .55s ease-in-out .1s infinite alternate" : "none", lineHeight: 1 }}>😄</div>
        {/* Driver happy right */}
        <div style={{ position: "absolute", top: humanY, left: "calc(64% - 10px)", fontSize: 26, animation: scene === 4 ? "happy-bounce .55s ease-in-out .2s infinite alternate" : "none", lineHeight: 1 }}>😄</div>
        {/* Car bouncing */}
        <div style={{ position: "absolute", top: carY, left: "55%", fontSize: 36, transform: "translateX(-50%)", animation: scene === 4 ? "happy-bounce .55s ease-in-out infinite alternate" : "none", lineHeight: 1 }}>🚗</div>
        {/* Motorbike */}
        <div style={{ position: "absolute", top: motoY, left: "20%", fontSize: 26, transform: "translateX(-50%)", lineHeight: 1 }}>🏍️</div>
        {/* Stars burst from center top */}
        {(["⭐","⭐","⭐","⭐","⭐"] as string[]).map((s, i) => (
          <div key={i} style={{ position: "absolute", top: humanY - 4, left: `${30 + i * 10}%`, fontSize: 14, animation: scene === 4 ? `star-pop .4s ease-out ${i * .08}s both` : "none", lineHeight: 1 }}>{s}</div>
        ))}
        {/* Complete badge */}
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", background: "#1d7a3a", color: "white", borderRadius: 6, padding: "3px 14px", fontSize: 9, fontFamily: "'Oswald',sans-serif", fontWeight: 600, letterSpacing: .4, whiteSpace: "nowrap" }}>✓ REPAIR COMPLETE</div>
      </div>

      {/* ── Label strip — BOTTOM, above dots ── */}
      <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", fontFamily: "'Oswald',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1.2, color: scenes[scene].labelColor, transition: "color .5s", pointerEvents: "none" }}>
        {scenes[scene].label.toUpperCase()}
      </div>

      {/* ── Progress dots — very bottom ── */}
      <div style={{ position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, pointerEvents: "none" }}>
        {scenes.map((_, i) => (
          <div key={i} style={{ width: i === scene ? 14 : 4, height: 4, borderRadius: 2, background: i === scene ? C.amberDark : "rgba(92,46,10,.2)", transition: "all .4s" }} />
        ))}
      </div>

    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [counts, setCounts] = useState({ jobs: 0, mechanics: 0, cities: 0, rating: 0 });
  const [heroVisible, setHeroVisible] = useState(false);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    setHeroVisible(true);
    const targets = { jobs: 50000, mechanics: 2800, cities: 40, rating: 49 };
    const duration = 2200;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts({
        jobs: Math.floor(ease * targets.jobs),
        mechanics: Math.floor(ease * targets.mechanics),
        cities: Math.floor(ease * targets.cities),
        rating: Math.floor(ease * targets.rating),
      });
      if (progress >= 1) clearInterval(timer);
    }, 16);

    // Scroll reveal
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    return () => { clearInterval(timer); observer.disconnect(); };
  }, []);

  const services = [
    { icon: "🔩", title: "Puncture Repair", price: "From ₹149", desc: "On-spot tyre repair anywhere, anytime" },
    { icon: "🔋", title: "Battery Jump Start", price: "From ₹199", desc: "Dead battery? Back in 10 minutes" },
    { icon: "⚙️", title: "Engine Repair", price: "From ₹499", desc: "Certified engine specialists" },
    { icon: "⛽", title: "Fuel Delivery", price: "From ₹99", desc: "Emergency petrol delivery" },
    { icon: "🚗", title: "Towing Service", price: "From ₹799", desc: "Safe flatbed towing" },
    { icon: "❄️", title: "AC Repair", price: "From ₹399", desc: "Cooling system diagnosis" },
    { icon: "⚡", title: "EV Specialist", price: "From ₹299", desc: "Electric vehicle experts" },
    { icon: "🔓", title: "Lockout Assist", price: "From ₹249", desc: "Locked keys? We'll help" },
  ];

  const steps = [
    { icon: "📱", num: "01", title: "Open & SOS", desc: "Tap the SOS button or choose a service type" },
    { icon: "📍", num: "02", title: "Share Location", desc: "GPS auto-detects your exact position" },
    { icon: "🤖", num: "03", title: "AI Matching", desc: "Best nearby mechanic found instantly" },
    { icon: "🛵", num: "04", title: "Live Tracking", desc: "Track mechanic in real-time on map" },
    { icon: "🔧", num: "05", title: "Get Fixed", desc: "Transparent pricing, no surprises" },
    { icon: "💳", num: "06", title: "Pay & Rate", desc: "UPI, card or cash — then review" },
  ];

  const testimonials = [
    { name: "Priya Sharma", loc: "Hyderabad", text: "My car died at 2AM on the highway. Mechanics 24/7 had someone there in 9 minutes. I cried with relief!", stars: 5, init: "PS" },
    { name: "Rajan Kumar", loc: "Chennai", text: "As a delivery driver this app saved me 6 times this year. Mechanics are pros, pricing always fair.", stars: 5, init: "RK" },
    { name: "Mohammed Rafiq", loc: "Mechanic, Bangalore", text: "Joined 8 months ago. Now I earn more than my old garage and work my own hours. Amazing platform!", stars: 5, init: "MR" },
    { name: "Sneha Reddy", loc: "Nellore", text: "Puncture at midnight on a lonely road. The mechanic arrived in 7 minutes. Absolute lifesaver!", stars: 5, init: "SR" },
  ];

  return (
    <div style={{ background: C.cream, overflowX: "hidden" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden", background: `linear-gradient(160deg, ${C.cream} 0%, ${C.cream2} 60%, #f0dbb8 100%)` }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(224,123,26,.08) 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, rgba(194,74,26,.06) 0%, transparent 70%)`, pointerEvents: "none" }} />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, opacity: .025, backgroundImage: `linear-gradient(${C.amber} 1px,transparent 1px),linear-gradient(90deg,${C.amber} 1px,transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 60px 80px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative", zIndex: 2 }}>
          {/* Left */}
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(40px)", transition: "all .8s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(224,123,26,.1)", border: `1px solid rgba(224,123,26,.25)`, borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
              <span style={{ width: 7, height: 7, background: C.green, borderRadius: "50%", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
              <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, color: C.amberDark, letterSpacing: 1.5 }}>LIVE IN 40+ CITIES ACROSS INDIA</span>
            </div>

            <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 72, fontWeight: 700, lineHeight: .92, color: C.textPrimary, letterSpacing: -2, marginBottom: 28 }}>
              BREAKDOWN?<br />
              <span style={{ color: C.amber }}>
                MECHANIC
              </span><br />
              <span style={{ color: C.terra }}>IN 8 MIN.</span>
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.7, color: C.textSecondary, marginBottom: 40, maxWidth: 480 }}>
              India's most trusted on-demand roadside assistance. <strong style={{ color: C.textPrimary }}>Verified mechanics</strong>, transparent pricing, live GPS tracking — available 24/7.
            </p>

            <div style={{ display: "flex", gap: 14, marginBottom: 48, flexWrap: "wrap" }}>
              <button onClick={() => router.push("/register")}
                style={{ padding: "15px 36px", background: `linear-gradient(135deg, ${C.amber}, ${C.orange})`, color: "white", border: "none", borderRadius: 10, fontFamily: "'Oswald',sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: 1.5, cursor: "pointer", boxShadow: `0 8px 24px rgba(224,123,26,.35)`, transition: "all .25s", display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}>
                🆘 GET HELP NOW
              </button>
              <button onClick={() => router.push("/become-mechanic")}
                style={{ padding: "14px 32px", background: "transparent", color: C.amberDark, border: `2px solid ${C.amber}`, borderRadius: 10, fontFamily: "'Oswald',sans-serif", fontSize: 17, fontWeight: 600, letterSpacing: 1.5, cursor: "pointer", transition: "all .25s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(224,123,26,.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                BECOME A MECHANIC →
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 32, paddingTop: 32, borderTop: `1px solid rgba(224,123,26,.15)` }}>
              {[
                { val: counts.jobs.toLocaleString("en-IN") + "+", label: "JOBS DONE" },
                { val: counts.mechanics.toLocaleString("en-IN") + "+", label: "MECHANICS" },
                { val: counts.cities + "+", label: "CITIES" },
                { val: (counts.rating / 10).toFixed(1) + "★", label: "RATING" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 30, fontWeight: 700, color: C.amberDark, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 1, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — hero card */}
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(40px)", transition: "all .9s ease .2s" }}>
            <div style={{ background: C.white, border: `1px solid rgba(224,123,26,.15)`, borderRadius: 24, padding: 32, boxShadow: "0 32px 80px rgba(92,46,10,.12)", position: "relative" }}>
              {/* Pulse ring */}
              <div style={{ position: "absolute", top: -3, right: -3, width: 16, height: 16, borderRadius: "50%", background: C.green, border: "3px solid white", zIndex: 3 }} />

              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>🚨</span> Request Emergency Help
              </div>

              {/* Story animation — 5 scenes, 2.5s each, 12.5s loop */}
              <StoryAnimation C={C} />

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                <input placeholder="📍 Your location (auto-detected)" readOnly
                  style={{ padding: "11px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.cream, width: "100%", cursor: "pointer" }} />
                <select style={{ padding: "11px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.cream, width: "100%" }}>
                  <option>🔩 Puncture Repair</option>
                  <option>🔋 Battery Dead</option>
                  <option>⚙️ Engine Problem</option>
                  <option>⛽ Fuel Empty</option>
                  <option>🔓 Locked Out</option>
                  <option>🚗 Need Towing</option>
                </select>
              </div>

              <button onClick={() => router.push("/register")}
                style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${C.terra}, ${C.orange})`, color: "white", border: "none", borderRadius: 10, fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: 2, cursor: "pointer", boxShadow: `0 6px 20px rgba(194,74,26,.3)`, marginBottom: 12 }}>
                🆘 FIND MECHANIC NOW
              </button>

              <p style={{ fontSize: 12, color: C.textMuted, textAlign: "center", marginBottom: 16 }}>
                Register free · Average arrival <strong style={{ color: C.amberDark }}>8 minutes</strong>
              </p>

              {/* Quick chips */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["🔩 Puncture", "🔋 Battery", "⚙️ Engine", "⛽ Fuel", "🚗 Tow"].map(s => (
                  <span key={s} onClick={() => router.push("/register")}
                    style={{ padding: "5px 12px", background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 20, fontSize: 12, cursor: "pointer", fontWeight: 500, transition: "all .2s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = C.amber}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = C.border}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Live indicator */}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12, color: C.textMuted }}>
                <span style={{ width: 8, height: 8, background: C.green, borderRadius: "50%", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
                <span><strong style={{ color: C.green }}>47 mechanics</strong> available near Nellore right now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────── */}
      <section style={{ background: C.brown, padding: "20px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 40, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          {["🏆 India's #1 Roadside App", "✅ 50,000+ Jobs Done", "🔒 100% Verified Mechanics", "⚡ Avg 8 Min Response", "💳 Secure Payments", "📱 Available 24/7"].map(t => (
            <div key={t} style={{ fontSize: 13, color: "rgba(255,255,255,.7)", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>{t}</div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section style={{ padding: "100px 60px", background: C.white }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }} className="reveal">
            <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 3, color: C.amber, display: "block", marginBottom: 10 }}>HOW IT WORKS</span>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 48, fontWeight: 700, color: C.textPrimary, marginBottom: 14 }}>
              From breakdown to <span style={{ color: C.amber }}>fixed</span> in minutes
            </h2>
            <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 480, margin: "0 auto" }}>6 simple steps. No stress. No waiting. No hidden charges.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ background: C.cream, borderRadius: 20, padding: "32px 28px", position: "relative", overflow: "hidden", transition: "all .3s", cursor: "default" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(92,46,10,.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div style={{ position: "absolute", top: 16, right: 20, fontFamily: "'Oswald',sans-serif", fontSize: 56, fontWeight: 700, color: "rgba(224,123,26,.08)", lineHeight: 1 }}>{s.num}</div>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, rgba(224,123,26,.15), rgba(194,74,26,.1))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 600, color: C.textPrimary, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>{s.desc}</div>
                {i < steps.length - 1 && i % 3 !== 2 && (
                  <div style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", color: C.amber, fontSize: 20, zIndex: 2 }}>→</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button onClick={() => router.push("/register")}
              style={{ padding: "15px 40px", background: `linear-gradient(135deg, ${C.amber}, ${C.orange})`, color: "white", border: "none", borderRadius: 10, fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, letterSpacing: 1, cursor: "pointer", boxShadow: `0 8px 24px rgba(224,123,26,.3)` }}>
              GET STARTED FREE →
            </button>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section style={{ padding: "100px 60px", background: C.cream }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 3, color: C.amber, display: "block", marginBottom: 10 }}>OUR SERVICES</span>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 48, fontWeight: 700, color: C.textPrimary, marginBottom: 14 }}>Every breakdown, <span style={{ color: C.amber }}>covered</span></h2>
            <p style={{ fontSize: 16, color: C.textSecondary }}>12 specialised services · Transparent pricing · Available 24/7</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {services.map((s, i) => (
              <div key={i} onClick={() => router.push("/services")}
                style={{ background: C.white, border: `1.5px solid ${activeService === i ? C.amber : C.border}`, borderRadius: 18, padding: "24px 20px", cursor: "pointer", transition: "all .25s", position: "relative", overflow: "hidden" }}
                onMouseEnter={() => setActiveService(i)}
                onMouseLeave={() => setActiveService(-1)}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.amber}, ${C.terra})`, transform: activeService === i ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform .3s" }} />
                <div style={{ width: 52, height: 52, borderRadius: 14, background: activeService === i ? `rgba(224,123,26,.15)` : C.cream2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 14, transition: "all .2s" }}>{s.icon}</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10, lineHeight: 1.4 }}>{s.desc}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.amber, fontFamily: "'Oswald',sans-serif" }}>{s.price}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 36 }}>
            <button onClick={() => router.push("/services")}
              style={{ padding: "12px 32px", background: "transparent", border: `2px solid ${C.amber}`, borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 600, color: C.amberDark, cursor: "pointer", letterSpacing: .5, transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.amber; (e.currentTarget as HTMLElement).style.color = "white"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = C.amberDark; }}>
              VIEW ALL 12 SERVICES →
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section style={{ padding: "80px 60px", background: C.brown, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 20% 50%, rgba(224,123,26,.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(194,74,26,.08) 0%, transparent 50%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, background: "rgba(255,255,255,.05)", borderRadius: 20, overflow: "hidden" }}>
            {[
              { val: "50,000+", label: "Jobs Completed", icon: "✅", sub: "Since 2022" },
              { val: "2,800+", label: "Verified Mechanics", icon: "🔧", sub: "Across India" },
              { val: "40+", label: "Cities Live", icon: "📍", sub: "And growing" },
              { val: "< 8 min", label: "Avg Response", icon: "⚡", sub: "Industry best" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "44px 32px", textAlign: "center", background: "rgba(255,255,255,.03)", transition: "background .2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.07)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.03)"}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 48, fontWeight: 700, color: "#f59e2a", lineHeight: 1, marginBottom: 8 }}>{s.val}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,.7)", fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR MECHANICS ────────────────────────────────────── */}
      <section style={{ padding: "100px 60px", background: C.white }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 3, color: C.amber, display: "block", marginBottom: 12 }}>FOR MECHANICS</span>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 44, fontWeight: 700, color: C.textPrimary, marginBottom: 16, lineHeight: 1.05 }}>
              Earn ₹40,000+/month on your <span style={{ color: C.amber }}>own schedule</span>
            </h2>
            <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.8, marginBottom: 32 }}>
              Join 2,800+ mechanics earning on their own terms. Set your own hours, service area, and availability.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
              {[
                { icon: "✅", text: "Verified & trusted platform — customers come to you" },
                { icon: "💰", text: "Daily earnings, no payment delays ever" },
                { icon: "📊", text: "Only 8% platform commission — you keep 92%" },
                { icon: "📱", text: "Simple app — accept jobs with one tap" },
                { icon: "🎓", text: "Free training and certification support" },
              ].map(f => (
                <div key={f.text} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
                  <span style={{ fontSize: 15, color: C.textSecondary }}>{f.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => router.push("/become-mechanic")}
              style={{ padding: "15px 36px", background: `linear-gradient(135deg, ${C.amber}, ${C.orange})`, color: "white", border: "none", borderRadius: 10, fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, letterSpacing: 1, cursor: "pointer", boxShadow: `0 8px 24px rgba(224,123,26,.3)` }}>
              JOIN AS MECHANIC →
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Monthly Average", val: "₹42,000", icon: "💰", color: C.amber, sub: "Top earners get ₹60K+" },
              { label: "Jobs Per Day", val: "8–12", icon: "🔧", color: C.orange, sub: "Flexible, your choice" },
              { label: "Platform Fee", val: "8% only", icon: "📊", color: C.terra, sub: "Lowest in industry" },
              { label: "Avg Rating", val: "4.8 ★", icon: "⭐", color: C.amberDark, sub: "Across all mechanics" },
            ].map((m, i) => (
              <div key={i} style={{ background: C.cream, borderRadius: 18, padding: "24px 20px", borderLeft: `4px solid ${m.color}`, transition: "all .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(92,46,10,.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.amberDark, marginBottom: 4 }}>{m.val}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section style={{ padding: "100px 60px", background: C.cream2 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 3, color: C.amber, display: "block", marginBottom: 10 }}>TESTIMONIALS</span>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 48, fontWeight: 700, color: C.textPrimary }}>Real stories, <span style={{ color: C.amber }}>real people</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 28, transition: "all .3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px) rotate(.5deg)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px rgba(92,46,10,.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0) rotate(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div style={{ color: C.amber, fontSize: 20, marginBottom: 14, letterSpacing: 2 }}>{"★".repeat(t.stars)}</div>
                <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${C.amber}, ${C.terra})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 700, color: "white" }}>{t.init}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.textPrimary }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDERS ─────────────────────────────────────────── */}
      <section style={{ padding: "80px 60px", background: C.white }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 3, color: C.amber, display: "block", marginBottom: 10 }}>BUILT BY</span>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 40, fontWeight: 700, color: C.textPrimary, marginBottom: 40 }}>The <span style={{ color: C.amber }}>founders</span> behind the wrench</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { name: "K. Sai Charan", role: "CEO & Co-Founder", init: "SC", bio: "Visionary behind Mechanics 24/7, passionate about solving real problems for every Indian driver" },
              { name: "K. Balamuralikrishna", role: "Co-Founder & CTO", init: "BK", bio: "Tech leader driving the platform's innovation, architecture and product vision" },
            ].map((f, i) => (
              <div key={i} style={{ background: C.cream, borderRadius: 20, padding: 32, textAlign: "center", transition: "all .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(92,46,10,.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: `linear-gradient(135deg, ${C.amber}, ${C.terra})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontSize: 30, fontWeight: 700, color: "white", margin: "0 auto 16px", boxShadow: `0 8px 24px rgba(224,123,26,.3)` }}>{f.init}</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{f.name}</div>
                <div style={{ fontSize: 13, color: C.amber, fontWeight: 600, marginBottom: 10, fontFamily: "'Oswald',sans-serif" }}>{f.role}</div>
                <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>{f.bio}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ padding: "100px 60px", background: C.terra, textAlign: "center", position: "relative", overflow: "hidden" }}>
        {[200, 400, 600].map((size, i) => (
          <div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: size, height: size, borderRadius: "50%", border: "1px solid rgba(255,255,255,.08)", animation: `sos-ring 3s ease-out ${i * .9}s infinite`, pointerEvents: "none" }} />
        ))}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🚨</div>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 56, fontWeight: 700, color: "white", marginBottom: 16, lineHeight: 1 }}>STRANDED RIGHT NOW?</h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.8)", marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>Verified help is under 8 minutes away. Don't wait.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/register")}
              style={{ padding: "18px 48px", background: "white", color: C.terra, border: "none", borderRadius: 100, fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: 2, cursor: "pointer", boxShadow: "0 8px 32px rgba(0,0,0,.2)", transition: "all .2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}>
              🆘 ACTIVATE SOS NOW
            </button>
            <button onClick={() => router.push("/support")}
              style={{ padding: "18px 40px", background: "transparent", color: "white", border: "2px solid rgba(255,255,255,.5)", borderRadius: 100, fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: 1, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "white"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.5)"}>
              📞 CALL SUPPORT
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background: C.textPrimary, color: "rgba(255,255,255,.7)", padding: "64px 60px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 700, color: "#f59e2a", marginBottom: 14 }}>🔧 MECHANICS 24/7</div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,.45)", marginBottom: 16, maxWidth: 280 }}>India's premier on-demand roadside assistance. Verified mechanics, anywhere, anytime, in minutes.</p>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)", fontFamily: "'Space Mono',monospace" }}>📞 1800-247-2474</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)", fontFamily: "'Space Mono',monospace", marginTop: 4 }}>✉️ support@mechanics247.com</div>
              {/* Founders credit */}
              <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(245,158,42,.08)", border: "1px solid rgba(245,158,42,.15)", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", letterSpacing: .5, marginBottom: 4 }}>FOUNDED BY</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", fontWeight: 600 }}>K. Sai Charan & K. Balamuralikrishna</div>
              </div>
            </div>
            {[
              { heading: "CUSTOMERS", links: [{ l: "Register", h: "/register" }, { l: "Login", h: "/login" }, { l: "Services", h: "/services" }, { l: "Support", h: "/support" }, { l: "Track Booking", h: "/customer/track" }] },
              { heading: "MECHANICS", links: [{ l: "Join Now", h: "/become-mechanic" }, { l: "Login", h: "/login" }, { l: "Earnings", h: "/become-mechanic" }, { l: "Dashboard", h: "/mechanic/dashboard" }] },
              { heading: "COMPANY", links: [{ l: "About Us", h: "/about" }, { l: "Contact", h: "/contact" }, { l: "Admin Login", h: "/admin/login" }, { l: "Careers", h: "/about" }] },
              { heading: "LEGAL", links: [{ l: "Terms of Service", h: "/terms" }, { l: "Privacy Policy", h: "/terms" }, { l: "Refund Policy", h: "/terms" }, { l: "Cookie Policy", h: "/terms" }] },
            ].map(col => (
              <div key={col.heading}>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "rgba(255,255,255,.3)", marginBottom: 16 }}>{col.heading}</div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => (
                    <li key={l.l}><a href={l.h} style={{ fontSize: 13, color: "rgba(255,255,255,.5)", textDecoration: "none", transition: "color .2s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#f59e2a"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,.5)"}>{l.l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.25)", fontFamily: "'Space Mono',monospace" }}>© 2025 MECHANICS 24/7. ALL RIGHTS RESERVED.</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.25)", fontFamily: "'Space Mono',monospace" }}>MADE WITH ♥ IN INDIA</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes car-shake{from{transform:translate(-50%,-50%) rotate(-1.5deg)}to{transform:translate(-50%,-50%) rotate(1.5deg)}}
        @keyframes smoke-puff{0%{transform:translateY(0) scale(1);opacity:.5}100%{transform:translateY(-36px) scale(2.5);opacity:0}}
        @keyframes sos-pulse{0%,100%{box-shadow:0 0 0 0 rgba(194,74,26,.6)}50%{box-shadow:0 0 0 10px rgba(194,74,26,0)}}
        @keyframes sos-ring{0%{transform:translate(-50%,-50%) scale(.3);opacity:.8}100%{transform:translate(-50%,-50%) scale(2);opacity:0}}
        @keyframes pulse-dot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.4}}
        @keyframes bounce-cry{from{transform:translateY(0)}to{transform:translateY(-5px)}}
        @keyframes ping-dot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:.6}}
        @keyframes moto-ride{from{transform:translate(-50%,-50%) translateY(0)}to{transform:translate(-50%,-50%) translateY(-4px)}}
        @keyframes wrench-spin{0%{transform:rotate(-20deg)}50%{transform:rotate(20deg)}100%{transform:rotate(-20deg)}}
        @keyframes happy-bounce{from{transform:translate(-50%,-50%) translateY(0)}to{transform:translate(-50%,-50%) translateY(-6px)}}
        @keyframes star-pop{0%{transform:scale(0) rotate(-30deg);opacity:0}80%{transform:scale(1.2) rotate(5deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1}}
        .reveal{opacity:0;transform:translateY(28px);transition:opacity .6s ease,transform .6s ease}
        .reveal.revealed{opacity:1;transform:translateY(0)}
      `}</style>
    </div>
  );
}