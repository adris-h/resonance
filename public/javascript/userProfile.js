import { auth } from './main.js';
import { onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {getFirestore, doc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {setCookie, getCookie} from "./main.js";


// const db = window.db;

const bioInput = document.querySelector('#bioInput');
const usernameInput = document.querySelector('#edit-username');
const usernameSubmit = document.querySelector('#submit-username');

const db = getFirestore();

let cookiesAllowed = localStorage.getItem("cookies") !== "false";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.warn("No user signed in");
        return;
    }

    usernameInput.value = user.displayName ;

    // update username and bio on click of submit button
    usernameSubmit.addEventListener('click', async () => {
        // get what user wrote in bio input
        const bio = bioInput.value;
        // update user name
        await updateProfile(user, { displayName: usernameInput.value })
            // after that save the bio to firestore
        .then(() => {
                return setDoc(doc(db, "users", user.uid), { userBio: bio, displayName:  usernameInput.value}, { merge: true });
            })
            // if successful, log success message
        .then(() => {
                console.log("profile updated yay!!");
                if(cookiesAllowed) {
                    setCookie("bio", bio, 30);
                    setCookie("username", usernameInput.value, 30);
                }
            })
        .catch((error) => {
            console.error("errror:::::", error);
        });
        console.log("username is  updated heh...");
    });

    getDoc(doc(db, "users", user.uid))
        .then(userDoc => {
            if (userDoc.exists()) {
                bioInput.innerText = userDoc.data().userBio || "";
            } else {
                bioInput.innerText = "";
            }
        })
});


function onLoad(){
    bioInput.value = getCookie("bio");
    usernameInput.value = getCookie("username");
}

if(cookiesAllowed) {
    onLoad();
}

