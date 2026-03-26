"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);

      toast.success("Registration successful!");
      router.push("/auth/login");

    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <br /><br />

        <select name="role" onChange={handleChange}>
          <option value="citizen">Citizen</option>
          <option value="officer">Officer</option>
        </select>

        <br /><br />
        <button type="submit">Register</button>
      </form>

      <br />
      <a href="/auth/login">Already have an account? Login</a>
    </div>
  );
}
