"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyIncidents } from "@/lib/api";
import { getUser, getToken } from "@/utils/auth";



export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    console.log("Citizen dashboard guard user", user, "token", token);

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (!user?.role) {
      console.warn("Citizen dashboard: no user role, forcing login");
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
        console.log("API Response:", data);

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

  // ✅ Show loading (same on server + client → no hydration issue)
  if (loading) {
    return <p>Loading...</p>;
  }

  const total = incidents.length;
  const pending = incidents.filter(i => i.status === "pending").length;
  const resolved = incidents.filter(i => i.status === "resolved").length;


  
  return (
  <div style={{ padding: "20px" }}>
    <h1>Citizen Dashboard</h1>

    {/* ✅ STAT CARDS */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      marginTop: "20px"
    }}>
      
      <div style={{ padding: "20px", background: "#e3f2fd", borderRadius: "10px" }}>
        <h3>Total Reports</h3>
        <h2>{total}</h2>
      </div>

      <div style={{ padding: "20px", background: "#fff3cd", borderRadius: "10px" }}>
        <h3>Pending</h3>
        <h2>{pending}</h2>
      </div>

      <div style={{ padding: "20px", background: "#d4edda", borderRadius: "10px" }}>
        <h3>Resolved</h3>
        <h2>{resolved}</h2>
      </div>

    </div>

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
