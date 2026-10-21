import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  applyRegistration,
  leaveClub,
  loadState,
  saveProfile,
  saveState,
  validateProfile,
  type Profile,
  type RegistrationState,
} from "./storage";

type RegistrationContextValue = {
  state: RegistrationState;
  updateProfile: (profile: Profile) => string | null;
  register: (clubId: string, profile?: Profile) => string | null;
  leave: (clubId: string) => void;
};

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RegistrationState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value: RegistrationContextValue = {
    state,
    updateProfile(profile) {
      const problem = validateProfile(profile);
      if (problem) return problem;
      setState((current) => saveProfile(current, profile));
      return null;
    },
    register(clubId, profile) {
      const registeredAt = new Date().toISOString();
      let message: string | null = null;
      setState((current) => {
        const outcome = applyRegistration(current, clubId, profile, registeredAt);
        message = outcome.message;
        return outcome.state;
      });
      return message;
    },
    leave(clubId) {
      setState((current) => leaveClub(current, clubId));
    },
  };

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
}

export function useRegistration(): RegistrationContextValue {
  const value = useContext(RegistrationContext);
  if (!value) {
    throw new Error("useRegistration must be used within RegistrationProvider");
  }
  return value;
}
