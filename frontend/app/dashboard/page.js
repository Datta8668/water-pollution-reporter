"use client";

import { useEffect, useState } from "react";
import { getIncidents, getMapIncidents, updateIncidentStatus } from "@/lib/api";
import dynamic from "next/dynamic";
import SeverityChart from "@/components/Charts/SeverityChart";
import TrendChart from "@/components/Charts/TrendChart";
import { useRouter } from "next/navigation";
import { getUser, getToken } from "@/utils/auth";


// ✅ Fix for Leaflet (no SSR)
const PollutionMap = dynamic(
  () => import("@/components/Map/PollutionMap"),
  { ssr: false }
);

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [mapData, setMapData] = useState([]);

  // ✅ ADD THIS BLOCK HERE
  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "officer" && user?.role !== "admin") {
      router.push("/citizen/dashboard");
    }
  }, []);


  // ✅ FETCH DATA
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getIncidents();
        const map = await getMapIncidents();

        console.log("All Incidents:", data);
        console.log("Map Data:", map);

        // ✅ SAFE ARRAY FIX (VERY IMPORTANT)
        const incidentsArray = Array.isArray(data)
          ? data
          : data?.data || data?.incidents || [];

        const mapArray = Array.isArray(map)
          ? map
          : map?.data || [];

        setIncidents(incidentsArray);
        setMapData(mapArray);
      } catch (err) {
        console.error("Error:", err);
      }
    }

    fetchData();
  }, []);

  // ✅ SAFETY (avoid filter error)
  const safeIncidents = Array.isArray(incidents) ? incidents : [];

  // ✅ STATS CALCULATION
  const today = new Date().toDateString();

  const totalToday = safeIncidents.filter(
    (i) => new Date(i.created_at).toDateString() === today
  ).length;

  const pending = safeIncidents.filter(
    (i) => i.status === "pending"
  ).length;

  const highCritical = safeIncidents.filter(
    (i) => i.severity === "high" || i.severity === "critical"
  ).length;

  const resolvedMonth = safeIncidents.filter((i) => {
    const d = new Date(i.created_at);
    const now = new Date();

    return (
      i.status === "resolved" &&
      d.getMonth() === now.getMonth()
    );
  }).length;

  // ✅ STATUS UPDATE
  const handleStatusChange = async (id) => {
    try {
      await updateIncidentStatus(id, "resolved");

      alert("Status updated!");

      const updated = await getIncidents();

      const updatedArray = Array.isArray(updated)
        ? updated
        : updated?.data || [];

      setIncidents(updatedArray);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ UI
  return (
    <div style={{ padding: "20px" }}>
      <h1>Government Dashboard</h1>

      {/* 🔷 STAT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div style={{ padding: "20px", background: "#e3f2fd", borderRadius: "10px" }}>
          <h3>Today</h3>
          <h2>{totalToday}</h2>
        </div>

        <div style={{ padding: "20px", background: "#fff3cd", borderRadius: "10px" }}>
          <h3>Pending</h3>
          <h2>{pending}</h2>
        </div>

        <div style={{ padding: "20px", background: "#f8d7da", borderRadius: "10px" }}>
          <h3>High / Critical</h3>
          <h2>{highCritical}</h2>
        </div>

        <div style={{ padding: "20px", background: "#d4edda", borderRadius: "10px" }}>
          <h3>Resolved (Month)</h3>
          <h2>{resolvedMonth}</h2>
        </div>
      </div>

      <br />

      {/* 🗺️ MAP */}
      <h2>All Incidents Map</h2>
      <PollutionMap data={mapData} />

      <br />

      {/* 📊 CHARTS */}
      <h2>Analytics</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <SeverityChart data={safeIncidents} />
        <TrendChart data={safeIncidents} />
      </div>

      <br />

      {/* 📋 TABLE */}
      <h2>All Incidents</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {safeIncidents.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.severity}</td>
              <td>{item.status}</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleStatusChange(item.id)}>
                  Mark Resolved
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>Total Incidents: {safeIncidents.length}</p>
    </div>
  );
}
