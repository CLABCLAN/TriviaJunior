// =================================================================
// 1. QUIZ DATA: VOEG HIER NIEUWE VRAGEN TOE!
// LET OP: Alle 'image' paden moeten beginnen met 'images/'
// =================================================================
const QUIZ_DATA = [
    { image: 'images/lion.jpg', correct: 'Lion', options: ['Tiger', 'Wolf', 'Leopard', 'Lion'] },
    { image: 'images/elephant.jpg', correct: 'Elephant', options: ['Rhino', 'Hippo', 'Elephant', 'Giraffe'] },
    { image: 'images/monkey.jpg', correct: 'Monkey', options: ['Chimpanzee', 'Gorilla', 'Monkey', 'Baboon'] },
    { image: 'images/penguin.jpg', correct: 'Penguin', options: ['Duck', 'Albatross', 'Penguin', 'Gull'] },
    { image: 'images/giraffe.jpg', correct: 'Giraffe', options: ['Zebra', 'Camel', 'Giraffe', 'Llama'] },
    { image: 'images/snake.jpg', correct: 'Snake', options: ['Worm', 'Eel', 'Lizard', 'Snake'] },
    { image: 'images/dolphin.jpg', correct: 'Dolphin', options: ['Shark', 'Whale', 'Dolphin', 'Seal'] },
    { image: 'images/rabbit.jpg', correct: 'Rabbit', options: ['Hare', 'Squirrel', 'Rat', 'Rabbit'] },
    { image: 'images/bear.jpg', correct: 'Bear', options: ['Grizzly', 'Kodiak', 'Panda', 'Bear'] },
    { image: 'images/tiger.jpg', correct: 'Tiger', options: ['Leopard', 'Jaguar', 'Panther', 'Tiger'] },
    { image: 'images/zebra.jpg', correct: 'Zebra', options: ['Horse', 'Donkey', 'Zebra', 'Stallion'] },
    { image: 'images/owl.jpg', correct: 'Owl', options: ['Eagle', 'Hawk', 'Owl', 'Falcon'] },
    { image: 'images/spider.jpg', correct: 'Spider', options: ['Scorpion', 'Tarantula', 'Ant', 'Spider'] },
    { image: 'images/crocodile.jpg', correct: 'Crocodile', options: ['Alligator', 'Crocodile', 'Lizard', 'Iguana'] },
    { image: 'images/shark.jpg', correct: 'Shark', options: ['Dolphin', 'Shark', 'Tuna', 'Salmon'] },
    { image: 'images/parrot.jpg', correct: 'Parrot', options: ['Toucan', 'Macaw', 'Parrot', 'Cockatoo'] },
    { image: 'images/kangaroo.jpg', correct: 'Kangaroo', options: ['Wallaby', 'Kangaroo', 'Koala', 'Wombat'] },
    { image: 'images/fox.jpg', correct: 'Fox', options: ['Wolf', 'Coyote', 'Fox', 'Jackal'] },
    { image: 'images/turtle.jpg', correct: 'Turtle', options: ['Tortoise', 'Lizard', 'Turtle', 'Frog'] },
    { image: 'images/bee.jpg', correct: 'Bee', options: ['Wasp', 'Hornet', 'Bee', 'Fly'] },
    { image: 'images/frog.jpg', correct: 'Frog', options: ['Toad', 'Newt', 'Frog', 'Salamander'] },
    { image: 'images/octopus.jpg', correct: 'Octopus', options: ['Squid', 'Cuttlefish', 'Octopus', 'Jellyfish'] },
    { image: 'images/peacock.jpg', correct: 'Peacock', options: ['Pheasant', 'Turkey', 'Peacock', 'Chicken'] },
    { image: 'images/seahorse.jpg', correct: 'Seahorse', options: ['Sealion', 'Seahorse', 'Starfish', 'Clownfish'] },
    { image: 'images/squirrel.jpg', correct: 'Squirrel', options: ['Chipmunk', 'Rat', 'Squirrel', 'Mouse'] },
    { image: 'images/flamingo.jpg', correct: 'Flamingo', options: ['Heron', 'Stork', 'Swan', 'Flamingo'] },
    { image: 'images/caterpillar.jpg', correct: 'Caterpillar', options: ['Worm', 'Larva', 'Caterpillar', 'Beetle'] },
    { image: 'images/camel.jpg', correct: 'Camel', options: ['Dromedary', 'Llama', 'Camel', 'Alpaca'] },
    { image: 'images/whale.jpg', correct: 'Whale', options: ['Dolphin', 'Shark', 'Whale', 'Orca'] },
    { image: 'images/bat.jpg', correct: 'Bat', options: ['Bird', 'Owl', 'Mouse', 'Bat'] },
];

// =================================================================
// 2. STATE & ELEMENTEN
// =================================================================
let currentQuestionIndex = 0;
let score = 0;
let questionList = []; 
let currentQuestion;

