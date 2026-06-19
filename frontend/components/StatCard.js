const TONES = {
  teal: "bg-teal-50 text-teal-700",
  silt: "bg-silt-100 text-silt-600",
  rust: "bg-rust-100 text-rust-700",
  moss: "bg-moss-100 text-moss-600",
};

export default function StatCard({ label, value, tone = "teal", hint }) {
  return (
    <div className="card animate-rise p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink capitalize">{value}</p>
      {hint && (
        <span className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TONES[tone]}`}>
          {hint}
        </span>
      )}
    </div>
  );
}
