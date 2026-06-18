"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { addVolunteerEntry } from "@/lib/volunteer";
import Navbar from "@/app/components/Navbar";

export default function AddPage() {
  const router = useRouter();

  const [organization, setOrganization] = useState("");
  const [hours, setHours] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const submit = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in first");

    const numHours = parseFloat(hours);

    // REQUIRED FIELDS
    if (!organization || !hours || !date) {
      return alert("Please fill all required fields");
    }

    // VALID NUMBER CHECK
    if (!Number.isFinite(numHours)) {
      return alert("Hours must be a valid number");
    }

    // RANGE CHECK
    if (numHours <= 0) {
      return alert("Hours must be greater than 0");
    }

    if (numHours > 24) {
      alert("You cannot log more than 24 hours in one entry");
      return;
    }

    // FUTURE DATE BLOCK
    const selectedDate = new Date(date);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return alert("You cannot log future dates");
    }

    try {
      await addVolunteerEntry(
        user.uid,
        organization.trim(),
        numHours,
        date,
        description.trim()
      );

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to save entry");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <Navbar />

      <h1 className="text-3xl font-bold mb-6 text-fuchsia-400">
        Add Entry
      </h1>

      <div className="space-y-3 max-w-md">

        <input
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
          placeholder="Organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />

        <input
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
          placeholder="Hours"
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <input
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <textarea
          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full py-3 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500"
        >
          Save Entry
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-2 text-gray-400 hover:text-white"
        >
          Back to Dashboard
        </button>

      </div>
    </main>
  );
}