const imageElement = document.getElementById('animal-image');
const optionsArea = document.getElementById('options-area');
const scoreDisplay = document.getElementById('score');
const totalQuestionsDisplay = document.getElementById('total-questions');
const nextButton = document.getElementById('next-button');
const feedbackMessage = document.getElementById('feedback');

// =================================================================
// 3. FUNCTIES VOOR HET SPEL
// =================================================================

function initializeGame() {
    // 1. Shuffle de hele QUIZ_DATA array
    questionList = [...QUIZ_DATA]; 
    questionList.sort(() => Math.random() - 0.5); 
    
    // 2. Update de totale vragen op het scorebord
    totalQuestionsDisplay.textContent = questionList.length;
    
    // 3. Start de eerste vraag
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= questionList.length) {
        showFinalScore();
        return;
    }

    currentQuestion = questionList[currentQuestionIndex];
    
    optionsArea.innerHTML = '';
    nextButton.classList.add('hidden');
    feedbackMessage.textContent = '';
    feedbackMessage.className = 'message';

    // LAADT DE AFBEELDING
    imageElement.src = currentQuestion.image; 
    imageElement.alt = "Raad dit dier: " + currentQuestion.image.replace('images/', '').replace('.jpg', '');

    let shuffledOptions = [...currentQuestion.options];
    shuffledOptions.sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.onclick = () => checkAnswer(option, currentQuestion.correct);
        optionsArea.appendChild(button);
    });
}

function checkAnswer(selectedOption, correctAnswer) {
    Array.from(optionsArea.children).forEach(button => {
        button.disabled = true;
        if (button.textContent === correctAnswer) {
            button.classList.add('correct');
        } else if (button.textContent === selectedOption) {
             button.classList.add('incorrect');
        }
    });

    if (selectedOption === correctAnswer) {
        score++;
        scoreDisplay.textContent = score;
        feedbackMessage.textContent = "GEWELDIG! Dat is de " + correctAnswer + "!";
    } else {
        feedbackMessage.textContent = "Helaas. Het juiste antwoord was: de " + correctAnswer + ".";
    }

    nextButton.classList.remove('hidden');
}

// =================================================================
// FUNCTIE OM SCORE NAAR PYTHON API TE STUREN
// =================================================================
function sendScoreToAPI(finalScore, totalQuestions) {
    // API sleutel met HOOFDLETTERS J en A, zoals vereist door de Python code
    const API_KEY = 'TRIVIA_Junior_APP_GROEPSPROJECT123'; 
    const API_URL = 'http://127.0.0.1:5000/api/save_score'; 
    
    const dataToSend = {
        quiz_name: "Animal Quiz",
        score: finalScore,
        total_questions: totalQuestions,
        timestamp: new Date().toISOString()
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // STUUR DE AUTHENTICATIE-SLEUTEL MEE
            'X-API-KEY': API_KEY 
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => {
        // Zorg ervoor dat de netwerkstatus 200 is, of werp een fout op bij 401
        if (response.status === 401) {
             throw new Error('Authenticatie Mislukt. Controleer de API Sleutel!');
        }
        if (!response.ok) {
            throw new Error('Netwerkfout of API-status (' + response.status + ').');
        }
        return response.json();
    })
    .then(data => {
        console.log('Score succesvol verzonden!', data);
        document.getElementById('api-status').textContent = `✅ Score Opgeslagen (ID: ${data.id})`;
    })
    .catch((error) => {
        console.error('Fout bij het verzenden van de score:', error);
        document.getElementById('api-status').textContent = `❌ Fout: ${error.message}`;
    });
}

function showFinalScore() {
    optionsArea.innerHTML = '';
    imageElement.src = 'placeholder.jpg'; 
    nextButton.classList.add('hidden');
    
    let finalScore = score;
    let totalQ = questionList.length;
    
    let finalMessage = `Quiz klaar! Je score is ${finalScore} van de ${totalQ} dieren!`;
    feedbackMessage.textContent = finalMessage;
    feedbackMessage.style.fontSize = '1.5em';
    
    // Voeg een statusbericht voor de API toe
    const apiStatus = document.createElement('p');
    apiStatus.id = 'api-status';
    apiStatus.textContent = 'Verzenden van score...';
    feedbackMessage.insertAdjacentElement('afterend', apiStatus);
    
    // *** ROEP DE VERZEND FUNCTIE AAN ***
    sendScoreToAPI(finalScore, totalQ);

    const restartButton = document.createElement('button');
    restartButton.textContent = "Speel Opnieuw!";
    restartButton.id = "restart-button";
    restartButton.onclick = () => {
        currentQuestionIndex = 0;
        score = 0;
        scoreDisplay.textContent = 0;
        initializeGame(); 
    };
    optionsArea.appendChild(restartButton);
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

// =================================================================
// 4. SPEL STARTEN
// =================================================================
initializeGame();
