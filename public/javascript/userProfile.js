import { auth } from './main.js';
import { onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {getFirestore, doc, setDoc, getDoc, getDocs} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {setCookie, getCookie} from "./main.js";

// const db = window.db;

const bioInput = document.querySelector('#bioInput');
const usernameInput = document.querySelector('#edit-username');
const usernameSubmit = document.querySelector('#submit-username');

const db = getFirestore();

let cookiesAllowed = localStorage.getItem("cookies") !== "false";
const r = document.documentElement;



const colorCell = document.querySelector('#color-cell');
const hexCode = document.querySelector('#hex-code');



let userColor;
console.log("user color at start:", userColor);

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

        r.style.setProperty('--profileColor', `${userColor}`);
        // update user name
        await updateProfile(user, { displayName: usernameInput.value })
        // after that save the bio to firestore
        .then(() => {
                return setDoc(doc(db, "users", user.uid), { userBio: bio, displayName:  usernameInput.value, userColor: userColor}, { merge: true });
            })
            // if successful, log success message
        .then(() => {
                console.log("profile updated yay!!");
                if(cookiesAllowed) {
                    setCookie("bio", bio, 30);
                    setCookie("username", usernameInput.value, 30);
                    setCookie("color", userColor, 30);

                    setDoc(doc(db, "users", user.uid), { userColor: userColor}, { merge: true });
                }
            })
        .catch((error) => {
            console.error("errror:::::", error);
        });
        console.log("username is  updated heh...");
        location.reload();
    });

    getDoc(doc(db, "users", user.uid))
        .then(userDoc => {
            if (userDoc.exists()) {
                const userData = userDoc.data();
                bioInput.innerText = userData.userBio || "";
                userColor = userData.userColor || "#ff0000";
                r.style.setProperty('--profileColor', userColor);
                colorCell.style.backgroundColor = userColor;
                hexCode.innerHTML = userColor;
            } else {
                bioInput.innerText = "";
            }
        })
});


function onLoad(){
    bioInput.value = getCookie("bio");
    usernameInput.value = getCookie("username");
    userColor = getCookie("color") || "#FFFFFF";
    r.style.setProperty('--profileColor', `${userColor}`);
    colorCell.style.backgroundColor = userColor;
    hexCode.innerHTML = userColor;
}

if(cookiesAllowed) {
    onLoad();
}


colorCell.addEventListener('click',()  => {
    const picker = new ColorPicker(colorCell, {
        submitMode: 'instant',
        headless: true,
        formats: false,
        showClearButton: false,
        enableAlpha: false,
        color: colorCell.style.backgroundColor
    })
        .on('pick', color => {
            applyColor(colorCell, color, hexCode);
        })
        .prompt()

})

console.log(userColor)

function applyColor(element, color, text) {
    const hexColor = color.string("hex")
    element.style.backgroundColor = hexColor;
    text.innerHTML = hexColor;
    userColor = hexColor;
    console.log(userColor)
}


