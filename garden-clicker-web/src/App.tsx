import { useEffect, useRef, useState } from "react";

type Crop = "empty" | "carrot" | "corn";

interface Field {
  crop: Crop;
  level: number;
}

interface Mission {
  id: string;
  description: string;
  completed: boolean;
  reward: number;
}

interface GameState {
  coins: number;
  fields: Field[];
  missions: Mission[];
  lastLogin: string;
  decorations: string[];
  soundOn: boolean;
}

const today = () => new Date().toDateString();

const generateMissions = (): Mission[] => [
  { id: "plant3", description: "Plant 3 crops", completed: false, reward: 10 },
  { id: "harvest5", description: "Harvest 5 crops", completed: false, reward: 20 },
  { id: "coins30", description: "Have 30 coins", completed: false, reward: 15 },
];

const defaultState: GameState = {
  coins: 0,
  fields: Array.from({ length: 6 }, () => ({
    crop: "empty",
    level: 1,
  })),
  missions: generateMissions(),
  lastLogin: today(),
  decorations: [],
  soundOn: true,
};

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem("garden-clicker");
    if (!saved) return defaultState;

    const parsed: GameState = JSON.parse(saved);
    if (parsed.lastLogin !== today()) {
      parsed.missions = generateMissions();
      parsed.lastLogin = today();
    }
    return parsed;
  });

  const [planted, setPlanted] = useState(0);
  const [harvested, setHarvested] = useState(0);

  const windRef = useRef<HTMLAudioElement | null>(null);
  const birdsRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlocked = useRef(false);

  /* 💾 SAVE GAME */
  useEffect(() => {
    localStorage.setItem("garden-clicker", JSON.stringify(state));
  }, [state]);

  /* 🔊 INIT AUDIO */
  useEffect(() => {
    windRef.current = new Audio("/birds.mp3");
    birdsRef.current = new Audio("/birds.mp3");

    windRef.current.loop = true;
    birdsRef.current.loop = true;

    windRef.current.volume = 0.25;
    birdsRef.current.volume = 0.35;
  }, []);

  const unlockAudio = () => {
    if (audioUnlocked.current) return;
    audioUnlocked.current = true;

    if (state.soundOn) {
      birdsRef.current?.play().catch(() => {});
    }
  };

  /* 🔁 SOUND TOGGLE */
  useEffect(() => {
    if (!audioUnlocked.current) return;

    if (state.soundOn) {
      windRef.current?.play().catch(() => {});
      birdsRef.current?.play().catch(() => {});
    } else {
      windRef.current?.pause();
      birdsRef.current?.pause();
    }
  }, [state.soundOn]);

  /* 🌱 GAME ACTIONS */
  const plant = (i: number) => {
    unlockAudio();
    if (state.fields[i].crop !== "empty") return;

    setPlanted((p) => p + 1);

    const fields = [...state.fields];
    fields[i].crop = Math.random() > 0.5 ? "carrot" : "corn";

    setState({ ...state, fields });
  };

  const harvest = (i: number) => {
    unlockAudio();
    const field = state.fields[i];
    if (field.crop === "empty") return;

    setHarvested((h) => h + 1);
    const gain = field.level * 2;

    const fields = [...state.fields];
    fields[i] = { crop: "empty", level: field.level };

    setState({
      ...state,
      coins: state.coins + gain,
      fields,
    });
  };

  const upgrade = (i: number) => {
    unlockAudio();
    if (state.coins < 10) return;

    const fields = [...state.fields];
    fields[i].level++;

    setState({
      ...state,
      coins: state.coins - 10,
      fields,
    });
  };

  /* 🎯 MISSIONS */
  useEffect(() => {
    const missions = state.missions.map((m) => {
      if (m.completed) return m;
      if (m.id === "plant3" && planted >= 3) return { ...m, completed: true };
      if (m.id === "harvest5" && harvested >= 5) return { ...m, completed: true };
      if (m.id === "coins30" && state.coins >= 30) return { ...m, completed: true };
      return m;
    });

    const rewards = missions.filter(
      (m, i) => m.completed && !state.missions[i].completed
    );

    if (rewards.length > 0) {
      setState((s) => ({
        ...s,
        coins: s.coins + rewards.reduce((a, b) => a + b.reward, 0),
        decorations: rewards.some((r) => r.id === "harvest5")
          ? [...s.decorations, "🌸"]
          : s.decorations,
        missions,
      }));
    } else {
      setState((s) => ({ ...s, missions }));
    }
  }, [planted, harvested, state.coins]);

  const cropEmoji = (crop: Crop) =>
    crop === "carrot" ? "🥕" : crop === "corn" ? "🌽" : "⬜";

  /* 🌿 UI */
  return (
    <div style={{ padding: 20, fontFamily: "system-ui" }}>
      <h1>🌿 Garden Clicker</h1>
      <a
  href="https://www.buymeacoffee.com/MarioMario"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "12px 18px",
    background: "#6fbf73",
    color: "#fff",
    borderRadius: "999px",
    textDecoration: "none",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
  }}
>
  ☕ Support the garden
</a>

      <button
        onClick={() => setState({ ...state, soundOn: !state.soundOn })}
        style={{ marginBottom: 12 }}
      >
        {state.soundOn ? "🔊 Sound ON" : "🔇 Sound OFF"}
      </button>

      <p>Coins: 🪙 {state.coins}</p>

      <h2>🌱 Garden</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 110px)", gap: 10 }}>
        {state.fields.map((f, i) => (
          <div
            key={i}
            style={{
              border: "2px solid #4caf50",
              padding: 10,
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 30 }}>{cropEmoji(f.crop)}</div>
            <div>⭐ {f.level}</div>
            {f.crop === "empty" ? (
              <button onClick={() => plant(i)}>Plant</button>
            ) : (
              <button onClick={() => harvest(i)}>Harvest</button>
            )}
            <br />
            <button onClick={() => upgrade(i)}>Upgrade (10🪙)</button>
          </div>
        ))}
      </div>

      <h2>🎯 Daily Missions</h2>
      <ul>
        {state.missions.map((m) => (
          <li key={m.id}>
            {m.completed ? "✅" : "⬜"} {m.description} (+{m.reward}🪙)
          </li>
        ))}
      </ul>

      <h2>🌸 Decorations</h2>
      <div style={{ fontSize: 26 }}>
        {state.decorations.length === 0 ? "None yet" : state.decorations.join(" ")}
      </div>

      <p style={{ marginTop: 40, opacity: 0.6 }}>
        Relax. Plant. Harvest. Come back tomorrow 🌙
      </p>
    </div>
  );
}
