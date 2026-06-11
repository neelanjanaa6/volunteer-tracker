"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

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

  const currentSchoolYear =
    new Date().getMonth() + 1 >= 8
      ? `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
      : `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`;

  const totalHours = entries
    .filter((e) => e.schoolYear === currentSchoolYear)
    .reduce((sum, e) => sum + e.hours, 0);

  const deleteEntry = async (id: string) => {
    await deleteDoc(doc(db, "volunteerEntries", id));
    setEntries(entries.filter((e) => e.id !== id));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please log in
      </div>
    );
  }

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

        <h1 className="text-3xl font-bold mb-6">
          Welcome, <span className="text-fuchsia-500">
            {user.displayName}
          </span>
        </h1>

        <div className="mb-8">
          <div className="inline-block p-5 rounded-2xl border border-fuchsia-500/40 bg-fuchsia-500/10">
            <p className="text-sm text-gray-400">
              Total Hours This Year
            </p>
            <p className="text-3xl font-bold text-fuchsia-400">
              {totalHours}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {entries.map((e) => (
            <div
              key={e.id}
              className="p-4 rounded-xl border border-white/10 bg-white/5 flex justify-between"
            >
              <div>
                <p className="font-semibold">{e.organization}</p>
                <p className="text-sm text-gray-400">{e.date}</p>
                <p className="text-fuchsia-400">{e.hours} hours</p>
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