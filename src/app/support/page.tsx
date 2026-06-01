"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { C, Card, Btn, Input } from "@/components/ui";

export default function SupportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("faq");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm the Mechanics 24/7 support bot. How can I help you today?" },
  ]);
  const [ticket, setTicket] = useState({ name: "", email: "", phone: "", category: "", subject: "", desc: "" });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const setT = (k: string, v: string) => setTicket(f => ({ ...f, [k]: v }));

  const sendMsg = () => {
    if (!chatMsg.trim()) return;
    const newMessages = [...messages, { from: "user", text: chatMsg }];
    setMessages(newMessages);
    setChatMsg("");
    setTimeout(() => {
      const replies: Record<string, string> = {
        "payment": "For payment issues, please share your booking ID and we'll resolve it within 2 hours.",
        "mechanic": "If you're unhappy with a mechanic, you can rate them or raise a complaint from your dashboard.",
        "cancel": "To cancel a booking, go to My Bookings → Select booking → Cancel. Free cancellation before mechanic departs.",
        "refund": "Refunds are processed within 3–5 business days to your original payment method.",
      };
      const lower = chatMsg.toLowerCase();
      const reply = Object.keys(replies).find(k => lower.includes(k));
      setMessages(prev => [...prev, { from: "bot", text: reply ? replies[reply] : "I understand your concern. Let me connect you with a support agent. Average wait: 2 minutes. 🕐" }]);
    }, 1000);
  };

  const faqs = [
    { q: "How quickly will a mechanic arrive?", a: "Average arrival time is 8 minutes in metro cities. In tier-2 cities, it may be 12–15 minutes. You can track the mechanic live on the map." },
    { q: "How is the service price decided?", a: "Prices are based on service type, vehicle type, and parts required. You get an estimate before confirming. Final invoice is shared after job completion." },
    { q: "Can I cancel a booking?", a: "Yes, you can cancel for free before the mechanic starts traveling. After that, a small cancellation fee may apply." },
    { q: "What if I'm not satisfied with the service?", a: "Rate the mechanic 1–3 stars and we'll investigate. Full refunds are available for substandard service with valid reason." },
    { q: "Are the mechanics verified?", a: "Yes, every mechanic goes through document verification (Aadhaar, license, certification), background check, and a skills test before being approved." },
    { q: "What payment methods are accepted?", a: "UPI, Credit/Debit Card, Net Banking, and Cash. All digital payments are secured via Razorpay." },
    { q: "Do you provide service at night?", a: "Yes! We are available 24/7, 365 days. Night-time bookings have the same pricing — no extra charges." },
    { q: "How do I become a mechanic on the platform?", a: "Click 'Become a Mechanic' in the navigation, fill the registration form, upload your documents, and our team will verify and approve your profile within 24 hours." },
  ];

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${C.cream2}, ${C.cream})`, padding: "120px 60px 60px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 48, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>
          How can we <span style={{ color: C.amber }}>help you?</span>
        </h1>
        <p style={{ fontSize: 16, color: C.textSecondary, marginBottom: 32 }}>24/7 support via chat, phone, email, and tickets</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { icon: "💬", label: "Live Chat", action: () => setChatOpen(true) },
            { icon: "📞", label: "Call: 1800-247-2474", action: () => {} },
            { icon: "📧", label: "Email Support", action: () => setActiveTab("ticket") },
            { icon: "🎫", label: "Raise Ticket", action: () => setActiveTab("ticket") },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action}
              style={{ padding: "12px 24px", background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: C.textSecondary, display: "flex", alignItems: "center", gap: 8, transition: "all .2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = C.amber}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = C.border}>
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 0 }}>
          {[
            { id: "faq", label: "📖 FAQ" },
            { id: "ticket", label: "🎫 Raise Ticket" },
            { id: "emergency", label: "🚨 Emergency Help" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: "16px 24px", border: "none", background: "transparent", fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 600, color: activeTab === tab.id ? C.amber : C.textSecondary, borderBottom: `3px solid ${activeTab === tab.id ? C.amber : "transparent"}`, cursor: "pointer", transition: "all .2s", letterSpacing: .5 }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 60px" }}>

        {/* FAQ */}
        {activeTab === "faq" && (
          <div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 32, fontWeight: 700, color: C.textPrimary, marginBottom: 32 }}>Frequently Asked Questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: C.white, border: `1px solid ${openFaq === i ? C.amber : C.border}`, borderRadius: 12, overflow: "hidden", transition: "all .2s" }}>
                  <div onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary }}>{faq.q}</span>
                    <span style={{ fontSize: 20, color: C.amber, transition: "transform .2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </div>
                  {openFaq === i && (
                    <div style={{ padding: "0 20px 18px", fontSize: 14, color: C.textSecondary, lineHeight: 1.7, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ticket */}
        {activeTab === "ticket" && (
          <div style={{ maxWidth: 640 }}>
            {ticketSubmitted ? (
              <div style={{ textAlign: "center", padding: 48 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>Ticket Submitted!</h2>
                <p style={{ fontSize: 15, color: C.textSecondary, marginBottom: 24 }}>Ticket ID: <strong style={{ fontFamily: "'Space Mono',monospace", color: C.amber }}>TKT-{Date.now().toString().slice(-6)}</strong></p>
                <p style={{ fontSize: 14, color: C.textSecondary }}>Our team will respond within <strong>2 hours</strong>. Check your email for updates.</p>
                <button onClick={() => setTicketSubmitted(false)} style={{ marginTop: 24, padding: "12px 28px", background: C.amber, color: "white", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Raise Another Ticket</button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 32, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Raise a Support Ticket</h2>
                <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 28 }}>We'll respond within 2 hours via email or phone.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Input label="Your Name" value={ticket.name} onChange={v => setT("name", v)} placeholder="Full name" required />
                    <Input label="Email" type="email" value={ticket.email} onChange={v => setT("email", v)} placeholder="your@email.com" required />
                  </div>
                  <Input label="Phone Number" type="tel" value={ticket.phone} onChange={v => setT("phone", v)} placeholder="+91 98765 43210" />
                  <Input label="Category" type="select" value={ticket.category} onChange={v => setT("category", v)}
                    options={["Payment Issue", "Mechanic Issue", "Service Quality", "App Bug", "Account Issue", "Refund Request", "Complaint", "Other"]} required />
                  <Input label="Subject" value={ticket.subject} onChange={v => setT("subject", v)} placeholder="Brief description of issue" required />
                  <Input label="Detailed Description" type="textarea" value={ticket.desc} onChange={v => setT("desc", v)} placeholder="Describe your issue in detail. Include booking ID if relevant." />
                  <div className="upload-zone">
                    <div style={{ fontSize: 24, marginBottom: 8 }}>📎</div>
                    <div style={{ fontSize: 13, color: C.textSecondary }}>Attach screenshot or photo (optional)</div>
                  </div>
                  <Btn onClick={() => ticket.name && ticket.email && ticket.category ? setTicketSubmitted(true) : null}
                    style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
                    Submit Ticket →
                  </Btn>
                </div>
              </>
            )}
          </div>
        )}

        {/* Emergency */}
        {activeTab === "emergency" && (
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🚨</div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 36, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>Emergency Help</h2>
            <p style={{ fontSize: 16, color: C.textSecondary, marginBottom: 36 }}>Stranded right now? Use one of these options for immediate assistance.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: C.terra, borderRadius: 16, padding: 28, color: "white" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📞</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Emergency Helpline</div>
                <div style={{ fontSize: 28, fontFamily: "'Space Mono',monospace", fontWeight: 700, marginBottom: 12 }}>1800-247-2474</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)" }}>Toll free · Available 24/7 · Average wait: 30 seconds</p>
              </div>
              <button onClick={() => router.push("/register")}
                style={{ padding: "20px", background: C.amber, color: "white", border: "none", borderRadius: 16, cursor: "pointer", fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>
                🆘 BOOK MECHANIC NOW
              </button>
              <button onClick={() => setChatOpen(true)}
                style={{ padding: "16px", background: C.white, border: `2px solid ${C.border}`, borderRadius: 12, cursor: "pointer", fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, color: C.textSecondary }}>
                💬 Start Live Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Chat Widget */}
      {chatOpen && (
        <div style={{ position: "fixed", bottom: 24, right: 24, width: 360, background: C.white, borderRadius: 20, boxShadow: "0 16px 48px rgba(42,26,8,.15)", border: `1px solid ${C.border}`, zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden", animation: "slide-up .3s ease" }}>
          <div style={{ background: C.brown, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, color: "white" }}>💬 Live Support</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>🟢 Online · Avg reply: 2 min</div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", cursor: "pointer", fontSize: 20 }}>×</button>
          </div>
          <div style={{ flex: 1, padding: 16, overflowY: "auto", maxHeight: 320, display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: msg.from === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px", background: msg.from === "user" ? C.amber : C.cream2, color: msg.from === "user" ? "white" : C.textPrimary, fontSize: 13, lineHeight: 1.5 }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8 }}>
            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()}
              placeholder="Type your message..."
              style={{ flex: 1, padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, background: C.cream, outline: "none" }} />
            <button onClick={sendMsg} style={{ padding: "10px 16px", background: C.amber, color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16 }}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}