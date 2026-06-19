const SEVERITY_FILL = { low: 0.3, medium: 0.55, high: 0.8, critical: 1 };
const SEVERITY_COLOR = { low: "#4C7A35", medium: "#B3871A", high: "#C1542E", critical: "#8C3A1D" };

const STATUS_STYLE = {
  pending: "bg-mist-soft text-ink-soft",
  assigned: "bg-teal-50 text-teal-700",
  in_progress: "bg-silt-100 text-silt-600",
  resolved: "bg-moss-100 text-moss-600",
  rejected: "bg-rust-100 text-rust-700",
};

function SeverityGauge({ value }) {
  const pct = SEVERITY_FILL[value] ?? 0.3;
  const color = SEVERITY_COLOR[value] ?? "#3C5457";
  const r = 8;
  const c = 2 * Math.PI * r;

  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0 -rotate-90">
        <circle cx="10" cy="10" r={r} fill="none" stroke="#DCE6E4" strokeWidth="3" />
        <circle
          cx="10"
          cy="10"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${c * pct} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xs font-semibold capitalize" style={{ color }}>
        {value}
      </span>
    </span>
  );
}

export default function StatusBadge({ value, type = "status" }) {
  if (!value) return null;

  if (type === "severity") {
    return <SeverityGauge value={value} />;
  }

  const style = STATUS_STYLE[value] || "bg-mist-soft text-ink-soft";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}>
      {value.replace("_", " ")}
    </span>
  );
}
