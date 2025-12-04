const questions = [
  { question: "Klik op Europa: Plaats de rode pin op het continent Europa", correctPosition: {x: 350, y: 150} },
  { question: "Klik op Afrika: Plaats de rode pin op het continent Afrika", correctPosition: {x: 350, y: 300} },
  { question: "Klik op Azië: Plaats de rode pin op het continent Azië", correctPosition: {x: 500, y: 150} },
  { question: "Klik op Noord-Amerika: Plaats de rode pin op het continent Noord-Amerika", correctPosition: {x: 150, y: 150} },
  { question: "Klik op Zuid-Amerika: Plaats de rode pin op het continent Zuid-Amerika", correctPosition: {x: 200, y: 350} },
  { question: "Klik op Australië: Plaats de rode pin op het continent Australië", correctPosition: {x: 520, y: 370} },
  { question: "Klik op Antarctica: Plaats de rode pin op het continent Antarctica", correctPosition: {x: 350, y: 500} },
  { question: "Klik op de Middellandse Zee: Plaats de rode pin op de Middellandse Zee", correctPosition: {x: 350, y: 250} },
  { question: "Klik op de oceaan links van Afrika: Plaats de rode pin op de Atlantische Oceaan", correctPosition: {x: 200, y: 300} },
  { question: "Klik op de oceaan rechts van Afrika: Plaats de rode pin op de Indische Oceaan", correctPosition: {x: 500, y: 300} },
  { question: "Klik op de Himalaya: Plaats de rode pin op de bergketen Himalaya", correctPosition: {x: 480, y: 130} },
  { question: "Klik op Mount Everest: Plaats de rode pin op de top van Mount Everest", correctPosition: {x: 500, y: 120} },
  { question: "Klik op de Nijl: Plaats de rode pin op de rivier Nijl", correctPosition: {x: 320, y: 350} },
  { question: "Klik op de Sahara: Plaats de rode pin op de Sahara-woestijn", correctPosition: {x: 250, y: 250} },
  { question: "Klik op de Amazone: Plaats de rode pin op de rivier Amazone", correctPosition: {x: 450, y: 300} },
  { question: "Klik op Japan: Plaats de rode pin op Japan", correctPosition: {x: 600, y: 150} },
  { question: "Klik op Groenland: Plaats de rode pin op Groenland", correctPosition: {x: 150, y: 50} },
  { question: "Klik op de Noordpool: Plaats de rode pin op de Noordpool", correctPosition: {x: 350, y: 0} },
  { question: "Klik op de Zuidpool: Plaats de rode pin op de Zuidpool", correctPosition: {x: 350, y: 500} }
];

let currentQ = 0;
let score = 0;
const tolerance = 50;

const questionBox = document.getElementById('question-box');
const map = document.getElementById('map');
const mapContainer = document.querySelector('.map-container');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const scoreDisplay = document.getElementById('score');
const totalDisplay = document.getElementById('total');
totalDisplay.textContent = questions.length;

let scale = 1;
const minScale = 1;
const maxScale = 3;

function showQuestion() {
  if(currentQ >= questions.length){
    questionBox.textContent = `Alle vragen zijn beantwoord! 🎉 Score: ${score} / ${questions.length}`;
    return;
  }
  questionBox.textContent = questions[currentQ].question;
  message.textContent = "";
}

function showConfetti() {
  for(let i=0;i<100;i++){
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = Math.random()*window.innerWidth + 'px';
    confetti.style.backgroundColor = `hsl(${Math.random()*360},100%,50%)`;
    document.body.appendChild(confetti);
    setTimeout(()=> confetti.remove(), 2000);
  }
}

mapContainer.addEventListener('wheel', e => {
  e.preventDefault();
  const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
  let newScale = scale * zoomFactor;
  if(newScale < minScale) newScale = minScale;
  if(newScale > maxScale) newScale = maxScale;

  const rect = mapContainer.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;

  const originX = (offsetX / mapContainer.offsetWidth) * 100;
  const originY = (offsetY / mapContainer.offsetHeight) * 100;
  map.style.transformOrigin = `${originX}% ${originY}%`;

  scale = newScale;
  map.style.transform = `scale(${scale})`;
});

mapContainer.addEventListener('click', e => {
  if(currentQ >= questions.length) return;

  const rect = map.getBoundingClientRect();
  const x = (e.clientX - rect.left) / scale;
  const y = (e.clientY - rect.top) / scale;

  const pin = document.createElement('div');
  pin.classList.add('pin');
  pin.style.left = x + 'px';
  pin.style.top = y + 'px';
  mapContainer.appendChild(pin);

  const correct = questions[currentQ].correctPosition;
  const dx = x - correct.x;
  const dy = y - correct.y;
  if(Math.sqrt(dx*dx + dy*dy) <= tolerance){
    message.textContent = "Correct! 🎉 +1 punt";
    score++;
    scoreDisplay.textContent = score;
    showConfetti();
  } else {
    message.textContent = "Fout! Probeer opnieuw.";
  }

  currentQ++;
  setTimeout(showQuestion, 1000);
});

showQuestion();

restartBtn.addEventListener('click', () => {
  document.querySelectorAll('.pin').forEach(pin=>pin.remove());
  currentQ = 0;
  score = 0;
  scoreDisplay.textContent = score;
  scale = 1;
  map.style.transform = `scale(${scale})`;
  showQuestion();
  message.textContent = "";
});
