import axios from "axios";

export const registerUser = async (formData) => {
  const res = await axios.post(
    "http://127.0.0.1:8000/auth/register",
    formData
  );
  return res.data;
};

export const loginUser = async (formData) => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/auth/login",
      formData
    );

    console.log("Login Response:", res.data);
    return res.data;

  } catch (err) {
    console.log("Login Error:", err.response?.data);
    throw err;
  }
};
