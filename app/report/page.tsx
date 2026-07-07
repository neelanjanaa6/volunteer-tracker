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
        backgroundColor: "#1a0b16",
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
        backgroundColor: "#f5f3f5",
      }}
      className="min-h-screen p-8"
    >

      <div className="max-w-5xl mx-auto">


        <button
          onClick={downloadPDF}
          style={{
            backgroundColor: "#d8a1c4",
            color: "#000000",
          }}
          className="mb-6 px-6 py-3 rounded-lg font-bold"
        >
          Download PDF
        </button>



        <div
          ref={reportRef}
          style={{
            backgroundColor: "#f1e8f1",
            color: "#ffffff",
            padding: "40px",
          }}
        >


          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >

            <h1
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#743e60",
              }}
            >
              Volunteer Tracker
            </h1>


            <p
              style={{
                color: "#501745",
              }}
            >
              Official Volunteer Hours Report
            </p>

          </div>




          <section
            style={{
              border: "1px solid #6b3b59",
              padding: "20px",
              marginBottom: "30px",
              borderRadius: "50px",
            }}
          >

            <h2
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: "#5e1744",
                marginBottom: "15px",
              }}
            >
              Student Information
            </h2>


            <p style={{ color: "#38082d" }}>
              <b>Name:</b> {user.displayName}
            </p>


            <p style={{ color: "#38082d" }}>
              <b>Email:</b> {user.email}
            </p>


            <p style={{ color: "#38082d" }}>
              <b>Total Volunteer Hours:</b> {totalHours}
            </p>


          </section>





          <h2
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#41102f",
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
              color: "#bbbbbb",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            Generated by Volunteer Tracker
          </p>



        </div>


      </div>


    </main>
  );
}



const tableHeader = {
  border: "1px solid #d8a1c4",
  padding: "12px",
  textAlign: "left" as const,
  backgroundColor: "#d8a1c4",
  color: "#000000",
  fontWeight: "bold",
};


const tableCell = {
  border: "1px solid #6b3b59",
  padding: "12px",
  color: "#0b0202",
};