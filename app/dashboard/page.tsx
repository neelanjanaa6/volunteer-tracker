"use client";

import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc
} from "firebase/firestore";
import Navbar from "@/app/components/Navbar";
import PageTransition from "@/app/components/PageTransition";

type Entry = {
  id: string;
  organization: string;
  hours: number;
  date: string;
  description?: string;
  schoolYear: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  // AUTH LISTENER
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);

      const q = query(
        collection(db, "volunteerEntries"),
        where("userId", "==", user.uid),
        orderBy("date", "desc")
      );

      const snapshot = await getDocs(q);

      const data: Entry[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Entry, "id">),
      }));

      setEntries(data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  // SCHOOL YEAR (kept for future use)
  const currentSchoolYear = useMemo(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    return month >= 8
      ? `${year}-${year + 1}`
      : `${year - 1}-${year}`;
  }, []);

  // TOTAL HOURS (SAFE)
  const totalHours = useMemo(() => {
    return entries.reduce((sum, e) => {
      return sum + Number(e.hours || 0);
    }, 0);
  }, [entries]);

  // DELETE ENTRY
  const deleteEntry = async (id: string) => {
    await deleteDoc(doc(db, "volunteerEntries", id));
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // AUTH GUARD
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please log in
      </div>
    );
  }

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-black text-white p-6">

        <Navbar />

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6">
          Welcome,{" "}
          <span className="text-fuchsia-500">
            {user.displayName}
          </span>
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <div className="p-4 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl">
            <p className="text-sm text-gray-400">Total Hours</p>
            <p className="text-2xl font-bold text-fuchsia-400">
              {totalHours}
            </p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-sm text-gray-400">Entries</p>
            <p className="text-2xl font-bold">
              {entries.length}
            </p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-sm text-gray-400">Organizations</p>
            <p className="text-2xl font-bold">
              {new Set(entries.map((e) => e.organization)).size}
            </p>
          </div>

        </div>

        {/* ENTRIES LIST */}
        <div className="space-y-4">

          {entries.map((e) => (
            <div
              key={e.id}
              className="p-4 rounded-xl border border-white/10 bg-white/5 flex justify-between items-center hover:bg-white/10 transition"
            >
              <div>
                <p className="font-semibold">
                  {e.organization}
                </p>

                <p className="text-sm text-gray-400">
                  {e.date}
                </p>

                <p className="text-fuchsia-400">
                  {e.hours} hours
                </p>
              </div>

              <button
                onClick={() => deleteEntry(e.id)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          ))}

        </div>

      </main>
    </PageTransition>
  );
}