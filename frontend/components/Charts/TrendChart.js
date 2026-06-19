"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function TrendChart({ data = [] }) {
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const chartData = days.map((d) => ({
    date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    count: data.filter((i) => i.created_at && new Date(i.created_at).toDateString() === d.toDateString()).length,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="#DCE6E4" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#3C5457" />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#3C5457" />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#0E5C63" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
