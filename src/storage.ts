export type Profile = {
  name: string;
  studentId: string;
};

export type Membership = {
  clubId: string;
  registeredAt: string;
};

export type RegistrationState = {
  profile: Profile | null;
  memberships: Membership[];
};

export const STORAGE_KEY = "muict-club-registrations";

export function emptyState(): RegistrationState {
  return { profile: null, memberships: [] };
}

export function normalizeProfile(profile: Profile): Profile {
  return {
    name: profile.name.trim(),
    studentId: profile.studentId.trim(),
  };
}

export function validateProfile(profile: Profile): string | null {
  const normalized = normalizeProfile(profile);
  if (normalized.name.length < 2) {
    return "Enter your name (at least 2 characters).";
  }
  if (!/^[A-Za-z0-9-]{4,20}$/.test(normalized.studentId)) {
    return "Enter a student ID of 4–20 letters or digits.";
  }
  return null;
}

export function saveProfile(state: RegistrationState, profile: Profile): RegistrationState {
  return { ...state, profile: normalizeProfile(profile) };
}

export type RegisterResult =
  | { ok: true; state: RegistrationState }
  | { ok: false; error: string; state: RegistrationState };

export function registerClub(
  state: RegistrationState,
  clubId: string,
  registeredAt: string = new Date().toISOString(),
): RegisterResult {
  if (!state.profile) {
    return {
      ok: false,
      error: "Add your name and student ID before registering.",
      state,
    };
  }
  if (state.memberships.some((membership) => membership.clubId === clubId)) {
    return {
      ok: false,
      error: "You are already registered for this club.",
      state,
    };
  }
  return {
    ok: true,
    state: {
      ...state,
      memberships: [...state.memberships, { clubId, registeredAt }],
    },
  };
}

export function leaveClub(state: RegistrationState, clubId: string): RegistrationState {
  return {
    ...state,
    memberships: state.memberships.filter((membership) => membership.clubId !== clubId),
  };
}

export type ApplyRegistrationResult = {
  state: RegistrationState;
  message: string | null;
};

export function applyRegistration(
  state: RegistrationState,
  clubId: string,
  profile?: Profile,
  registeredAt: string = new Date().toISOString(),
): ApplyRegistrationResult {
  let next = state;
  if (profile) {
    const problem = validateProfile(profile);
    if (problem) return { state, message: problem };
    next = saveProfile(state, profile);
  } else if (!state.profile) {
    return {
      state,
      message: "Add your name and student ID before registering.",
    };
  }

  const result = registerClub(next, clubId, registeredAt);
  if (!result.ok) return { state: next, message: result.error };
  return { state: result.state, message: null };
}

function isProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<Profile>;
  if (typeof record.name !== "string" || typeof record.studentId !== "string") return false;
  return validateProfile({ name: record.name, studentId: record.studentId }) === null;
}

function isMembership(value: unknown): value is Membership {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<Membership>;
  return (
    typeof record.clubId === "string" &&
    record.clubId.trim().length > 0 &&
    typeof record.registeredAt === "string" &&
    record.registeredAt.trim().length > 0
  );
}

export function loadState(storage: Storage = localStorage): RegistrationState {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyState();
    const record = parsed as Partial<RegistrationState>;
    return {
      profile: isProfile(record.profile) ? normalizeProfile(record.profile) : null,
      memberships: Array.isArray(record.memberships) ? record.memberships.filter(isMembership) : [],
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state: RegistrationState, storage: Storage = localStorage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function formatRegisteredAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
