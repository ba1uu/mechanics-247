"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { C } from "@/components/ui";

export default function TermsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  const terms = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using the Mechanics 24/7 platform ('Service'), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. These terms apply to all users including customers, mechanics, and administrators."
    },
    {
      title: "2. Service Description",
      content: "Mechanics 24/7 is an on-demand roadside assistance platform that connects vehicle owners ('Customers') with independent mechanics ('Mechanic Partners'). We act as an intermediary and do not directly provide mechanical services. The quality and completion of services is the sole responsibility of the Mechanic Partner."
    },
    {
      title: "3. User Accounts",
      content: "You must provide accurate, complete, and current information when creating an account. You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms."
    },
    {
      title: "4. Bookings & Cancellations",
      content: "Customers may cancel a booking free of charge before the Mechanic Partner begins travelling to the service location. A cancellation fee of ₹50 may apply if cancelled after the mechanic has departed. Repeated cancellations may result in account restrictions. No-shows by customers will be charged a convenience fee."
    },
    {
      title: "5. Payments & Refunds",
      content: "All payments are processed through secure third-party payment gateways. Service prices are estimates; final charges may vary based on actual repair work and parts. Refunds are processed within 5-7 business days for valid claims. Platform commission of 8% is deducted from mechanic earnings automatically."
    },
    {
      title: "6. Mechanic Partner Terms",
      content: "Mechanics must maintain valid licenses, certifications, and insurance at all times. False or misleading information during registration will result in immediate account termination. Mechanics are independent contractors and not employees of Mechanics 24/7. You are responsible for your own taxes on earnings received through the platform."
    },
    {
      title: "7. Prohibited Conduct",
      content: "Users may not engage in fraudulent activity, harassment, discrimination, or any conduct that violates applicable laws. Off-platform transactions that bypass our payment system are strictly prohibited and will result in permanent account ban. Sharing personal contact details to avoid platform fees is a violation of these terms."
    },
    {
      title: "8. Liability Limitations",
      content: "Mechanics 24/7 is not liable for any damages arising from services provided by Mechanic Partners. Our maximum liability is limited to the service fee paid for the specific booking in question. We do not guarantee availability of mechanics, response times, or service outcomes."
    },
    {
      title: "9. Dispute Resolution",
      content: "In case of disputes, please contact our support team within 48 hours of service completion. We will mediate between customers and mechanics in good faith. Unresolved disputes will be subject to arbitration under Indian law. The courts of Hyderabad, Telangana shall have exclusive jurisdiction."
    },
    {
      title: "10. Changes to Terms",
      content: "We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms. We will notify users of significant changes via email or in-app notification with at least 14 days notice."
    },
  ];

  const privacy = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly: name, phone number, email address, vehicle details, location data, profile photos, and payment information. We also collect usage data including app activity, device information, and crash reports to improve our service."
    },
    {
      title: "2. How We Use Your Information",
      content: "Your information is used to provide and improve our services, process payments, send service updates and notifications, match customers with mechanics, comply with legal obligations, and prevent fraud. We do not use your data for purposes not described in this policy."
    },
    {
      title: "3. Location Data",
      content: "We collect precise location data when you use the app to enable mechanic matching and live tracking. Location data is shared with your matched mechanic only during an active booking. You can disable location access in your device settings, but this will limit app functionality."
    },
    {
      title: "4. Information Sharing",
      content: "We share your information only with: matched mechanics (limited to name, phone, and location during booking), payment processors, and legal authorities when required. We never sell your personal data to third parties for advertising or marketing purposes."
    },
    {
      title: "5. Data Security",
      content: "We implement industry-standard security measures including 256-bit SSL encryption, secure data storage, and regular security audits. Sensitive data like bank account numbers are encrypted at rest. However, no system is 100% secure and we cannot guarantee absolute security."
    },
    {
      title: "6. Data Retention",
      content: "We retain your account data as long as your account is active. Booking history is retained for 3 years for legal and tax purposes. You may request deletion of your account and associated data at any time, subject to legal retention requirements."
    },
    {
      title: "7. Your Rights",
      content: "You have the right to access, correct, or delete your personal data. You may opt out of marketing communications at any time. You can request a copy of your data in a portable format. To exercise these rights, contact us at privacy@mechanics247.com."
    },
    {
      title: "8. Cookies",
      content: "We use cookies and similar technologies to maintain your session, remember preferences, and analyze usage patterns. You can control cookie settings through your browser. Disabling cookies may affect some features of the platform."
    },
    {
      title: "9. Children's Privacy",
      content: "Our Service is not directed to users under 18 years of age. We do not knowingly collect personal information from minors. If we become aware of such collection, we will promptly delete the information and terminate the account."
    },
    {
      title: "10. Contact Us",
      content: "For privacy-related questions or to exercise your rights, contact our Data Protection Officer at: privacy@mechanics247.com or by writing to Mechanics 24/7, 3rd Floor Tech Tower, Hitech City, Hyderabad 500081, Telangana, India."
    },
  ];

  const content = activeTab === "terms" ? terms : privacy;

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      <section style={{ background: `linear-gradient(135deg, ${C.cream2}, ${C.cream})`, padding: "100px 60px 48px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 44, fontWeight: 700, color: C.textPrimary, marginBottom: 12 }}>Legal & Privacy</h1>
        <p style={{ fontSize: 15, color: C.textSecondary }}>Last updated: June 1, 2025</p>
      </section>

      {/* Tab bar */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 60px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex" }}>
          {([
            { id: "terms", label: "📋 Terms of Service" },
            { id: "privacy", label: "🔒 Privacy Policy" },
          ] as const).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: "16px 28px", border: "none", background: "transparent", fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 600, color: activeTab === tab.id ? C.amber : C.textSecondary, borderBottom: `3px solid ${activeTab === tab.id ? C.amber : "transparent"}`, cursor: "pointer", transition: "all .2s", letterSpacing: .5 }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 60px" }}>
        {/* Intro box */}
        <div style={{ background: "rgba(224,123,26,.08)", border: `1px solid rgba(224,123,26,.2)`, borderRadius: 12, padding: "16px 20px", marginBottom: 36, fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>
          {activeTab === "terms"
            ? "⚖️ Please read these Terms of Service carefully before using Mechanics 24/7. These terms govern your use of our platform and constitute a binding legal agreement."
            : "🔒 Your privacy matters to us. This policy explains how we collect, use, and protect your personal information when you use Mechanics 24/7."}
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {content.map((section, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px 28px", transition: "box-shadow .2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(92,46,10,.07)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "none"}>
              <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.amberDark, marginBottom: 12 }}>{section.title}</h3>
              <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.8 }}>{section.content}</p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 40, padding: "20px 24px", background: C.cream2, borderRadius: 12, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>
            Questions about our {activeTab === "terms" ? "terms" : "privacy policy"}?{" "}
            <a href="/contact" style={{ color: C.amber, fontWeight: 600 }}>Contact us</a> or email{" "}
            <a href={`mailto:${activeTab === "terms" ? "legal" : "privacy"}@mechanics247.com`} style={{ color: C.amber, fontWeight: 600 }}>
              {activeTab === "terms" ? "legal" : "privacy"}@mechanics247.com
            </a>
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
            <button onClick={() => router.push("/register")} style={{ padding: "10px 24px", background: C.amber, color: "white", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              I Agree — Register Now
            </button>
            <button onClick={() => router.push("/")} style={{ padding: "10px 24px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, cursor: "pointer", color: C.textSecondary }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}