import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 text-white sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight transition hover:opacity-90">
          MachineData
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-medium transition hover:scale-105 hover:bg-white/20"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-md transition hover:scale-105 hover:shadow-lg"
          >
            Dashboard
          </Link>
        </div>
      </nav>
    </header>
  );
}
