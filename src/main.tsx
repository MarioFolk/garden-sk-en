import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
  kvStore: true,
});

Devvit.addCustomPostType({
  name: 'Garden Clicker',
  render: (context) => {
    const { userId } = context;
    
    // Load score with async initializer
    const [score, setScore] = useState(async () => {
      if (userId) {
        const stored = await context.kvStore.get(`score:${userId}`);
        return stored ? parseInt(stored as string) : 0;
      }
      return 0;
    });

    const handleClick = async () => {
      const newScore = score + 1;
      setScore(newScore);

      // Persist to KVStore
      if (userId) {
        await context.kvStore.put(`score:${userId}`, newScore.toString());
      }
    };

    return (
      <vstack alignment="center middle" gap="medium">
        <text size="xlarge">🌱 Garden SK Clicker</text>

        <button
          appearance="primary"
          onPress={handleClick}
        >
          Klikni 🌿
        </button>

        <text size="large">Score: {score}</text>
      </vstack>
    );
  },
});

export default Devvit;
