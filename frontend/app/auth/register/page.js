"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { registerUser } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "citizen",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedForm = { ...form, role: form.role?.toLowerCase?.() };
      await registerUser(normalizedForm);

      toast.success("Account created — please log in.");
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="card animate-rise p-8">
        <span className="font-data text-xs uppercase tracking-wide text-teal-600">Get started</span>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Citizens report incidents. Officers manage their zone&apos;s response.
        </p>

        <form onSubmit={handleRegister} className="mt-6 flex flex-col gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Full name
            </span>
            <input
              name="name"
              required
              onChange={handleChange}
              className="w-full rounded-lg border border-mist bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="w-full rounded-lg border border-mist bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Phone
            </span>
            <input
              name="phone"
              required
              onChange={handleChange}
              className="w-full rounded-lg border border-mist bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Password
            </span>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              className="w-full rounded-lg border border-mist bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
              I am a
            </span>
            <select
              name="role"
              onChange={handleChange}
              defaultValue="citizen"
              className="w-full rounded-lg border border-mist bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="citizen">Citizen — I want to report incidents</option>
              <option value="officer">Officer — I manage incident response</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-lg bg-teal-700 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-teal-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
