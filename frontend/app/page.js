import Link from "next/link";

const STEPS = [
  { n: "01", title: "Spot it", body: "See discoloured water, runoff, or dumping near a river, lake or drain." },
  { n: "02", title: "Report it", body: "Drop a pin, attach a photo, add a short note — takes under two minutes." },
  { n: "03", title: "Track it", body: "Watch your report move from pending to assigned to resolved in real time." },
];

const FEATURES = [
  {
    title: "GPS-tagged reporting",
    body: "Every incident is pinned to an exact location, so officers know precisely where to respond.",
  },
  {
    title: "AI severity classification",
    body: "Photos are analysed to flag pollution type and severity — model training currently in progress.",
  },
  {
    title: "Live officer dashboard",
    body: "Government teams see every report on a live map, sorted by zone and urgency.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-mist">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-teal-100" />
        <div className="pointer-events-none absolute -right-6 -top-6 h-52 w-52 rounded-full border border-teal-100" />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="animate-rise">
            <span className="font-data text-xs uppercase tracking-widest text-teal-600">
              Civic water monitoring
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Report water pollution before it spreads.
            </h1>
            <p className="mt-4 max-w-md text-base text-ink-soft">
              AquaWatch connects citizens who spot pollution with the officers who can act on
              it — with a photo, a pin, and under two minutes of your time.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/auth/register"
                className="rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
              >
                Report an incident
              </Link>
              <Link
                href="/auth/login"
                className="rounded-full border border-mist px-6 py-3 text-sm font-semibold text-ink transition hover:border-teal-500"
              >
                Government login
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="card w-full max-w-sm animate-rise p-5" style={{ animationDelay: "0.12s" }}>
              <p className="font-data text-xs uppercase tracking-wide text-ink-soft">Live incident · #2046</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                Discoloured discharge — Mula River
              </h3>
              <div className="mt-4 flex items-center justify-between border-t border-mist pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rust-700">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="-rotate-90">
                    <circle cx="10" cy="10" r="8" fill="none" stroke="#DCE6E4" strokeWidth="3" />
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      fill="none"
                      stroke="#8C3A1D"
                      strokeWidth="3"
                      strokeDasharray="40.2 50.3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Critical
                </span>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                  Assigned
                </span>
              </div>
              <p className="mt-3 font-data text-xs text-ink-soft">18.5204&deg; N, 73.8567&deg; E</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink">How a report moves</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-6">
              <span className="font-data text-sm text-teal-500">{s.n}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-mist bg-surface-raised">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Built for both sides of the response
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-mist p-5">
                <h3 className="font-display text-base font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink">Seen something in the water?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          Create a free account and file your first report in under two minutes.
        </p>
        <Link
          href="/auth/register"
          className="mt-6 inline-block rounded-full bg-teal-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
        >
          Get started
        </Link>
      </section>
    </div>
  );
}
