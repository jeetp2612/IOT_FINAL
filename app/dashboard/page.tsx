"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchFiles = useCallback(async () => {
    try {
      const res = await axios.get(API!);
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files", err);
    }
  }, [API]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/stats/summary`);
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  }, [API]);

  useEffect(() => {
    fetchFiles();
    fetchStats();
  }, [fetchFiles, fetchStats]);

  const downloadFile = async (id: string) => {
    const response = await fetch(`${API}/download/${id}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "MachineData.pdf";
    a.click();
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Machine Data Dashboard</h1>

      <div className="flex gap-6 mb-10">
        <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-5">
          <h2>Total Files</h2>
          <p className="text-2xl font-bold">{stats.totalFiles || 0}</p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-5">
          <h2>Total Size (bytes)</h2>
          <p className="text-2xl font-bold">{stats.totalSize || 0}</p>
        </div>
      </div>

      <table className="w-full border rounded-2xl overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">File Name</th>
            <th>Upload Date</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file._id} className="text-center border hover:bg-gray-100">
              <td className="p-3">{file.filename}</td>
              <td>{new Date(file.uploadDate).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => downloadFile(file._id)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded"
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
