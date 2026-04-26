export function PasswordRequirements({ password }) {
  const requirements = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Lowercase", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="ds-auth-form__requirements">
      <p>Security Requirements:</p>
      <ul>
        {requirements.map((req, i) => (
          <li key={i} className={req.met ? "ds-auth-form__req--met" : ""}>
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PasswordStrengthBar({ strength }) {
  if (!strength.label) return null;
  return (
    <div className="ds-auth-form__strength">
      <div className="ds-auth-form__strength-bar">
        <div
          className="ds-auth-form__strength-fill"
          style={{
            width: `${strength.score}%`,
            backgroundColor: strength.color,
          }}
        />
      </div>
      <span
        className="ds-auth-form__strength-label"
        style={{ color: strength.color }}
      >
        {strength.label}
      </span>
    </div>
  );
}
