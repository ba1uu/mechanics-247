"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { C, StatusBadge, StatsCard, Card, Btn } from "@/components/ui";
import { store, sampleBookings, sampleMechanics } from "@/store";

const NAV = [
  { icon: "📊", label: "Dashboard", id: "dashboard" },
  { icon: "🆘", label: "New Request", id: "request" },
  { icon: "📋", label: "My Bookings", id: "bookings" },
  { icon: "📍", label: "Live Track", id: "track" },
  { icon: "🚗", label: "My Vehicles", id: "vehicles" },
  { icon: "❤️", label: "Saved Mechanics", id: "mechanics" },
  { icon: "💳", label: "Payments", id: "payments" },
  { icon: "🧾", label: "Invoices", id: "invoices" },
  { icon: "🔔", label: "Notifications", id: "notifications" },
  { icon: "👤", label: "Profile", id: "profile" },
  { icon: "🆘", label: "Emergency SOS", id: "sos" },
];

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(store.getUser());
  const [active, setActive] = useState("dashboard");
  const [bookings] = useState(store.getBookings());
  const [vehicles, setVehicles] = useState(store.getVehicles());
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState("");
  const [sosModal, setSosModal] = useState(false);

  useEffect(() => {
    const u = store.getUser();
    if (!u || u.role !== "customer") { router.push("/login"); return; }
    setUser(u);
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const SidebarLink = ({ item }: { item: typeof NAV[0] }) => (
    <button className={`sidebar-link ${active === item.id ? "active" : ""}`}
      onClick={() => { if (item.id === "request") router.push("/customer/request"); else if (item.id === "sos") setSosModal(true); else setActive(item.id); }}
      style={{ color: item.id === "sos" ? C.terra : undefined }}>
      <span style={{ fontSize: 16 }}>{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </button>
  );

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.cream, fontFamily: "'Inter',sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: collapsed ? 60 : 240, background: C.white, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, transition: "width .3s", zIndex: 100, overflowX: "hidden" }}>
        <div style={{ padding: "16px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {!collapsed && <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, color: C.amberDark }}>🔧 M24/7</span>}
          <button onClick={() => setCollapsed(c => !c)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.textMuted, marginLeft: collapsed ? "auto" : 0 }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {!collapsed && (
          <div style={{ padding: "16px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
              {user.name.charAt(0)}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Customer</div>
            </div>
          </div>
        )}

        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(item => <SidebarLink key={item.id} item={item} />)}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: `1px solid ${C.border}` }}>
          <button className="sidebar-link" onClick={() => { store.logout(); router.push("/"); }}>
            <span>🚪</span>{!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: collapsed ? 60 : 240, flex: 1, transition: "margin .3s", minHeight: "100vh" }}>
        <div style={{ padding: "24px 32px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700, color: C.textPrimary }}>
                {active === "dashboard" ? `Good day, ${user.name.split(" ")[0]}! 👋` : NAV.find(n => n.id === active)?.label}
              </h1>
              <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>📍 {user.city || "Nellore"}, {user.state || "Andhra Pradesh"}</p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={() => setSosModal(true)} style={{ padding: "9px 18px", background: C.terra, color: "white", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: 1, animation: "pulse-dot 2s infinite" }}>
                🆘 SOS
              </button>
              <button onClick={() => setActive("notifications")} style={{ width: 38, height: 38, borderRadius: 8, background: C.cream2, border: `1px solid ${C.border}`, cursor: "pointer", fontSize: 18, position: "relative" }}>
                🔔
                <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, background: C.terra, borderRadius: "50%" }} />
              </button>
            </div>
          </div>

          {/* DASHBOARD */}
          {active === "dashboard" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              {/* SOS Card */}
              <div style={{ background: `linear-gradient(135deg, ${C.terra}, ${C.orange})`, borderRadius: 20, padding: "28px 32px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 8 }}>🚨 Need Roadside Help Right Now?</div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", marginBottom: 16 }}>Verified mechanic at your location in under 8 minutes</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["🔩 Puncture", "🔋 Battery", "⚙️ Engine", "⛽ Fuel", "🚗 Towing"].map(s => (
                      <span key={s} onClick={() => router.push("/customer/request")} style={{ padding: "6px 14px", background: "rgba(255,255,255,.2)", border: "1px solid rgba(255,255,255,.3)", borderRadius: 20, fontSize: 12, color: "white", cursor: "pointer", fontWeight: 500 }}>{s}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => router.push("/customer/request")}
                  style={{ padding: "16px 28px", background: "white", color: C.terra, border: "none", borderRadius: 12, fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, cursor: "pointer", letterSpacing: 1, flexShrink: 0 }}>
                  🆘 GET HELP
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="📋" label="TOTAL BOOKINGS" value={bookings.length.toString()} delta="All time" />
                <StatsCard icon="✅" label="COMPLETED" value={bookings.filter(b => b.status === "completed").length.toString()} color={C.green} />
                <StatsCard icon="⚡" label="ACTIVE" value={bookings.filter(b => b.status === "in_progress").length.toString()} color={C.blue} />
                <StatsCard icon="💰" label="TOTAL SPENT" value={"₹" + bookings.reduce((s, b) => s + (b.amount || 0), 0).toLocaleString("en-IN")} color={C.terra} />
              </div>

              {/* Recent bookings */}
              <Card style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary }}>Recent Bookings</h3>
                  <Btn variant="ghost" onClick={() => setActive("bookings")} style={{ fontSize: 12 }}>View All →</Btn>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="data-table">
                    <thead><tr><th>Booking ID</th><th>Issue</th><th>Mechanic</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {bookings.slice(0, 3).map(b => (
                        <tr key={b.id}>
                          <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12 }}>{b.id}</span></td>
                          <td>{b.issue}</td>
                          <td>{b.mechanic || "—"}</td>
                          <td>{b.date}</td>
                          <td><strong>₹{b.amount || "—"}</strong></td>
                          <td><StatusBadge status={b.status} /></td>
                          <td>
                            {b.status === "in_progress" && <Btn variant="primary" onClick={() => router.push("/customer/track")} style={{ fontSize: 11, padding: "4px 10px" }}>Track</Btn>}
                            {b.status === "completed" && <Btn variant="ghost" style={{ fontSize: 11, padding: "4px 10px" }}>Invoice</Btn>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Quick actions */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {[
                  { icon: "🔧", title: "Book a Mechanic", desc: "Start a new service request", action: () => router.push("/customer/request"), color: C.amber },
                  { icon: "🚗", title: "Add Vehicle", desc: "Register a new vehicle", action: () => setActive("vehicles"), color: C.orange },
                  { icon: "📍", title: "Track Mechanic", desc: "Live GPS tracking", action: () => router.push("/customer/track"), color: C.terra },
                  { icon: "💬", title: "Chat Support", desc: "24/7 customer support", action: () => router.push("/support"), color: C.green },
                  { icon: "🧾", title: "My Invoices", desc: "Download past invoices", action: () => setActive("invoices"), color: C.blue },
                  { icon: "⭐", title: "My Reviews", desc: "Ratings I've given", action: () => setActive("bookings"), color: C.amberDark },
                ].map((a, i) => (
                  <Card key={i} onClick={a.action} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${a.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{a.icon}</div>
                    <div>
                      <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 600, color: C.textPrimary }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{a.desc}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {active === "bookings" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 600, color: C.textPrimary }}>All Bookings</h3>
                  <Btn onClick={() => router.push("/customer/request")}>+ New Request</Btn>
                </div>
                <table className="data-table">
                  <thead><tr><th>Booking ID</th><th>Vehicle</th><th>Issue</th><th>Mechanic</th><th>Location</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.amber }}>{b.id}</span></td>
                        <td>Car</td>
                        <td>{b.issue}</td>
                        <td>{b.mechanic || <span style={{ color: C.textMuted }}>Pending</span>}</td>
                        <td>{b.location}</td>
                        <td>{b.date}</td>
                        <td><strong>₹{b.amount || "—"}</strong></td>
                        <td><StatusBadge status={b.status} /></td>
                        <td style={{ display: "flex", gap: 6 }}>
                          {b.status === "in_progress" && <Btn variant="primary" onClick={() => router.push("/customer/track")} style={{ fontSize: 11, padding: "4px 8px" }}>Track</Btn>}
                          {b.status === "completed" && <Btn variant="ghost" style={{ fontSize: 11, padding: "4px 8px" }}>Invoice</Btn>}
                          <Btn variant="ghost" style={{ fontSize: 11, padding: "4px 8px" }}>Details</Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* VEHICLES */}
          {active === "vehicles" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 700, color: C.textPrimary }}>My Vehicles</h2>
                <Btn onClick={() => showToast("Vehicle form coming soon!")}>+ Add Vehicle</Btn>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {vehicles.length > 0 ? vehicles.map((v, i) => (
                  <Card key={i}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>{v.type?.includes("Bike") ? "🏍️" : "🚗"}</div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary }}>{v.brand} {v.model}</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: C.amber, margin: "6px 0" }}>{v.number}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{v.type} · {v.fuel}</div>
                    <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                      <Btn variant="ghost" style={{ fontSize: 12, flex: 1, justifyContent: "center" }}>Edit</Btn>
                      <Btn variant="primary" onClick={() => router.push("/customer/request")} style={{ fontSize: 12, flex: 1, justifyContent: "center" }}>Book Service</Btn>
                    </div>
                  </Card>
                )) : (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: C.textMuted }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🚗</div>
                    <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, color: C.textSecondary }}>No vehicles yet</h3>
                    <p style={{ marginBottom: 20 }}>Add your vehicle to get started</p>
                    <Btn onClick={() => showToast("Opening vehicle form...")}>+ Add Your First Vehicle</Btn>
                  </div>
                )}
                <Card onClick={() => showToast("Add vehicle form!")} style={{ border: `2px dashed ${C.border}`, background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 32, minHeight: 180, cursor: "pointer" }}>
                  <div style={{ fontSize: 32 }}>➕</div>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 600, color: C.textMuted }}>Add New Vehicle</div>
                </Card>
              </div>
            </div>
          )}

          {/* SAVED MECHANICS */}
          {active === "mechanics" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 700, color: C.textPrimary, marginBottom: 20 }}>Saved Mechanics</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {sampleMechanics.filter(m => m.status === "approved").map((m, i) => (
                  <Card key={i}>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.cream2, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, color: C.amberDark, flexShrink: 0 }}>{m.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, color: C.textPrimary }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: C.amber }}>{"★".repeat(Math.round(m.rating))} {m.rating}</div>
                        <div style={{ fontSize: 12, color: C.textMuted }}>{m.city} · {m.experience} yrs exp</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                      {m.skills.map(s => <span key={s} style={{ padding: "3px 10px", background: C.cream2, borderRadius: 20, fontSize: 11, color: C.textSecondary }}>{s}</span>)}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn variant="ghost" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>📞 Call</Btn>
                      <Btn variant="primary" onClick={() => router.push("/customer/request")} style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>Book</Btn>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {active === "payments" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="💰" label="TOTAL SPENT" value={"₹" + bookings.reduce((s, b) => s + (b.amount || 0), 0).toLocaleString("en-IN")} />
                <StatsCard icon="✅" label="PAID" value={bookings.filter(b => b.status === "completed").length.toString() + " jobs"} color={C.green} />
                <StatsCard icon="🔄" label="PENDING" value="₹0" color={C.orange} />
              </div>
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Payment History</h3>
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Booking</th><th>Service</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
                  <tbody>
                    {bookings.filter(b => b.amount).map(b => (
                      <tr key={b.id}>
                        <td>{b.date}</td>
                        <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12 }}>{b.id}</span></td>
                        <td>{b.issue}</td>
                        <td><strong>₹{b.amount}</strong></td>
                        <td>UPI</td>
                        <td><StatusBadge status="completed" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {active === "notifications" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 20 }}>Notifications</h3>
                {[
                  { icon: "✅", title: "Booking Completed", desc: "Your booking BK003 has been completed by Venkat Rao", time: "2 min ago", unread: true },
                  { icon: "🔧", title: "Mechanic Accepted", desc: "Rajesh Kumar accepted your request BK003", time: "15 min ago", unread: true },
                  { icon: "💳", title: "Payment Successful", desc: "₹499 paid for booking BK002", time: "2 days ago", unread: false },
                  { icon: "⭐", title: "Rate your Mechanic", desc: "How was your experience with Suresh Babu?", time: "3 days ago", unread: false },
                ].map((n, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: `1px solid ${C.border}`, background: n.unread ? "rgba(224,123,26,.03)" : "transparent" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.cream2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{n.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: C.textPrimary, marginBottom: 3 }}>{n.title}</div>
                      <div style={{ fontSize: 13, color: C.textSecondary }}>{n.desc}</div>
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, flexShrink: 0 }}>{n.time}</div>
                    {n.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.amber, alignSelf: "center", flexShrink: 0 }} />}
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* PROFILE */}
          {active === "profile" && (
            <div style={{ animation: "fade-in .3s ease", maxWidth: 600 }}>
              <Card>
                <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "'Oswald',sans-serif", fontSize: 28, fontWeight: 700 }}>{user.name.charAt(0)}</div>
                  <div>
                    <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 700, color: C.textPrimary }}>{user.name}</h2>
                    <p style={{ fontSize: 13, color: C.textMuted }}>{user.email} · {user.phone}</p>
                    <p style={{ fontSize: 12, color: C.textMuted }}>{user.city}, {user.state}</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { label: "Full Name", val: user.name },
                    { label: "Phone", val: user.phone },
                    { label: "Email", val: user.email },
                    { label: "City", val: user.city || "Nellore" },
                  ].map((f, i) => (
                    <div key={i} style={{ padding: "12px 16px", background: C.cream, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Oswald',sans-serif", marginBottom: 4 }}>{f.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.textPrimary }}>{f.val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 24 }}>
                  <Btn onClick={() => showToast("Profile updated!")}>Update Profile</Btn>
                </div>
              </Card>
            </div>
          )}

          {/* INVOICES */}
          {active === "invoices" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 20 }}>Invoices</h3>
                {bookings.filter(b => b.status === "completed").map(b => (
                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: C.amber, marginBottom: 4 }}>INV-{b.id}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.textPrimary }}>{b.issue} by {b.mechanic}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{b.date}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, color: C.textPrimary }}>₹{b.amount}</div>
                      <Btn variant="ghost" style={{ fontSize: 12, marginTop: 8 }}>📥 Download PDF</Btn>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* SOS Modal */}
      {sosModal && (
        <div className="modal-overlay" onClick={() => setSosModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ background: C.terra, color: "white", textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🆘</div>
            <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 32, fontWeight: 700, marginBottom: 12 }}>EMERGENCY SOS</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,.85)", marginBottom: 32 }}>
              Your location will be shared immediately with the nearest available mechanic.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20 }}>
              <button onClick={() => { setSosModal(false); router.push("/customer/request"); }}
                style={{ padding: "14px 32px", background: "white", color: C.terra, border: "none", borderRadius: 10, fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                🔧 BOOK MECHANIC
              </button>
              <button onClick={() => window.open("tel:1800-247-2474")}
                style={{ padding: "14px 32px", background: "rgba(255,255,255,.2)", color: "white", border: "1px solid rgba(255,255,255,.4)", borderRadius: 10, fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
                📞 CALL HELPLINE
              </button>
            </div>
            <button onClick={() => setSosModal(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: 14 }}>Cancel</button>
          </div>
        </div>
      )}

      {toast && <div className={`toast success`}>{toast}</div>}
    </div>
  );
}