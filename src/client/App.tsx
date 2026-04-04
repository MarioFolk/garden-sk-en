import { useEffect, useState } from 'react';
import {
  createInitialState,
  plantCrop,
  tick,
  Crop,
  GameState,
} from './core/game';

const STORAGE_KEY = 'garden-save';

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : createInitialState();
  });

  const now = () => Math.floor(Date.now() / 1000);

  // ✅ Idle tick každú sekundu
  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => tick(s, now()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ✅ Auto save
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // ✅ Plant crop
  const plant = (i: number, crop: Crop) => {
    setState((s) => plantCrop(s, i, crop, now()));
  };

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h1>🌱 Garden Clicker</h1>
      <h2>Coins: {state.coins}</h2>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        {state.fields.map((f, i) => (
          <div
            key={i}
            style={{
              border: '2px solid green',
              padding: 10,
              width: 120,
            }}
          >
            <div style={{ fontSize: 24 }}>
              {f.crop ?? '🟫'}
            </div>

            {!f.crop ? (
              <>
                <button onClick={() => plant(i, 'carrot')}>🌱</button>
                <button onClick={() => plant(i, 'corn')}>🌽</button>
                <button onClick={() => plant(i, 'apple')}>🍎</button>
              </>
            ) : (
              <div>Growing…</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
