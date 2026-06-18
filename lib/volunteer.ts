import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function addVolunteerEntry(
  userId: string,
  organization: string,
  hours: number,
  date: string,
  description?: string
) {
  // -------------------------
  // 1. Clean inputs
  // -------------------------
  const numHours = Number(hours);
  const cleanOrg = organization?.trim();
  const cleanDesc = description?.trim() || "";

  // -------------------------
  // 2. Validation (BACKEND SAFETY)
  // -------------------------
  if (!userId) {
    throw new Error("Missing userId");
  }

  if (!cleanOrg) {
    throw new Error("Organization required");
  }

  if (!Number.isFinite(numHours)) {
    throw new Error("Hours must be a valid number");
  }

  if (numHours <= 0) {
    throw new Error("Hours must be greater than 0");
  }

  if (numHours > 24) {
    throw new Error("Maximum 24 hours per entry");
  }

  if (!date) {
    throw new Error("Date required");
  }

  // -------------------------
  // 3. WRITE TO FIRESTORE
  // -------------------------
  await addDoc(collection(db, "volunteerEntries"), {
    userId,
    organization: cleanOrg,
    hours: numHours,
    date,
    description: cleanDesc,
    createdAt: new Date().toISOString(),
  });
}