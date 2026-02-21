"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({});
    
  const API = process.env.NEXT_PUBLIC_API_URL;


  useEffect(() => {
    fetchFiles();
    fetchStats();
  }, []);

  const fetchFiles = async () => {
    const res = await axios.get(API);
    setFiles(res.data);
  };

  const fetchStats = async () => {
    const res = await axios.get(`${API}/stats/summary`);
    setStats(res.data);
  };

  const downloadFile = (id) => {
    window.open(`${API}/download/${id}`);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="flex gap-6 mb-10">
        <div className="bg-green-100 p-5 rounded">
          <h2>Total Files</h2>
          <p className="text-2xl font-bold">{stats.totalFiles}</p>
        </div>

        <div className="bg-blue-100 p-5 rounded">
          <h2>Total Size (bytes)</h2>
          <p className="text-2xl font-bold">{stats.totalSize}</p>
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
