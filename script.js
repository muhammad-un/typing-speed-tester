const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const errorsDisplay = document.getElementById('errors');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');

const wordsToType = ["banana", "cloud", "guitar", "matrix", "zebra", "python", "rocket", "lamp", "ocean", "wizard", "jungle", "puzzle", "storm", "laser", "ninja"];

let currentWordIndex = 0;
let startTime;
let intervalId;
let typedWord = "";
let correctWords = 0;
let totalErrors = 0;
let totalTypedChars = 0;
let isTestRunning = false;

function startGame() {
    if (!isTestRunning) {
        isTestRunning = true;
        currentWordIndex = 0;
        correctWords = 0;
        totalErrors = 0;
        totalTypedChars = 0;
        timerDisplay.textContent = 0;
        wpmDisplay.textContent = 0;
        accuracyDisplay.textContent = "0%";
        errorsDisplay.textContent = 0;
        inputField.value = "";
        displayCurrentWord();
        startTime = new Date();
        intervalId = setInterval(updateTimer, 1000);
        inputField.disabled = false;
        inputField.focus();
    }
}

function displayCurrentWord() {
    textDisplay.innerHTML = '';
    const currentWord = wordsToType[currentWordIndex];
    for (let i = 0; i < currentWord.length; i++) {
        const span = document.createElement('span');
        span.textContent = currentWord[i];
        textDisplay.appendChild(span);
    }
}

inputField.addEventListener('input', () => {
    if (!isTestRunning) return;
    typedWord = inputField.value;
    visualizeInput();

    // Handle space for word completion
    if (typedWord.endsWith(' ')) {
        typedWord = typedWord.trim();
        const expectedWord = wordsToType[currentWordIndex];

        if (typedWord === expectedWord) {
            correctWords++;
        } else {
            totalErrors++;
        }
        totalTypedChars += expectedWord.length + 1;
        inputField.value = "";
        currentWordIndex++;

        if (currentWordIndex < wordsToType.length) {
            displayCurrentWord();
        } else {
            endGame();
        }
    }
});

inputField.addEventListener('keydown', (event) => {
    if (!isTestRunning) return;
    if (event.key === 'Backspace') {
        // Basic backspace handling within the current word
        if (typedWord.length > 0) {
            typedWord = typedWord.slice(0, -1);
            visualizeInput();
        }
    }
});

function visualizeInput() {
    const expectedWord = wordsToType[currentWordIndex];
    textDisplay.innerHTML = '';
    for (let i = 0; i < expectedWord.length; i++) {
        const span = document.createElement('span');
        span.textContent = expectedWord[i];
        if (i < typedWord.length) {
            if (typedWord[i] === expectedWord[i]) {
                span.classList.add('correct');
            } else {
                span.classList.add('incorrect');
            }
        }
        textDisplay.appendChild(span);
    }
}

function updateTimer() {
    const currentTime = new Date();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000);
    timerDisplay.textContent = timeElapsed;
    updateResults(timeElapsed);
}

function updateResults(timeElapsed) {
    if (timeElapsed > 0) {
        const wordsTyped = correctWords;
        const wpm = Math.round((wordsTyped / timeElapsed) * 60);
        const accuracy = totalTypedChars > 0 ? Math.round(((totalTypedChars - totalErrors) / totalTypedChars) * 100) : 0;

        wpmDisplay.textContent = wpm;
        accuracyDisplay.textContent = accuracy + "%";
        errorsDisplay.textContent = totalErrors;
    }
}

function endGame() {
    isTestRunning = false;
    clearInterval(intervalId);
    inputField.disabled = true;
}

function resetGame() {
    isTestRunning = false;
    clearInterval(intervalId);
    currentWordIndex = 0;
    correctWords = 0;
    totalErrors = 0;
    totalTypedChars = 0;
    timerDisplay.textContent = 0;
    wpmDisplay.textContent = 0;
    accuracyDisplay.textContent = "0%";
    errorsDisplay.textContent = 0;
    inputField.value = "";
    displayCurrentWord();
    inputField.disabled = true;
}

// Initial setup
if (wordsToType.length > 0) {
    displayCurrentWord();
}
inputField.disabled = true;
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);