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
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');

if (!root) {
  console.error('ROOT NOT FOUND');
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
