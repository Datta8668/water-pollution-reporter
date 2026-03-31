const BASE_URL = "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});


// ✅ CREATE INCIDENT
export const createIncident = async (data) => {
  const res = await fetch(`${BASE_URL}/incidents/report`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return res.json();
};


// ✅ GET ALL INCIDENTS (optional but useful)
export const getIncidents = async () => {
  const res = await fetch(`${BASE_URL}/incidents`, {
    headers: getHeaders(),
  });

  return res.json();
};


// ✅ GET MY INCIDENTS (THIS WAS MISSING 🚨)
export const getMyIncidents = async () => {
  const res = await fetch(`${BASE_URL}/incidents/my`, {
    headers: getHeaders(),
  });

  return res.json();
};
