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
      <body className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-slate-900 antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        <ToasterProvider />
      </body>
    </html>
  );
}
