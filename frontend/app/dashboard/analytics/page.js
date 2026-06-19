"use client";

import { useEffect, useState } from "react";
import SeverityChart from "@/components/Charts/SeverityChart";
import TrendChart from "@/components/Charts/TrendChart";
import StatCard from "@/components/StatCard";
import Loader from "@/components/Loader";
import { getIncidents } from "@/lib/api";

export default function AnalyticsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIncidents()
      .then((data) => setIncidents(Array.isArray(data) ? data : data?.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader label="Crunching the numbers" />;
  }

  const total = incidents.length;
  const resolved = incidents.filter((i) => i.status === "resolved").length;
  const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;

  const typeCounts = incidents.reduce((acc, i) => {
    const key = i.pollution_type || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topTypeEntry = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
  const topType = topTypeEntry ? topTypeEntry[0].replace("_", " ") : "—";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <span className="font-data text-xs uppercase tracking-wide text-teal-600">Insights</span>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Analytics</h1>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total incidents" value={total} tone="teal" />
        <StatCard label="Resolution rate" value={`${resolutionRate}%`} tone="moss" />
        <StatCard label="Most reported type" value={topType} tone="silt" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-4">
          <h2 className="font-display text-base font-semibold text-ink">Severity breakdown</h2>
          <SeverityChart data={incidents} />
        </div>
        <div className="card p-4">
          <h2 className="font-display text-base font-semibold text-ink">7-day trend</h2>
          <TrendChart data={incidents} />
        </div>
      </div>
    </div>
  );
}
