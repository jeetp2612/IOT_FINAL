import Link from "next/link";

export default function Home() {
  return (
    <section className="flex min-h-[75vh] items-center justify-center">
      <div className="w-full rounded-2xl border border-white/30 bg-white/20 p-8 text-center shadow-xl backdrop-blur md:p-14">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
          Machine Analytics
        </p>
        <h1 className="mx-auto mb-5 max-w-4xl bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-4xl font-extrabold leading-tight text-transparent md:text-6xl">
          Machine Data Dashboard for Fast, Reliable JSON Insights
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base text-indigo-50 md:text-lg">
          Monitor uploaded machine files, download data instantly, and track summary metrics in one polished SaaS-style workspace.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-indigo-600 shadow-xl transition duration-200 hover:scale-105 hover:shadow-2xl"
        >
          Open Dashboard
        </Link>
      </div>
    </section>
  );
}
