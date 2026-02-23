"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!API) return;
    fetchData();
  }, [API]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rowsRes, statsRes] = await Promise.all([
        axios.get(API),
        axios.get(`${API}/stats/summary`),
      ]);
      setRows(rowsRes.data?.data || []);
      setStats(statsRes.data || {});
      setError(null);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const downloadText = async () => {
    try {
      const response = await fetch(`${API}/download`);
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "machine-data-log.txt";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download text file.");
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Machine Data Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Data is appended one-by-one into one stored text file.
        </p>
      </div>

      {loading && (
        <div className="text-center text-slate-500 animate-pulse">Loading data...</div>
      )}

      {error && (
        <div className="rounded-xl bg-red-100 p-4 text-red-600 shadow">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white/70 backdrop-blur-md p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-sm text-slate-500">Total Files</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalFiles || 0}</p>
          </div>

          <div className="rounded-2xl bg-white/70 backdrop-blur-md p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-sm text-slate-500">Last Updated</h3>
            <p className="mt-2 text-lg font-semibold text-slate-700">
              {stats.lastUploadDate
                ? new Date(stats.lastUploadDate).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-700">Stored Files</h2>
            <button
              onClick={downloadText}
              className="rounded-full bg-indigo-600 px-4 py-2 text-white font-medium shadow-md transition hover:opacity-90"
            >
              Download Text
            </button>
          </div>

          {rows.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No files stored yet.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Stored Time</th>
                  <th className="px-6 py-4">Data Snapshot</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row._id} className="border-t hover:bg-slate-50 transition align-top">
                    <td className="px-6 py-4 font-medium text-slate-700">{index + 1}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(row.uploadDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xl">
                      <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed">
                        {JSON.stringify(row.rowData, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
