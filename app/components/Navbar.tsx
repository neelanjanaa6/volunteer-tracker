"use client";

import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const linkStyle = (path: string) =>
    `px-3 py-1 rounded ${
      pathname === path ? "bg-black text-white" : "hover:bg-gray-200"
    }`;

  return (
    <nav className="flex items-center justify-between border-b p-4 mb-6">
      <h1 className="font-bold text-lg">Volunteer Tracker</h1>

      <div className="flex gap-2 items-center">
        <button
          onClick={() => router.push("/dashboard")}
          className={linkStyle("/dashboard")}
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push("/add")}
          className={linkStyle("/add")}
        >
          Add Entry
        </button>

        <button
          onClick={logout}
          className="text-red-500 hover:underline ml-2"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}