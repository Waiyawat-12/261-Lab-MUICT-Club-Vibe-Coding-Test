import { beforeEach, describe, expect, it } from "vitest";
import { clubs } from "./data/clubs";
import {
  STORAGE_KEY,
  applyRegistration,
  emptyState,
  leaveClub,
  loadState,
  registerClub,
  saveProfile,
  saveState,
} from "./storage";

const profile = { name: "Ari Wong", studentId: "6612345" };
const registeredAt = "2026-10-21T04:00:00.000Z";

describe("club registration storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("lists the ten MUICT clubs", () => {
    expect(clubs.map((club) => club.name)).toEqual([
      "AI",
      "Dev",
      "IoT",
      "Cyber",
      "Badminton",
      "Table Tennis",
      "Japanese Society",
      "Board Game",
      "Media and Entertainment",
      "Speakers",
    ]);
    expect(new Set(clubs.map((club) => club.id)).size).toBe(clubs.length);
    expect(new Set(clubs.map((club) => club.category))).toEqual(
      new Set(["Technology", "Sports", "Culture"]),
    );
  });

  it("starts empty", () => {
    expect(loadState()).toEqual(emptyState());
  });

  it("saves a profile and round-trips memberships", () => {
    const withProfile = saveProfile(emptyState(), profile);
    const registered = registerClub(withProfile, "ai", registeredAt);
    expect(registered.ok).toBe(true);
    if (!registered.ok) return;
    saveState(registered.state);
    expect(loadState()).toEqual(registered.state);
  });

  it("rejects a duplicate registration", () => {
    const withProfile = saveProfile(emptyState(), profile);
    const first = registerClub(withProfile, "dev", registeredAt);
    if (!first.ok) throw new Error("expected the first registration to succeed");
    const second = registerClub(first.state, "dev", "2026-10-22T04:00:00.000Z");
    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.error).toMatch(/already registered/i);
    expect(second.state.memberships).toHaveLength(1);
    expect(second.state.memberships[0]?.registeredAt).toBe(registeredAt);
  });

  it("refuses registration without a profile", () => {
    const result = registerClub(emptyState(), "iot", registeredAt);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.state.memberships).toEqual([]);
  });

  it("leaves only the chosen club", () => {
    const withProfile = saveProfile(emptyState(), profile);
    const first = registerClub(withProfile, "ai", registeredAt);
    if (!first.ok) throw new Error("expected AI registration to succeed");
    const second = registerClub(first.state, "cyber", "2026-10-21T05:00:00.000Z");
    if (!second.ok) throw new Error("expected Cyber registration to succeed");
    const left = leaveClub(second.state, "ai");
    expect(left.profile).toEqual(profile);
    expect(left.memberships.map((membership) => membership.clubId)).toEqual(["cyber"]);
  });

  it("rejects an invalid profile without creating a membership", () => {
    const result = applyRegistration(
      emptyState(),
      "speakers",
      { name: "A", studentId: "12" },
      registeredAt,
    );
    expect(result.message).toMatch(/name/i);
    expect(result.state).toEqual(emptyState());
  });

  it("updates the saved profile when a duplicate registration is attempted", () => {
    const first = applyRegistration(emptyState(), "ai", profile, registeredAt);
    expect(first.message).toBeNull();
    const second = applyRegistration(
      first.state,
      "ai",
      { name: "Ari W.", studentId: "6612345" },
      "2026-10-22T04:00:00.000Z",
    );
    expect(second.message).toMatch(/already registered/i);
    expect(second.state.memberships).toEqual([{ clubId: "ai", registeredAt }]);
    expect(second.state.profile).toEqual({ name: "Ari W.", studentId: "6612345" });
  });

  it("can register again after leaving", () => {
    const joined = applyRegistration(emptyState(), "badminton", profile, registeredAt);
    const left = leaveClub(joined.state, "badminton");
    const again = applyRegistration(left, "badminton", undefined, "2026-10-22T04:00:00.000Z");
    expect(again.message).toBeNull();
    expect(again.state.memberships).toEqual([
      { clubId: "badminton", registeredAt: "2026-10-22T04:00:00.000Z" },
    ]);
  });

  it("ignores corrupt storage and drops invalid memberships", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadState()).toEqual(emptyState());

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        profile: { name: "Ari Wong", studentId: "6612345" },
        memberships: [
          { clubId: "ai", registeredAt },
          { clubId: 3 },
          { clubId: " ", registeredAt },
        ],
      }),
    );
    expect(loadState()).toEqual({
      profile,
      memberships: [{ clubId: "ai", registeredAt }],
    });
  });
});
