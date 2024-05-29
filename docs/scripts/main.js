class Screen {
  constructor() {
    this.duration;
    this.lines = [];
  }

  get text() {
    return this.lines.join('\n');
  }
  set text(value) {
    this.lines = [];
    for (const line of value.split('\n')) {
      this.lines.push(line);
    }
  }
}

const lineQueue = [];
let isRunning = false;
let screenElem;

window.addEventListener('load', () => {
  screenElem = document.getElementById('screen');
  main();
});

async function main() {
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

    sb.push(line.replaceAll('\n', '').replaceAll('\r', ''));

    if (index === 13) {
      const screen = new Screen();
      screen.duration = timeDuration * 70;
      screen.lines = sb;
      lineQueue.push(screen);
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
  if (!screen)
    return Promise.resolve();

  let screensInnerHTML = '';
  for (let line of screen.lines) {
    if (!line || line.length === 0)
      line = ' ';
    line = line.replaceAll(' ', '⠀');
    screensInnerHTML += `<p class="line">${line}</p>`;
  }
  screensInnerHTML += '<p id="size-line" class="line">                                                                   </p>';

  screenElem.innerHTML = screensInnerHTML;

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
