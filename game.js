// WOORDENLIJST: Georganiseerd op lengte voor de Level Up modus
const wordList = {
    4: ["FIETS", "BOEK", "HUIS", "WOLK", "GRAS", "KRANT", "VRIJ"],
    5: ["APPEL", "SPEEL", "LEZEN", "GEHEIM", "LOPEN", "ZAND", "MAKEN"],
    6: ["KATTEN", "SCHOOL", "TUINEN", "VOGELS", "DROMEN", "BEZOEK", "DENKEN"],
    8: ["COMPUTER", "AVONTUUR", "GISTEREN", "VANDAAG", "PLANETEN", "GROENTE"],
    11: ["ZONNEBLOEM", "OVERMORGEN", "SPEELTUIN", "BIBLIOTHEEK"]
};

// Vlakke lijst van alle woorden voor Scramble, Tijdrit en Lege Plek
const allWords = [].concat(...Object.values(wordList));

let currentWord = '';
let score = 0;
let currentMode = 'default';
let timerInterval;
let timeRemaining = 60;
let currentLevel = 4; // Start met 4-letterwoorden voor Level Up mode

// =================================================================
// HULPFUNCTIES
// =================================================================

// Functie om de letters van een woord door elkaar te gooien (Scramble)
function scrambleWord(word) {
    const letters = word.split('');
    // Fisher-Yates shuffle
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    const scrambled = letters.join('');
    // Zorg dat het niet hetzelfde is als het origineel
    if (scrambled === word) {
        return scrambleWord(word); 
    }
    return scrambled;
}

// Functie om een woord met lege plekken te maken (Lege Plek)
function createBlankWord(word) {
    const letters = word.split('');
    const blanksCount = Math.floor(word.length / 4) + 1; // 1 of 2 lege plekken
    const indices = [];

    // Kies willekeurige unieke indexen
    while (indices.length < blanksCount) {
        const index = Math.floor(Math.random() * word.length);
        if (!indices.includes(index)) {
            indices.push(index);
        }
    }

    // Vervang letters door underscores
    indices.forEach(index => {
        letters[index] = '_';
    });

    return letters.join('');
}


// =================================================================
// START / EINDE VAN DE RONDE FUNCTIES
// =================================================================

// De centrale functie die bepaalt hoe het woord wordt getoond
function generateDisplayWord(word) {
    if (currentMode === 'default' || currentMode === 'time') {
        return scrambleWord(word); // Scrambled woord
    } else if (currentMode === 'blank') {
        return createBlankWord(word); // Woord met underscores
    } else if (currentMode === 'level') {
        return scrambleWord(word); // Ook scrambled, maar de selectie is anders
    }
}

// Functie om een nieuwe ronde te starten
function startNewRound() {
    // 1. Selecteer het juiste woord op basis van de modus
    let selectedWord;

    if (currentMode === 'level') {
        // Gebruik de woordenlijst voor het huidige niveau (lengte)
        const wordsForLevel = wordList[currentLevel];
        if (!wordsForLevel) {
            // Dit zou alleen moeten gebeuren als alle levels zijn voltooid
            endGame('Gefeliciteerd! Je hebt alle levels voltooid! 🎉');
            return;
        }
        const randomIndex = Math.floor(Math.random() * wordsForLevel.length);
        selectedWord = wordsForLevel[randomIndex];
    } else {
        // Gebruik de algemene lijst voor andere modes
        const randomIndex = Math.floor(Math.random() * allWords.length);
        selectedWord = allWords[randomIndex];
    }
    
    currentWord = selectedWord.toUpperCase();

    // 2. Toon het woord op de juiste manier
    const displayWord = generateDisplayWord(currentWord);
    document.getElementById('scrambled-word-display').textContent = displayWord;

    // 3. Reset interface
    document.getElementById('user-input').value = '';
    document.getElementById('feedback-message').textContent = 'Raad het woord! 🤔';
    document.getElementById('feedback-message').className = 'message';
    document.getElementById('check-button').style.display = 'inline-block';
    document.getElementById('next-button').classList.add('hidden');
    document.getElementById('user-input').focus(); 
}

// =================================================================
// GAME LOGICA
// =================================================================

// Functie om het antwoord te controleren
function checkAnswer() {
    const userInput = document.getElementById('user-input').value.trim().toUpperCase();
    const feedbackElement = document.getElementById('feedback-message');
    
    if (userInput === '') {
        feedbackElement.textContent = '❌ Typ eerst een woord in!';
        feedbackElement.className = 'message incorrect';
        return;
    }

    if (userInput === currentWord) {
        // CORRECT ANTWOORD
        feedbackElement.textContent = `🥳 Fantastisch! Het was inderdaad "${currentWord}"!`;
        feedbackElement.className = 'message correct';
        score++;
        document.getElementById('current-score').textContent = score;

        if (currentMode === 'time') {
            // Bij Tijdrit: direct een nieuw woord starten (geen 'Nieuw Woord' knop)
            startNewRound();
        } else if (currentMode === 'level') {
            // Bij Level Up: check of we naar het volgende niveau moeten
            checkLevelUp();
            document.getElementById('check-button').style.display = 'none';
            document.getElementById('next-button').classList.remove('hidden');
            document.getElementById('next-button').textContent = 'Volgende Woord';

        } else {
            // Standaard of Lege Plek: toon 'Nieuw Woord' knop
            document.getElementById('check-button').style.display = 'none';
            document.getElementById('next-button').classList.remove('hidden');
            document.getElementById('next-button').textContent = 'Nieuw Woord';
        }

    } else {
        // FOUT ANTWOORD
        feedbackElement.textContent = '❌ Helaas, probeer nog eens! (Tip: let op hoofdletters en spaties!)';
        feedbackElement.className = 'message incorrect';
        document.getElementById('user-input').value = '';
        document.getElementById('user-input').focus();
    }
}

