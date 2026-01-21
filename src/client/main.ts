let score = 0;

const root = document.getElementById('root');

if (root) {
  const scoreEl = document.createElement('div');
  scoreEl.innerText = `Score: ${score}`;
  root.appendChild(scoreEl);

  const button = document.createElement('button');
  button.innerText = 'Click me!';
  button.onclick = () => {
    score += 1;
    scoreEl.innerText = `Score: ${score}`;
  };
  root.appendChild(button);
}
