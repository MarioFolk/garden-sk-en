import { useEffect, useState } from '@devvit/public-api';

type CropType = 'carrot' | 'corn' | 'apple';
type Field = { crop: CropType | null; plantedAt: number | null };
type GameState = {
  coins: number;
  premium: boolean;
  fields: Field[];
};

const CROP_DATA: Record<CropType, { growTime: number; yield: number }> = {
  carrot: { growTime: 10, yield: 1 },
  corn: { growTime: 30, yield: 5 },
  apple: { growTime: 60, yield: 12 },
};

export default function GardenClicker() {
  const [state, setState] = useState<GameState>({
    coins: 0,
    premium: false,
    fields: [
      { crop: null, plantedAt: null },
      { crop: null, plantedAt: null },
      { crop: null, plantedAt: null },
    ],
  });

  const now = () => Math.floor(Date.now() / 1000);

  // Load saved state
  useEffect(() => {
    window.parent.postMessage({ type: 'LOAD' }, '*');
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'STATE') setState(e.data.state);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Auto tick
  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => ({ ...s })); // force re-render for timers
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Save
  useEffect(() => {
    window.parent.postMessage({ type: 'SAVE', state }, '*');
  }, [state]);

  const plantCrop = (index: number, crop: CropType) => {
    setState((s) => {
      const newFields = [...s.fields];
      if (newFields[index].crop) return s;
      newFields[index] = { crop, plantedAt: now() };
      return { ...s, fields: newFields };
    });
  };

  const harvest = (index: number) => {
    setState((s) => {
      const field = s.fields[index];
      if (!field.crop || !field.plantedAt) return s;

      const effectiveTime = state.premium
        ? CROP_DATA[field.crop].growTime / 2
        : CROP_DATA[field.crop].growTime;

      if (now() - field.plantedAt < effectiveTime) return s;

      const newFields = [...s.fields];
      newFields[index] = { crop: null, plantedAt: null };
      return { ...s, coins: s.coins + CROP_DATA[field.crop].yield, fields: newFields };
    });
  };

  const buyPremium = () => {
    window.open('https://your-payment-link.com', '_blank');
    setState((s) => ({ ...s, premium: true }));
  };

  return (
    <vstack alignment="center middle" gap="medium" style={{ padding: 20 }}>
      <text size="xlarge">🌱 Garden Clicker</text>
      <text>Coins: {state.coins}</text>
      <text>{state.premium ? '💎 Premium active!' : 'Activate premium boost'}</text>

      <hstack gap="small" alignment="center middle">
        {state.fields.map((f, i) => {
          const ready =
            f.crop &&
            f.plantedAt &&
            now() - f.plantedAt >=
              (state.premium ? CROP_DATA[f.crop].growTime / 2 : CROP_DATA[f.crop].growTime);
          return (
            <vstack
              key={i}
              alignment="center middle"
              gap="small"
              style={{
                border: '2px solid green',
                padding: 10,
                width: 100,
                minHeight: 120,
                backgroundColor: f.crop ? '#e0ffe0' : '#fff',
              }}
            >
              <text>{f.crop || 'Empty'}</text>
              {f.crop && <text size="small">{ready ? 'Ready!' : 'Growing...'}</text>}

              {!f.crop && (
                <vstack gap="xsmall">
                  <button onPress={() => plantCrop(i, 'carrot')}>🌱 Carrot</button>
                  <button onPress={() => plantCrop(i, 'corn')}>🌽 Corn</button>
                  <button onPress={() => plantCrop(i, 'apple')}>🍎 Apple</button>
                </vstack>
              )}
              {ready && <button onPress={() => harvest(i)}>Harvest</button>}
            </vstack>
          );
        })}
      </hstack>

      {!state.premium && <button onPress={buyPremium}>Buy Premium Boost</button>}
    </vstack>
  );
}
