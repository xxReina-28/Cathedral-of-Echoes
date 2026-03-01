import { DEFAULT_STATE, STORAGE_KEY } from "./constants.js";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);

    const parsed = JSON.parse(raw);

    // Basic forward-compatible merge.
    const merged = {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      solved: { ...DEFAULT_STATE.solved, ...(parsed.solved || {}) },
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
      roomData: { ...DEFAULT_STATE.roomData, ...(parsed.roomData || {}) }
    };

    return merged;
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function wipeState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
