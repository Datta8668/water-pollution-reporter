import StatusBadge from "./StatusBadge";

export default function IncidentCard({ incident }) {
  return (
    <div style={{
      border: "1px solid #e5e7eb", borderRadius: "12px",
      padding: "16px", background: "white",
      marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ margin: 0 }}>{incident.title}</h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <StatusBadge value={incident.severity} type="severity" />
          <StatusBadge value={incident.status} type="status" />
        </div>
      </div>
      <p style={{ color: "#6b7280", margin: "8px 0" }}>{incident.description}</p>
      {incident.photo_url && (
        <img
          src={incident.photo_url} alt="incident"
          style={{ width: "100%", maxHeight: "180px",
            objectFit: "cover", borderRadius: "8px", marginTop: "8px" }}
        />
      )}
      <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
        📅 {new Date(incident.created_at).toLocaleDateString()} &nbsp;|&nbsp;
        🏷️ {incident.pollution_type}
      </p>
    </div>
  );
}