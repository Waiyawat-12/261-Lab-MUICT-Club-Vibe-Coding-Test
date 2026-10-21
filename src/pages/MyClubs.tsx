import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProfileForm } from "../components/ProfileForm";
import { getClub } from "../data/clubs";
import { useRegistration } from "../registration";
import { formatRegisteredAt } from "../storage";

export function MyClubs() {
  const { state, leave, updateProfile } = useRegistration();
  const [editing, setEditing] = useState(false);
  const [pendingLeaveId, setPendingLeaveId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "My clubs · MUICT Club Registration";
  }, []);

  const memberships = [...state.memberships].sort((a, b) =>
    b.registeredAt.localeCompare(a.registeredAt),
  );

  return (
    <section className="page">
      <header className="hero">
        <p className="kicker">Your registration</p>
        <h1>Your clubs.</h1>
        <p className="lede">
          {memberships.length === 0
            ? "Clubs you join show up here, with the date you registered."
            : `You are registered for ${memberships.length} ${memberships.length === 1 ? "club" : "clubs"}.`}
        </p>
      </header>

      <section className="panel profile-card">
        <h2>Student details</h2>
        {state.profile && !editing ? (
          <div className="stack">
            <p className="profile-summary">
              <strong>{state.profile.name}</strong>
              <span className="muted">{state.profile.studentId}</span>
            </p>
            <button className="button ghost" type="button" onClick={() => setEditing(true)}>
              Edit details
            </button>
          </div>
        ) : state.profile || editing ? (
          <ProfileForm
            initial={state.profile}
            submitLabel="Save details"
            onSubmit={(profile) => {
              const message = updateProfile(profile);
              if (!message) setEditing(false);
              return message;
            }}
            onCancel={
              state.profile
                ? () => {
                    setEditing(false);
                  }
                : undefined
            }
          />
        ) : (
          <p className="muted">Add your name and student ID when you register for a club.</p>
        )}
      </section>

      {memberships.length === 0 ? (
        <div className="panel empty">
          <h2>No clubs yet</h2>
          <p>When you register, the club is listed here.</p>
          <Link className="button primary" to="/">
            Browse clubs
          </Link>
        </div>
      ) : (
        <ul className="member-list">
          {memberships.map((membership) => {
            const club = getClub(membership.clubId);
            const confirming = pendingLeaveId === membership.clubId;
            return (
              <li key={membership.clubId} className="member-row">
                <span className="member-accent" style={{ background: club?.accent ?? "#12315c" }} />
                <div className="member-copy">
                  <h2>{club?.name ?? "Unknown club"}</h2>
                  <p className="muted">
                    {club ? club.category : "This club is no longer listed."} · Joined{" "}
                    <time dateTime={membership.registeredAt}>
                      {formatRegisteredAt(membership.registeredAt)}
                    </time>
                  </p>
                </div>
                <div className="inline-actions">
                  {club ? (
                    <Link className="button ghost" to={`/clubs/${club.id}`}>
                      View club
                    </Link>
                  ) : null}
                  {confirming ? (
                    <>
                      <button
                        className="button danger"
                        type="button"
                        onClick={() => {
                          leave(membership.clubId);
                          setPendingLeaveId(null);
                        }}
                      >
                        Confirm leave
                      </button>
                      <button className="button ghost" type="button" onClick={() => setPendingLeaveId(null)}>
                        Keep
                      </button>
                    </>
                  ) : (
                    <button
                      className="button danger"
                      type="button"
                      onClick={() => setPendingLeaveId(membership.clubId)}
                    >
                      Leave
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
