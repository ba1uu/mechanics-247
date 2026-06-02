"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { C, StatusBadge, StatsCard, Card, Btn } from "@/components/ui";
import { store } from "@/store";
import { supabase } from "@/lib/supabase";

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

type Profile = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  role: string;
  created_at: string;
};

type Booking = {
  id: string;
  customer_id: string | null;
  mechanic_id: string | null;
  service: string;
  status: string;
  location_address: string | null;
  price: number | null;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(store.getUser());
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [searchQuery, setSearchQuery] = useState("");

  // Real data from Supabase
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [mechanics, setMechanics] = useState<Profile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = store.getUser();
    if (!u || u.role !== "admin") { router.push("/login"); return; }
    setUser(u);
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      const allProfiles = profiles || [];
      setCustomers(allProfiles.filter(p => p.role === "customer"));
      setMechanics(allProfiles.filter(p => p.role === "mechanic"));

      // Fetch all bookings
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      setBookings(bookingsData || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const suspendUser = async (id: string) => {
    showToast("User suspended!");
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      showToast(`Booking status updated to ${status}`);
    }
  };

  // Computed stats
  const totalRevenue = bookings.reduce((s, b) => s + (b.price || 0), 0);
  const completedBookings = bookings.filter(b => b.status === "completed");
  const pendingBookings = bookings.filter(b => b.status === "pending");
  const activeBookings = bookings.filter(b => b.status === "accepted");
  const commission = Math.floor(totalRevenue * 0.08);

  const revenueData = [
    { month: "Jan", amount: 124000 }, { month: "Feb", amount: 138000 },
    { month: "Mar", amount: 156000 }, { month: "Apr", amount: 142000 },
    { month: "May", amount: 189000 }, { month: "Jun", amount: totalRevenue || 201000 },
  ];
  const maxRevenue = Math.max(...revenueData.map(r => r.amount));

  // Filter by search
  const filteredCustomers = customers.filter(c =>
    !searchQuery || c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredBookings = bookings.filter(b =>
    !searchQuery || b.service?.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.includes(searchQuery)
  );

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
              {!collapsed && item.id === "verifications" && pendingBookings.length > 0 && (
                <span style={{ marginLeft: "auto", background: C.terra, color: "white", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "2px 6px" }}>
                  {pendingBookings.length}
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
            <Btn variant="ghost" onClick={fetchAllData} style={{ fontSize: 12 }}>🔄 Refresh</Btn>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f59e2a", display: "flex", alignItems: "center", justifyContent: "center", color: C.brown, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 700 }}>A</div>
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>

          {/* DASHBOARD */}
          {active === "dashboard" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: C.textMuted }}>⏳ Loading data from Supabase...</div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                    <StatsCard icon="👥" label="TOTAL CUSTOMERS" value={customers.length.toString()} delta="From DB" color={C.amber} />
                    <StatsCard icon="🔧" label="MECHANICS" value={mechanics.length.toString()} delta="From DB" color={C.green} />
                    <StatsCard icon="📋" label="TOTAL BOOKINGS" value={bookings.length.toString()} delta={pendingBookings.length + " pending"} color={C.blue} />
                    <StatsCard icon="💰" label="TOTAL REVENUE" value={"₹" + totalRevenue.toLocaleString("en-IN")} delta={"₹" + commission.toLocaleString("en-IN") + " commission"} color={C.terra} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
                    <Card>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary }}>Revenue Chart</h3>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: C.amberDark }}>₹{totalRevenue.toLocaleString("en-IN")}</span>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 160, marginBottom: 12 }}>
                        {revenueData.map((r, i) => (
                          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                            <div style={{ fontSize: 10, color: C.textMuted }}>{(r.amount / 1000).toFixed(0)}k</div>
                            <div style={{ width: "100%", background: C.amber, borderRadius: "4px 4px 0 0", height: `${(r.amount / maxRevenue) * 120}px`, transition: "height .5s ease" }} />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        {revenueData.map(r => <div key={r.month} style={{ flex: 1, textAlign: "center", fontSize: 11, color: C.textMuted }}>{r.month}</div>)}
                      </div>
                    </Card>

                    <Card>
                      <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Platform Health</h3>
                      {[
                        { label: "Total Customers", val: customers.length.toString(), good: true },
                        { label: "Total Mechanics", val: mechanics.length.toString(), good: true },
                        { label: "Pending Bookings", val: pendingBookings.length.toString(), good: pendingBookings.length === 0 },
                        { label: "Active Bookings", val: activeBookings.length.toString(), good: true },
                        { label: "Completed Jobs", val: completedBookings.length.toString(), good: true },
                        { label: "Platform Commission", val: "₹" + commission.toLocaleString("en-IN"), good: true },
                      ].map((s, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                          <span style={{ fontSize: 13, color: C.textSecondary }}>{s.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: s.good ? C.green : C.terra }}>{s.val}</span>
                        </div>
                      ))}
                    </Card>
                  </div>

                  {/* Recent bookings */}
                  <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                      <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary }}>Recent Bookings</h3>
                      <Btn variant="ghost" onClick={() => setActive("bookings")} style={{ fontSize: 12 }}>View All →</Btn>
                    </div>
                    <table className="data-table">
                      <thead><tr><th>Booking ID</th><th>Service</th><th>Location</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                      <tbody>
                        {bookings.slice(0, 5).map(b => (
                          <tr key={b.id}>
                            <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: C.amber }}>{b.id.slice(0, 8)}...</span></td>
                            <td>{b.service}</td>
                            <td>{b.location_address || "—"}</td>
                            <td>{new Date(b.created_at).toLocaleDateString()}</td>
                            <td><strong>₹{b.price || "—"}</strong></td>
                            <td><StatusBadge status={b.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* USERS */}
          {active === "users" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="👥" label="TOTAL CUSTOMERS" value={customers.length.toString()} />
                <StatsCard icon="✅" label="WITH BOOKINGS" value={customers.filter(c => bookings.some(b => b.customer_id === c.id)).length.toString()} color={C.green} />
                <StatsCard icon="📋" label="TOTAL BOOKINGS" value={bookings.length.toString()} color={C.amber} />
              </div>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary }}>All Customers ({filteredCustomers.length})</h3>
                  <Btn variant="ghost" style={{ fontSize: 12 }}>Export CSV</Btn>
                </div>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted }}>⏳ Loading...</div>
                ) : filteredCustomers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted }}>No customers found</div>
                ) : (
                  <table className="data-table">
                    <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>City</th><th>Bookings</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filteredCustomers.map(c => (
                        <tr key={c.id}>
                          <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: C.amber }}>{c.id.slice(0, 8)}...</span></td>
                          <td><strong>{c.name || "—"}</strong></td>
                          <td>{c.phone || "—"}</td>
                          <td>{c.email || "—"}</td>
                          <td>{c.city || "—"}</td>
                          <td><span style={{ fontWeight: 700 }}>{bookings.filter(b => b.customer_id === c.id).length}</span></td>
                          <td>{new Date(c.created_at).toLocaleDateString()}</td>
                          <td style={{ display: "flex", gap: 6 }}>
                            <Btn variant="ghost" style={{ fontSize: 11, padding: "4px 8px" }}>View</Btn>
                            <Btn variant="danger" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => suspendUser(c.id)}>Suspend</Btn>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            </div>
          )}

          {/* MECHANICS */}
          {active === "mechanics" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="🔧" label="TOTAL MECHANICS" value={mechanics.length.toString()} />
                <StatsCard icon="✅" label="ACTIVE JOBS" value={activeBookings.length.toString()} color={C.green} />
                <StatsCard icon="📋" label="COMPLETED JOBS" value={completedBookings.length.toString()} color={C.amber} />
              </div>
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>All Mechanics ({mechanics.length})</h3>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted }}>⏳ Loading...</div>
                ) : mechanics.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted }}>No mechanics registered yet</div>
                ) : (
                  <table className="data-table">
                    <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>City</th><th>Jobs Done</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                      {mechanics.map(m => (
                        <tr key={m.id}>
                          <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: C.amber }}>{m.id.slice(0, 8)}...</span></td>
                          <td><strong>{m.name || "—"}</strong></td>
                          <td>{m.phone || "—"}</td>
                          <td>{m.email || "—"}</td>
                          <td>{m.city || "—"}</td>
                          <td>{bookings.filter(b => b.mechanic_id === m.id && b.status === "completed").length}</td>
                          <td>{new Date(m.created_at).toLocaleDateString()}</td>
                          <td style={{ display: "flex", gap: 6 }}>
                            <Btn variant="ghost" style={{ fontSize: 11, padding: "4px 8px" }}>View</Btn>
                            <Btn variant="danger" style={{ fontSize: 11, padding: "4px 8px" }} onClick={() => suspendUser(m.id)}>Suspend</Btn>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            </div>
          )}

          {/* BOOKINGS */}
          {active === "bookings" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="📋" label="TOTAL" value={bookings.length.toString()} />
                <StatsCard icon="⏳" label="PENDING" value={pendingBookings.length.toString()} color={C.orange} />
                <StatsCard icon="🔵" label="ACTIVE" value={activeBookings.length.toString()} color={C.blue} />
                <StatsCard icon="✅" label="COMPLETED" value={completedBookings.length.toString()} color={C.green} />
              </div>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary }}>All Bookings ({filteredBookings.length})</h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="ghost" style={{ fontSize: 12 }}>Export</Btn>
                  </div>
                </div>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted }}>⏳ Loading...</div>
                ) : filteredBookings.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted }}>No bookings found</div>
                ) : (
                  <table className="data-table">
                    <thead><tr><th>Booking ID</th><th>Service</th><th>Customer ID</th><th>Location</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {filteredBookings.map(b => (
                        <tr key={b.id}>
                          <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: C.amber }}>{b.id.slice(0, 8)}...</span></td>
                          <td>{b.service}</td>
                          <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11 }}>{b.customer_id?.slice(0, 8) || "—"}...</span></td>
                          <td>{b.location_address || "—"}</td>
                          <td>{new Date(b.created_at).toLocaleDateString()}</td>
                          <td><strong>₹{b.price || "—"}</strong></td>
                          <td><StatusBadge status={b.status} /></td>
                          <td style={{ display: "flex", gap: 4 }}>
                            {b.status === "pending" && <Btn variant="success" style={{ fontSize: 11, padding: "4px 6px" }} onClick={() => updateBookingStatus(b.id, "accepted")}>Accept</Btn>}
                            {b.status !== "completed" && b.status !== "cancelled" && (
                              <Btn variant="danger" style={{ fontSize: 11, padding: "4px 6px" }} onClick={() => updateBookingStatus(b.id, "cancelled")}>Cancel</Btn>
                            )}
                            <Btn variant="ghost" style={{ fontSize: 11, padding: "4px 6px" }}>Details</Btn>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            </div>
          )}

          {/* REVENUE */}
          {active === "revenue" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="💰" label="TOTAL REVENUE" value={"₹" + totalRevenue.toLocaleString("en-IN")} color={C.amber} />
                <StatsCard icon="📊" label="COMMISSION (8%)" value={"₹" + commission.toLocaleString("en-IN")} color={C.green} />
                <StatsCard icon="🔧" label="MECHANIC PAYOUTS" value={"₹" + (totalRevenue - commission).toLocaleString("en-IN")} color={C.orange} />
                <StatsCard icon="📋" label="PAID JOBS" value={completedBookings.length.toString()} color={C.terra} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
                <Card>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 20 }}>Booking Revenue Breakdown</h3>
                  {completedBookings.length === 0 ? (
                    <p style={{ color: C.textMuted, textAlign: "center", padding: "24px 0" }}>No completed bookings yet</p>
                  ) : (
                    <table className="data-table">
                      <thead><tr><th>Booking ID</th><th>Service</th><th>Date</th><th>Gross</th><th>Commission</th><th>Payout</th></tr></thead>
                      <tbody>
                        {completedBookings.map(b => (
                          <tr key={b.id}>
                            <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: C.amber }}>{b.id.slice(0, 8)}...</span></td>
                            <td>{b.service}</td>
                            <td>{new Date(b.created_at).toLocaleDateString()}</td>
                            <td><strong>₹{b.price || 0}</strong></td>
                            <td style={{ color: C.green }}>₹{Math.floor((b.price || 0) * 0.08)}</td>
                            <td>₹{Math.floor((b.price || 0) * 0.92)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
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
                    <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>₹{(totalRevenue - commission).toLocaleString("en-IN")} pending for mechanics</p>
                    <Btn variant="success" onClick={() => showToast("✅ Payouts initiated!")} style={{ width: "100%", justifyContent: "center" }}>💰 Send All Payouts</Btn>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* VERIFICATIONS */}
          {active === "verifications" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 700, color: C.textPrimary, marginBottom: 20 }}>Pending Bookings Queue</h2>
              {pendingBookings.length === 0 ? (
                <Card style={{ textAlign: "center", padding: 48 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, color: C.green }}>All caught up!</h3>
                  <p style={{ color: C.textMuted }}>No pending bookings</p>
                </Card>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {pendingBookings.map(b => (
                    <Card key={b.id}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
                        <div>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>{b.service}</div>
                          <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 4 }}>📍 {b.location_address || "Location not set"}</div>
                          <div style={{ fontSize: 12, color: C.textMuted }}>Customer: {b.customer_id?.slice(0, 8)}... · {new Date(b.created_at).toLocaleString()}</div>
                          <div style={{ marginTop: 8 }}><StatusBadge status={b.status} /></div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <Btn variant="success" onClick={() => updateBookingStatus(b.id, "accepted")} style={{ justifyContent: "center" }}>✅ Assign</Btn>
                          <Btn variant="danger" onClick={() => updateBookingStatus(b.id, "cancelled")} style={{ justifyContent: "center" }}>❌ Cancel</Btn>
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
                        <td><Btn variant="primary" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => showToast("Opening ticket " + t.id)}>Resolve</Btn></td>
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
                      {[{ label: "Booking", val: d.booking }, { label: "Customer", val: d.customer }, { label: "Mechanic", val: d.mechanic }, { label: "Amount", val: d.amount }].map(f => (
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
              <Card>
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
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, fontFamily: "'Oswald',sans-serif", display: "block", marginBottom: 8 }}>TITLE</label>
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
                <Btn onClick={() => showToast("✅ Settings saved!")}>Save Settings</Btn>
              </Card>
            </div>
          )}
        </div>
      </div>

      {toast.msg && (
        <div className={`toast ${toast.type === "error" ? "error" : "success"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}