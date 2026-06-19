"use client";

import { createIncident } from "@/lib/api";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const PollutionMap = dynamic(() => import("@/components/Map/PollutionMap"), { ssr: false });

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dyypu1m6i/image/upload";
const CLOUDINARY_PRESET = "unsigned_preset";

export default function ReportPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    photo_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported on this device");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocating(false);
        toast.success("Location captured");
      },
      (error) => {
        console.error(error);
        toast.error("Unable to fetch location");
        setLocating(false);
      }
    );
  };

  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: data });
      const result = await res.json();

      setForm((prev) => ({ ...prev, photo_url: result.secure_url }));
      toast.success("Photo uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createIncident(form);
      toast.success("Report submitted successfully!");
      router.push("/citizen/my-reports");
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const hasLocation = form.latitude && form.longitude;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <span className="font-data text-xs uppercase tracking-wide text-teal-600">New report</span>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Report a pollution incident</h1>
      <p className="mt-1 text-sm text-ink-soft">Add a photo and pin the location — it takes under two minutes.</p>

      <form onSubmit={handleSubmit} className="card mt-7 flex flex-col gap-5 p-6">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Title
          </span>
          <input
            name="title"
            required
            onChange={handleChange}
            placeholder="e.g. Black discharge near Mula riverbank"
            className="w-full rounded-lg border border-mist bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Description
          </span>
          <textarea
            name="description"
            rows={3}
            onChange={handleChange}
            placeholder="Colour, smell, visible effect on fish or plants, estimated area…"
            className="w-full rounded-lg border border-mist bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Photo evidence
          </span>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-mist bg-surface px-4 py-8 text-center transition hover:border-teal-400">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => uploadImage(e.target.files[0])}
            />
            {form.photo_url ? (
              <img
                src={form.photo_url}
                alt="preview"
                className="h-32 w-full max-w-xs rounded-lg object-cover"
              />
            ) : (
              <>
                <span className="text-2xl">📷</span>
                <span className="text-sm font-medium text-ink-soft">
                  {uploading ? "Uploading…" : "Tap to take or upload a photo"}
                </span>
              </>
            )}
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Address
          </span>
          <input
            name="address"
            onChange={handleChange}
            placeholder="Nearest landmark or street"
            className="w-full rounded-lg border border-mist bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Location</span>
            <button
              type="button"
              onClick={getLocation}
              disabled={locating}
              className="rounded-full border border-teal-600 px-3.5 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-50 disabled:opacity-60"
            >
              {locating ? "Locating…" : "📍 Use my location"}
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-3">
            <input
              value={form.latitude}
              readOnly
              placeholder="Latitude"
              className="font-data w-full rounded-lg border border-mist bg-mist-soft px-3.5 py-2.5 text-sm text-ink-soft"
            />
            <input
              value={form.longitude}
              readOnly
              placeholder="Longitude"
              className="font-data w-full rounded-lg border border-mist bg-mist-soft px-3.5 py-2.5 text-sm text-ink-soft"
            />
          </div>

          {hasLocation && (
            <div className="mt-3 overflow-hidden rounded-xl border border-mist">
              <PollutionMap
                data={[
                  {
                    id: "preview",
                    latitude: Number(form.latitude),
                    longitude: Number(form.longitude),
                    title: form.title || "Your report",
                    severity: "medium",
                    status: "pending",
                  },
                ]}
                center={[Number(form.latitude), Number(form.longitude)]}
                zoom={14}
                height="220px"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || uploading}
          className="mt-2 w-full rounded-lg bg-teal-700 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit report"}
        </button>
      </form>
    </div>
  );
}
