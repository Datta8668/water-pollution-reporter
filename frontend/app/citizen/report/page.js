"use client";

import { useState } from "react";
import { createIncident } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";


export default function ReportPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    photo_url: "",
  });

  const router = useRouter();

useEffect(() => {
  const token = getToken();

  if (!token) {
    router.push("/auth/login");
  }
}, []);

  // handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setForm((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    },
    (error) => {
      console.error(error);
      alert("Unable to fetch location");
    }
  );
};

const uploadImage = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "unsigned_preset"); // your preset

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dyypu1m6i/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();

    // ✅ Save URL
    setForm((prev) => ({
      ...prev,
      photo_url: result.secure_url,
    }));

    alert("Image uploaded!");
  } catch (err) {
    console.error(err);
    alert("Image upload failed");
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log("Submitting:", form);

    const res = await createIncident(form);

    alert("Report submitted successfully!");

    // redirect
    window.location.href = "/citizen/my-reports";

  } catch (err) {
    console.error(err);
    alert("Submission failed");
  }
};


  return (
    <div style={{ padding: "20px" }}>
      <h1>Report Pollution Incident</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />
        <textarea name="description" placeholder="Description" onChange={handleChange} />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => uploadImage(e.target.files[0])}
        />

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />

        <input
          name="latitude"
          placeholder="Latitude"
          value={form.latitude}
          readOnly
        />

        <input
          name="longitude"
          placeholder="Longitude"
          value={form.longitude}
          readOnly
        />

        <button type="button" onClick={getLocation}>
  Use My Location
</button>


        <button type="submit">
          Submit Report
        </button>
      </form>
    </div>
  );
}
