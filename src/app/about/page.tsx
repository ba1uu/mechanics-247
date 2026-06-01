"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { C, Card } from "@/components/ui";

export default function AboutPage() {
  const router = useRouter();

  const team = [
    { name: "K. Sai Charan", role: "CEO & Co-Founder", bio: "Visionary entrepreneur passionate about solving real-world problems for every Indian driver", init: "SC" },
    { name: "K. Balamuralikrishna", role: "Co-Founder & CTO", bio: "Tech leader driving the platform's innovation, architecture, and product vision", init: "BK" },
    { name: "K. Naveen", role: "Co-Founder", bio: "Driving growth and operations, ensuring every driver gets help when they need it most", init: "KN" },
    { name: "K. Sai Praneeth", role: "Co-Founder", bio: "Focused on mechanic partnerships and quality assurance across all service categories", init: "SP" },
    { name: "P. Rajendra", role: "Co-Founder", bio: "Leading customer experience and expanding Mechanics 24/7 to new cities across India", init: "PR" },
  ];

  const milestones = [
    { year: "2022", title: "Founded", desc: "Started in Hyderabad with 10 mechanics" },
    { year: "2023", title: "Series A", desc: "Raised ₹5Cr, expanded to 10 cities" },
    { year: "2024", title: "50K Jobs", desc: "Crossed 50,000 completed jobs" },
    { year: "2025", title: "40 Cities", desc: "Now live across 40 cities in India" },
  ];

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <style>{`
        @media (min-width: 769px) {
          .milestone-card:first-child { border-radius: 16px 0 0 16px !important; }
          .milestone-card:last-child  { border-radius: 0 16px 16px 0 !important; }
          .milestone-card:not(:first-child):not(:last-child) { border-radius: 0 !important; }
        }

        @media (max-width: 768px) {
          .about-hero { padding: 100px 20px 60px !important; }
          .about-hero h1 { font-size: 36px !important; }
          .about-hero p { font-size: 15px !important; }
          .mission-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .mission-section { padding: 60px 20px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .timeline-section { padding: 60px 20px !important; }
          .timeline-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .milestone-arrow { display: none !important; }
          .founders-section { padding: 60px 20px !important; }
          .founders-grid { grid-template-columns: 1fr !important; }
          .values-section { padding: 60px 20px !important; }
          .values-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .values-card { padding: 20px !important; }
          .cta-section { padding: 60px 20px !important; }
          .cta-section h2 { font-size: 30px !important; }
          .cta-buttons { flex-direction: column !important; align-items: center !important; }
          .cta-buttons button { width: 100% !important; max-width: 320px !important; }
          .timeline-h2 { font-size: 28px !important; }
          .founders-h2 { font-size: 28px !important; }
          .values-h2 { font-size: 28px !important; }
          .mission-h2 { font-size: 30px !important; }
        }
        @media (max-width: 480px) {
          .about-hero h1 { font-size: 28px !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .timeline-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section className="about-hero" style={{ background: `linear-gradient(135deg, ${C.brown}, ${C.terra})`, padding: "120px 60px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🔧</div>
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 52, fontWeight: 700, color: "white", marginBottom: 16 }}>
            About Mechanics 24/7
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,.8)", lineHeight: 1.7 }}>
            We're on a mission to eliminate the stress of vehicle breakdowns — making roadside assistance fast, transparent, and affordable for every Indian driver.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mission-section" style={{ padding: "80px 60px", background: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="mission-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 3, color: C.amber, display: "block", marginBottom: 12 }}>OUR MISSION</span>
              <h2 className="mission-h2" style={{ fontFamily: "'Oswald',sans-serif", fontSize: 40, fontWeight: 700, color: C.textPrimary, marginBottom: 20 }}>
                No driver should ever feel <span style={{ color: C.amber }}>stranded and helpless</span>
              </h2>
              <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.8, marginBottom: 16 }}>
                Mechanics 24/7 was born from a real problem — our founders were stranded on a highway at midnight with no help in sight. It took hours to find a mechanic.
              </p>
              <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.8 }}>
                We built the platform we wished existed — connecting stranded drivers with verified, nearby mechanics in under 8 minutes. Today, we serve 40+ cities and have completed over 50,000 jobs.
              </p>
            </div>
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { icon: "🏆", title: "50,000+", sub: "Jobs Completed" },
                { icon: "🔧", title: "2,800+", sub: "Verified Mechanics" },
                { icon: "🌆", title: "40+", sub: "Cities" },
                { icon: "⭐", title: "4.9 / 5", sub: "Average Rating" },
              ].map((s, i) => (
                <div key={i} style={{ background: C.cream2, borderRadius: 16, padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.amberDark }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section" style={{ padding: "80px 60px", background: C.cream2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 3, color: C.amber, display: "block", marginBottom: 8 }}>OUR JOURNEY</span>
            <h2 className="timeline-h2" style={{ fontFamily: "'Oswald',sans-serif", fontSize: 40, fontWeight: 700, color: C.textPrimary }}>From idea to <span style={{ color: C.amber }}>India's #1 platform</span></h2>
          </div>
          <div className="timeline-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
            {milestones.map((m, i) => (
              <div key={i} className="milestone-card" style={{ background: C.white, padding: "28px 24px", borderRadius: 16, textAlign: "center", position: "relative" }}>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.amber, marginBottom: 8 }}>{m.year}</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 8 }}>{m.title}</div>
                <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.5 }}>{m.desc}</div>
                {i < 3 && <div className="milestone-arrow" style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, background: C.amber, clipPath: "polygon(0 0,100% 50%,0 100%)", zIndex: 2 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="founders-section" style={{ padding: "80px 60px", background: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 3, color: C.amber, display: "block", marginBottom: 8 }}>THE FOUNDERS</span>
            <h2 className="founders-h2" style={{ fontFamily: "'Oswald',sans-serif", fontSize: 40, fontWeight: 700, color: C.textPrimary }}>The minds behind <span style={{ color: C.amber }}>the wrench</span></h2>
          </div>
          <div className="founders-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {team.map((t, i) => (
              <Card key={i} style={{ textAlign: "center", padding: 36 }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: `linear-gradient(135deg, ${C.amber}, ${C.terra})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: "white", margin: "0 auto 20px", boxShadow: `0 8px 24px rgba(224,123,26,.3)` }}>
                  {t.init}
                </div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>{t.name}</div>
                <div style={{ fontSize: 13, color: C.amber, fontWeight: 600, marginBottom: 12, fontFamily: "'Oswald',sans-serif", letterSpacing: .5 }}>{t.role}</div>
                <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>{t.bio}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section" style={{ padding: "80px 60px", background: C.cream2 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 3, color: C.amber, display: "block", marginBottom: 8 }}>OUR VALUES</span>
            <h2 className="values-h2" style={{ fontFamily: "'Oswald',sans-serif", fontSize: 40, fontWeight: 700, color: C.textPrimary }}>What we <span style={{ color: C.amber }}>stand for</span></h2>
          </div>
          <div className="values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { icon: "⚡", title: "Speed", desc: "Every second counts when you're stranded. We obsess over response times." },
              { icon: "🔒", title: "Trust", desc: "Every mechanic is verified, background-checked, and rated by real customers." },
              { icon: "💰", title: "Transparency", desc: "Upfront pricing, no hidden charges. What you see is what you pay." },
              { icon: "🌍", title: "Accessibility", desc: "Available 24/7, in every city, for every vehicle type and every Indian." },
              { icon: "🤝", title: "Fairness", desc: "We empower mechanics to earn more, work freely, and grow their income." },
              { icon: "🚀", title: "Innovation", desc: "AI-powered matching, live tracking, and smart diagnostics — built in India." },
            ].map((v, i) => (
              <Card key={i} className="values-card" style={{ textAlign: "center", padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{v.icon}</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 8 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>{v.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ padding: "80px 60px", background: C.brown, textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 40, fontWeight: 700, color: "white", marginBottom: 16 }}>Join Our Mission</h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,.7)", marginBottom: 36 }}>Whether you're a driver or a mechanic, there's a place for you on Mechanics 24/7</p>
        <div className="cta-buttons" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => router.push("/register")} style={{ padding: "14px 32px", background: C.amber, color: "white", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, cursor: "pointer", letterSpacing: 1 }}>
            GET HELP AS CUSTOMER
          </button>
          <button onClick={() => router.push("/become-mechanic")} style={{ padding: "14px 32px", background: "transparent", color: "white", border: "2px solid rgba(255,255,255,.4)", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, cursor: "pointer", letterSpacing: 1 }}>
            JOIN AS MECHANIC
          </button>
        </div>
      </section>
    </div>
  );
}