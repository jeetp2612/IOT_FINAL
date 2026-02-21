"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

toast.success("File uploaded successfully!");
toast.error("Upload failed!");
toast.loading("Uploading...");

export default function Dashboard() {
  const [files, setFiles] = useState([]);
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
      const [filesRes, statsRes] = await Promise.all([
        axios.get(API),
        axios.get(`${API}/stats/summary`),
      ]);
      setFiles(filesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (id) => {
    window.open(`${API}/download/${id}`);
  };

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          📊 Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Monitor uploaded machine data and download reports.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-slate-500 animate-pulse">
          Loading data...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl bg-red-100 p-4 text-red-600 shadow">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/70 backdrop-blur-md p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-sm text-slate-500">Total Files</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {stats.totalFiles || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-white/70 backdrop-blur-md p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-sm text-slate-500">Total Size</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {stats.totalSize || 0} bytes
            </p>
          </div>

          <div className="rounded-2xl bg-white/70 backdrop-blur-md p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-sm text-slate-500">Last Updated</h3>
            <p className="mt-2 text-lg font-semibold text-slate-700">
              {files.length > 0
                ? new Date(files[0].uploadDate).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Table Section */}
      {!loading && !error && (
        <div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-lg overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-700">
              Uploaded Files
            </h2>
          </div>

          {files.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No files uploaded yet.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-6 py-4">Upload Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr
                    key={file._id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {file.filename}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(file.uploadDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => downloadFile(file._id)}
                        className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white font-medium shadow-md transition hover:scale-105 hover:shadow-lg"
                      >
                        Download
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