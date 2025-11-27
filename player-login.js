
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs, query, where } 
    from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

  // Config ophalen uit JSON
  async function loadFirebaseConfig() {
    const response = await fetch('/firebaseConfig.json'); // pad naar je JSON-bestand
    if (!response.ok) throw new Error("Kon firebaseConfig.json niet laden");
    return await response.json();
  }

  // Init Firebase pas na laden config
  loadFirebaseConfig().then(firebaseConfig => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const form = document.getElementById("playerForm");
    const message = document.getElementById("message");
    const registerBtn = document.getElementById("registerBtn");

    // Helper: genereer code met leading zeros (#0001, #0002, ...)
    function formatCode(num) {
      return "#" + String(num).padStart(4, "0");
    }

    // Registreren
    registerBtn.addEventListener("click", async () => {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        message.textContent = "Vul alle velden in!";
        message.style.color = "red";
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, "players"));
        const count = snapshot.size;
        const newCode = formatCode(count + 1);

        await addDoc(collection(db, "players"), {
          username,
          password, // ⚠️ plaintext demo
          code: newCode,
          createdAt: new Date()
        });

        message.textContent = `Registratie succesvol 🎮 — jouw code is ${newCode}`;
        message.style.color = "green";
      } catch (err) {
        console.error(err);
        message.textContent = "Fout bij registreren!";
        message.style.color = "red";
      }
    });

    // Inloggen
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const q = query(
          collection(db, "players"),
          where("username", "==", username),
          where("password", "==", password)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const playerData = snapshot.docs[0].data();
          message.textContent = `Succesvol ingelogd 🎮 — jouw code is ${playerData.code}`;
          message.style.color = "green";
          // window.location.href = "player-dashboard.html";
        } else {
          message.textContent = "Onjuiste gegevens!";
          message.style.color = "red";
        }
      } catch (err) {
        console.error(err);
        message.textContent = "Fout bij inloggen!";
        message.style.color = "red";
      }
    });
  }).catch(err => {
    console.error("Firebase config laden mislukt:", err);
  });

