"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-6">
      
      <h1 className="text-4xl font-bold text-fuchsia-500">
        Volunteer Tracker
      </h1>

      <p className="text-gray-400 text-center max-w-md">
        Track your volunteer hours, stay organized, and build your resume effortlessly.
      </p>

      <button
        onClick={() => router.push("/login")}
        className="bg-fuchsia-600 hover:bg-fuchsia-500 px-6 py-3 rounded-lg font-semibold"
      >
        Get Started
      </button>

    </main>
  );
}