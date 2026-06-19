"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyIncidents } from "@/lib/api";
import { getUser, getToken } from "@/utils/auth";
import StatCard from "@/components/StatCard";
import IncidentCard from "@/components/Incident/IncidentCard";
import Loader from "@/components/Loader";

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

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
    if (role === "officer" || role === "admin") {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMyIncidents();
        if (Array.isArray(data)) {
          setIncidents(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <Loader label="Loading your reports" />;
  }

  const total = incidents.length;
  const pending = incidents.filter((i) => i.status === "pending").length;
  const resolved = incidents.filter((i) => i.status === "resolved").length;

  const recent = [...incidents]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-data text-xs uppercase tracking-wide text-teal-600">Citizen dashboard</span>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Your reports at a glance</h1>
        </div>
        <Link
          href="/citizen/report"
          className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
        >
          + Report new incident
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total reports" value={total} tone="teal" />
        <StatCard
          label="Pending"
          value={pending}
          tone="silt"
          hint={pending > 0 ? "Awaiting review" : "All clear"}
        />
        <StatCard label="Resolved" value={resolved} tone="moss" />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink">Recent reports</h2>
        <Link href="/citizen/my-reports" className="text-sm font-semibold text-teal-700 hover:underline">
          View all →
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="card mt-4 flex flex-col items-center gap-2 p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">No reports yet</p>
          <p className="text-sm text-ink-soft">File your first report — it takes under two minutes.</p>
          <Link
            href="/citizen/report"
            className="mt-3 rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            Report an incident
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {recent.map((item) => (
            <IncidentCard key={item.id} incident={item} />
          ))}
        </div>
      )}
    </div>
  );
}
