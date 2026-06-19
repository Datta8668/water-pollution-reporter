"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SEVERITY_COLOR = {
  low: "#4C7A35",
  medium: "#B3871A",
  high: "#C1542E",
  critical: "#8C3A1D",
};

export default function PollutionMap({ data = [], center, zoom = 12, height = "420px" }) {
  const valid = (data || []).filter((d) => d.latitude && d.longitude);
  const mapCenter = center || (valid[0] ? [valid[0].latitude, valid[0].longitude] : [18.5204, 73.8567]);

  return (
    <MapContainer center={mapCenter} zoom={zoom} style={{ height, width: "100%" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {valid.map((item) => (
        <CircleMarker
          key={item.id}
          center={[item.latitude, item.longitude]}
          radius={9}
          pathOptions={{
            color: SEVERITY_COLOR[item.severity] || "#1C8C92",
            fillColor: SEVERITY_COLOR[item.severity] || "#1C8C92",
            fillOpacity: 0.75,
            weight: 2,
          }}
        >
          <Popup>
            <div style={{ minWidth: "160px" }}>
              <p style={{ fontWeight: 600, color: "#0B2B2E", margin: 0 }}>{item.title || "Incident"}</p>
              <p style={{ marginTop: 4, fontSize: 12, color: "#3C5457", textTransform: "capitalize" }}>
                {item.pollution_type ? item.pollution_type.replace("_", " ") : "unknown"} · {item.severity}
              </p>
              <p style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: "#0E5C63", textTransform: "capitalize" }}>
                {item.status}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
