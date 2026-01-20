import { Devvit } from '@devvit/public-api';

Devvit.addCustomPostType({
  name: 'Garden Clicker',
  description: 'Simple clicker test',
  render: () => {
    return (
      <vstack padding="medium" gap="medium">
        <text size="xlarge" weight="bold">
          🌱 Garden Clicker
        </text>

        <text>
          Devvit UI funguje 🎉
        </text>
      </vstack>
    );
  },
});

export default Devvit;
