// Confirm file is loading
console.log("🔥 script.js loaded");

// Display message in chatbox
function displayMessage(message, type) {
    const chatBox = document.getElementById("chat-box");

    const msg = document.createElement("div");
    msg.className = type;  // "user-msg" or "bot-msg"
    msg.innerText = message;

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}

// Main send function
async function sendMessage() {
    let input = document.getElementById("user-input");
    let message = input.value.trim();

    if (!message) return;

    // Show user message
    displayMessage(message, "user-msg");
    input.value = "";

    // Show typing bubble
    let typing = document.createElement("div");
    typing.className = "bot-msg";
    typing.innerText = "Typing...";
    document.getElementById("chat-box").appendChild(typing);

    try {
        // Send message to backend Flask API
        let response = await fetch("http://192.168.29.166:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });

        let data = await response.json();

        typing.remove(); // remove typing indicator
        displayMessage(data.reply, "bot-msg");

    } catch (error) {
        typing.remove();
        displayMessage("❌ Error connecting to server", "bot-msg");
        console.log("Fetch error:", error);
    }
}
