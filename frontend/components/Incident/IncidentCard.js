import StatusBadge from "./StatusBadge";

export default function IncidentCard({ incident }) {
  const date = incident.created_at
    ? new Date(incident.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="card animate-rise overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      {incident.photo_url && (
        <div className="h-40 w-full overflow-hidden bg-mist-soft">
          <img src={incident.photo_url} alt={incident.title} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-semibold text-ink">{incident.title}</h3>
          <StatusBadge value={incident.status} type="status" />
        </div>

        {incident.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{incident.description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-mist pt-3">
          <StatusBadge value={incident.severity} type="severity" />
          <span className="rounded-full bg-mist-soft px-2.5 py-1 text-xs font-medium capitalize text-ink-soft">
            {incident.pollution_type ? incident.pollution_type.replace("_", " ") : "unknown"}
          </span>
          <span className="font-data text-xs text-ink-soft">{date}</span>
        </div>
      </div>
    </div>
  );
}
