document.addEventListener('DOMContentLoaded', () => {
    // DOM-elementen ophalen
    const modeButtons = document.querySelectorAll('.mode-button');
    const wordDisplay = document.getElementById('scrambled-word-display');
    const userInput = document.getElementById('user-input');
    const checkButton = document.getElementById('check-button');
    const feedbackMessage = document.getElementById('feedback-message');
    const scoreSpan = document.getElementById('current-score');
    const nextButton = document.getElementById('next-button');
    const timerDisplay = document.getElementById('timer-display');
    const currentTimeSpan = document.getElementById('current-time');
    const levelDisplay = document.getElementById('level-display');

    // Spelstatus variabelen
    let currentMode = 'default';
    let score = 0;
    let timerInterval;
    let timeLeft;
    let availableWords = [];

    // Dummy data voor het woordspel
    const words = [ // Lijst met 30 makkelijkere woorden
        { original: "huis", scrambled: "siuh" },
        { original: "boom", scrambled: "moob" },
        { original: "auto", scrambled: "otua" },
        { original: "zon", scrambled: "noz" },
        { original: "maan", scrambled: "naam" },
        { original: "kat", scrambled: "tak" },
        { original: "hond", scrambled: "dnoh" },
        { original: "vis", scrambled: "siv" },
        { original: "bal", scrambled: "lab" },
        { original: "stoel", scrambled: "leots" },
        { original: "tafel", scrambled: "lefat" },
        { original: "bed", scrambled: "deb" },
        { original: "boek", scrambled: "koeb" },
        { original: "pen", scrambled: "nep" },
        { original: "jas", scrambled: "saj" },
        { original: "sok", scrambled: "kos" },
        { original: "melk", scrambled: "klem" },
        { original: "brood", scrambled: "doorb" },
        { original: "kaas", scrambled: "saak" },
        { original: "gras", scrambled: "sarg" },
        { original: "bloem", scrambled: "moelb" },
        { original: "water", scrambled: "retwa" },
        { original: "fiets", scrambled: "stefi" },
        { original: "boot", scrambled: "toob" },
        { original: "zee", scrambled: "eez" },
        { original: "park", scrambled: "krap" },
        { original: "vogel", scrambled: "legov" },
        { original: "appel", scrambled: "leppa" },
        { original: "peer", scrambled: "reep" },
        { original: "eten", scrambled: "nete" }
    ];
    let currentWord = null;
    let isAnswered = false; // Voorkomt dubbele 'Enter' acties

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentMode = button.dataset.mode;
            console.log("Modus veranderd naar:", currentMode);
            resetGame();
        });
    });

    // --- TIMER LOGICA ---
    function startTimer() {
        timeLeft = 45; // Starttijd
        currentTimeSpan.textContent = timeLeft;
        timerDisplay.classList.remove('hidden');

        timerInterval = setInterval(() => {
            timeLeft--;
            currentTimeSpan.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function adjustTime(seconds) {
        timeLeft += seconds;
        if (timeLeft < 0) timeLeft = 0; // Zorg ervoor dat de tijd niet negatief wordt
        currentTimeSpan.textContent = timeLeft;
    }

    function endGame() {
        stopTimer();
        wordDisplay.textContent = `Tijd is om! Je eindscore is ${score}.`;
        feedbackMessage.textContent = 'Klik op "Herstart" om opnieuw te spelen.';
        userInput.disabled = true;
        checkButton.disabled = true;
        nextButton.textContent = 'Herstart';
        nextButton.style.display = 'inline-block';
        nextButton.classList.remove('hidden');
    }

    function resetGame() {
        score = 0;
        scoreSpan.textContent = score;
        feedbackMessage.textContent = '';
        userInput.value = '';
        userInput.disabled = false;
        userInput.style.display = 'inline-block';
        checkButton.disabled = false;
        checkButton.style.display = 'inline-block';
        nextButton.classList.add('hidden');
        availableWords = [...words]; // Reset de lijst met beschikbare woorden
        stopTimer();

        // UI aanpassen op basis van modus
        timerDisplay.classList.add('hidden');
        levelDisplay.classList.add('hidden');

        if (currentMode === 'time') {
            startTimer();
        }

        document.querySelector('h1').textContent = '✨ Spellingskampioen! ✨';
        userInput.placeholder = 'Typ het juiste woord hier...';
        nextButton.textContent = 'Nieuw Woord / Herstart';

        getNewWord();
    }

    function getNewWord() {
        isAnswered = false; // Reset de status voor het nieuwe woord
        if (availableWords.length === 0) {
            stopTimer();
            wordDisplay.textContent = "Alle woorden geraden!";
            feedbackMessage.textContent = `Goed gedaan! Je eindscore is ${score}.`;
            userInput.disabled = true;
            checkButton.disabled = true;
            nextButton.textContent = 'Herstart';
            nextButton.classList.remove('hidden');
            return;
        }
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[randomIndex];
        wordDisplay.textContent = currentWord.scrambled;
        feedbackMessage.textContent = '';
        userInput.value = '';
        userInput.disabled = false;
        checkButton.disabled = false;
        nextButton.classList.add('hidden');
    }

    function checkAnswer() {
        if (isAnswered) return; // Als al beantwoord, doe niets

        const playerAnswer = userInput.value.toLowerCase();
        if (playerAnswer === currentWord.original.toLowerCase()) {
            isAnswered = true;
            score++;
            scoreSpan.textContent = score;
            feedbackMessage.textContent = '🎉 Goed zo!';
            feedbackMessage.style.color = 'green';

            // Verwijder het correct geraden woord uit de lijst
            const wordIndex = availableWords.indexOf(currentWord);
            if (wordIndex > -1) {
                availableWords.splice(wordIndex, 1);
            }

            if (currentMode === 'time') {
                adjustTime(30); // +30 seconden voor goed antwoord
            }

            // Ga direct door naar het volgende woord na een korte pauze
            setTimeout(getNewWord, 400);
        } else {
            feedbackMessage.textContent = `Helaas, probeer het opnieuw.`;
            feedbackMessage.style.color = 'red';
            if (currentMode === 'time') {
                adjustTime(-10); // -10 seconden voor fout antwoord
            }
        }
    }

    checkButton.addEventListener('click', checkAnswer);
    userInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' && !userInput.disabled) {
            checkAnswer();
        }
    });

    nextButton.addEventListener('click', () => {
        if (nextButton.textContent === 'Herstart') {
            resetGame();
        } else {
            getNewWord();
        }
    });

    resetGame();
});
