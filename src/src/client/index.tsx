import { useEffect, useState } from 'react';

export default function App() {
  const [score, setScore] = useState(0);

  // 🔄 načítanie pri štarte
  useEffect(() => {
    window.parent.postMessage(
      { type: 'LOAD_SCORE' },
      '*'
    );
  }, []);

  // 📩 odpoveď z Devvitu
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'SCORE_LOADED') {
        setScore(event.data.score);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // 🖱️ click
  const click = () => {
    const newScore = score + 1;
    setScore(newScore);

    window.parent.postMessage(
      { type: 'SAVE_SCORE', score: newScore },
      '*'
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🌱 Garden Clicker</h1>
      <h2>Score: {score}</h2>
      <button onClick={click}>CLICK</button>
    </div>
  );
}
