"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function TrendChart({ data }) {
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toDateString();
  });

  const chartData = last7Days.map((day) => ({
    date: day,
    count: data.filter(
      (i) => new Date(i.created_at).toDateString() === day
    ).length,
  }));

  return (
    <LineChart width={400} height={300} data={chartData}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="count" />
    </LineChart>
  );
}
