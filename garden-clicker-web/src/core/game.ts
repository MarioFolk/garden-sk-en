export type Crop = 'carrot' | 'corn' | 'apple';

export type Field = {
  crop: Crop | null;
  plantedAt: number | null;
};

export type GameState = {
  coins: number;
  fields: Field[];
};

export const CROPS: Record<Crop, { growTime: number; yield: number }> = {
  carrot: { growTime: 10, yield: 1 },
  corn: { growTime: 30, yield: 5 },
  apple: { growTime: 60, yield: 12 },
};

export function createInitialState(): GameState {
  return {
    coins: 0,
    fields: [
      { crop: null, plantedAt: null },
      { crop: null, plantedAt: null },
      { crop: null, plantedAt: null },
    ],
  };
}

export function plantCrop(
  state: GameState,
  index: number,
  crop: Crop,
  now: number
): GameState {
  if (state.fields[index].crop) return state;

  const fields = [...state.fields];
  fields[index] = { crop, plantedAt: now };

  return { ...state, fields };
}

export function tick(state: GameState, now: number): GameState {
  let coins = state.coins;

  const fields = state.fields.map((field) => {
    if (!field.crop || !field.plantedAt) return field;

    const data = CROPS[field.crop];
    if (now - field.plantedAt >= data.growTime) {
      coins += data.yield;
      return { crop: null, plantedAt: null };
    }

    return field;
  });

  return { coins, fields };
}
