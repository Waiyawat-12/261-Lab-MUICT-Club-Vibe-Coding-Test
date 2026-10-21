import { Link } from "react-router-dom";
import type { Club } from "../data/clubs";

type ClubCardProps = {
  club: Club;
  index: number;
  registered: boolean;
};

export function ClubCard({ club, index, registered }: ClubCardProps) {
  return (
    <Link className={registered ? "card registered" : "card"} to={`/clubs/${club.id}`}>
      <span className="card-accent" style={{ background: club.accent }} />
      <span className="card-body">
        <span className="card-kicker">
          <span className="index">{String(index + 1).padStart(2, "0")}</span>
          <span className="chip">{club.category}</span>
        </span>
        <h2>{club.name}</h2>
        <p className="tagline">{club.tagline}</p>
        <span className="card-foot">
          <span className="text-link">{registered ? "View details" : "View and register"}</span>
          {registered ? <span className="pill">Registered</span> : null}
        </span>
      </span>
    </Link>
  );
}
