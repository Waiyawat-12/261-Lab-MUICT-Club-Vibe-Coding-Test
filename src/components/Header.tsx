import { NavLink } from "react-router-dom";
import { useRegistration } from "../registration";

export function Header() {
  const { state } = useRegistration();

  return (
    <header className="site-header">
      <NavLink className="brand" to="/" end>
        <span className="brand-mark" aria-hidden="true">
          M
        </span>
        <span>
          <strong>MUICT</strong>
          <small>Club registration</small>
        </span>
      </NavLink>
      <nav className="nav" aria-label="Primary">
        <NavLink to="/" end>
          Clubs
        </NavLink>
        <NavLink to="/my-clubs">
          My clubs
          <span className="count">{state.memberships.length}</span>
        </NavLink>
      </nav>
      <p className="who">
        {state.profile ? (
          <>
            <span className="who-name">{state.profile.name}</span>
            <span className="who-id">{state.profile.studentId}</span>
          </>
        ) : (
          <span className="who-id">No student profile yet</span>
        )}
      </p>
    </header>
  );
}
