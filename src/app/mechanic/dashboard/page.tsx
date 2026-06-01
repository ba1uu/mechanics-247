"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { C, StatusBadge, StatsCard, Card, Btn } from "@/components/ui";
import { store, sampleBookings } from "@/store";

const NAV = [
  { icon: "📊", label: "Dashboard", id: "dashboard" },
  { icon: "🆕", label: "New Requests", id: "requests" },
  { icon: "✅", label: "Accepted Jobs", id: "accepted" },
  { icon: "📋", label: "Completed Jobs", id: "completed" },
  { icon: "💰", label: "Earnings", id: "earnings" },
  { icon: "👛", label: "Wallet", id: "wallet" },
  { icon: "⭐", label: "Reviews", id: "reviews" },
  { icon: "👤", label: "My Profile", id: "profile" },
  { icon: "⚙️", label: "Settings", id: "settings" },
];

const INCOMING = [
  { id: "REQ001", customer: "Amit S.", vehicle: "Maruti Swift", issue: "Engine Problem", distance: "1.8 km", fare: "₹450–₹600", time: 15 },
  { id: "REQ002", customer: "Priya R.", vehicle: "Honda Activa", issue: "Puncture", distance: "0.9 km", fare: "₹150–₹200", time: 12 },
];

export default function MechanicDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(store.getUser());
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [requests, setRequests] = useState(INCOMING);
  const [timers, setTimers] = useState<Record<string, number>>({ REQ001: 15, REQ002: 12 });
  const [acceptedJobs, setAcceptedJobs] = useState<typeof INCOMING>([]);
  const [jobStep, setJobStep] = useState<Record<string, number>>({});

  useEffect(() => {
    const u = store.getUser();
    if (!u || u.role !== "mechanic") { router.push("/login"); return; }
    setUser(u);
  }, []);

  // Countdown timers for incoming requests
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(k => {
          if (updated[k] > 0) updated[k] -= 1;
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const acceptRequest = (req: typeof INCOMING[0]) => {
    setRequests(prev => prev.filter(r => r.id !== req.id));
    setAcceptedJobs(prev => [...prev, req]);
    setJobStep(prev => ({ ...prev, [req.id]: 0 }));
    showToast("✅ Job accepted! Navigate to customer.");
    setActive("accepted");
  };

  const declineRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    showToast("Job declined.", "error");
  };

  const JOB_STEPS = ["Reached Customer", "Diagnosis Started", "Repair Started", "Repair Completed"];

  const advanceStep = (jobId: string) => {
    setJobStep(prev => {
      const current = prev[jobId] ?? 0;
      if (current < JOB_STEPS.length - 1) return { ...prev, [jobId]: current + 1 };
      // Complete
      setAcceptedJobs(p => p.filter(j => j.id !== jobId));
      showToast("🎉 Job completed! ₹499 credited to wallet.");
      setActive("completed");
      return prev;
    });
  };

  const revenueData = [1200, 1800, 1400, 2200, 1600, 2400, 1950];
  const maxBar = Math.max(...revenueData);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.cream, fontFamily: "'Inter',sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: collapsed ? 64 : 248, background: C.white, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, transition: "width .3s", zIndex: 100, overflowX: "hidden" }}>
        <div style={{ padding: "16px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {!collapsed && <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, color: C.amberDark }}>🔧 M24/7</span>}
          <button onClick={() => setCollapsed(c => !c)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.textMuted, marginLeft: collapsed ? "auto" : 0 }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {!collapsed && (
          <div style={{ padding: "14px 12px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{user.name}</div>
                <div style={{ fontSize: 11, color: C.amber }}>⭐ 4.9 · Mechanic</div>
              </div>
            </div>
            {/* Online toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: isOnline ? "rgba(45,122,58,.1)" : C.cream2, borderRadius: 10, padding: "10px 14px", border: `1px solid ${isOnline ? C.green : C.border}` }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: isOnline ? C.green : C.textMuted, fontFamily: "'Oswald',sans-serif" }}>{isOnline ? "🟢 ONLINE" : "⚫ OFFLINE"}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{isOnline ? "Accepting jobs" : "Not available"}</div>
              </div>
              <div onClick={() => { setIsOnline(o => !o); showToast(isOnline ? "You're now offline" : "You're now online!"); }}
                style={{ width: 44, height: 24, borderRadius: 12, background: isOnline ? C.green : C.border, position: "relative", cursor: "pointer", transition: "all .3s" }}>
                <div style={{ position: "absolute", top: 3, left: isOnline ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left .3s" }} />
              </div>
            </div>
          </div>
        )}

        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`sidebar-link ${active === item.id ? "active" : ""}`}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.id === "requests" && requests.length > 0 && (
                <span style={{ marginLeft: "auto", background: C.terra, color: "white", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "2px 6px" }}>
                  {requests.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "10px 8px", borderTop: `1px solid ${C.border}` }}>
          <button className="sidebar-link" onClick={() => { store.logout(); router.push("/"); }}>
            <span>🚪</span>{!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: collapsed ? 64 : 248, flex: 1, transition: "margin .3s" }}>
        {/* Top bar */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 20, fontWeight: 700, color: C.textPrimary }}>
            {NAV.find(n => n.id === active)?.icon} {NAV.find(n => n.id === active)?.label}
          </h2>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: C.amberDark, background: C.cream2, padding: "6px 14px", borderRadius: 8 }}>
              💰 Today: ₹1,240
            </div>
            <button onClick={() => setActive("requests")} style={{ position: "relative", width: 38, height: 38, borderRadius: 8, background: C.cream2, border: `1px solid ${C.border}`, cursor: "pointer", fontSize: 18 }}>
              🔔
              {requests.length > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, background: C.terra, borderRadius: "50%" }} />}
            </button>
          </div>
        </div>

        <div style={{ padding: "24px 28px" }}>

          {/* DASHBOARD */}
          {active === "dashboard" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              {/* Incoming request alert */}
              {requests.length > 0 && isOnline && (
                <div style={{ background: `linear-gradient(135deg, ${C.terra}, ${C.orange})`, borderRadius: 16, padding: "20px 24px", marginBottom: 20, display: "flex", gap: 20, alignItems: "center", animation: "slide-up .3s ease" }}>
                  <div style={{ fontSize: 36, animation: "pulse-dot 1s infinite" }}>🚨</div>
                  <div style={{ flex: 1, color: "white" }}>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>NEW BOOKING REQUEST!</div>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,.85)" }}>{requests[0].customer} · {requests[0].vehicle} · {requests[0].issue}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginTop: 2 }}>{requests[0].distance} away · {requests[0].fare}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setActive("requests")} style={{ padding: "10px 20px", background: "white", color: C.terra, border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>VIEW →</button>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="💰" label="TODAY'S EARNINGS" value="₹1,240" delta="↑ 18% vs yesterday" color={C.amber} />
                <StatsCard icon="✅" label="JOBS TODAY" value="4" delta="2 more pending" color={C.green} />
                <StatsCard icon="⭐" label="MY RATING" value="4.9" delta="234 reviews" color={C.orange} />
                <StatsCard icon="📋" label="THIS MONTH" value="₹38,400" delta="Target: ₹42,000" color={C.terra} />
              </div>

              {/* Earnings chart */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 17, fontWeight: 600, color: C.textPrimary }}>7-Day Earnings</h3>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: C.amberDark }}>₹12,550</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 140, marginBottom: 10 }}>
                    {revenueData.map((val, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                        <div style={{ fontSize: 10, color: C.textMuted }}>₹{(val / 1000).toFixed(1)}k</div>
                        <div style={{ width: "100%", background: i === 6 ? C.amber : "rgba(224,123,26,.2)", borderRadius: "4px 4px 0 0", height: `${(val / maxBar) * 110}px`, transition: "height .5s ease", cursor: "pointer" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.amber}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = i === 6 ? C.amber : "rgba(224,123,26,.2)"} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {days.map(d => <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 11, color: C.textMuted }}>{d}</div>)}
                  </div>
                </Card>

                <Card>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 17, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Performance</h3>
                  {[
                    { label: "Acceptance Rate", val: "92%", good: true },
                    { label: "Completion Rate", val: "98%", good: true },
                    { label: "Avg Response", val: "1.2 min", good: true },
                    { label: "Cancellations", val: "2 this month", good: false },
                    { label: "Avg Job Time", val: "34 min", good: true },
                    { label: "Repeat Customers", val: "38%", good: true },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 12, color: C.textSecondary }}>{s.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: s.good ? C.green : C.terra }}>{s.val}</span>
                    </div>
                  ))}
                </Card>
              </div>

              {/* Recent jobs */}
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 17, fontWeight: 600, color: C.textPrimary }}>Recent Jobs</h3>
                  <Btn variant="ghost" onClick={() => setActive("completed")} style={{ fontSize: 12 }}>View All →</Btn>
                </div>
                <table className="data-table">
                  <thead><tr><th>Booking</th><th>Customer</th><th>Issue</th><th>Date</th><th>Earned</th><th>Rating</th><th>Status</th></tr></thead>
                  <tbody>
                    {sampleBookings.map(b => (
                      <tr key={b.id}>
                        <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.amber }}>{b.id}</span></td>
                        <td>Customer</td>
                        <td>{b.issue}</td>
                        <td>{b.date}</td>
                        <td><strong>₹{b.amount || "—"}</strong></td>
                        <td style={{ color: C.amber }}>⭐ 4.9</td>
                        <td><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* NEW REQUESTS */}
          {active === "requests" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              {!isOnline ? (
                <Card style={{ textAlign: "center", padding: 48 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>⚫</div>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, color: C.textSecondary }}>You're Offline</h3>
                  <p style={{ color: C.textMuted, marginBottom: 20 }}>Toggle online to start receiving job requests</p>
                  <Btn onClick={() => setIsOnline(true)}>Go Online</Btn>
                </Card>
              ) : requests.length === 0 ? (
                <Card style={{ textAlign: "center", padding: 48 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, color: C.textSecondary }}>No new requests</h3>
                  <p style={{ color: C.textMuted }}>You'll be notified when a new booking comes in</p>
                </Card>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {requests.map(req => (
                    <div key={req.id} style={{ background: C.white, border: `2px solid ${C.terra}`, borderRadius: 16, padding: 24, animation: "slide-up .3s ease", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.terra}, transparent)`, width: `${(timers[req.id] / req.time) * 100}%`, transition: "width 1s linear" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, color: C.terra, letterSpacing: 1, marginBottom: 6 }}>🚨 NEW BOOKING REQUEST</div>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, fontWeight: 700, color: C.textPrimary }}>{req.customer}</div>
                          <div style={{ fontSize: 14, color: C.textSecondary, marginTop: 2 }}>{req.vehicle} · {req.issue}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 32, fontWeight: 700, color: timers[req.id] <= 5 ? C.red : C.terra }}>{timers[req.id]}s</div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>to respond</div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                        <div style={{ background: C.cream, borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                          <div style={{ fontSize: 20, marginBottom: 4 }}>📍</div>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, color: C.textPrimary }}>{req.distance}</div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>away</div>
                        </div>
                        <div style={{ background: C.cream, borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                          <div style={{ fontSize: 20, marginBottom: 4 }}>💰</div>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, color: C.textPrimary }}>{req.fare}</div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>estimate</div>
                        </div>
                        <div style={{ background: C.cream, borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                          <div style={{ fontSize: 20, marginBottom: 4 }}>⚙️</div>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, color: C.textPrimary }}>{req.issue}</div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>issue type</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={() => acceptRequest(req)}
                          style={{ flex: 1, padding: "14px", background: C.green, color: "white", border: "none", borderRadius: 10, fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
                          ✅ ACCEPT JOB
                        </button>
                        <button onClick={() => declineRequest(req.id)}
                          style={{ flex: 1, padding: "14px", background: C.cream2, color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: 10, fontFamily: "'Oswald',sans-serif", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
                          ❌ DECLINE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACCEPTED JOBS (Active) */}
          {active === "accepted" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              {acceptedJobs.length === 0 ? (
                <Card style={{ textAlign: "center", padding: 48 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                  <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 22, color: C.textSecondary }}>No active jobs</h3>
                  <p style={{ color: C.textMuted, marginBottom: 20 }}>Accept a request from the New Requests tab</p>
                  <Btn onClick={() => setActive("requests")}>View Requests</Btn>
                </Card>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {acceptedJobs.map(job => (
                    <Card key={job.id}>
                      {/* Map placeholder */}
                      <div style={{ background: "#e8dcc8", borderRadius: 12, height: 200, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(224,123,26,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(224,123,26,.06) 1px,transparent 1px)", backgroundSize: "30px 30px" }} />
                        <div style={{ textAlign: "center", zIndex: 2, position: "relative" }}>
                          <div style={{ fontSize: 40, animation: "float 2s ease-in-out infinite" }}>📍</div>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 600, color: C.brown }}>Customer Location</div>
                          <div style={{ fontSize: 13, color: C.textSecondary }}>{job.distance} away</div>
                        </div>
                        <button style={{ position: "absolute", bottom: 12, right: 12, padding: "8px 16px", background: C.green, color: "white", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                          onClick={() => showToast("Opening Google Maps...")}>
                          🗺️ Navigate
                        </button>
                      </div>

                      {/* Customer info */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                        <div style={{ background: C.cream, borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Oswald',sans-serif", marginBottom: 6 }}>CUSTOMER</div>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 700, color: C.textPrimary }}>{job.customer}</div>
                          <div style={{ fontSize: 13, color: C.textSecondary }}>{job.vehicle}</div>
                          <div style={{ fontSize: 13, color: C.terra, fontWeight: 600, marginTop: 4 }}>🔧 {job.issue}</div>
                        </div>
                        <div style={{ background: C.cream, borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Oswald',sans-serif", marginBottom: 6 }}>FARE ESTIMATE</div>
                          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 700, color: C.amberDark }}>{job.fare}</div>
                          <div style={{ fontSize: 12, color: C.textMuted }}>Final after completion</div>
                        </div>
                      </div>

                      {/* Progress steps */}
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, color: C.textSecondary, marginBottom: 12, letterSpacing: .5 }}>JOB PROGRESS</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {JOB_STEPS.map((step, i) => {
                            const current = jobStep[job.id] ?? 0;
                            const done = i < current;
                            const active = i === current;
                            return (
                              <div key={step} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: active ? "rgba(224,123,26,.08)" : done ? "rgba(45,122,58,.06)" : "transparent", border: `1px solid ${active ? C.amber : done ? C.green : C.border}` }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? C.green : active ? C.amber : C.cream2, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, flexShrink: 0 }}>
                                  {done ? "✓" : i + 1}
                                </div>
                                <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? C.amberDark : done ? C.green : C.textMuted, flex: 1 }}>{step}</span>
                                {active && <span style={{ fontSize: 11, color: C.amber, fontFamily: "'Oswald',sans-serif", fontWeight: 700 }}>CURRENT</span>}
                                {done && <span style={{ fontSize: 11, color: C.green }}>Done</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button onClick={() => advanceStep(job.id)}
                          style={{ flex: 2, padding: "13px", background: C.amber, color: "white", border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: .5, minWidth: 180 }}>
                          {(jobStep[job.id] ?? 0) < JOB_STEPS.length - 1 ? `✅ ${JOB_STEPS[(jobStep[job.id] ?? 0)]}` : "🏁 Complete Job"}
                        </button>
                        <button onClick={() => showToast("Calling customer...")}
                          style={{ flex: 1, padding: "13px", background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500, minWidth: 100 }}>
                          📞 Call
                        </button>
                        <button onClick={() => showToast("Opening chat...")}
                          style={{ flex: 1, padding: "13px", background: C.cream2, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500, minWidth: 100 }}>
                          💬 Chat
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COMPLETED JOBS */}
          {active === "completed" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="✅" label="TOTAL COMPLETED" value="234" delta="All time" color={C.green} />
                <StatsCard icon="💰" label="TOTAL EARNED" value="₹2,34,000" color={C.amber} />
                <StatsCard icon="⭐" label="AVG RATING" value="4.9 / 5" color={C.orange} />
              </div>
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Completed Jobs</h3>
                <table className="data-table">
                  <thead><tr><th>Booking ID</th><th>Customer</th><th>Issue</th><th>Date</th><th>Earned</th><th>Rating</th></tr></thead>
                  <tbody>
                    {sampleBookings.filter(b => b.status === "completed").map(b => (
                      <tr key={b.id}>
                        <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.amber }}>{b.id}</span></td>
                        <td>Customer</td>
                        <td>{b.issue}</td>
                        <td>{b.date}</td>
                        <td><strong style={{ color: C.green }}>₹{b.amount}</strong></td>
                        <td style={{ color: C.amber }}>⭐ 4.9</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* EARNINGS */}
          {active === "earnings" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="💰" label="THIS MONTH" value="₹38,400" delta="Target: ₹42,000" color={C.amber} />
                <StatsCard icon="📅" label="LAST MONTH" value="₹41,200" color={C.green} />
                <StatsCard icon="📊" label="ALL TIME" value="₹2,34,000" color={C.orange} />
                <StatsCard icon="⏳" label="PENDING PAYOUT" value="₹3,200" color={C.terra} />
              </div>
              <Card style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 20 }}>Earnings Breakdown</h3>
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Booking ID</th><th>Service</th><th>Gross</th><th>Platform Fee</th><th>Net Earned</th></tr></thead>
                  <tbody>
                    {sampleBookings.filter(b => b.amount).map(b => (
                      <tr key={b.id}>
                        <td>{b.date}</td>
                        <td><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: C.amber }}>{b.id}</span></td>
                        <td>{b.issue}</td>
                        <td>₹{b.amount}</td>
                        <td style={{ color: C.terra }}>-₹{Math.floor((b.amount || 0) * 0.08)}</td>
                        <td><strong style={{ color: C.green }}>₹{Math.floor((b.amount || 0) * 0.92)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* WALLET */}
          {active === "wallet" && (
            <div style={{ animation: "fade-in .3s ease", maxWidth: 600 }}>
              <Card style={{ background: `linear-gradient(135deg, ${C.brown}, ${C.terra})`, marginBottom: 20 }}>
                <div style={{ color: "white" }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", fontFamily: "'Oswald',sans-serif", letterSpacing: 1, marginBottom: 8 }}>WALLET BALANCE</div>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 48, fontWeight: 700, color: "#f59e2a", marginBottom: 4 }}>₹3,200</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>Next payout: Tomorrow, 9:00 AM</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                    <button onClick={() => showToast("Withdrawal initiated!")} style={{ padding: "10px 24px", background: "white", color: C.brown, border: "none", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                      💳 Withdraw Now
                    </button>
                    <button onClick={() => showToast("Bank details updated!")} style={{ padding: "10px 24px", background: "transparent", color: "white", border: "1px solid rgba(255,255,255,.4)", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      🏦 Bank Details
                    </button>
                  </div>
                </div>
              </Card>
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 17, fontWeight: 600, color: C.textPrimary, marginBottom: 16 }}>Transaction History</h3>
                {[
                  { icon: "✅", desc: "Job completed — BK003", amount: "+₹459", date: "Today", color: C.green },
                  { icon: "✅", desc: "Job completed — BK001", amount: "+₹322", date: "Yesterday", color: C.green },
                  { icon: "💸", desc: "Payout to SBI Bank", amount: "-₹3,200", date: "28 May", color: C.terra },
                  { icon: "✅", desc: "Job completed — BK002", amount: "+₹460", date: "27 May", color: C.green },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.cream2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{t.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.textPrimary }}>{t.desc}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{t.date}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 17, fontWeight: 700, color: t.color }}>{t.amount}</div>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* REVIEWS */}
          {active === "reviews" && (
            <div style={{ animation: "fade-in .3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                <StatsCard icon="⭐" label="OVERALL RATING" value="4.9 / 5" delta="234 reviews" color={C.amber} />
                <StatsCard icon="👍" label="5 STAR REVIEWS" value="198" delta="84.6% of all" color={C.green} />
                <StatsCard icon="📈" label="THIS MONTH" value="12 reviews" color={C.orange} />
              </div>
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 20 }}>Customer Reviews</h3>
                {[
                  { name: "Amit S.", rating: 5, text: "Very professional! Fixed my engine issue quickly. Highly recommended.", date: "30 May 2025" },
                  { name: "Priya R.", rating: 5, text: "Came within 7 minutes at midnight. Absolute lifesaver. 5 stars!", date: "28 May 2025" },
                  { name: "Ravi T.", rating: 4, text: "Good work. Took a bit longer than expected but result was great.", date: "26 May 2025" },
                ].map((r, i) => (
                  <div key={i} style={{ padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.cream2, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 700, color: C.amberDark }}>{r.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: C.textPrimary }}>{r.name}</div>
                          <div style={{ color: C.amber, fontSize: 14 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{r.date}</div>
                    </div>
                    <p style={{ fontSize: 14, color: C.textSecondary, fontStyle: "italic" }}>&ldquo;{r.text}&rdquo;</p>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* PROFILE */}
          {active === "profile" && (
            <div style={{ animation: "fade-in .3s ease", maxWidth: 600 }}>
              <Card>
                <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "'Oswald',sans-serif", fontSize: 32, fontWeight: 700 }}>{user.name.charAt(0)}</div>
                  <div>
                    <h2 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 24, fontWeight: 700, color: C.textPrimary }}>{user.name}</h2>
                    <div style={{ color: C.amber, fontSize: 16, marginTop: 2 }}>⭐ 4.9 · 234 jobs · Engine Specialist</div>
                    <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{user.city} · {user.phone}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Full Name", val: user.name },
                    { label: "Phone", val: user.phone },
                    { label: "Email", val: user.email },
                    { label: "City", val: user.city || "Nellore" },
                    { label: "Experience", val: "8 years" },
                    { label: "Skills", val: "Engine, Electrical" },
                  ].map((f, i) => (
                    <div key={i} style={{ padding: "12px 14px", background: C.cream, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Oswald',sans-serif", marginBottom: 3 }}>{f.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.textPrimary }}>{f.val}</div>
                    </div>
                  ))}
                </div>
                <Btn onClick={() => showToast("Profile updated!")}>Update Profile</Btn>
              </Card>
            </div>
          )}

          {/* SETTINGS */}
          {active === "settings" && (
            <div style={{ animation: "fade-in .3s ease", maxWidth: 560 }}>
              <Card>
                <h3 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 18, fontWeight: 600, color: C.textPrimary, marginBottom: 20 }}>Preferences</h3>
                {[
                  { label: "Push Notifications", desc: "New job alerts, payments", enabled: true },
                  { label: "SMS Alerts", desc: "Important account updates", enabled: true },
                  { label: "Auto-Accept Jobs", desc: "Within 2km radius only", enabled: false },
                  { label: "Night Mode (10PM–6AM)", desc: "Reduce job alerts at night", enabled: false },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{s.label}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{s.desc}</div>
                    </div>
                    <div style={{ width: 44, height: 24, borderRadius: 12, background: s.enabled ? C.green : C.border, position: "relative", cursor: "pointer" }}
                      onClick={() => showToast("Setting updated!")}>
                      <div style={{ position: "absolute", top: 3, left: s.enabled ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left .3s" }} />
                    </div>
                  </div>
                ))}
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