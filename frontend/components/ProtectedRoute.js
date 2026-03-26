"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser } from "@/utils/auth";

export default function ProtectedRoute({ children, role }) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (role && user?.role !== role) {
      router.push("/unauthorized");
    }
  }, []);

  return children;
}
