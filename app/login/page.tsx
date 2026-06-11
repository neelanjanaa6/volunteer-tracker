"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  User
} from "firebase/auth";

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/30 via-black to-pink-600/20" />

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-fuchsia-500/30 bg-black/60 backdrop-blur-xl shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-white">
          Volunteer Tracker
        </h1>

        <p className="text-center text-gray-400 mt-2 mb-6">
          Track your impact. Build your future.
        </p>

        {!user ? (
          <button
            onClick={signIn}
            className="w-full py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-fuchsia-600 to-pink-600
            hover:from-fuchsia-500 hover:to-pink-500
            transition"
          >
            Sign in with Google
          </button>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-white">
              Logged in as <span className="font-semibold">{user.displayName}</span>
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-2 rounded-lg bg-white text-black font-medium"
            >
              Go to Dashboard
            </button>

            <button
              onClick={logout}
              className="w-full py-2 rounded-lg text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        )}

      </div>
    </main>
  );
}