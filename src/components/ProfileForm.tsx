import { useId, useState, type FormEvent } from "react";
import { validateProfile, type Profile } from "../storage";

type ProfileFormProps = {
  initial: Profile | null;
  submitLabel: string;
  onSubmit: (profile: Profile) => string | null;
  onCancel?: () => void;
};

export function ProfileForm({ initial, submitLabel, onSubmit, onCancel }: ProfileFormProps) {
  const nameId = useId();
  const studentIdField = useId();
  const [name, setName] = useState(initial?.name ?? "");
  const [studentId, setStudentId] = useState(initial?.studentId ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const profile = { name: name.trim(), studentId: studentId.trim() };
    const problem = validateProfile(profile);
    if (problem) {
      setError(problem);
      return;
    }
    const message = onSubmit(profile);
    if (message) setError(message);
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor={nameId}>Name</label>
        <input
          id={nameId}
          name="name"
          autoComplete="name"
          value={name}
          maxLength={80}
          required
          onChange={(event) => {
            setName(event.target.value);
            setError(null);
          }}
        />
      </div>
      <div className="field">
        <label htmlFor={studentIdField}>Student ID</label>
        <input
          id={studentIdField}
          name="studentId"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          value={studentId}
          maxLength={20}
          required
          onChange={(event) => {
            setStudentId(event.target.value);
            setError(null);
          }}
        />
      </div>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="inline-actions">
        <button className="button primary" type="submit">
          {submitLabel}
        </button>
        {onCancel ? (
          <button className="button ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
