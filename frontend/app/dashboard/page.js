"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SeverityChart from "@/components/Charts/SeverityChart";
import TrendChart from "@/components/Charts/TrendChart";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/Incident/StatusBadge";
import Loader from "@/components/Loader";
import { getIncidents, getMapIncidents, updateIncidentStatus } from "@/lib/api";
import { getUser, getToken } from "@/utils/auth";

const PollutionMap = dynamic(() => import("@/components/Map/PollutionMap"), { ssr: false });

export default function Dashboard() {
  const router = useRouter();

  const [incidents, setIncidents] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (!user?.role) {
      router.push("/auth/login");
      return;
    }

    const role = user.role?.toLowerCase?.();
    if (role !== "officer" && role !== "admin") {
      router.push("/citizen/dashboard");
    }
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getIncidents();
        const map = await getMapIncidents();

        const incidentsArray = Array.isArray(data) ? data : data?.data || data?.incidents || [];
        const mapArray = Array.isArray(map) ? map : map?.data || [];

        setIncidents(incidentsArray);
        setMapData(mapArray);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <Loader label="Loading dashboard" />;
  }

  const safeIncidents = Array.isArray(incidents) ? incidents : [];
  const today = new Date().toDateString();

  const totalToday = safeIncidents.filter(
    (i) => new Date(i.created_at).toDateString() === today
  ).length;

  const pending = safeIncidents.filter((i) => i.status === "pending").length;

  const highCritical = safeIncidents.filter(
    (i) => i.severity === "high" || i.severity === "critical"
  ).length;

  const resolvedMonth = safeIncidents.filter((i) => {
    const d = new Date(i.created_at);
    const now = new Date();
    return i.status === "resolved" && d.getMonth() === now.getMonth();
  }).length;

  const handleStatusChange = async (id) => {
    setUpdatingId(id);
    try {
      await updateIncidentStatus(id, "resolved");
      toast.success("Marked as resolved");

      const updated = await getIncidents();
      const updatedArray = Array.isArray(updated) ? updated : updated?.data || [];
      setIncidents(updatedArray);
    } catch (err) {
      console.error(err);
      toast.error("Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const recent = [...safeIncidents]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <span className="font-data text-xs uppercase tracking-wide text-teal-600">Officer control room</span>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Government dashboard</h1>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Reported today" value={totalToday} tone="teal" />
        <StatCard label="Pending" value={pending} tone="silt" hint={pending > 0 ? "Needs review" : "Clear"} />
        <StatCard label="High / critical" value={highCritical} tone="rust" />
        <StatCard label="Resolved this month" value={resolvedMonth} tone="moss" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="card overflow-hidden p-4 lg:col-span-3">
          <h2 className="font-display text-base font-semibold text-ink">All incidents</h2>
          <div className="mt-3 overflow-hidden rounded-xl">
            <PollutionMap data={mapData} height="380px" />
          </div>
        </div>

        <div className="card p-4 lg:col-span-2">
          <h2 className="font-display text-base font-semibold text-ink">Severity breakdown</h2>
          <SeverityChart data={safeIncidents} />
        </div>
      </div>

      <div className="card mt-6 p-4">
        <h2 className="font-display text-base font-semibold text-ink">7-day incident trend</h2>
        <TrendChart data={safeIncidents} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink">Recent incidents</h2>
        <a href="/dashboard/incidents" className="text-sm font-semibold text-teal-700 hover:underline">
          Manage all →
        </a>
      </div>

      <div className="card mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-mist text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((item) => (
              <tr key={item.id} className="border-b border-mist last:border-0 hover:bg-mist-soft">
                <td className="px-4 py-3 font-data text-ink-soft">#{item.id}</td>
                <td className="px-4 py-3 font-medium text-ink">{item.title}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={item.severity} type="severity" />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={item.status} type="status" />
                </td>
                <td className="px-4 py-3 font-data text-ink-soft">
                  {new Date(item.created_at).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right">
                  {item.status !== "resolved" ? (
                    <button
                      onClick={() => handleStatusChange(item.id)}
                      disabled={updatingId === item.id}
                      className="rounded-full border border-teal-600 px-3 py-1 text-xs font-semibold text-teal-700 transition hover:bg-teal-50 disabled:opacity-60"
                    >
                      {updatingId === item.id ? "Updating…" : "Mark resolved"}
                    </button>
                  ) : (
                    <span className="text-xs text-ink-soft">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-right font-data text-xs text-ink-soft">
        Total incidents: {safeIncidents.length}
      </p>
    </div>
  );
}
