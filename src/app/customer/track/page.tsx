"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { C, Btn } from "@/components/ui";

const STATUS_STEPS = [
  { label: "Booking Confirmed", time: "10:32 AM", done: true, active: false },
  { label: "Mechanic Accepted", time: "10:33 AM", done: true, active: false },
  { label: "En Route", time: "10:34 AM", done: false, active: true },
  { label: "Arrived", time: "", done: false, active: false },
  { label: "Repair Started", time: "", done: false, active: false },
  { label: "Repair Complete", time: "", done: false, active: false },
  { label: "Payment Done", time: "", done: false, active: false },
];

export default function LiveTrackPage() {
  const router = useRouter();
  const [eta, setEta] = useState(8);
  const [distance, setDistance] = useState(2.3);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "mechanic", text: "Hi! I accepted your request. On my way! 🛵" },
  ]);
  const [steps, setSteps] = useState(STATUS_STEPS);
  const [currentStep, setCurrentStep] = useState(2);
  const [panelExpanded, setPanelExpanded] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setEta(e => Math.max(0, e - 1));
      setDistance(d => parseFloat(Math.max(0, d - 0.15).toFixed(1)));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const quickMessages = ["Where are you?", "I'm near the signal", "How long?", "Please hurry!"];

  const sendMsg = (text: string) => {
    const msg = text || chatMsg;
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { from: "customer", text: msg }]);
    setChatMsg("");
    setTimeout(() => {
      const replies = ["Almost there! 2 minutes away", "I can see your location", "Just crossed the signal", "Arriving shortly!"];
      setMessages(prev => [...prev, { from: "mechanic", text: replies[Math.floor(Math.random() * replies.length)] }]);
    }, 1200);
  };

  const advanceStatus = () => {
    if (currentStep >= steps.length - 1) return;
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setSteps(prev => prev.map((s, i) => {
      if (i === currentStep) return { ...s, done: true, active: false, time: now };
      if (i === currentStep + 1) return { ...s, active: true };
      return s;
    }));
    setCurrentStep(c => c + 1);
    if (currentStep + 1 >= 5) router.push("/customer/request");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: C.cream, fontFamily: "'Inter',sans-serif", overflow: "hidden" }}>
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <button onClick={() => router.push("/customer/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: C.textSecondary, fontWeight: 500 }}>← Dashboard</button>
        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, color: C.textPrimary }}>📍 Live Tracking</div>
        <button onClick={() => setChatOpen(o => !o)} style={{ padding: "6px 14px", background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>💬 Chat</button>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Map */}
        <div style={{ flex: 1, background: "#e8dcc8", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(92,46,10,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(92,46,10,.08) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          <div style={{ position: "absolute", top: "30%", left: 0, right: 0, height: 20, background: "rgba(255,255,255,.6)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "40%", width: 16, background: "rgba(255,255,255,.6)" }} />
          <div style={{ position: "absolute", top: "62%", left: 0, right: 0, height: 12, background: "rgba(255,255,255,.5)" }} />

          {/* Customer pin */}
          <div style={{ position: "absolute", bottom: "22%", left: "56%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.terra, border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 12px rgba(194,74,26,.4)", animation: "pulse-dot 2s infinite" }}>🧑</div>
            <div style={{ background: "white", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: C.terra, marginTop: 4, whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(0,0,0,.1)" }}>You</div>
          </div>

          {/* Mechanic pin */}
          <div style={{ position: "absolute", top: "28%", left: "26%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.green, border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 12px rgba(45,122,58,.4)" }}>🛵</div>
            <div style={{ background: "white", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: C.green, marginTop: 4, whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(0,0,0,.1)" }}>Rajesh</div>
          </div>

          {/* Route */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            <line x1="26%" y1="28%" x2="56%" y2="78%" stroke={C.amber} strokeWidth="3" strokeDasharray="12,6" opacity="0.7" />
          </svg>

          {/* ETA pill */}
          <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", background: C.white, borderRadius: 100, padding: "10px 20px", boxShadow: "0 4px 20px rgba(92,46,10,.15)", display: "flex", gap: 20, alignItems: "center", whiteSpace: "nowrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, fontWeight: 700, color: C.green }}>{eta} min</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>ETA</div>
            </div>
            <div style={{ width: 1, height: 28, background: C.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, fontWeight: 700, color: C.textPrimary }}>{distance} km</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>away</div>
            </div>
            <div style={{ width: 1, height: 28, background: C.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18 }}>🛵</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>en route</div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div style={{ width: panelExpanded ? 340 : 48, background: C.white, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", transition: "width .3s", overflow: "hidden", flexShrink: 0 }}>
          <button onClick={() => setPanelExpanded(e => !e)} style={{ padding: "12px", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, cursor: "pointer", fontSize: 18, color: C.textMuted }}>
            {panelExpanded ? "→" : "←"}
          </button>
          {panelExpanded && (
            <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
              {/* Mechanic card */}
              <div style={{ background: C.cream2, borderRadius: 14, padding: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700 }}>R</div>
                  <div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, color: C.textPrimary }}>Rajesh Kumar</div>
                    <div style={{ fontSize: 12, color: C.amber }}>⭐ 4.9 · Engine Specialist</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{distance} km away · {eta} min ETA</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ flex: 1, padding: "9px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13 }}>📞 Call</button>
                  <button onClick={() => setChatOpen(true)} style={{ flex: 1, padding: "9px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13 }}>💬 Chat</button>
                  <button onClick={() => router.push("/customer/dashboard")} style={{ flex: 1, padding: "9px", background: "#fdecea", border: "1px solid #c0392b", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#c0392b" }}>Cancel</button>
                </div>
              </div>

              {/* Timeline */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 12, fontWeight: 600, color: C.textSecondary, letterSpacing: .5, marginBottom: 12 }}>JOB STATUS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {steps.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: i < steps.length - 1 ? 14 : 0, position: "relative" }}>
                      {i < steps.length - 1 && <div style={{ position: "absolute", left: 11, top: 24, bottom: 0, width: 2, background: s.done ? C.amber : C.border }} />}
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: s.done ? C.amber : s.active ? C.amber : C.cream2, border: `2px solid ${s.done || s.active ? C.amber : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: s.done || s.active ? "white" : C.textMuted, fontWeight: 700 }}>
                        {s.done ? "✓" : s.active ? "●" : ""}
                      </div>
                      <div style={{ flex: 1, paddingTop: 2 }}>
                        <div style={{ fontSize: 13, fontWeight: s.active ? 700 : 400, color: s.done || s.active ? C.textPrimary : C.textMuted }}>{s.label}</div>
                        {s.time && <div style={{ fontSize: 11, color: C.textMuted }}>{s.time}</div>}
                        {s.active && <div style={{ fontSize: 11, color: C.amber, fontWeight: 700 }}>← CURRENT</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: C.cream, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: C.textMuted, marginBottom: 12 }}>💡 Demo: Click to simulate progress</div>
              <Btn onClick={advanceStatus} style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>▶ Advance Status</Btn>
            </div>
          )}
        </div>
      </div>

      {/* Chat */}
      {chatOpen && (
        <div style={{ position: "fixed", bottom: 0, right: 0, width: 320, background: C.white, borderLeft: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}`, borderRadius: "16px 0 0 0", boxShadow: "-4px -4px 20px rgba(92,46,10,.1)", zIndex: 200, display: "flex", flexDirection: "column", height: 420, animation: "slide-up .3s ease" }}>
          <div style={{ background: C.brown, padding: "14px 18px", borderRadius: "16px 0 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 600, color: "white" }}>💬 Chat with Rajesh</div>
            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", cursor: "pointer", fontSize: 20 }}>×</button>
          </div>
          <div style={{ padding: "8px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {quickMessages.map(q => (
              <span key={q} onClick={() => sendMsg(q)} style={{ padding: "4px 10px", background: C.cream2, borderRadius: 20, fontSize: 11, cursor: "pointer" }}>{q}</span>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "customer" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "80%", padding: "9px 13px", borderRadius: msg.from === "customer" ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: msg.from === "customer" ? C.amber : C.cream2, color: msg.from === "customer" ? "white" : C.textPrimary, fontSize: 13 }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg("")} placeholder="Type a message..."
              style={{ flex: 1, padding: "9px 12px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, background: C.cream, outline: "none" }} />
            <button onClick={() => sendMsg("")} style={{ padding: "9px 14px", background: C.amber, color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}