import { Devvit } from '@devvit/public-api';

export function Game() {
  const [score, setScore] = Devvit.useState<number | null>(null);
  const storage = Devvit.useStorage();

  // Načítanie score pri štarte
  Devvit.useEffect(async () => {
    const saved = await storage.get<number>('score');
    setScore(saved ?? 0);
  }, []);

  const increment = async () => {
    const newScore = (score ?? 0) + 1;

    // ✅ uloženie do storage
    await storage.set('score', newScore);

    // ✅ update UI
    setScore(newScore);
  };

  if (score === null) {
    return <text>Loading...</text>;
  }

  return (
    <vstack
      height="100%"
      width="100%"
      alignment="center middle"
      gap="medium"
    >
      <text size="xlarge" weight="bold">
        🌱 Garden SK Review Clicker
      </text>

      <button appearance="primary" onPress={increment}>
        Click me!
      </button>

      <text size="large">
        Score: {score}
      </text>
    </vstack>
  );
}
