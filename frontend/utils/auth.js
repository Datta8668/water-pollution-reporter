export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // ✅ also remove user
};

export const saveUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
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

export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");

    // ✅ handle null / undefined
    if (!user || user === "undefined") {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch (err) {
      console.error("Invalid user JSON:", err);
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  return !!getToken();
};
