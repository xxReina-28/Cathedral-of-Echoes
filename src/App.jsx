import React, { useEffect, useMemo, useState } from "react";
import { DEFAULT_STATE, ROOMS } from "./game/constants.js";
import { loadState, saveState, wipeState } from "./game/storage.js";
import Toggle from "./components/Toggle.jsx";
import Decor from "./components/Decor.jsx";
import Room1CandleMemory from "./rooms/Room1CandleMemory.jsx";
import Room2StainedGlass from "./rooms/Room2StainedGlass.jsx";

function isRoomUnlocked(roomId, solved) {
  const room = ROOMS.find((r) => r.id === roomId);
  if (!room) return false;
  return room.requires.every((req) => Boolean(solved[req]));
}

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [bootToast, setBootToast] = useState("");

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    setBootToast("Save loaded from local storage.");
    const t = setTimeout(() => setBootToast(""), 900);
    return () => clearTimeout(t);
  }, []);

  const unlockedMap = useMemo(() => {
    const map = {};
    for (const r of ROOMS) map[r.id] = isRoomUnlocked(r.id, state.solved);
    return map;
  }, [state.solved]);

  const activeRoom = ROOMS.find((r) => r.id === state.activeRoomId) || ROOMS[0];

  const intensity = state.settings.intensity;
  const arachnophobia = state.settings.arachnophobia;

  useEffect(() => {
    document.documentElement.dataset.intensity = intensity;
    document.documentElement.dataset.arachno = arachnophobia ? "on" : "off";
  }, [intensity, arachnophobia]);

  function setIntensityLow(isLow) {
    setState((s) => ({
      ...s,
      settings: { ...s.settings, intensity: isLow ? "low" : "high" }
    }));
  }

  function setArachnophobia(on) {
    setState((s) => ({
      ...s,
      settings: { ...s.settings, arachnophobia: Boolean(on) }
    }));
  }

  function gotoRoom(roomId) {
    if (!unlockedMap[roomId]) return;
    setState((s) => ({ ...s, activeRoomId: roomId }));
  }

  function resetAll() {
    wipeState();
    setState(structuredClone(DEFAULT_STATE));
    setBootToast("Save wiped. The cathedral forgets you.");
    setTimeout(() => setBootToast(""), 1100);
  }

  const allSolved = Boolean(state.solved.room1 && state.solved.room2);

  return (
    <div className="app">
      <Decor arachnophobia={arachnophobia} />

      <header className="topbar">
        <div className="brand">
          <div className="brand__sigil" aria-hidden="true" />
          <div className="brand__text">
            <h1>Cathedral of Echoes</h1>
            <p>Heavy dark horror puzzles. Single page. Local save.</p>
          </div>
        </div>

        <div className="controls">
          <div className="controlCard">
            <div className="controlCard__title">Intensity</div>
            <div className="controlCard__row">
              <span className="muted">Low</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={state.settings.intensity === "high"}
                  onChange={(e) => setIntensityLow(!e.target.checked)}
                />
                <span className="switch__track" />
              </label>
              <span className="muted">High</span>
            </div>
            <div className="controlCard__hint">
              Low reduces flicker, shake, and motion.
            </div>
          </div>

          <div className="controlCard">
            <div className="controlCard__title">Arachnophobia</div>
            <Toggle
              label="Disable spiders"
              hint="Hides spiders, reduces web density."
              value={arachnophobia}
              onChange={setArachnophobia}
            />
          </div>

          <button className="btn btn--danger" onClick={resetAll} title="Wipe save">
            Wipe Save
          </button>
        </div>
      </header>

      <main className="main">
        <aside className="sidebar">
          <div className="sidebar__title">Rooms</div>

          <div className="roomList">
            {ROOMS.map((r) => {
              const unlocked = unlockedMap[r.id];
              const isActive = r.id === activeRoom.id;
              const isSolved = Boolean(state.solved[r.id]);

              return (
                <button
                  key={r.id}
                  className={`roomBtn ${isActive ? "roomBtn--active" : ""}`}
                  onClick={() => gotoRoom(r.id)}
                  disabled={!unlocked}
                >
                  <div className="roomBtn__top">
                    <span className="roomBtn__name">{r.title}</span>
                    <span className={`badge ${!unlocked ? "badge--locked" : isSolved ? "badge--ok" : "badge--open"}`}>
                      {!unlocked ? "Locked" : isSolved ? "Solved" : "Open"}
                    </span>
                  </div>
                  <div className="roomBtn__sub">{r.subtitle}</div>
                </button>
              );
            })}
          </div>

          <div className="sidebar__footer">
            <div className="divider" />
            <div className="sidebarNote">
              {allSolved ? (
                <>
                  <div className="sidebarNote__title">V1 Complete</div>
                  <div className="sidebarNote__text">
                    Two locks broken. The cathedral still watches. Add more rooms when you feel like it.
                  </div>
                </>
              ) : (
                <>
                  <div className="sidebarNote__title">Progress</div>
                  <div className="sidebarNote__text">
                    Solve Room 1 to unlock Room 2.
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>

        <section className="content">
          {activeRoom.id === "room1" ? (
            <Room1CandleMemory state={state} setState={setState} />
          ) : null}

          {activeRoom.id === "room2" ? (
            <Room2StainedGlass
              state={state}
              setState={setState}
              locked={!unlockedMap.room2}
            />
          ) : null}

          {bootToast ? <div className="bootToast">{bootToast}</div> : null}
        </section>
      </main>

      <footer className="footer">
        <span className="muted">
          Tip. Want Room 3 later. Add a confessional keypad, a bell-tower timing puzzle, or a relic inventory.
        </span>
      </footer>
    </div>
  );
}
