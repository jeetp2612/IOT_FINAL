"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filename, setFilename] = useState("");
  const [rowDataText, setRowDataText] = useState(
    '{\n  "temperature": 72.5,\n  "humidity": 45,\n  "pressure": 101.2,\n  "timestamp": "2025-01-01T10:00:00Z"\n}'
  );
  const [submitting, setSubmitting] = useState(false);

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

  const submitRow = async (e) => {
    e.preventDefault();

    if (!filename.trim()) {
      toast.error("Filename is required.");
      return;
    }

    let parsedRowData;
    try {
      parsedRowData = JSON.parse(rowDataText);
    } catch {
      toast.error("rowData must be valid JSON.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(API, {
        filename: filename.trim(),
        rowData: parsedRowData,
      });
      toast.success("Data row stored successfully.");
      setFilename("");
      await fetchData();
    } catch (submitError) {
      toast.error(
        submitError?.response?.data?.message || "Failed to store data row."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const downloadText = async (id) => {
    try {
      const response = await fetch(`${API}/download/${id}`);
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data-row.txt";
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
          Store any JSON row, view it in text format, and download as text.
        </p>
      </div>

      <form
        onSubmit={submitRow}
        className="rounded-2xl bg-white/70 backdrop-blur-md p-6 shadow-lg space-y-4"
      >
        <h2 className="text-lg font-semibold text-slate-700">Add Data Row</h2>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Filename (example: Machine_A)"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          value={rowDataText}
          onChange={(e) => setRowDataText(e.target.value)}
          rows={8}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-indigo-600 px-5 py-2 text-white text-sm font-medium disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Row"}
        </button>
      </form>

      {loading && (
        <div className="text-center text-slate-500 animate-pulse">Loading data...</div>
      )}

      {error && (
        <div className="rounded-xl bg-red-100 p-4 text-red-600 shadow">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/70 backdrop-blur-md p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-sm text-slate-500">Total Rows</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalRows || 0}</p>
          </div>

          <div className="rounded-2xl bg-white/70 backdrop-blur-md p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-sm text-slate-500">API Status</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">Ready</p>
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
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-700">Stored Rows</h2>
          </div>

          {rows.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No rows stored yet.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Filename</th>
                  <th className="px-6 py-4">Data (Text)</th>
                  <th className="px-6 py-4">Upload Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id} className="border-t hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-700">{row.filename}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xl">
                      <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed">
                        {JSON.stringify(row.rowData, null, 2)}
                      </pre>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(row.uploadDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => downloadText(row._id)}
                        className="rounded-full bg-indigo-600 px-4 py-2 text-white font-medium shadow-md transition hover:opacity-90"
                      >
                        Download Text
                      </button>
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
