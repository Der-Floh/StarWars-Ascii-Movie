class Screen {
  constructor(text = '', duration = 0) {
    this.text = text;
    this.duration = duration;
  }
}

const lineQueue = [];
let isRunning = false;
let screenElem = document.getElementById('screen');

async function main() {
  // Assuming Data.StarWars is a string with your text data
  const data = await getData();
  const lines = data.split('\n');
  if (!lines || lines.length === 0) return;

  loadScreens(lines);
  await printScreens();
}

function loadScreens(lines) {
  let sb = [];
  let index = 0;
  let timeDuration = 0;

  lines.forEach(line => {
    if (index === 0) {
      timeDuration = parseInt(line.trim(), 10);
      index++;
      return;
    }

    sb.push(line);
    if (index === 13) {
      lineQueue.push(new Screen(sb.join('\n'), timeDuration * 70));
      sb = [];
      index = 0;
    } else {
      index++;
    }
  });

  isRunning = false;
}

async function printScreens() {
  isRunning = true;

  while (isRunning || lineQueue.length !== 0) {
    if (lineQueue.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
      continue;
    }

    const screen = lineQueue.shift();
    await printScreen(screen);
  }
}

function printScreen(screen) {
  if (!screen) return Promise.resolve();
  if (!screenElem)
    screenElem = document.getElementById('screen');
  screenElem.textContent = screen.text;
  return new Promise(resolve => setTimeout(resolve, screen.duration));
}

async function getData() {
  try {
    const response = await fetch('resources/starwars.txt');
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}


// Example usage
main();
