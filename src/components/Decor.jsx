import React from "react";

export default function Decor({ arachnophobia }) {
  return (
    <>
      {/* Cobwebs */}
      <div className={`web web--tl ${arachnophobia ? "web--calm" : ""}`} aria-hidden="true" />
      <div className={`web web--tr ${arachnophobia ? "web--calm" : ""}`} aria-hidden="true" />
      <div className={`web web--bl ${arachnophobia ? "web--calm" : ""}`} aria-hidden="true" />

      {/* Bats */}
      <div className="bats" aria-hidden="true">
        <span className="bat bat--1" />
        <span className="bat bat--2" />
        <span className="bat bat--3" />
      </div>

      {/* Optional spiders. Hidden when arachnophobia is enabled */}
      {!arachnophobia ? (
        <>
          <div className="spider spider--1" aria-hidden="true" />
          <div className="spider spider--2" aria-hidden="true" />
        </>
      ) : null}

      {/* Crime scene markers */}
      <div className="markers" aria-hidden="true">
        <span className="marker marker--1">1</span>
        <span className="marker marker--2">2</span>
        <span className="marker marker--3">3</span>
      </div>

      {/* Inverted crosses. Pure decor */}
      <div className="crosses" aria-hidden="true">
        <span className="cross cross--1" />
        <span className="cross cross--2" />
      </div>

      {/* Poltergeist layer */}
      <div className="poltergeist" aria-hidden="true" />
    </>
  );
}
