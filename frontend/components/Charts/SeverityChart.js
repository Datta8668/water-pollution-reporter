"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = {
  low: "#4C7A35",
  medium: "#B3871A",
  high: "#C1542E",
  critical: "#8C3A1D",
  unknown: "#3C5457",
};

export default function SeverityChart({ data = [] }) {
  const grouped = Object.values(
    data.reduce((acc, item) => {
      const key = item.severity || "unknown";
      if (!acc[key]) acc[key] = { name: key, value: 0 };
      acc[key].value++;
      return acc;
    }, {})
  );

  if (grouped.length === 0) {
    return <p className="py-12 text-center text-sm text-ink-soft">No incident data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={grouped} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {grouped.map((entry, index) => (
            <Cell key={index} fill={COLORS[entry.name] || "#1C8C92"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
