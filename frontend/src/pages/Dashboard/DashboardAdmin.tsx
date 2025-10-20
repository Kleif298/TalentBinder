import React, { useState } from "react";
import "./Dashboard.scss";
import Header from "~/components/Header/Header.tsx";
import Filter from "~/components/Filter/Filter.tsx";
import GridList from "~/components/GridList/GridList.tsx";
import ModalCandidates from "~/components/Modal/Modal.tsx"


const DashboardAdmin = () => {
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  async function registerCandidate(candidate: any) {
    console.log("Registering candidate:", candidate);
    try {
      setMessage("Speichere...");
      const res = await fetch("http://localhost:4000/api/dashboard/registerCandidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify( candidate ),
      });
      if (!res.ok) {
        throw new Error("Server error: " + res.statusText);
      }

      const data = await res.json();

      if (data.success) {
        setMessage("Candidate registered successfully!");
        setRefreshKey((prev) => prev + 1);
      } else {
        setMessage("Registrating candidate failed: " + data.message);
      }
    } catch (err: any) {
      setMessage("Registrating candidate failed: " + err.message);
    }
  };


  return (
    <div>
      <Header />
      {message && <div className="dashboard-message">{message}</div>}
      <div className="list-container">
        <div className="list-header">
          <Filter />
          <ModalCandidates onSave={(candidate) => { registerCandidate(candidate) }} />
        </div>
        <GridList key={refreshKey} />
      </div>
    </div>
  );
};

export default DashboardAdmin;
