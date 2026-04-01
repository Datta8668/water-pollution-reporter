"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = {
  low: "#22c55e",
  medium: "#facc15",
  high: "#f97316",
  critical: "#ef4444",
};

export default function SeverityChart({ data }) {
  const grouped = Object.values(
    data.reduce((acc, item) => {
      if (!acc[item.severity]) {
        acc[item.severity] = { name: item.severity, value: 0 };
      }
      acc[item.severity].value++;
      return acc;
    }, {})
  );

  return (
    <PieChart width={400} height={300}>
      <Pie data={grouped} dataKey="value">
        {grouped.map((entry, index) => (
          <Cell key={index} fill={COLORS[entry.name]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