// =================================================================
// TIMER LOGICA (voor Tijdrit Mode)
// =================================================================

function updateTimer() {
    timeRemaining--;
    document.getElementById('current-time').textContent = timeRemaining;

    if (timeRemaining <= 10) {
        document.getElementById('timer-display').style.color = '#ff4500'; // Oranje/rood bij weinig tijd
    } else {
        document.getElementById('timer-display').style.color = '#f44336';
    }

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        endGame(`De tijd is om! Je score is: ${score} punten! 🏆`);
    }
}

function startTimerMode() {
    score = 0;
    timeRemaining = 60;
    document.getElementById('current-score').textContent = score;
    document.getElementById('timer-display').textContent = 'Tijd: 60s';
    document.getElementById('next-button').textContent = 'Herstart Tijdrit';
    
    // Zorg ervoor dat de timer zichtbaar is
    document.getElementById('timer-display').classList.remove('hidden');
    document.getElementById('level-display').classList.add('hidden');
    document.getElementById('next-button').classList.add('hidden'); // Verberg de knop tijdens het spelen
    
    // Start de timer
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    startNewRound();
}

// =================================================================
// LEVEL UP LOGICA (voor Woordlengte Uitdaging)
// =================================================================

function checkLevelUp() {
    // We checken de score na een correct antwoord. 
    // Als de score een veelvoud is van 5, gaan we naar het volgende niveau.
    if (score > 0 && score % 5 === 0) {
        const sortedLevels = Object.keys(wordList).map(Number).sort((a, b) => a - b);
        const currentIndex = sortedLevels.indexOf(currentLevel);
        
        if (currentIndex < sortedLevels.length - 1) {
            currentLevel = sortedLevels[currentIndex + 1];
            document.getElementById('current-level').textContent = currentLevel;
            document.getElementById('feedback-message').textContent = `NIVEAU UP! Nu ${currentLevel}-letterwoorden! ⬆️`;
        } else {
            // Alle levels voltooid
            endGame('Je bent de opper-spellingskampioen! Alle levels voltooid! 🎉');
        }
    }
}

// =================================================================
// MODUS CONTROLE & INIT
// =================================================================

function resetGame() {
    // Reset basisvariabelen
    clearInterval(timerInterval);
    score = 0;
    document.getElementById('current-score').textContent = score;
    document.getElementById('timer-display').classList.add('hidden');
    document.getElementById('level-display').classList.add('hidden');
    document.getElementById('next-button').classList.add('hidden');
    document.getElementById('check-button').style.display = 'inline-block';
}

function endGame(message) {
    document.getElementById('scrambled-word-display').textContent = 'GAME OVER!';
    document.getElementById('feedback-message').textContent = message;
    document.getElementById('feedback-message').className = 'message correct';
    document.getElementById('check-button').style.display = 'none';
    document.getElementById('next-button').classList.remove('hidden');
    document.getElementById('next-button').textContent = 'Nieuw Spel'; // Tekst aanpassen na einde
    document.getElementById('user-input').value = '';
    document.getElementById('user-input').disabled = true; // Veld uitschakelen
}

function selectMode(mode) {
    resetGame();
    currentMode = mode;
    document.querySelectorAll('.mode-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.getElementById('user-input').disabled = false;

    // Start de juiste modus
    if (mode === 'time') {
        startTimerMode();
    } else if (mode === 'level') {
        currentLevel = 4; // Start altijd bij het laagste level
        document.getElementById('current-level').textContent = currentLevel;
        document.getElementById('level-display').classList.remove('hidden');
        document.getElementById('next-button').textContent = 'Volgende Woord';
        startNewRound();
    } else {
        document.getElementById('next-button').textContent = 'Nieuw Woord';
        startNewRound();
    }
}

// Event Listeners voor de knoppen
document.getElementById('check-button').addEventListener('click', checkAnswer);
document.getElementById('next-button').addEventListener('click', () => {
    // Na het einde van een game (Time Attack), herstarten we de modus
    if (document.getElementById('next-button').textContent === 'Nieuw Spel') {
         selectMode(currentMode); // Herstart de huidige modus
    } else {
        startNewRound();
    }
});

// Listener voor de Enter-toets
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && document.getElementById('check-button').style.display !== 'none' && !document.getElementById('user-input').disabled) {
        event.preventDefault(); 
        checkAnswer();
    }
});

// Listeners voor de mode-knoppen
document.querySelectorAll('.mode-button').forEach(button => {
    button.addEventListener('click', function() {
        selectMode(this.getAttribute('data-mode'));
    });
});

// Start de game in de standaard modus zodra de pagina geladen is
window.onload = () => {
    selectMode('default');
};