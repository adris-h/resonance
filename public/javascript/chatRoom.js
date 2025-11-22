import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase, ref, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

import { getUsername, getUserId, getCurrentUser } from './main.js';

const db = getDatabase();
const messageRef = ref(db, "messages");


const messageInput = document.getElementById("message-input");

const messageText = messageInput.value;
const sendButton = document.getElementById("send-button");


sendButton.addEventListener("click", () =>{
    sendMessage(messageText);
    console.log("your message ", messageText);
    console.log(messageInput.value);
});

function sendMessage(messageText) {
    const user = getCurrentUser();
    const username = getUsername();


    if (user && username){
        const messageData = {
            name: username,
            text: messageText,
            timestamp: serverTimestamp()
        }

        push(messageRef, messageData)
            .then(() => {
                console.log("Message sent successfully!", messageText);
            })
            .catch((err) => {
                console.log(err);
            })
    } else {
        console.log("Not Signed In");
    }
}