import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

Devvit.addCustomPostType({
  name: 'Garden Clicker',
  render: () => {
    const [score, setScore] = useState(0);

    return (
      <vstack alignment="center middle" gap="medium">
        <text size="xlarge">🌱 Garden SK Clicker</text>

        <button
          appearance="primary"
          onPress={() => setScore((prev) => prev + 1)}
        >
          Klikni 🌿
        </button>

        <text size="large">Score: {score}</text>
      </vstack>
    );
  },
});

export default Devvit;
