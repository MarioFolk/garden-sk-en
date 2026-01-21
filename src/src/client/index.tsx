import { useEffect, useState } from 'react';

export default function App() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setScore(s => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🌱 Garden Clicker</h1>
      <h2>Score: {score}</h2>

      <button onClick={() => setScore(s => s + 1)}>CLICK</button>
    </div>
  );
}
