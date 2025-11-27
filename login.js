

document.addEventListener("DOMContentLoaded", () => {
  const playerRole = document.getElementById("playerRole");
  const teacherRole = document.getElementById("teacherRole");

  playerRole.addEventListener("click", () => {
    window.location.href = "player-login.html"; // pagina voor speler
  });

  teacherRole.addEventListener("click", () => {
    window.location.href = "teacher-login.html"; // pagina voor docent
  });
});

