import "./CandidateCard.scss";
import star from "~/assets/star.svg";

interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  job_branche_interests: string;
}

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  return (
    <div className="talent-card">
      {candidate.first_name} {candidate.last_name}
      {candidate.status == "favorite" ? <img src={star} alt="talent star" /> : null}
    </div>
  );
};

export default CandidateCard;
