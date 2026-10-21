import { useEffect, useState } from "react";
import { categories, clubs, type ClubCategory } from "../data/clubs";
import { ClubCard } from "../components/ClubCard";
import { useRegistration } from "../registration";

type Filter = "All" | ClubCategory;

const filters: Filter[] = ["All", ...categories];

export function ClubList() {
  const { state } = useRegistration();
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    document.title = "Clubs · MUICT Club Registration";
  }, []);

  const visible =
    filter === "All" ? clubs : clubs.filter((club) => club.category === filter);
  const registeredIds = new Set(state.memberships.map((membership) => membership.clubId));

  return (
    <section className="page">
      <header className="hero">
        <p className="kicker">Ten student clubs</p>
        <h1>Find your club.</h1>
        <p className="lede">
          Browse technology, sport, and culture clubs at MUICT. Open a club for meeting times and
          what members actually do, then register in this browser.
        </p>
      </header>
      <div className="filters" role="group" aria-label="Filter clubs">
        {filters.map((category) => {
          const count =
            category === "All"
              ? clubs.length
              : clubs.filter((club) => club.category === category).length;
          const selected = filter === category;
          return (
            <button
              key={category}
              type="button"
              className={selected ? "chip-button active" : "chip-button"}
              aria-pressed={selected}
              onClick={() => setFilter(category)}
            >
              {category}
              <span className="chip-count">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="grid">
        {visible.map((club) => (
          <ClubCard
            key={club.id}
            club={club}
            index={clubs.findIndex((item) => item.id === club.id)}
            registered={registeredIds.has(club.id)}
          />
        ))}
      </div>
    </section>
  );
}
