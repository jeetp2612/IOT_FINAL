"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchJsonWithRetry = async (url, retries = 1) => {
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
  };

  const fetchData = async () => {
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
  };

  const downloadFile = (id) => {
    window.open(`${API}/download/${id}`);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {loading && <p className="mb-4">Loading data...</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      {/* Stats */}
      <div className="flex gap-6 mb-10">
        <div className="bg-green-100 p-5 rounded">
          <h2>Total Files</h2>
          <p className="text-2xl font-bold">{stats.totalFiles || 0}</p>
        </div>

        <div className="bg-blue-100 p-5 rounded">
          <h2>Total Size (bytes)</h2>
          <p className="text-2xl font-bold">{stats.totalSize || 0}</p>
        </div>
      </div>

      {/* Files Table */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">File Name</th>
            <th>Upload Date</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file._id} className="text-center border">
              <td className="p-3">{file.filename}</td>
              <td>{new Date(file.uploadDate).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => downloadFile(file._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
