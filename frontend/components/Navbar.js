"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeToken, getUser } from "@/utils/auth";

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
      <circle cx="16" cy="16" r="6" fill="#1C8C92" />
      <circle cx="16" cy="16" r="10" fill="none" stroke="#1C8C92" strokeWidth="1.4" opacity="0.5" />
      <circle cx="16" cy="16" r="14" fill="none" stroke="#1C8C92" strokeWidth="1.2" opacity="0.25" />
    </svg>
  );
}

const NAV = {
  citizen: [
    { href: "/citizen/dashboard", label: "Dashboard" },
    { href: "/citizen/report", label: "Report incident" },
    { href: "/citizen/my-reports", label: "My reports" },
  ],
  officer: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/incidents", label: "Incidents" },
    { href: "/dashboard/analytics", label: "Analytics" },
  ],
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const user = typeof window !== "undefined" ? getUser() : null;
  const roleGroup = user?.role === "admin" ? "officer" : user?.role;
  const links = roleGroup === "citizen" ? NAV.citizen : roleGroup === "officer" ? NAV.officer : [];

  const handleLogout = () => {
    removeToken();
    setOpen(false);
    router.push("/auth/login");
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-mist backdrop-blur"
      style={{ backgroundColor: "rgba(246,248,247,0.92)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-lg font-semibold text-ink">AquaWatch</span>
          <span className="hidden font-data text-[11px] uppercase tracking-wide text-ink-soft sm:inline">
            / pollution reporter
          </span>
        </Link>

        <nav suppressHydrationWarning className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                pathname === l.href
                  ? "bg-teal-700 text-white"
                  : "text-ink-soft hover:bg-mist-soft hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div suppressHydrationWarning className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="font-data text-xs text-ink-soft">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-mist px-3.5 py-1.5 text-sm font-semibold text-ink transition hover:border-rust-500 hover:text-rust-700"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-medium text-ink-soft hover:text-ink">
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-teal-700 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-teal-600"
              >
                Report pollution
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-mist md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 5h14M2 9h14M2 13h14" stroke="#0B2B2E" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div suppressHydrationWarning className="border-t border-mist bg-surface px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-mist-soft"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="mt-2 rounded-lg border border-mist px-3 py-2 text-left text-sm font-semibold text-rust-700"
              >
                Log out ({user?.email})
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-mist-soft"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-teal-700 px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Report pollution
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
