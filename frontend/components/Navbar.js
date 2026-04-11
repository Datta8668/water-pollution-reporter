"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeToken, getUser } from "@/utils/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/auth/login");
  };

  // ✅ Safe check — returns null on server, user object on client
  const user = typeof window !== "undefined" ? getUser() : null;

  return (
    <nav
      suppressHydrationWarning
      style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", padding: "12px 24px",
        background: "#1A6B9A", color: "white"
      }}>

      <h2 style={{ margin: 0 }}>💧 Water Pollution Reporter</h2>

      <div suppressHydrationWarning style={{ display: "flex", gap: "20px", alignItems: "center" }}>

        {user?.role === "citizen" && (
          <>
            <Link href="/citizen/dashboard" style={{ color: "white" }}>Dashboard</Link>
            <Link href="/citizen/report" style={{ color: "white" }}>Report</Link>
            <Link href="/citizen/my-reports" style={{ color: "white" }}>My Reports</Link>
          </>
        )}

        {(user?.role === "officer" || user?.role === "admin") && (
          <>
            <Link href="/dashboard" style={{ color: "white" }}>Dashboard</Link>
            <Link href="/dashboard/incidents" style={{ color: "white" }}>Incidents</Link>
            <Link href="/dashboard/analytics" style={{ color: "white" }}>Analytics</Link>
          </>
        )}

        {user && (
          <span suppressHydrationWarning style={{ opacity: 0.8 }}>
            👤 {user?.email}
          </span>
        )}

        {user && (
          <button
            onClick={handleLogout}
            style={{
              background: "white", color: "#1A6B9A",
              border: "none", padding: "6px 14px",
              borderRadius: "6px", cursor: "pointer",
              fontWeight: "bold"
            }}>
            Logout
          </button>
        )}

      </div>
    </nav>
  );
}