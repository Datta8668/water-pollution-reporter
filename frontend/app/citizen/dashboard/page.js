"use client";

import { useEffect, useState } from "react";
import { getMyIncidents } from "@/lib/api";

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [mounted, setMounted] = useState(false); // ✅ important

  useEffect(() => {
    setMounted(true); // ✅ ensures client render only

    const loadData = async () => {
      try {
        const data = await getMyIncidents();
        console.log("API Response:", data);

        if (Array.isArray(data)) {
          setIncidents(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  // ✅ prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const total = incidents.length;
  const pending = incidents.filter(i => i.status === "pending").length;
  const resolved = incidents.filter(i => i.status === "resolved").length;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Citizen Dashboard</h1>

      <h2>Stats</h2>
      <p>Total Reports: {total}</p>
      <p>Pending: {pending}</p>
      <p>Resolved: {resolved}</p>

      <br />

      <h2>My Reports</h2>

      {incidents.length === 0 ? (
        <p>No reports found</p>
      ) : (
        <ul>
          {incidents.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong> - {item.status}
            </li>
          ))}
        </ul>
      )}

      <br />

      <a href="/citizen/report">Report New Incident</a>
      <br />
      <a href="/citizen/my-reports">View My Reports</a>
    </div>
  );
}
