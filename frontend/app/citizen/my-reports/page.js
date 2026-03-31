"use client";

import { useEffect, useState } from "react";

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
          <div
            key={report.id}
            style={{
              border: "1px solid gray",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <p>Status: {report.status}</p>

            {report.photo_url && (
              <img
                src={report.photo_url}
                alt="report"
                width="200"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
