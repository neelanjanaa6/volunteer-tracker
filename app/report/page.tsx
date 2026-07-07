"use client";

import { useEffect, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";


type Entry = {
  id: string;
  organization: string;
  hours: number;
  date: string;
  description?: string;
};

export default function ReportPage() {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setLoading(false);
        return;
      }

      setUser(u);

      const q = query(
        collection(db, "volunteerEntries"),
        where("userId", "==", u.uid),
        orderBy("date", "asc")
      );

      const snapshot = await getDocs(q);

      const data: Entry[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Entry, "id">),
      }));

      setEntries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalHours = entries.reduce(
    (sum, entry) => sum + Number(entry.hours || 0),
    0
  );

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const html2pdf = (await import("html2pdf.js")).default as any;

    const options = {
        margin: 0.5,
        filename: "Volunteer_Hours_Report.pdf",
        image: {
            type: "jpeg",
            quality: 0.98,
        },
        html2canvas: {
            scale: 2,
            backgroundColor: "#5a024e",
            useCORS: true,
        },
        jsPDF: {
            unit: "in",
            format: "letter",
            orientation: "portrait",
        },
    };

    html2pdf()
        .set(options)
        .from(reportRef.current)
        .save();
};


  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading report...
      </main>
    );
  }


  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Please log in.
      </main>
    );
  }


  return (
    <main
      style={{
        backgroundColor: "#f3f4f6",
      }}
      className="min-h-screen p-8"
    >

      <div className="max-w-5xl mx-auto">

        <button
          onClick={downloadPDF}
          style={{
            backgroundColor: "#c026d3",
            color: "white",
          }}
          className="mb-6 px-6 py-3 rounded-lg font-semibold"
        >
          Download PDF
        </button>


        <div
          ref={reportRef}
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            padding: "40px",
          }}
        >

          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Volunteer Hours Report
          </h1>


          <p
            style={{
              color: "#666666",
              marginBottom: "30px",
            }}
          >
            Generated on {new Date().toLocaleDateString()}
          </p>


          <section
            style={{
              border: "1px solid #cccccc",
              padding: "20px",
              marginBottom: "30px",
            }}
          >

            <h2
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Student Information
            </h2>

            <p>
              <b>Name:</b> {user.displayName}
            </p>

            <p>
              <b>Email:</b> {user.email}
            </p>

            <p>
              <b>Total Volunteer Hours:</b> {totalHours}
            </p>

          </section>


          <h2
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            Volunteer Entries
          </h2>


          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >

            <thead>

              <tr>

                <th style={tableHeader}>
                  Date
                </th>

                <th style={tableHeader}>
                  Organization
                </th>

                <th style={tableHeader}>
                  Hours
                </th>

                <th style={tableHeader}>
                  Description
                </th>

              </tr>

            </thead>


            <tbody>

              {entries.map((entry) => (

                <tr key={entry.id}>

                  <td style={tableCell}>
                    {entry.date}
                  </td>

                  <td style={tableCell}>
                    {entry.organization}
                  </td>

                  <td style={tableCell}>
                    {entry.hours}
                  </td>

                  <td style={tableCell}>
                    {entry.description || "-"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          <p
            style={{
              marginTop: "40px",
              color: "#666666",
              fontSize: "12px",
            }}
          >
            This report was generated from Volunteer Tracker.
          </p>


        </div>

      </div>

    </main>
  );
}


const tableHeader = {
  border: "1px solid #cccccc",
  padding: "10px",
  textAlign: "left" as const,
  backgroundColor: "#eeeeee",
};


const tableCell = {
  border: "1px solid #cccccc",
  padding: "10px",
};