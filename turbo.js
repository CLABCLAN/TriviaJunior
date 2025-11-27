
// Firebase imports
import { collection, addDoc, getDocs, query, orderBy, limit } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

let timerStarted = false;
let startTime = null;
let timerInterval = null;

function startTimer() {
  startTime = Date.now();
  timerStarted = true;
  timerInterval = setInterval(updateTimerDisplay, 10);
}

async function stopTimer() {
  clearInterval(timerInterval);
  const totalSeconds = (Date.now() - startTime) / 1000;
  document.getElementById("timer").textContent = 
    `⏱️ Tijd: ${totalSeconds.toFixed(2)}s`;

  try {
    await addDoc(collection(window.db, "gameTimes"), {
      time: totalSeconds.toFixed(2),
      streak: streak,
      niveau: currentNiveau,
      date: new Date().toISOString()
    });
    console.log("Tijd opgeslagen in Firestore!");
    loadHighscores();
  } catch (err) {
    console.error("Kon tijd niet opslaan:", err);
  }
}

function updateTimerDisplay() {
  const elapsed = (Date.now() - startTime) / 1000;
  document.getElementById("timer").textContent = 
    `⏱️ Tijd: ${elapsed.toFixed(2)}s`;
}

function resetGame() {
  carPosition = 20;
  document.getElementById("car").style.left = carPosition + "px";

  streak = 0;
  document.getElementById("streak-count").textContent = streak;

  clearInterval(timerInterval);
  timerStarted = false;
  startTime = null;
  document.getElementById("timer").textContent = "⏱️ Tijd: 0.00s";

  // overlay en niveau-select weer zichtbaar maken
  document.getElementById("overlay-start").classList.remove("hidden");
  document.getElementById("niveau-select").classList.remove("hidden");

  // niveau opnieuw ophalen uit dropdown
  currentNiveau = parseInt(document.getElementById("niveau").value, 10);

  loadQuestion();
}

document.getElementById("reset-btn").onclick = resetGame;

// 👉 Startknop event
document.getElementById("start-btn").onclick = () => {
  // overlay en niveau-select verbergen
  document.getElementById("overlay-start").classList.add("hidden");
  document.getElementById("niveau-select").classList.add("hidden");

  if (!timerStarted) {
    // niveau ophalen bij start
    currentNiveau = parseInt(document.getElementById("niveau").value, 10);
    startTimer();
  }
};

let carPosition = 20;
let streak = 0;
let currentNiveau = 1;
const winDistance = 600;

let allQuestions = [];
let questionPools = { 1: [], 2: [], 3: [] };

const categories = ["wetenschap.json", "geschiedenis.json", "sport.json"];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadAllQuestions() {
  const promises = categories.map(cat =>
    fetch("./" + cat).then(res => res.json())
  );

  Promise.all(promises)
    .then(results => {
      allQuestions = results.flat();

      // Verdeel vragen per niveau
      questionPools[1] = shuffle(allQuestions.filter(q => q.niveau === 1));
      questionPools[2] = shuffle(allQuestions.filter(q => q.niveau === 2));
      questionPools[3] = shuffle(allQuestions.filter(q => q.niveau === 3));

      loadQuestion();
    })
    .catch(err => {
      console.error("Kon vragen niet laden:", err);
      document.getElementById("question").textContent = "Fout bij laden van vragen!";
    });
}

function loadQuestion() {
  if (questionPools[currentNiveau].length === 0) {
    // Als pool leeg is, opnieuw vullen
    questionPools[currentNiveau] = shuffle(allQuestions.filter(q => q.niveau === currentNiveau));
  }

  const q = questionPools[currentNiveau].pop();
  const questionBox = document.getElementById("question");
  questionBox.textContent = q.question;
  questionBox.className = q.category || "";

  const buttons = document.querySelectorAll(".answers button");

  let opts = Array.isArray(q.options) ? [...q.options] : [];
  const correct = q.correct;

  if (!opts.includes(correct)) {
    opts.push(correct);
  }
  opts = [...new Set(opts)];
  let shuffled = shuffle(opts);

  const count = Math.min(buttons.length, shuffled.length);
  shuffled = shuffled.slice(0, count);

  if (!shuffled.includes(correct)) {
    shuffled[count - 1] = correct;
    shuffled = shuffle(shuffled);
  }

  buttons.forEach((btn, i) => {
    if (i < count) {
      const value = shuffled[i];
      btn.textContent = value;
      btn.dataset.isCorrect = String(value === correct);
      btn.disabled = false;
      btn.style.display = "";
      btn.onclick = () => checkAnswer(btn, q);
    } else {
      btn.textContent = "";
      btn.dataset.isCorrect = "false";
      btn.disabled = true;
      btn.style.display = "none";
      btn.onclick = null;
    }
  });
}

function checkAnswer(button, q) {
  const isCorrect = button.dataset.isCorrect === "true";

  if (isCorrect) {
    streak++;
    document.getElementById("streak-count").textContent = streak;

    let step = 10;
    if (streak >= 2) step = 30;
    if (streak >= 3) step = 50;
    if (streak >= 5) step = 90;
    if (streak >= 7) step = 120;

    carPosition += step;
    document.getElementById("car").style.left = carPosition + "px";

    if (carPosition >= winDistance) {
      stopTimer();
      setTimeout(() => {
        alert("🏁 Gefeliciteerd! Je hebt de finish gehaald!");
      }, 500);
      return;
    }

    setTimeout(loadQuestion, 1000);
  } else {
    streak = 0;
    document.getElementById("streak-count").textContent = streak;

    // ❌ Error overlay tonen
    const errorOverlay = document.getElementById("overlay-error");
    errorOverlay.classList.remove("hidden");

    setTimeout(() => {
      errorOverlay.classList.add("hidden");
      loadQuestion();
    }, 1000);
  }
}

// 🔥 Leaderboard ophalen
async function loadHighscores() {
  const q = query(collection(window.db, "gameTimes"), orderBy("time", "asc"), limit(10));
  const snapshot = await getDocs(q);
  const list = document.getElementById("highscore-list");
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.time}s (streak: ${data.streak}, niveau: ${data.niveau})`;
    list.appendChild(li);
  });
}

// Start automatisch
window.onload = () => {
  loadAllQuestions();
  loadHighscores();
};
