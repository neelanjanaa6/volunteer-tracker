export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        Volunteer Tracker
      </h1>

      <p className="text-lg text-center mb-6">
        Track your volunteer hours and build your impact portfolio.
      </p>

      <button className="bg-black text-white px-4 py-2 rounded">
        Get Started
      </button>
    </main>
  );
}