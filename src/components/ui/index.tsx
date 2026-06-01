// Shared reusable components

export const C = {
  // Colors
  cream: "#fdf6ed",
  cream2: "#faefd8",
  white: "#fffaf3",
  amber: "#e07b1a",
  amberDark: "#b85f0a",
  amberLight: "#f59e2a",
  orange: "#d95f1a",
  terra: "#c24a1a",
  brown: "#5c2e0a",
  textPrimary: "#2a1a08",
  textSecondary: "#6b4e2a",
  textMuted: "#a08060",
  green: "#2d7a3a",
  greenBg: "#e8f5eb",
  red: "#c0392b",
  redBg: "#fdecea",
  blue: "#1a6bff",
  blueBg: "#e8f0ff",
  border: "rgba(224,123,26,0.15)",
};

export const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  completed: { bg: "#e8f5eb", text: "#2d7a3a", border: "#2d7a3a" },
  in_progress: { bg: "#e8f0ff", text: "#1a6bff", border: "#1a6bff" },
  pending: { bg: "#fef3e2", text: "#e07b1a", border: "#e07b1a" },
  accepted: { bg: "#e8f0ff", text: "#1a6bff", border: "#1a6bff" },
  cancelled: { bg: "#fdecea", text: "#c0392b", border: "#c0392b" },
  approved: { bg: "#e8f5eb", text: "#2d7a3a", border: "#2d7a3a" },
  rejected: { bg: "#fdecea", text: "#c0392b", border: "#c0392b" },
  active: { bg: "#e8f5eb", text: "#2d7a3a", border: "#2d7a3a" },
  offline: { bg: "#f0ece6", text: "#a08060", border: "#a08060" },
};

export function StatusBadge({ status }: { status: string }) {
  const colors = statusColors[status] || statusColors.pending;
  return (
    <span style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: ".5px", fontFamily: "'Oswald',sans-serif", textTransform: "uppercase" as const }}>
      {status.replace("_", " ")}
    </span>
  );
}

export function Card({ children, style = {}, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, transition: "all .2s", ...(onClick ? { cursor: "pointer" } : {}), ...style }}
      onMouseEnter={onClick ? (e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(92,46,10,.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; } : undefined}
      onMouseLeave={onClick ? (e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; } : undefined}>
      {children}
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", style = {}, type = "button", disabled = false }:
  { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "danger" | "success"; style?: React.CSSProperties; type?: "button" | "submit"; disabled?: boolean }) {
  const variants = {
    primary: { background: C.amber, color: C.white, border: "none" },
    secondary: { background: "transparent", color: C.amberDark, border: `1.5px solid ${C.amber}` },
    ghost: { background: "transparent", color: C.textSecondary, border: `1px solid ${C.border}` },
    danger: { background: C.red, color: "white", border: "none" },
    success: { background: C.green, color: "white", border: "none" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...variants[variant], padding: "10px 20px", borderRadius: 8, fontFamily: "'Oswald',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: 1, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .6 : 1, transition: "all .2s", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" as const, ...style }}>
      {children}
    </button>
  );
}

export function Input({ label, type = "text", value, onChange, placeholder, required, options, accept }:
  { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; options?: string[]; accept?: string }) {
  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 8, fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.textPrimary, background: C.cream, outline: "none", transition: "border .2s" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, letterSpacing: ".3px", fontFamily: "'Oswald',sans-serif" }}>{label}{required && <span style={{ color: C.terra }}> *</span>}</label>
      {type === "select" ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
          <option value="">Select {label}</option>
          {options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
          style={{ ...inputStyle, resize: "vertical" }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} accept={accept}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = C.amber}
          onBlur={e => e.target.style.borderColor = C.border} />
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, breadcrumb }: { title: string; subtitle?: string; breadcrumb?: string[] }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {breadcrumb && (
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8, fontFamily: "'Space Mono',monospace" }}>
          {breadcrumb.join(" / ")}
        </div>
      )}
      <h1 style={{ fontFamily: "'Oswald',sans-serif", fontSize: 36, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 15, color: C.textSecondary }}>{subtitle}</p>}
    </div>
  );
}

export function StatsCard({ icon, label, value, delta, color }: { icon: string; label: string; value: string; delta?: string; color?: string }) {
  return (
    <Card style={{ borderLeft: `4px solid ${color || C.amber}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: ".5px", marginBottom: 6, fontFamily: "'Oswald',sans-serif" }}>{label}</div>
          <div style={{ fontFamily: "'Oswald',sans-serif", fontSize: 32, fontWeight: 700, color: C.textPrimary }}>{value}</div>
          {delta && <div style={{ fontSize: 12, color: C.green, marginTop: 4 }}>{delta}</div>}
        </div>
        <div style={{ fontSize: 28 }}>{icon}</div>
      </div>
    </Card>
  );
}