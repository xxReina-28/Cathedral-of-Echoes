import React from "react";

export default function Toggle({ label, value, onChange, hint }) {
  return (
    <label className="toggle">
      <span className="toggle__text">
        <span className="toggle__label">{label}</span>
        {hint ? <span className="toggle__hint">{hint}</span> : null}
      </span>
      <span className="toggle__pill" aria-hidden="true">
        <input
          className="toggle__input"
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle__knob" />
      </span>
    </label>
  );
}
