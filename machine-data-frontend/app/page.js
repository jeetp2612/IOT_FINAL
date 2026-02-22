import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <section className="max-w-3xl py-20">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Smart Machine Data
          </span>
          <br />
          Monitoring Platform
        </h1>

        <p className="mt-6 text-lg text-slate-600">
          Send any JSON row to the backend, monitor stored data, and download entries as plain text.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard">
            <button className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Open Dashboard
            </button>
          </Link>

          <Link href="#features">
            <button className="rounded-full bg-white/70 px-8 py-3 font-semibold text-slate-700 shadow-md backdrop-blur-md transition hover:bg-white hover:shadow-lg">
              Explore Features
            </button>
          </Link>
        </div>
      </section>

      <section
        id="features"
        className="grid grid-cols-1 gap-6 py-16 md:grid-cols-3 max-w-6xl"
      >
        <div className="rounded-2xl bg-white/70 p-8 shadow-lg backdrop-blur-md transition hover:shadow-xl">
          <h3 className="text-xl font-semibold">Flexible JSON Input</h3>
          <p className="mt-4 text-slate-600">
            Send row-wise machine data in JSON without file upload handling.
          </p>
        </div>

        <div className="rounded-2xl bg-white/70 p-8 shadow-lg backdrop-blur-md transition hover:shadow-xl">
          <h3 className="text-xl font-semibold">Text Dashboard View</h3>
          <p className="mt-4 text-slate-600">
            View each stored row in readable text format directly in the dashboard.
          </p>
        </div>

        <div className="rounded-2xl bg-white/70 p-8 shadow-lg backdrop-blur-md transition hover:shadow-xl">
          <h3 className="text-xl font-semibold">Text Download</h3>
          <p className="mt-4 text-slate-600">
            Download individual records as .txt for sharing and auditing.
          </p>
        </div>
      </section>
    </div>
  );
}
