"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { C, StatusBadge, StatsCard, Card, Btn } from "@/components/ui";
import { store, sampleMechanics, sampleCustomers, sampleBookings } from "@/store";

const NAV = [
  { icon: "📊", label: "Dashboard", id: "dashboard" },
  { icon: "👥", label: "Manage Users", id: "users" },
  { icon: "🔧", label: "Manage Mechanics", id: "mechanics" },
  { icon: "📋", label: "All Bookings", id: "bookings" },
  { icon: "💰", label: "Revenue", id: "revenue" },
  { icon: "✅", label: "Verifications", id: "verifications" },
  { icon: "🎫", label: "Support Tickets", id: "tickets" },
  { icon: "🚨", label: "Disputes", id: "disputes" },
  { icon: "📣", label: "Notifications", id: "notifications" },
  { icon: "⚙️", label: "Settings", id: "settings" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(store.getUser());
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [mechanics, setMechanics] = useState(sampleMechanics);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const u = store.getUser();
    if (!u || u.role !== "admin") { router.push("/admin/login"); return; }
    setUser(u);
  }, []);

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const approveMechanic = (id: string) => {
    setMechanics(prev => prev.map(m => m.id === id ? { ...m, status: "approved" } : m));
    showToast("✅ Mechanic approved successfully!");
  };

  const rejectMechanic = (id: string) => {
    setMechanics(prev => prev.map(m => m.id === id ? { ...m, status: "rejected" } : m));
    showToast("❌ Mechanic application rejected.", "error");
  };

  const customers = sampleCustomers;
  const bookings = sampleBookings;

  const revenueData = [
    { month: "Jan", amount: 124000 }, { month: "Feb", amount: 138000 },
    { month: "Mar", amount: 156000 }, { month: "Apr", amount: 142000 },
    { month: "May", amount: 189000 }, { month: "Jun", amount: 201000 },
  ];
  const maxRevenue = Math.max(...revenueData.map(r => r.amount));

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.cream, fontFamily: "'Inter',sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: collapsed ? 64 : 256, background: C.brown, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, transition: "width .3s", zIndex: 100, overflowX: "hidden" }}>
        <div style={{ padding: "16px 14px", borderBottom: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {!collapsed && <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, color: "#f59e2a" }}>🔧 ADMIN</span>}
          <button onClick={() => setCollapsed(c => !c)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "rgba(255,255,255,.5)", marginLeft: collapsed ? "auto" : 0 }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {!collapsed && (
          <div style={{ padding: "14px 12px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f59e2a", display: "flex", alignItems: "center", justifyContent: "center", color: C.brown, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>A</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>Super Admin</div>
            </div>
          </div>
        )}

        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", transition: "all .2s", background: active === item.id ? "rgba(245,158,42,.2)" : "transparent", color: active === item.id ? "#f59e2a" : "rgba(255,255,255,.6)", fontSize: 13, fontWeight: active === item.id ? 600 : 400, width: "100%", textAlign: "left" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.id === "verifications" && mechanics.filter(m => m.status === "pending").length > 0 && (
                <span style={{ marginLeft: "auto", background: C.terra, color: "white", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "2px 6px" }}>
                  {mechanics.filter(m => m.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "10px 8px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <button onClick={() => { store.logout(); router.push("/"); }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: "transparent", color: "rgba(255,255,255,.5)", fontSize: 13, width: "100%", textAlign: "left" }}>
            <span>🚪</span>{!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: collapsed ? 64 : 256, flex: 1, transition: "margin .3s", minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, color: C.textPrimary }}>
            {NAV.find(n => n.id === active)?.icon} {NAV.find(n => n.id === active)?.label}
          </h2>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..."
              style={{ padding: "8px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, background: C.cream, width: 200, outline: "none" }} />
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f59e2a", display: "flex", alignItems: "center", justifyContent: "center", color: C.brown, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 700 }}>A</div>
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>

          {/* DASHBOARD OVERVIEW */}
          {active === "dashboard" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="👥" label="TOTAL USERS" value={customers.length.toString()} delta="↑ 12% this month" color={C.amber} />
                <StatsCard icon="🔧" label="ACTIVE MECHANICS" value={mechanics.filter(m => m.status === "approved").length.toString()} delta="↑ 5% this month" color={C.green} />
                <StatsCard icon="📋" label="TODAY'S BOOKINGS" value="47" delta="↑ 8% vs yesterday" color={C.blue} />
                <StatsCard icon="💰" label="TODAY'S REVENUE" value="₹23,400" delta="↑ 15% vs yesterday" color={C.terra} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
                {/* Revenue chart */}
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary }}>Revenue — Last 6 Months</h3>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: C.amberDark }}>₹9,50,000</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 160, marginBottom: 12 }}>
                    {revenueData.map((r, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                        <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'Space Mono',monospace" }}>
                          {(r.amount / 1000).toFixed(0)}k
                        </div>
                        <div style={{ width: "100%", background: C.amber, borderRadius: "4px 4px 0 0", height: `${(r.amount / maxRevenue) * 120}px`, transition: "height .5s ease", cursor: "pointer" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.amberDark}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.amber} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {revenueData.map(r => <div key={r.month} style={{ flex: 1, textAlign: "center", fontSize: 11, color: C.textMuted }}>{r.month}</div>)}
                  </div>
                </Card>

                {/* Quick stats */}
                <Card>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Platform Health</h3>
                  {[
                    { label: "Avg Response Time", val: "7.8 min", good: true },
                    { label: "Job Completion Rate", val: "94.2%", good: true },
                    { label: "Customer Satisfaction", val: "4.9 / 5", good: true },
                    { label: "Pending Verifications", val: mechanics.filter(m => m.status === "pending").length + " mechanics", good: false },
                    { label: "Open Disputes", val: "3", good: false },
                    { label: "Platform Commission", val: "₹76,000", good: true },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 13, color: C.textSecondary }}>{s.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: s.good ? C.green : C.terra }}>{s.val}</span>
                    </div>
                  ))}
                </Card>
              </div>

              {/* Recent activity */}
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Recent Activity</h3>
                {[
                  { icon: "🆕", text: "New mechanic registration — Venkat Rao from Nellore", time: "2 min ago", color: C.blue },
                  { icon: "✅", text: "Booking BK003 completed — ₹799 revenue", time: "8 min ago", color: C.green },
                  { icon: "🎫", text: "Support ticket raised by customer Priya Reddy", time: "15 min ago", color: C.orange },
                  { icon: "💰", text: "Payout of ₹3,200 sent to mechanic Rajesh Kumar", time: "32 min ago", color: C.amber },
                  { icon: "🚨", text: "Dispute raised for booking BK001 — under review", time: "1 hr ago", color: C.terra },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${a.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                    <div style={{ flex: 1, fontSize: 13, color: C.textSecondary }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, flexShrink: 0 }}>{a.time}</div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* USERS */}
          {active === "users" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="👥" label="TOTAL CUSTOMERS" value={customers.length.toString()} />
                <StatsCard icon="✅" label="ACTIVE THIS MONTH" value={customers.length.toString()} color={C.green} />
                <StatsCard icon="📋" label="TOTAL BOOKINGS" value={bookings.length.toString()} color={C.amber} />
              </div>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary }}>All Customers</h3>
                  <Btn variant="ghost" style={{ fontSize: 12 }}>Export CSV</Btn>
                </div>
                <table className="data-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>City</th><th>Bookings</th><th>Joined</th><th>Actions</th></tr></thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c.id}>
                        <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.amber }}>{c.id}</span></td>
                        <td><strong>{c.name}</strong></td>
                        <td>{c.phone}</td>
                        <td>{c.email}</td>
                        <td>{c.city}</td>
                        <td><span style={{ fontWeight: 700 }}>{c.bookings}</span></td>
                        <td>{c.joined}</td>
                        <td style={{ display: "flex", gap: 6 }}>
                          <Btn variant="ghost" style={{ fontSize: 11, padding: "4px 8px" }}>View</Btn>
                          <Btn variant="danger" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => showToast("User suspended!")}>Suspend</Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* MECHANICS */}
          {active === "mechanics" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="🔧" label="TOTAL" value={mechanics.length.toString()} />
                <StatsCard icon="✅" label="APPROVED" value={mechanics.filter(m => m.status === "approved").length.toString()} color={C.green} />
                <StatsCard icon="⏳" label="PENDING" value={mechanics.filter(m => m.status === "pending").length.toString()} color={C.orange} />
                <StatsCard icon="❌" label="REJECTED" value={mechanics.filter(m => m.status === "rejected").length.toString()} color={C.red} />
              </div>
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>All Mechanics</h3>
                <table className="data-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>City</th><th>Skills</th><th>Experience</th><th>Rating</th><th>Jobs</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {mechanics.map(m => (
                      <tr key={m.id}>
                        <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.amber }}>{m.id}</span></td>
                        <td><strong>{m.name}</strong></td>
                        <td>{m.phone}</td>
                        <td>{m.city}</td>
                        <td><span style={{ fontSize: 12 }}>{m.skills.join(", ")}</span></td>
                        <td>{m.experience} yrs</td>
                        <td><strong style={{ color: C.amber }}>⭐ {m.rating}</strong></td>
                        <td>{m.jobs}</td>
                        <td><StatusBadge status={m.status} /></td>
                        <td style={{ display: "flex", gap: 4 }}>
                          {m.status === "pending" && <>
                            <Btn variant="success" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => approveMechanic(m.id)}>✓ Approve</Btn>
                            <Btn variant="danger" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => rejectMechanic(m.id)}>✗ Reject</Btn>
                          </>}
                          {m.status === "approved" && <Btn variant="ghost" style={{ fontSize: 11, padding: "4px 8px" }}>View</Btn>}
                          {m.status === "rejected" && <Btn variant="ghost" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => approveMechanic(m.id)}>Re-approve</Btn>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* BOOKINGS */}
          {active === "bookings" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="📋" label="TOTAL BOOKINGS" value={bookings.length.toString()} />
                <StatsCard icon="✅" label="COMPLETED" value={bookings.filter(b => b.status === "completed").length.toString()} color={C.green} />
                <StatsCard icon="🔵" label="IN PROGRESS" value={bookings.filter(b => b.status === "in_progress").length.toString()} color={C.blue} />
                <StatsCard icon="❌" label="CANCELLED" value="0" color={C.red} />
              </div>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary }}>All Bookings</h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="ghost" style={{ fontSize: 12 }}>Filter</Btn>
                    <Btn variant="ghost" style={{ fontSize: 12 }}>Export</Btn>
                  </div>
                </div>
                <table className="data-table">
                  <thead><tr><th>Booking ID</th><th>Issue</th><th>Customer</th><th>Mechanic</th><th>Location</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.amber }}>{b.id}</span></td>
                        <td>{b.issue}</td>
                        <td>Customer</td>
                        <td>{b.mechanic || "—"}</td>
                        <td>{b.location}</td>
                        <td>{b.date}</td>
                        <td><strong>₹{b.amount || "—"}</strong></td>
                        <td><StatusBadge status={b.status} /></td>
                        <td><Btn variant="ghost" style={{ fontSize: 11, padding: "4px 8px" }}>Details</Btn></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* REVENUE */}
          {active === "revenue" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="💰" label="TOTAL REVENUE" value="₹9,50,000" delta="↑ 18% vs last month" color={C.amber} />
                <StatsCard icon="📊" label="PLATFORM COMMISSION" value="₹76,000" delta="8% of total" color={C.green} />
                <StatsCard icon="🔧" label="MECHANIC PAYOUTS" value="₹8,74,000" color={C.orange} />
                <StatsCard icon="⏳" label="PENDING PAYOUTS" value="₹12,400" color={C.terra} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
                <Card>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 20 }}>Monthly Revenue Breakdown</h3>
                  <table className="data-table">
                    <thead><tr><th>Month</th><th>Bookings</th><th>Total Revenue</th><th>Commission</th><th>Payouts</th><th>Growth</th></tr></thead>
                    <tbody>
                      {revenueData.map((r, i) => (
                        <tr key={r.month}>
                          <td><strong>{r.month} 2025</strong></td>
                          <td>{Math.floor(r.amount / 500)}</td>
                          <td><strong>₹{r.amount.toLocaleString("en-IN")}</strong></td>
                          <td style={{ color: C.green }}>₹{Math.floor(r.amount * 0.08).toLocaleString("en-IN")}</td>
                          <td>₹{Math.floor(r.amount * 0.92).toLocaleString("en-IN")}</td>
                          <td style={{ color: i === 0 ? C.textMuted : C.green }}>{i === 0 ? "—" : `↑ ${Math.floor(Math.random() * 15 + 5)}%`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Card>
                    <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Commission Settings</h3>
                    {[
                      { label: "Standard jobs", val: "8%" },
                      { label: "Emergency jobs", val: "10%" },
                      { label: "EV Specialist", val: "7%" },
                      { label: "Towing", val: "12%" },
                    ].map((r, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 13, color: C.textSecondary }}>{r.label}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.amber }}>{r.val}</span>
                      </div>
                    ))}
                    <Btn onClick={() => showToast("Commission settings saved!")} style={{ width: "100%", justifyContent: "center", marginTop: 12, fontSize: 12 }}>Update Settings</Btn>
                  </Card>
                  <Card>
                    <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, color: C.textPrimary, marginBottom: 12 }}>Trigger Payouts</h3>
                    <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>₹12,400 pending for 8 mechanics</p>
                    <Btn variant="success" onClick={() => showToast("✅ Payouts initiated for all mechanics!")} style={{ width: "100%", justifyContent: "center" }}>
                      💰 Send All Payouts
                    </Btn>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* VERIFICATIONS */}
          {active === "verifications" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 700, color: C.textPrimary, marginBottom: 20 }}>Mechanic Verification Queue</h2>
              {mechanics.filter(m => m.status === "pending").length === 0 ? (
                <Card style={{ textAlign: "center", padding: 48 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, color: C.green }}>All caught up!</h3>
                  <p style={{ color: C.textMuted }}>No pending verifications</p>
                </Card>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {mechanics.filter(m => m.status === "pending").map(m => (
                    <Card key={m.id}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.cream2, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, color: C.amberDark }}>{m.name.charAt(0)}</div>
                            <div>
                              <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, color: C.textPrimary }}>{m.name}</div>
                              <div style={{ fontSize: 13, color: C.textMuted }}>{m.phone} · {m.city} · {m.experience} yrs exp</div>
                            </div>
                            <StatusBadge status={m.status} />
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                            {m.skills.map(s => <span key={s} style={{ padding: "3px 10px", background: C.cream2, borderRadius: 20, fontSize: 12 }}>{s}</span>)}
                          </div>
                          <div style={{ display: "flex", gap: 12 }}>
                            {["🪪 Aadhaar", "📋 License", "🏅 Certification"].map(doc => (
                              <span key={doc} style={{ padding: "4px 12px", background: "rgba(45,122,58,.1)", border: "1px solid rgba(45,122,58,.2)", borderRadius: 8, fontSize: 12, color: C.green, cursor: "pointer" }}
                                onClick={() => showToast(`Viewing ${doc}...`)}>
                                {doc} ✓
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <Btn variant="success" onClick={() => approveMechanic(m.id)} style={{ justifyContent: "center" }}>✅ Approve</Btn>
                          <Btn variant="danger" onClick={() => rejectMechanic(m.id)} style={{ justifyContent: "center" }}>❌ Reject</Btn>
                          <Btn variant="ghost" onClick={() => showToast("Message sent to mechanic")} style={{ justifyContent: "center", fontSize: 12 }}>📞 Contact</Btn>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TICKETS */}
          {active === "tickets" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="🎫" label="OPEN TICKETS" value="12" color={C.orange} />
                <StatsCard icon="⏳" label="IN PROGRESS" value="5" color={C.blue} />
                <StatsCard icon="✅" label="RESOLVED TODAY" value="8" color={C.green} />
              </div>
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Support Tickets</h3>
                <table className="data-table">
                  <thead><tr><th>Ticket ID</th><th>Customer</th><th>Category</th><th>Subject</th><th>Created</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {[
                      { id: "TKT-001", customer: "Priya Reddy", cat: "Payment Issue", sub: "Refund not received", date: "2025-05-30", status: "open" },
                      { id: "TKT-002", customer: "Amit Sharma", cat: "Mechanic Issue", sub: "Mechanic didn't arrive", date: "2025-05-29", status: "in_progress" },
                      { id: "TKT-003", customer: "Ravi Teja", cat: "App Bug", sub: "OTP not received", date: "2025-05-28", status: "completed" },
                    ].map(t => (
                      <tr key={t.id}>
                        <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.amber }}>{t.id}</span></td>
                        <td>{t.customer}</td>
                        <td>{t.cat}</td>
                        <td>{t.sub}</td>
                        <td>{t.date}</td>
                        <td><StatusBadge status={t.status} /></td>
                        <td>
                          <Btn variant="primary" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => showToast("Opening ticket " + t.id)}>Resolve</Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* DISPUTES */}
          {active === "disputes" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Active Disputes</h3>
                {[
                  { id: "DSP-001", booking: "BK001", customer: "Amit Sharma", mechanic: "Rajesh Kumar", issue: "Charged more than estimate", amount: "₹200 excess", status: "under_review" },
                  { id: "DSP-002", booking: "BK002", customer: "Priya Reddy", mechanic: "Suresh Babu", issue: "Work not completed properly", amount: "₹499 refund", status: "pending" },
                ].map(d => (
                  <div key={d.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: C.amber }}>{d.id}</span>
                      <StatusBadge status={d.status} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
                      {[
                        { label: "Booking", val: d.booking },
                        { label: "Customer", val: d.customer },
                        { label: "Mechanic", val: d.mechanic },
                        { label: "Amount", val: d.amount },
                      ].map(f => (
                        <div key={f.label}>
                          <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Oswald',sans-serif" }}>{f.label}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{f.val}</div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 14 }}>Issue: {d.issue}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn variant="success" onClick={() => showToast("Refund approved!")} style={{ fontSize: 12 }}>✅ Approve Refund</Btn>
                      <Btn variant="danger" onClick={() => showToast("Dispute closed.")} style={{ fontSize: 12 }}>❌ Reject</Btn>
                      <Btn variant="ghost" style={{ fontSize: 12 }}>📞 Contact Both</Btn>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {active === "notifications" && (
            <div style={{ animation: "fade-in .3s ease", maxWidth: 700 }}>
              <Card style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 20 }}>Send Broadcast Notification</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 8 }}>TARGET AUDIENCE</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["All Users", "Customers Only", "Mechanics Only"].map(t => (
                        <div key={t} style={{ padding: "8px 16px", border: `1.5px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>{t}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 8 }}>NOTIFICATION TITLE</label>
                    <input placeholder="e.g. Special Offer This Weekend!" style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.cream }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 8 }}>MESSAGE</label>
                    <textarea rows={3} placeholder="Notification message..." style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.cream, resize: "vertical" }} />
                  </div>
                  <Btn onClick={() => showToast("📣 Notification sent to all users!")} style={{ alignSelf: "flex-start" }}>📣 Send Notification</Btn>
                </div>
              </Card>
            </div>
          )}

          {/* SETTINGS */}
          {active === "settings" && (
            <div style={{ animation: "fade-in .3s ease", maxWidth: 600 }}>
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 20 }}>Platform Settings</h3>
                {[
                  { label: "Platform Name", val: "Mechanics 24/7", type: "text" },
                  { label: "Support Phone", val: "1800-247-2474", type: "text" },
                  { label: "Support Email", val: "support@mechanics247.com", type: "email" },
                  { label: "Default Commission %", val: "8", type: "number" },
                  { label: "Max Mechanic ETA (min)", val: "15", type: "number" },
                ].map((s, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 6 }}>{s.label}</label>
                    <input type={s.type} defaultValue={s.val} style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.cream }} />
                  </div>
                ))}
                <Btn onClick={() => showToast("✅ Settings saved!")} style={{ marginTop: 8 }}>Save Settings</Btn>
              </Card>
            </div>
          )}
        </div>
      </div>

      {toast.msg && (
        <div className={`toast ${toast.type}`} style={{ background: toast.type === "error" ? C.red : C.green }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}