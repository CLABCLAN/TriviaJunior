// ===== Chatbot & Cyber Security =====

// Rate limiting
let lastAskTime = 0;

// Input validation functie
function validateInput(input) {
    if (!input || input.trim() === "") {
        alert("Typ een vraag voordat je verzendt.");
        return false;
    }
    if (input.length > 200) {
        alert("Vraag te lang, maximaal 200 tekens.");
        return false;
    }
    const forbidden = /[<>]/;
    if (forbidden.test(input)) {
        alert("Ongeldige tekens in vraag.");
        return false;
    }
    const badWords = ["fuck", "shit"]; // voorbeeld ongepaste woorden
    const lowerInput = input.toLowerCase();
    for (let word of badWords) {
        if (lowerInput.includes(word)) {
            alert("Gebruik geen ongepaste woorden.");
            return false;
        }
    }
    return true;
}

// Functie om vraag naar chatbot te sturen
function sendQuestionToChatbot(question) {
    // Hier komt jouw originele code om chatbot response te tonen
    const chatMessages = document.getElementById("chatMessages");

    const userMsgDiv = document.createElement("div");
    userMsgDiv.classList.add("message", "user-message");
    userMsgDiv.innerHTML = `<div class="message-content">${question}</div>`;
    chatMessages.appendChild(userMsgDiv);

    // Scroll naar beneden
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simuleer bot response
    setTimeout(() => {
        const botMsgDiv = document.createElement("div");
        botMsgDiv.classList.add("message", "bot-message");
        botMsgDiv.innerHTML = `<div class="message-content">Dit is een voorbeeld antwoord op: "${question}"</div>`;
        chatMessages.appendChild(botMsgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// ===== Event Listener =====
const askButton = document.getElementById("askButton");
const questionInput = document.getElementById("questionInput");

askButton.addEventListener("click", () => {
    const now = Date.now();
    const question = questionInput.value;

    // Rate limiting: 5 seconden tussen vragen
    if (now - lastAskTime < 5000) {
        alert("Wacht even voordat je een nieuwe vraag stelt.");
        return;
    }

    // Input validation
    if (!validateInput(question)) return;

    lastAskTime = now;
    sendQuestionToChatbot(question);
    questionInput.value = "";
});

// Suggestion buttons
document.querySelectorAll(".suggestion-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        questionInput.value = btn.dataset.question;
        askButton.click();
    });
});

// ===== Shopping Cart functies (origineel) =====
// ... hier komt jouw originele cart code ...
