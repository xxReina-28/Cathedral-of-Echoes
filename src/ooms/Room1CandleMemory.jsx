import React, { useEffect, useMemo, useRef, useState } from "react";
import RoomShell from "../components/RoomShell.jsx";

function randInt(max) {
  return Math.floor(Math.random() * max);
}

export default function Room1CandleMemory({ state, setState }) {
  const solved = state.solved.room1;

  const [status, setStatus] = useState("idle"); // idle | showing | input | fail | win
  const [sequence, setSequence] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [flash, setFlash] = useState(null); // candle index flashing
  const [lockout, setLockout] = useState(false);

  const timeoutsRef = useRef([]);

  const candleCount = 5;
  const targetLength = 6;

  const bestStreak = state.roomData?.room1?.bestStreak ?? 0;

  const canStart = !solved && (status === "idle" || status === "fail" || status === "win");

  const intensity = state.settings.intensity;

  const pace = useMemo(() => {
    // low intensity plays a bit slower, easier on the nervous system
    return intensity === "low"
      ? { on: 520, gap: 320 }
      : { on: 380, gap: 220 };
  }, [intensity]);

  function clearTimers() {
    for (const t of timeoutsRef.current) clearTimeout(t);
    timeoutsRef.current = [];
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  function start() {
    clearTimers();
    setStatus("idle");
    setFlash(null);
    setLockout(false);
    setStepIndex(0);

    const first = [randInt(candleCount)];
    setSequence(first);

    // show after state is set
    const t = setTimeout(() => showSequence(first), 150);
    timeoutsRef.current.push(t);
  }

  function extendSequence(prev) {
    return [...prev, randInt(candleCount)];
  }

  function showSequence(seq) {
    clearTimers();
    setStatus("showing");
    setLockout(true);
    setFlash(null);
    setStepIndex(0);

    let cursor = 0;
    const total = seq.length;

    const scheduleFlash = () => {
      if (cursor >= total) {
        const tDone = setTimeout(() => {
          setFlash(null);
          setStatus("input");
          setLockout(false);
        }, Math.max(180, pace.gap));
        timeoutsRef.current.push(tDone);
        return;
      }

      const idx = seq[cursor];

      const tOn = setTimeout(() => {
        setFlash(idx);
      }, pace.gap);

      const tOff = setTimeout(() => {
        setFlash(null);
        cursor += 1;
        scheduleFlash();
      }, pace.gap + pace.on);

      timeoutsRef.current.push(tOn, tOff);
    };

    scheduleFlash();
  }

  function onPress(i) {
    if (solved) return;
    if (lockout) return;
    if (status !== "input") return;

    // brief manual flash feedback
    setFlash(i);
    const t = setTimeout(() => setFlash(null), Math.min(220, pace.on));
    timeoutsRef.current.push(t);

    const expected = sequence[stepIndex];
    if (i !== expected) {
      setStatus("fail");
      setLockout(true);

      // update best streak
      const streak = Math.max(0, sequence.length - 1);
      if (streak > bestStreak) {
        setState((s) => ({
          ...s,
          roomData: {
            ...s.roomData,
            room1: { ...(s.roomData?.room1 || {}), bestStreak: streak }
          }
        }));
      }

      const t2 = setTimeout(() => {
        setLockout(false);
      }, 500);
      timeoutsRef.current.push(t2);
      return;
    }

    const nextStep = stepIndex + 1;
    if (nextStep >= sequence.length) {
      // completed current sequence
      if (sequence.length >= targetLength) {
        setStatus("win");
        setLockout(true);

        setState((s) => ({
          ...s,
          solved: { ...s.solved, room1: true }
        }));

        return;
      }

      const nextSeq = extendSequence(sequence);
      setSequence(nextSeq);
      setStatus("showing");
      setLockout(true);

      const t3 = setTimeout(() => showSequence(nextSeq), 550);
      timeoutsRef.current.push(t3);
      return;
    }

    setStepIndex(nextStep);
  }

  function resetProgress() {
    clearTimers();
    setStatus("idle");
    setSequence([]);
    setStepIndex(0);
    setFlash(null);
    setLockout(false);
  }

  return (
    <RoomShell
      title="Nave of Cinders"
      subtitle="Five candles. One order. Repeat the whispers exactly."
      rightSlot={
        <div className="room__meta">
          <div className="pill">
            Target <b>{targetLength}</b>
          </div>
          <div className="pill">
            Best streak <b>{bestStreak}</b>
          </div>
        </div>
      }
    >
      <div className="lore">
        <p>
          The air tastes like old soot. The cathedral does not speak. It tests.
          Light the sequence. Do not improvise. It dislikes confidence.
        </p>
      </div>

      <div className="panel">
        <div className="panel__row">
          <button className="btn" onClick={start} disabled={!canStart}>
            {solved ? "Solved" : "Begin the Sequence"}
          </button>
          <button className="btn btn--ghost" onClick={resetProgress}>
            Reset
          </button>

          <div className="status">
            <span className={`sigil sigil--${status}`} />
            <span className="status__text">
              {solved
                ? "The nave yields. A door unlatches somewhere."
                : status === "idle"
                ? "Awaiting ignition."
                : status === "showing"
                ? "Watch."
                : status === "input"
                ? `Your turn. Step ${stepIndex + 1} of ${sequence.length}.`
                : status === "fail"
                ? "Wrong. The wax remembers your mistake."
                : "Enough. The lock breaks."}
            </span>
          </div>
        </div>

        <div className="candles">
          {Array.from({ length: candleCount }).map((_, i) => {
            const lit = flash === i;
            return (
              <button
                key={i}
                className={`candle ${lit ? "candle--lit" : ""}`}
                onClick={() => onPress(i)}
                disabled={solved || lockout}
                aria-label={`Candle ${i + 1}`}
              >
                <span className="candle__wax" />
                <span className="candle__flame" />
                <span className="candle__base" />
              </button>
            );
          })}
        </div>

        {!solved ? (
          <div className="hint">
            Hint. In low intensity mode, the sequence plays slower. Still unforgiving though.
          </div>
        ) : (
          <div className="hint hint--good">
            Room 1 solved. The Rose Window Reliquary is now accessible.
          </div>
        )}
      </div>
    </RoomShell>
  );
}
