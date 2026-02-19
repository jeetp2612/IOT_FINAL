"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({});
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchFiles();
    fetchStats();
  }, []);

  const fetchFiles = async () => {
    setLoadingFiles(true);
    try {
      const res = await axios.get(API);
      setFiles(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching files", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await axios.get(`${API}/stats/summary`);
      setStats(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching stats", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const downloadFile = async (id) => {
    try {
      const response = await fetch(`${API}/download/${id}`);
      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MachineData_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF Downloaded Successfully");
    } catch (error) {
      console.error("Download failed", error);
      toast.error("PDF download failed");
    }
  };

  const formattedUpdatedTime = useMemo(() => {
    if (!lastUpdated) return "-";
    return lastUpdated.toLocaleString();
  }, [lastUpdated]);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-100 to-indigo-200 p-4 shadow-xl sm:p-6 md:p-8">
      <div className="space-y-8">
        <section className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-xl backdrop-blur-lg sm:p-8">
          <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">Machine Data Dashboard</h1>
          <p className="mt-2 text-slate-600">Track uploads, monitor data volume, and download PDF reports in one analytics panel.</p>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white/70 p-5 shadow-xl backdrop-blur-lg transition hover:scale-105">
            <p className="text-sm font-medium text-slate-500">{"\uD83D\uDCC1"} Total Files</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">{loadingStats ? "Loading..." : stats.totalFiles || 0}</p>
          </div>

          <div className="rounded-2xl bg-white/70 p-5 shadow-xl backdrop-blur-lg transition hover:scale-105">
            <p className="text-sm font-medium text-slate-500">{"\uD83D\uDCBE"} Total Size</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">{loadingStats ? "Loading..." : stats.totalSize || 0}</p>
          </div>

          <div className="rounded-2xl bg-white/70 p-5 shadow-xl backdrop-blur-lg transition hover:scale-105">
            <p className="text-sm font-medium text-slate-500">{"\u23F1\uFE0F"} Last Updated</p>
            <p className="mt-2 text-xl font-bold text-slate-800">{formattedUpdatedTime}</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white/70 shadow-xl backdrop-blur-lg">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-800">Uploaded Files</h2>
            {loadingFiles && <span className="text-sm font-medium text-slate-500">Loading files...</span>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/90 text-sm uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">File Name</th>
                  <th className="px-4 py-3">Upload Date</th>
                  <th className="px-4 py-3">Download</th>
                </tr>
              </thead>
              <tbody>
                {!loadingFiles && files.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-4 py-10 text-center text-slate-500">
                      No files uploaded yet
                    </td>
                  </tr>
                )}

                {files.map((file) => (
                  <tr key={file._id} className="border-t border-slate-200 transition hover:bg-indigo-50/80">
                    <td className="px-4 py-3 font-medium text-slate-700">{file.filename}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(file.uploadDate).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => downloadFile(file._id)}
                        className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

