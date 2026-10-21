import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProfileForm } from "../components/ProfileForm";
import { clubIndex, getClub } from "../data/clubs";
import { useRegistration } from "../registration";
import { formatRegisteredAt } from "../storage";

export function ClubDetail() {
  const { clubId } = useParams();
  const club = clubId ? getClub(clubId) : undefined;
  const { state, register, leave } = useRegistration();
  const membership = state.memberships.find((item) => item.clubId === club?.id);
  const [editing, setEditing] = useState(state.profile === null);
  const [error, setError] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  useEffect(() => {
    document.title = club ? `${club.name} · MUICT Clubs` : "Club not found · MUICT Clubs";
  }, [club]);

  useEffect(() => {
    setError(null);
    setConfirmLeave(false);
    setEditing(state.profile === null);
  }, [clubId, state.profile]);

  if (!club) {
    return (
      <section className="page">
        <div className="panel empty">
          <h1>Club not found</h1>
          <p>That club is not on the MUICT list.</p>
          <Link className="button primary" to="/">
            Back to clubs
          </Link>
        </div>
      </section>
    );
  }

  const index = clubIndex(club.id);

  function join(profile?: { name: string; studentId: string }) {
    const message = register(club!.id, profile);
    setError(message);
    if (!message) setEditing(false);
    return message;
  }

  return (
    <section className="page">
      <p className="back">
        <Link to="/">All clubs</Link>
      </p>
      <div className="detail">
        <article className="panel story">
          <span className="story-band" style={{ background: club.accent }} />
          <div className="story-body">
            <p className="kicker">
              {String(index + 1).padStart(2, "0")} · {club.category}
            </p>
            <h1>{club.name}</h1>
            <p className="lede">{club.tagline}</p>
            <a className="button primary jump" href="#register">
              {membership ? "Your registration" : "Register"}
            </a>
            <p>{club.description}</p>
            <h2>What members do</h2>
            <ul className="activities">
              {club.activities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
            <dl className="facts">
              <div>
                <dt>Meets</dt>
                <dd>{club.meeting}</dd>
              </div>
              <div>
                <dt>Where</dt>
                <dd>{club.location}</dd>
              </div>
            </dl>
          </div>
        </article>
        <aside className="panel register-panel" id="register">
          <h2>{membership ? "You are registered" : `Register for ${club.name}`}</h2>
          {membership ? (
            <div className="stack">
              <p className="status">
                Joined <time dateTime={membership.registeredAt}>{formatRegisteredAt(membership.registeredAt)}</time>
                {state.profile ? (
                  <>
                    {" "}
                    as <strong>{state.profile.name}</strong>
                  </>
                ) : null}
                .
              </p>
              <Link className="button primary" to="/my-clubs">
                View my clubs
              </Link>
              {confirmLeave ? (
                <div className="confirm">
                  <p>Leave {club.name}? You can register again later.</p>
                  <div className="inline-actions">
                    <button
                      className="button danger"
                      type="button"
                      onClick={() => {
                        leave(club.id);
                        setConfirmLeave(false);
                      }}
                    >
                      Confirm leave
                    </button>
                    <button className="button ghost" type="button" onClick={() => setConfirmLeave(false)}>
                      Keep registration
                    </button>
                  </div>
                </div>
              ) : (
                <button className="button danger" type="button" onClick={() => setConfirmLeave(true)}>
                  Leave club
                </button>
              )}
            </div>
          ) : (
            <div className="stack">
              <p className="muted">Saved in this browser. A club can be joined once.</p>
              {state.profile && !editing ? (
                <>
                  <p className="profile-summary">
                    Registering as <strong>{state.profile.name}</strong>
                    <span className="muted">{state.profile.studentId}</span>
                  </p>
                  {error ? (
                    <p className="error" role="alert">
                      {error}
                    </p>
                  ) : null}
                  <div className="inline-actions">
                    <button className="button primary" type="button" onClick={() => join()}>
                      Register for {club.name}
                    </button>
                    <button
                      className="button ghost"
                      type="button"
                      onClick={() => {
                        setEditing(true);
                        setError(null);
                      }}
                    >
                      Edit details
                    </button>
                  </div>
                </>
              ) : (
                <ProfileForm
                  initial={state.profile}
                  submitLabel={`Save and register`}
                  onSubmit={(profile) => join(profile)}
                  onCancel={
                    state.profile
                      ? () => {
                          setEditing(false);
                          setError(null);
                        }
                      : undefined
                  }
                />
              )}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
