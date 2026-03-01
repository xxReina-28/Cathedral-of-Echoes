import React from "react";

export default function RoomShell({ title, subtitle, children, rightSlot }) {
  return (
    <section className="room">
      <header className="room__header">
        <div>
          <h2 className="room__title">{title}</h2>
          <p className="room__subtitle">{subtitle}</p>
        </div>
        <div className="room__right">{rightSlot}</div>
      </header>

      <div className="room__body">{children}</div>
    </section>
  );
}
