"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItem = (href, label) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full
          ${
            isActive
              ? "bg-white text-indigo-600 shadow-md"
              : "text-slate-700 hover:text-indigo-600 hover:bg-white/50"
          }`}
      >
        {label}
        {isActive && (
          <span className="absolute inset-0 -z-10 rounded-full bg-white/70 backdrop-blur-md" />
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-lg">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-slate-800 transition hover:text-indigo-600"
        >
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MachineData
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {navItem("/", "Home")}
          {navItem("/dashboard", "Dashboard")}
        </div>
      </nav>
    </header>
  );
}