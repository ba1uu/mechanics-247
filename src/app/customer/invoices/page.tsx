"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { C, Btn } from "@/components/ui";

const SAMPLE_INVOICES = [
  { id: "INV-BK001", bookingId: "BK001", date: "28 May 2025", mechanic: "Rajesh Kumar", mechanicPhone: "9876543210", service: "Puncture Repair", vehicle: "Maruti Swift — AP 15 AB 1234", location: "Nellore, AP", labour: 250, parts: 80, platform: 24, status: "paid" },
  { id: "INV-BK002", bookingId: "BK002", date: "15 May 2025", mechanic: "Suresh Babu", mechanicPhone: "9876543211", service: "Battery Jump Start", vehicle: "Honda Activa — AP 15 CD 5678", location: "Nellore, AP", labour: 350, parts: 120, platform: 29, status: "paid" },
];

export default function InvoicesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(SAMPLE_INVOICES[0]);
  const [printing, setPrinting] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const total = selected.labour + selected.parts + selected.platform;

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 300);
  };

  const handleDownload = () => {
    // Create invoice HTML content and trigger download
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${selected.id}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #2a1a08; }
    .header { background: #5c2e0a; color: white; padding: 24px; border-radius: 8px 8px 0 0; }
    .logo { font-size: 22px; font-weight: bold; letter-spacing: 1px; }
    .subtitle { font-size: 12px; opacity: .6; margin-top: 4px; }
    .invoice-id { font-size: 28px; font-weight: bold; color: #f59e2a; text-align: right; }
    .section { padding: 20px 24px; border-bottom: 1px solid #faefd8; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .label { font-size: 11px; color: #a08060; text-transform: uppercase; margin-bottom: 4px; }
    .value { font-size: 14px; font-weight: 600; }
    .line-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #faefd8; font-size: 14px; }
    .total { display: flex; justify-content: space-between; padding: 16px 0 0; font-size: 20px; font-weight: bold; color: #b85f0a; }
    .badge { display: inline-block; padding: 4px 12px; background: #e8f5eb; color: #2d7a3a; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .footer { background: #faefd8; padding: 20px 24px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #a08060; }
  </style>
</head>
<body>
  <div class="header">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div><div class="logo">🔧 MECHANICS 24/7</div><div class="subtitle">On-Demand Roadside Assistance</div></div>
      <div class="invoice-id">${selected.id}</div>
    </div>
  </div>
  <div class="section">
    <div class="grid-2">
      <div><div class="label">Invoice Date</div><div class="value">${selected.date}</div></div>
      <div><div class="label">Status</div><div class="value"><span class="badge">✓ PAID</span></div></div>
      <div><div class="label">Booking ID</div><div class="value">${selected.bookingId}</div></div>
      <div><div class="label">Service</div><div class="value">${selected.service}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="grid-2">
      <div><div class="label">Vehicle</div><div class="value">${selected.vehicle}</div></div>
      <div><div class="label">Location</div><div class="value">${selected.location}</div></div>
      <div><div class="label">Mechanic</div><div class="value">${selected.mechanic}</div></div>
      <div><div class="label">Mechanic Phone</div><div class="value">${selected.mechanicPhone}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="line-item"><span>Labour Charges</span><span>₹${selected.labour}</span></div>
    <div class="line-item"><span>Parts / Materials</span><span>₹${selected.parts}</span></div>
    <div class="line-item"><span>Platform Fee (8%)</span><span>₹${selected.platform}</span></div>
    <div class="total"><span>TOTAL PAID</span><span>₹${total}</span></div>
  </div>
  <div class="footer">
    Thank you for using Mechanics 24/7! | support@mechanics247.com | 1800-247-2474<br>
    This is a computer-generated invoice. No signature required.
  </div>
</body>
</html>`;

    const blob = new Blob([invoiceHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✅ Invoice downloaded!");
  };

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 24px 60px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 36, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>My Invoices</h1>
          <p style={{ fontSize: 14, color: C.textSecondary }}>Download or print invoices for all completed services</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
          {/* Invoice list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: 1, marginBottom: 4 }}>SELECT INVOICE</div>
            {SAMPLE_INVOICES.map(inv => (
              <div key={inv.id} onClick={() => setSelected(inv)}
                style={{ background: selected.id === inv.id ? "rgba(224,123,26,.08)" : C.white, border: `2px solid ${selected.id === inv.id ? C.amber : C.border}`, borderRadius: 14, padding: "16px 18px", cursor: "pointer", transition: "all .2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, fontWeight: 700, color: C.amber }}>{inv.id}</span>
                  <span style={{ fontSize: 11, background: "#e8f5eb", color: "#2d7a3a", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>PAID</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 3 }}>{inv.service}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{inv.date}</div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, color: C.amberDark, marginTop: 6 }}>
                  ₹{inv.labour + inv.parts + inv.platform}
                </div>
              </div>
            ))}
          </div>

          {/* Invoice preview */}
          <div>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 32px rgba(92,46,10,.08)" }}>
              {/* Invoice header */}
              <div style={{ background: C.brown, padding: "28px 32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, fontWeight: 700, color: "#f59e2a", letterSpacing: 1 }}>🔧 MECHANICS 24/7</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 2 }}>On-Demand Roadside Assistance</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 8 }}>Hitech City, Hyderabad 500081 · 1800-247-2474</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 30, fontWeight: 700, color: "#f59e2a" }}>{selected.id}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }}>TAX INVOICE</div>
                    <div style={{ marginTop: 8, background: "rgba(45,122,58,.8)", borderRadius: 20, padding: "4px 14px", display: "inline-block", fontSize: 12, fontWeight: 700, color: "white" }}>✓ PAID</div>
                  </div>
                </div>
              </div>

              {/* Invoice details */}
              <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
                  {[
                    { label: "Invoice Date", val: selected.date },
                    { label: "Booking ID", val: selected.bookingId },
                    { label: "Payment Method", val: "UPI" },
                    { label: "Vehicle", val: selected.vehicle },
                    { label: "Service Location", val: selected.location },
                    { label: "Service Type", val: selected.service },
                  ].map((f, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Oswald',sans-serif", letterSpacing: .5, marginBottom: 4 }}>{f.label.toUpperCase()}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{f.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mechanic */}
              <div style={{ padding: "20px 32px", borderBottom: `1px solid ${C.border}`, background: C.cream, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700 }}>
                  {selected.mechanic.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Oswald',sans-serif", marginBottom: 2 }}>SERVICE PROVIDED BY</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>{selected.mechanic}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{selected.mechanicPhone} · Verified Mechanic ✓</div>
                </div>
              </div>

              {/* Line items */}
              <div style={{ padding: "24px 32px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: 1, marginBottom: 16 }}>CHARGES BREAKDOWN</div>
                {[
                  { label: "Labour Charges", desc: "Mechanic service fee", amount: selected.labour },
                  { label: "Parts / Materials", desc: "Spare parts used", amount: selected.parts },
                  { label: "Platform Service Fee", desc: "8% platform commission", amount: selected.platform },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.textPrimary }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{item.desc}</div>
                    </div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, color: C.textPrimary }}>₹{item.amount}</div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0 0" }}>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, color: C.textPrimary }}>TOTAL PAID</div>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.amberDark }}>₹{total}</div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "20px 32px", background: C.cream2, textAlign: "center" }}>
                <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Thank you for choosing Mechanics 24/7! 🔧</p>
                <p style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Space Mono',monospace" }}>This is a computer-generated invoice. No signature required.</p>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <Btn onClick={handleDownload} style={{ flex: 1, justifyContent: "center", padding: "13px" }}>
                📥 Download Invoice
              </Btn>
              <Btn variant="secondary" onClick={handlePrint} disabled={printing} style={{ flex: 1, justifyContent: "center", padding: "13px" }}>
                🖨️ {printing ? "Opening..." : "Print Invoice"}
              </Btn>
              <Btn variant="ghost" onClick={() => router.push("/customer/dashboard")} style={{ flex: 1, justifyContent: "center", padding: "13px" }}>
                ← Dashboard
              </Btn>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}