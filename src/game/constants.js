export const STORAGE_KEY = "cathedral_of_echoes_v1";

export const ROOMS = [
  {
    id: "room1",
    title: "Nave of Cinders",
    subtitle: "Candle sequence. Memory test.",
    requires: []
  },
  {
    id: "room2",
    title: "Rose Window Reliquary",
    subtitle: "Stained-glass cipher. Decode the phrase.",
    requires: ["room1"]
  }
];

export const DEFAULT_STATE = {
  version: 1,
  activeRoomId: "room1",
  solved: {
    room1: false,
    room2: false
  },
  settings: {
    intensity: "high", // "high" | "low"
    arachnophobia: false // true hides spiders and reduces web density
  },
  roomData: {
    room1: {
      bestStreak: 0
    },
    room2: {
      // persisted inputs for the decoder
      inputs: {}
    }
  }
};
