"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatusBadge from "@/components/Incident/StatusBadge";
import Loader from "@/components/Loader";
import { getIncidents, updateIncidentStatus } from "@/lib/api";

const STATUS_OPTIONS = ["pending", "assigned", "in_progress", "resolved"];
const SEVERITY_OPTIONS = ["low", "medium", "high", "critical"];

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const loadIncidents = async () => {
    try {
      const data = await getIncidents();
      setIncidents(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load incidents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateIncidentStatus(id, status);
      toast.success(`Status updated to ${status.replace("_", " ")}`);
      await loadIncidents();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loader label="Loading incidents" />;
  }

  const filtered = incidents.filter((i) => {
    const matchesSearch =
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.address?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || i.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <span className="font-data text-xs uppercase tracking-wide text-teal-600">Incident queue</span>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Incidents management</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or address…"
          className="min-w-[220px] flex-1 rounded-lg border border-mist bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-mist bg-surface px-3 py-2.5 text-sm capitalize text-ink outline-none focus:border-teal-500"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded-lg border border-mist bg-surface px-3 py-2.5 text-sm capitalize text-ink outline-none focus:border-teal-500"
        >
          <option value="all">All severities</option>
          {SEVERITY_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 font-data text-xs text-ink-soft">
        {filtered.length} of {incidents.length} incidents
      </p>

      <div className="card mt-3 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-mist text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-soft">
                  No incidents match these filters.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-b border-mist last:border-0 hover:bg-mist-soft">
                  <td className="px-4 py-3 font-data text-ink-soft">#{item.id}</td>
                  <td className="px-4 py-3 font-medium text-ink">{item.title}</td>
                  <td className="px-4 py-3 capitalize text-ink-soft">
                    {item.pollution_type ? item.pollution_type.replace("_", " ") : "unknown"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.severity} type="severity" />
                  </td>
                  <td className="px-4 py-3 font-data text-ink-soft">
                    {new Date(item.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.status} type="status" />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={item.status}
                      disabled={updatingId === item.id}
                      onChange={(e) => handleUpdate(item.id, e.target.value)}
                      className="rounded-full border border-mist bg-surface px-2.5 py-1 text-xs capitalize outline-none transition focus:border-teal-500 disabled:opacity-60"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
