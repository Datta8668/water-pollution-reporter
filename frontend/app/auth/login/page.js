"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { loginUser } from "@/services/authService";
import { getUser, saveToken, saveUser } from "@/utils/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (!data.access_token) {
        throw new Error("Token not received");
      }

      saveToken(data.access_token);
      if (data.user) saveUser(data.user);

      toast.success("Welcome back!");

      const savedUser = getUser ? getUser() : null;
      const role = savedUser?.role || data.user?.role?.toLowerCase?.();

      if (role === "officer" || role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/citizen/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="card animate-rise p-8">
        <span className="font-data text-xs uppercase tracking-wide text-teal-600">Welcome back</span>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Log in to AquaWatch</h1>
        <p className="mt-1 text-sm text-ink-soft">Track your reports or manage your zone&apos;s incidents.</p>

        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-mist bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-mist bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-lg bg-teal-700 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-teal-700 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
