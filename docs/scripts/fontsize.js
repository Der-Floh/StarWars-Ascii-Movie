async function adjustFontSize() {
    const screenElem = document.getElementById('screen');
    let fontSize = 10;
    const screenWidth = window.innerWidth;

    screenElem.style.fontSize = `${fontSize}px`;

    while (screenElem.scrollWidth <= screenWidth && fontSize < 100) {
        fontSize += 1;
        screenElem.style.fontSize = `${fontSize}px`;
    }

    screenElem.style.fontSize = `${fontSize - 1}px`;
}

window.addEventListener('load', async () => {
    await adjustFontSize();
});

window.addEventListener('resize', async () => {
    await adjustFontSize();
});
