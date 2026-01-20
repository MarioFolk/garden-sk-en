import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true, kvStore: true });

Devvit.addCustomPostType({
  name: 'Garden Clicker',
  description: 'Simple review clicker game',
  render: () => {
    const [score, setScore] = Devvit.useState<number | null>(null);
    const storage = Devvit.useStorage();

    // Načítanie uloženého skóre
    Devvit.useEffect(async () => {
      const saved = await storage.get<number>('score');
      setScore(saved ?? 0);
    }, []);

    const increment = async () => {
      const newScore = (score ?? 0) + 1;
      setScore(newScore);
      await storage.set('score', newScore);
    };

    if (score === null) return <text>Loading...</text>;

    return (
      <vstack gap="medium" alignment="center middle">
        <text size="xlarge">🌱 Garden SK Review Clicker</text>

        <button appearance="primary" onPress={increment}>
          Click me!
        </button>

        <text>Score: {score}</text>
      </vstack>
    );
  }
});

export default Devvit;
