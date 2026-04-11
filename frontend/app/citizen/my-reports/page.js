"use client";

import { useEffect, useState } from "react";
import IncidentCard from "@/components/Incident/IncidentCard";

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/incidents/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        console.log("API Response:", data);

        // ✅ FIX: ensure array
        if (Array.isArray(data)) {
          setReports(data);
        } else if (data.incidents) {
          setReports(data.incidents);
        } else if (data.data) {
          setReports(data.data);
        } else {
          setReports([]); // fallback
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Reports</h1>

      {reports.length === 0 ? (
        <p>No reports found</p>
      ) : (
        reports.map((report) => (
        <IncidentCard key={report.id} incident={report} />
      ))
      
      )}
    </div>
  );
}
