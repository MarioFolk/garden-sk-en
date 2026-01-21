import { Devvit } from '@devvit/public-api';

Devvit.addCustomPostType({
  name: 'Garden Clicker',
  render: () => {
    const [score, setScore] = Devvit.useState(0);

    return (
      <vstack gap="medium" alignment="center middle">
        <text size="xlarge">🌱 Garden SK Review Clicker</text>

        <button appearance="primary" onPress={() => setScore(score + 1)}>
          Click me!
        </button>

        <text>Score: {score}</text>
      </vstack>
    );
  },
});

export default Devvit;
