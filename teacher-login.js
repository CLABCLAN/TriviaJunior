import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCtCtq9GTNW4Bl4y3Qd5ySyY-Y_jF6jcWw",
  authDomain: "trivia-junior.firebaseapp.com",
  projectId: "trivia-junior",
  storageBucket: "trivia-junior.firebasestorage.app",
  messagingSenderId: "275426568262",
  appId: "1:275426568262:web:372d65d8c8ef2a5fca8247",
  measurementId: "G-31PX8XWMK0"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("teacherForm");
const message = document.getElementById("message");
const registerBtn = document.getElementById("registerBtn");

// Registreren
registerBtn.addEventListener("click", async () => {
  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    message.textContent = "Vul alle velden in!";
    message.style.color = "red";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    message.textContent = "Registratie succesvol 👩‍🏫";
    message.style.color = "green";
  } catch (err) {
    console.error(err);
    message.textContent = "Fout bij registreren: " + err.message;
    message.style.color = "red";
  }
});

// Inloggen
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    message.textContent = "Succesvol ingelogd 👩‍🏫";
    message.style.color = "green";
    // Redirect naar dashboard
    // window.location.href = "teacher-dashboard.html";
  } catch (err) {
    console.error(err);
    message.textContent = "Fout bij inloggen: " + err.message;
    message.style.color = "red";
  }
});
