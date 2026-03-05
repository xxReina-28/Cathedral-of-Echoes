import React from "react";

export default function Decor({ arachnophobia }) {
  return (
    <>
      {/* Cobwebs */}
      <div
        className={`web web--tl ${arachnophobia ? "web--calm" : ""}`}
        aria-hidden="true"
      />
      <div
        className={`web web--tr ${arachnophobia ? "web--calm" : ""}`}
        aria-hidden="true"
      />
      <div
        className={`web web--bl ${arachnophobia ? "web--calm" : ""}`}
        aria-hidden="true"
      />
      <div
        className={`web web--br ${arachnophobia ? "web--calm" : ""}`}
        aria-hidden="true"
      />

      {/* Bats . spread across page */}
      <div className="bats" aria-hidden="true">
        <span className="bat bat--1" />
        <span className="bat bat--2" />
        <span className="bat bat--3" />
        <span className="bat bat--4" />
        <span className="bat bat--5" />
        <span className="bat bat--6" />
        <span className="bat bat--7" />
        <span className="bat bat--8" />
      </div>

      {/* Spiders . hidden when arachnophobia on */}
      {!arachnophobia ? (
        <div className="spiders" aria-hidden="true">
          <span className="spiderLine spiderLine--1" />
          <span className="spider spider--1" />

          <span className="spiderLine spiderLine--2" />
          <span className="spider spider--2" />

          <span className="spiderLine spiderLine--3" />
          <span className="spider spider--3" />
        </div>
      ) : null}

      {/* Crime scene markers */}
      <div className="markers" aria-hidden="true">
        <span className="marker marker--1">1</span>
        <span className="marker marker--2">2</span>
        <span className="marker marker--3">3</span>
      </div>

      {/* Inverted crosses */}
      <div className="crosses" aria-hidden="true">
        <span className="cross cross--1" />
        <span className="cross cross--2" />
      </div>

      {/* Ghosts . doubled, varied sizes, full page */}
      <div className="ghosts" aria-hidden="true">
        <span className="ghost ghost--1 ghost--sm" />
        <span className="ghost ghost--2 ghost--md" />
        <span className="ghost ghost--3 ghost--sm" />
        <span className="ghost ghost--4 ghost--md" />
        <span className="ghost ghost--5 ghost--sm" />
        <span className="ghost ghost--6 ghost--md" />
      </div>

      {/* Poltergeist layer */}
      <div className="poltergeist" aria-hidden="true" />
    </>
  );
}