import React, { useMemo, useState } from "react";
import RoomShell from "../components/RoomShell.jsx";

const SYMBOLS = ["☩", "✶", "✣", "❖", "✥", "✦", "✧", "☾", "☉", "⚶", "⚸", "✺"];
const PHRASE = "ECHOES REMAIN";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function buildCipher(phrase) {
  const uniqLetters = Array.from(new Set(phrase.replace(/[^A-Z]/g, "").split("")));
  const shuffledSymbols = [...SYMBOLS];

  for (let i = shuffledSymbols.length - 1; i > 0; i--) {
    const j = (i * 7 + 3) % (i + 1);
    [shuffledSymbols[i], shuffledSymbols[j]] = [shuffledSymbols[j], shuffledSymbols[i]];
  }

  const map = {};
  uniqLetters.forEach((ch, idx) => {
    map[ch] = shuffledSymbols[idx % shuffledSymbols.length];
  });

  return map;
}

function sanitizeChar(s) {
  if (!s) return "";
  const c = s.toUpperCase().slice(0, 1);
  return ALPHABET.includes(c) ? c : "";
}

export default function Room2StainedGlass({ state, setState, locked }) {
  const solved = state.solved.room2;
  const [toast, setToast] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [jumpscare, setJumpscare] = useState(false);

  const cipher = useMemo(() => buildCipher(PHRASE), []);
  const encoded = useMemo(() => {
    return PHRASE.split("").map((ch) => {
      if (ch === " ") return " ";
      return cipher[ch] || "□";
    });
  }, [cipher]);

  const inputs = state.roomData?.room2?.inputs || {};

  const revealedPairs = useMemo(() => {
    const picks = ["E", "O", "A"];
    const pairs = [];

    for (const ch of picks) {
      if (cipher[ch]) pairs.push([cipher[ch], ch]);
    }

    return pairs;
  }, [cipher]);

  const currentDecoded = useMemo(() => {
    return PHRASE.split("").map((ch) => {
      if (ch === " ") return " ";
      const sym = cipher[ch];
      const guess = inputs[sym] || "";
      return guess ? guess : "·";
    });
  }, [inputs, cipher]);

  const isCorrect = useMemo(() => {
    return currentDecoded.join("") === PHRASE;
  }, [currentDecoded]);

  function setInput(sym, value) {
    if (locked || solved) return;

    const next = { ...inputs, [sym]: sanitizeChar(value) };

    setState((s) => ({
      ...s,
      roomData: {
        ...s.roomData,
        room2: {
          ...(s.roomData?.room2 || {}),
          inputs: next
        }
      }
    }));
  }

  function clearAll() {
    if (locked) return;

    setState((s) => ({
      ...s,
      roomData: {
        ...s.roomData,
        room2: {
          ...(s.roomData?.room2 || {}),
          inputs: {}
        }
      }
    }));

    setToast("Glass wiped clean.");
    setTimeout(() => setToast(""), 900);
  }

  function submit() {
    if (locked || solved) return;

    if (isCorrect) {
      setState((s) => ({
        ...s,
        solved: { ...s.solved, room2: true }
      }));

      setToast("The rose window exhales. The cathedral accepts the name.");
      setTimeout(() => setToast(""), 1300);
    } else {
      setToast("Wrong resonance. Try again.");
      setTimeout(() => setToast(""), 900);
    }
  }

  function requestHint() {
    if (locked || solved || jumpscare) return;

    setJumpscare(true);

    setTimeout(() => {
      setJumpscare(false);
      setHintLevel((level) => Math.min(level + 1, 3));
    }, 1300);
  }

  function getHintText() {
    if (hintLevel === 0) return "";
    if (hintLevel === 1) return "Hint 1: The phrase has two words. The second word starts with R.";
    if (hintLevel === 2) return "Hint 2: Repeated symbols mean repeated letters. Look for the symbol that appears twice in the first word.";
    return "Hint 3: The answer is something the cathedral keeps repeating: ECHOES REMAIN.";
  }

  return (
    <RoomShell
      title="Rose Window Reliquary"
      subtitle="Decode the stained-glass hymn. Symbols hide letters."
      rightSlot={
        <div className="room__meta">
          <div className={`pill ${locked ? "pill--locked" : ""}`}>
            {locked ? "Locked" : solved ? "Solved" : "Active"}
          </div>
        </div>
      }
    >
      {jumpscare ? (
        <div className="jumpscare" aria-hidden="true">
          <div className="jumpscare__face">
            <span className="jumpscare__eye jumpscare__eye--left" />
            <span className="jumpscare__eye jumpscare__eye--right" />
            <span className="jumpscare__mouth" />
          </div>
          <div className="jumpscare__text">LOOK CLOSER</div>
        </div>
      ) : null}

      <div className="lore">
        <p>
          A circular window of fractured color watches you. It does not blink. It translates.
          Feed it the correct phrase. The cathedral loves certainty, and punishes guesses.
        </p>
      </div>

      <div className={`panel ${locked ? "panel--locked" : ""}`}>
        <div className="glass">
          <div className="glass__row">
            <div className="glass__encoded">
              {encoded.map((t, i) =>
                t === " " ? (
                  <span key={i} className="glass__spacer" />
                ) : (
                  <span key={i} className="glass__tile">
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="glass__row">
            <div className="glass__decoded" aria-label="Decoded output">
              {currentDecoded.map((t, i) =>
                t === " " ? (
                  <span key={i} className="glass__spacer" />
                ) : (
                  <span key={i} className="glass__tile glass__tile--decoded">
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="fractures">
            <div className="fractures__title">Fractures in the glass. A few truths leak out.</div>
            <div className="fractures__pairs">
              {revealedPairs.map(([sym, ch]) => (
                <span key={sym} className="fracturePair">
                  <span className="fracturePair__sym">{sym}</span>
                  <span className="fracturePair__eq">=</span>
                  <span className="fracturePair__ch">{ch}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="decoder">
          <div className="decoder__header">
            <div>
              <div className="decoder__title">Symbol Decoder</div>
              <div className="decoder__sub">
                Each symbol represents one letter across the whole phrase.
              </div>
            </div>

            <div className="decoder__actions">
              <button className="btn btn--ghost" onClick={requestHint} disabled={locked || solved}>
                Hint
              </button>
              <button className="btn btn--ghost" onClick={clearAll} disabled={locked}>
                Clear
              </button>
              <button className="btn" onClick={submit} disabled={locked || solved}>
                Submit
              </button>
            </div>
          </div>

          {hintLevel > 0 ? (
            <div className="hintBox">
              <strong>Unlocked Hint {hintLevel}:</strong> {getHintText()}
            </div>
          ) : (
            <div className="hintBox hintBox--warning">
              Hint available. Payment required: one jumpscare.
            </div>
          )}

          <div className="decoderGrid">
            {Object.values(cipher)
              .filter((v, i, arr) => arr.indexOf(v) === i)
              .map((sym) => {
                const val = inputs[sym] || "";
                const forced = revealedPairs.find((p) => p[0] === sym)?.[1] || null;
                const isForced = Boolean(forced);

                return (
                  <div key={sym} className={`decoderCell ${isForced ? "decoderCell--fixed" : ""}`}>
                    <div className="decoderCell__sym">{sym}</div>
                    <input
                      className="decoderCell__input"
                      value={isForced ? forced : val}
                      disabled={locked || solved || isForced}
                      onChange={(e) => setInput(sym, e.target.value)}
                      placeholder="A-Z"
                      maxLength={1}
                    />
                  </div>
                );
              })}
          </div>

          <div className="hint">
            Tip. Start with the leaked pairs, then look for repeats in the symbols. Spaces are real.
          </div>

          {toast ? <div className="toast">{toast}</div> : null}

          {solved ? (
            <div className="hint hint--good">
              Room 2 solved. The cathedral records your passage in silence.
            </div>
          ) : null}
        </div>
      </div>
    </RoomShell>
  );
}