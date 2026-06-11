import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function addVolunteerEntry(
  userId: string,
  organization: string,
  hours: number,
  date: string,
  description: string
) {
  await addDoc(collection(db, "volunteerEntries"), {
    userId,
    organization,
    hours,
    date,
    description,
    schoolYear: getSchoolYear(date),
    createdAt: serverTimestamp(),
  });
}

function getSchoolYear(dateStr: string) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  // school year starts around August
  return month >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}