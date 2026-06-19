export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-teal-700">
      <span className="relative inline-flex h-10 w-10 items-center justify-center">
        <span className="ripple-ring" />
        <span className="ripple-ring delay" />
        <span className="absolute inset-[10px] rounded-full bg-teal-700" />
      </span>
      <span className="font-data text-xs uppercase tracking-wide text-ink-soft">{label}&hellip;</span>
    </div>
  );
}
