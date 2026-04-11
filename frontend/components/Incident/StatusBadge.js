export default function StatusBadge({ value, type = "status" }) {
  const statusColors = {
    pending: { bg: "#e5e7eb", color: "#374151" },
    assigned: { bg: "#dbeafe", color: "#1e40af" },
    in_progress: { bg: "#fef3c7", color: "#92400e" },
    resolved: { bg: "#dcfce7", color: "#14532d" },
  };
  const severityColors = {
    low: { bg: "#dcfce7", color: "#14532d" },
    medium: { bg: "#fef3c7", color: "#92400e" },
    high: { bg: "#ffedd5", color: "#9a3412" },
    critical: { bg: "#fee2e2", color: "#7f1d1d" },
  };

  const colors = type === "severity"
    ? severityColors[value]
    : statusColors[value];

  return (
    <span style={{
      background: colors?.bg || "#e5e7eb",
      color: colors?.color || "#374151",
      padding: "3px 10px", borderRadius: "999px",
      fontSize: "12px", fontWeight: "bold",
      textTransform: "capitalize"
    }}>
      {value}
    </span>
  );
}