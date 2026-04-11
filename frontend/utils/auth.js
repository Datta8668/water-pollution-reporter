export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // ✅ also remove user
};

export const saveUser = (user) => {
  if (user) {
    const normalizedUser = {
      ...user,
      role: user.role?.toLowerCase?.() || user.role,
    };
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  }
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");

    if (!user || user === "undefined") {
      return null;
    }

    try {
      const parsed = JSON.parse(user);
      if (parsed.role) {
        parsed.role = parsed.role?.toLowerCase?.();
      }
      return parsed;
    } catch (err) {
      console.error("Invalid user JSON:", err);
      return null;
    }
  }
  return null;
};

export const isLoggedIn = () => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("token");
  }
  return false;
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const isAuthenticated = () => {
  return !!getToken();
};
