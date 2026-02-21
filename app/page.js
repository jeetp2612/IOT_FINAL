export default function Home() {
  return (
    <main className="p-10 text-center">
      <h1 className="text-4xl font-bold">Machine Data Collector</h1>
      <p className="mt-4 text-gray-600">
        Monitor and download machine JSON data easily
      </p>

      <a href="/dashboard">
        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded">
          Open Dashboard
        </button>
      </a>
    </main>
  );
}
