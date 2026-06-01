"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { C, Input, Btn, Card } from "@/components/ui";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const setF = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${C.cream2}, ${C.cream})`, padding: "120px 60px 60px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 48, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>
          Get in <span style={{ color: C.amber }}>Touch</span>
        </h1>
        <p style={{ fontSize: 16, color: C.textSecondary }}>We'd love to hear from you. Our team responds within 2 hours.</p>
      </section>

      <section style={{ padding: "60px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
          {/* Contact form */}
          <div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 24 }}>Send us a message</h2>
            {sent ? (
              <Card style={{ textAlign: "center", padding: 48 }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: C.textSecondary, marginBottom: 20 }}>We'll get back to you within 2 hours at <strong>{form.email}</strong></p>
                <Btn onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}>Send Another</Btn>
              </Card>
            ) : (
              <Card>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Input label="Full Name" value={form.name} onChange={v => setF("name", v)} placeholder="Your name" required />
                    <Input label="Email" type="email" value={form.email} onChange={v => setF("email", v)} placeholder="you@email.com" required />
                  </div>
                  <Input label="Phone Number" type="tel" value={form.phone} onChange={v => setF("phone", v)} placeholder="+91 98765 43210" />
                  <Input label="Subject" type="select" value={form.subject} onChange={v => setF("subject", v)}
                    options={["General Inquiry", "Partnership", "Media / Press", "Career", "Technical Issue", "Feedback", "Other"]} required />
                  <Input label="Message" type="textarea" value={form.message} onChange={v => setF("message", v)} placeholder="Tell us how we can help..." />
                  <Btn onClick={() => form.name && form.email && form.subject ? setSent(true) : null} style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
                    Send Message →
                  </Btn>
                </div>
              </Card>
            )}
          </div>

          {/* Contact info */}
          <div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary, marginBottom: 24 }}>Contact Information</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {[
                { icon: "📞", title: "Phone", lines: ["1800-247-2474 (Toll Free)", "+91 40 2345 6789"] },
                { icon: "📧", title: "Email", lines: ["support@mechanics247.com", "business@mechanics247.com"] },
                { icon: "📍", title: "Head Office", lines: ["3rd Floor, Tech Tower,", "Hitech City, Hyderabad — 500081"] },
                { icon: "⏰", title: "Business Hours", lines: ["Customer Support: 24/7", "Business Queries: Mon–Sat, 9AM–7PM"] },
              ].map((info, i) => (
                <Card key={i} style={{ display: "flex", gap: 16, padding: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(224,123,26,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{info.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>{info.title}</div>
                    {info.lines.map(l => <div key={l} style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>{l}</div>)}
                  </div>
                </Card>
              ))}
            </div>

            {/* Map placeholder */}
            <div style={{ background: "#e8dcc8", borderRadius: 16, height: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(224,123,26,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(224,123,26,.05) 1px,transparent 1px)", backgroundSize: "30px 30px" }} />
              <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📍</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, color: C.brown }}>Hyderabad, Telangana</div>
                <div style={{ fontSize: 13, color: C.textSecondary }}>Hitech City, 500081</div>
              </div>
            </div>

            {/* Social */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, color: C.textMuted, letterSpacing: 1, marginBottom: 12 }}>FOLLOW US</div>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { icon: "📘", label: "Facebook" },
                  { icon: "📷", label: "Instagram" },
                  { icon: "🐦", label: "Twitter" },
                  { icon: "💼", label: "LinkedIn" },
                  { icon: "▶️", label: "YouTube" },
                ].map(s => (
                  <button key={s.label} style={{ width: 44, height: 44, borderRadius: 10, background: C.white, border: `1px solid ${C.border}`, cursor: "pointer", fontSize: 18, transition: "all .2s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = C.amber}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = C.border}
                    title={s.label}>
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}