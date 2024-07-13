const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    const alertMessageDiv = document.getElementById("alert-message");
    const allMessages = document.getElementById("all-message");
    const messageInput = document.getElementById("msg-input");
    const sendButton = document.getElementById("send-button");

    // Function to update alert message and clear after a timeout
    const updateAlertMessage = (message) => {
        alertMessageDiv.textContent = message;
        setTimeout(() => {
            alertMessageDiv.textContent = "";
        }, 3000);
    };

    // Function to add a message to the chat box
    const addMessageToChat = (message, sender) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("my-2", "py-1", "px-2", "rounded-md");

        if (sender === "you") {
            messageElement.classList.add("bg-gray-200");
            messageElement.textContent = `You: ${message}`;
        } else {
            messageElement.classList.add("bg-green-200");
            messageElement.textContent = `${socket.id}: ${message}`;
        }

        allMessages.appendChild(messageElement);
        // Scroll to bottom of chat box
        allMessages.scrollTop = allMessages.scrollHeight;
    };

    // Socket events
    socket.on("connect", () => {
        console.log("Connected to server");
        updateAlertMessage("Connected to server");
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from server");
        updateAlertMessage("Disconnected from server");
    });

    socket.on("message", (message) => {
        addMessageToChat(message, "other");
    });

    // Send button click event
    sendButton.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message !== "") {
            socket.emit("user-message", message);
            addMessageToChat(message, "you");
            messageInput.value = "";
        }
    });

    // Handle 'Enter' key press in message input field
    messageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendButton.click();
        }
    });
});
