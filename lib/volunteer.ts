export async function addVolunteerEntry(
  userId: string,
  organization: string,
  hours: number,
  date: string,
  description?: string
) {
  const numHours = Number(hours);

  // 🚨 HARD BLOCK (backend enforcement)
  if (!Number.isFinite(numHours)) {
    throw new Error("Invalid hours");
  }

  if (numHours <= 0) {
    throw new Error("Hours must be > 0");
  }

  if (numHours > 24) {
    throw new Error("MAX 24 HOURS ALLOWED");
  }

  // if validation passes → pretend save (replace with your real Firestore call)
  console.log("SAVING ENTRY:", {
    userId,
    organization,
    hours: numHours,
    date,
    description,
  });
}