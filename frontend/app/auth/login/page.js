"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginUser } from "@/services/authService";
import { getUser, saveToken, saveUser } from "@/utils/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const data = await loginUser({
      email,
      password,
    });

    console.log("Login Response:", data);

    // ❌ If no token → stop
    if (!data.access_token) {
      throw new Error("Token not received");
    }

    // ✅ Save token
    saveToken(data.access_token);

    // ✅ Save user
    if (data.user) {
      saveUser(data.user);
    }

    toast.success("Login successful!");

    // read from local storage to avoid mismatch
    const savedUser = getUser ? getUser() : null; // fallback if util is extended
    const role = savedUser?.role || data.user?.role?.toLowerCase?.();

    console.log("Login role:", role, "-- data.user:", data.user, "-- savedUser:", savedUser);

    if (role === "officer" || role === "admin") {
      router.push("/dashboard"); // government dashboard
    } else {
      router.push("/citizen/dashboard"); // citizen dashboard
    }

  } catch (err) {
    console.error(err);

    toast.error(
      err.response?.data?.detail || err.message || "Login failed"
    );
  }
};


  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      <br />
      <a href="/auth/register">Dont have an account? Register</a>
    </div>
  );
}
