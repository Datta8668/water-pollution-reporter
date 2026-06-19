"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import IncidentCard from "@/components/Incident/IncidentCard";
import Loader from "@/components/Loader";
import { getToken } from "@/utils/auth";

const FILTERS = ["all", "pending", "assigned", "in_progress", "resolved"];

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/incidents/my", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          setReports(data);
        } else if (data.incidents) {
          setReports(data.incidents);
        } else if (data.data) {
          setReports(data.data);
        } else {
          setReports([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <Loader label="Loading your reports" />;
  }

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-data text-xs uppercase tracking-wide text-teal-600">All reports</span>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">My reports</h1>
        </div>
        <Link
          href="/citizen/report"
          className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
        >
          + New report
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
              filter === f
                ? "bg-teal-700 text-white"
                : "border border-mist text-ink-soft hover:border-teal-400"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center gap-2 p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">No reports found</p>
          <p className="text-sm text-ink-soft">Try a different filter, or file a new report.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((report) => (
            <IncidentCard key={report.id} incident={report} />
          ))}
        </div>
      )}
    </div>
  );
}
