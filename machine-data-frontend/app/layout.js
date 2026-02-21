import "./globals.css";
import Navbar from "../src/components/Navbar";
import ToasterProvider from "../src/components/ToasterProvider";

export const metadata = {
  title: "Machine Data Collector",
  description: "Dashboard for machine JSON uploads",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-purple-200 text-slate-800 antialiased">

        {/* Soft background blur effect */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute top-[-200px] left-[-200px] h-[500px] w-[500px] rounded-full bg-indigo-400/30 blur-3xl" />
          <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-purple-400/30 blur-3xl" />
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl border border-white/40 p-8 transition-all duration-300">
            {children}
          </div>
        </main>

        <ToasterProvider />
      </body>
    </html>
  );
}