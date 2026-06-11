"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);

      // if already logged in → send to dashboard
      if (u) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log("LOGIN SUCCESS:", result.user);

      router.push("/dashboard");
    } catch (error: any) {
      console.log("ERROR CODE:", error.code);
      console.log("ERROR MESSAGE:", error.message);

      alert(error.code || "Login failed");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-6">
      <h1 className="text-4xl font-bold text-fuchsia-500">
        Volunteer Tracker
      </h1>

      <p className="text-gray-400 text-center max-w-md">
        Sign in to track your volunteer hours and stay organized.
      </p>

      {!user && (
        <button
          onClick={signIn}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 px-6 py-3 rounded-lg font-semibold"
        >
          Sign in with Google
        </button>
      )}
    </main>
  );
}