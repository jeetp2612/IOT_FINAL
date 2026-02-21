"use client";

import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchJsonWithRetry = useCallback(async (url: string, retries = 1): Promise<any> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      if (retries > 0) {
        await wait(3000);
        return fetchJsonWithRetry(url, retries - 1);
      }
      throw err;
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!API) {
      setError("Failed to load data");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [filesData, statsData] = await Promise.all([
        fetchJsonWithRetry(API),
        fetchJsonWithRetry(`${API}/stats/summary`)
      ]);
      setFiles(Array.isArray(filesData) ? filesData : []);
      setStats(statsData || {});
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [API, fetchJsonWithRetry]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      {loading && <p className="mb-4">Loading data...</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

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
