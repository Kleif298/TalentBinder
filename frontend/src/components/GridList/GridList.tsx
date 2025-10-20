import { useState, useEffect } from "react";
import CandidateCard from "../CandidateCard/CandidateCard";
import "./GridList.scss";


interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  job_branche_interests: string;
}

const GridList = () => {

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCandidatesData(): Promise<Candidate[]> {
    try {
      const res = await fetch("http://localhost:4000/api/dashboard/callCandidates", {
        credentials: "include"
      });
 
      if (!res.ok) {
        throw new Error("Server error: " + res.statusText);
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.candidates)) {
        return data.candidates as Candidate[];
      } 
      else {
        console.log("Either calling candidates failed or no candidates are registered in db: " + data.message);
        return [];
      }
    } catch (err: any) {
      console.log("Calling candidates failed: " + err.message);
      throw new Error(err.message);
    }
  }

  useEffect (() => {
    async function loadCandidates() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCandidatesData();
        setCandidates(data);
      } catch (err: any) {
        setError("Fehler beim Laden der Kandidatendaten: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
      loadCandidates();
  }, []);
  
  if (isLoading) {
    return <div className="grid-list-container">Lade Kandidaten...</div>;
  }

  if (error) {
    return <div className="grid-list-container" style={{ color: "red" }}>Fehler: {error}</div>;
  }

  if (candidates.length === 0) {
    return <div className="grid-list-container">Keine Kandidaten gefunden.</div>;
  }

  return (
    <div className="grid-list-container">
       {candidates.map((c) => (
        <CandidateCard key={c.id} candidate={c} />
      ))}
    </div>
  );
};
export default GridList;
