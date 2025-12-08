
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, getDoc, setDoc, doc, collection } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";



// https://firebase.google.com/docs/web/setup#available-libraries



// konfigurace Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCStdq2XovV_DxXknQCCHsRELFoeeFC-Yw",
    authDomain: "klauzury2025.firebaseapp.com",
    projectId: "klauzury2025",
    storageBucket: "klauzury2025.firebasestorage.app",
    messagingSenderId: "651354005038",
    appId: "1:651354005038:web:82f771acea5d61b9a849bf",
    measurementId: "G-HQ3GTYZS9J",
}

// initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



localStorage.setItem("cookies", "true");

const signInPage = "index.html";
let currentPage = window.location.pathname

function relocateToSignInPage(){
    window.location.href = signInPage;
}

function relocateToMainPage(mainPage){
    window.location.href = mainPage;
}


// funkce pro vytvoreni uctu
function signUp(){
    // ziskani emailu, hesla a username z inputu
    const email = emailInput.value;
    const password = passwordInput.value;
    const username = document.getElementById("username-input").value;

    // vytvoreni noveho uzivatele v Firebase Auth
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

            const user = userCredential.user;
            // nastaveni uzivatelskeho jmena
            return updateProfile(user, {
                displayName: username
            }).then(() => {
                // vytvoreni dokumentu ve Firestore databazi pro uzivatele
                return setDoc(doc(db, "users", user.uid), {
                    displayName: user.displayName,
                    bio: "" // nazacatku prazdny bio
                });
            }).then(() => {
                //presmerovani uzivatele do mainu
                relocateToMainPage("main.html");
            });
        })
        .catch((error) => {
            // kdyz se neco pokazi, "chyti" se error
            const errorCode = error.code;
            const errorMessage = error.code;
            console.error("Sign up error:", errorCode, errorMessage);
            // zobrazi chybu uzivatel
            displayError(errorCode);
        });
}

// funkce pro prihlaseni
function signIn(){
    // ziskani informaci z inputu
    const email = emailInput.value;
    const password = passwordInput.value;

    // prihlaseni uzivatele v Firebase Auth
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            relocateToMainPage("public/main.html");
        })
        // jeslti nastala chyba tak se zobrazi v cem je chyba
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.code;
            console.error("Sign up error:", errorCode, errorMessage);
            displayError(errorCode);
        });
}
// funkce pro odhlaseni uzivatele
function signingOut(){
    signOut(auth).then(() => {
        console.log("Signed out successfully");
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const signUpButton = document.getElementById("sign-up-button");
    if (signUpButton) {
        signUpButton.addEventListener("click", () => {
            console.log("01 Sign up button clicked");
            signUp();
        });
    }

    const signInButton = document.getElementById("sign-in-button");
    if (signInButton) {
        signInButton.addEventListener("click", () => {
            signIn();
            console.log("02 Sign up button clicked");
        })
    }

    const signOutButton = document.getElementById("sign-out-button");
    if (signOutButton) {
        signOutButton.addEventListener("click", () => {
            signingOut();
            console.log("03 Sign out button clicked");
            relocateToSignInPage();
        })
    }

});

const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

function displayError(errorCode){
    const errorMessage = document.querySelector(".error-message");
    if (errorCode === 'auth/invalid-credential') {
        errorMessage.innerText = "wrong password"; // display error
        passwordInput.classList.add("error"); // change border color
        emailInput.classList.remove("error"); // change border color
    } else if (emailInput.value === "" && passwordInput.value === "") {
        errorMessage.innerText = "please fill in all fields"; // display error
        emailInput.classList.add("error"); // change border color
        passwordInput.classList.add("error"); // change border color
    } else if (errorCode === 'auth/invalid-email'){
        errorMessage.innerText = "invalid email"; // display error
        emailInput.classList.add("error"); // change border color
        passwordInput.classList.remove("error"); // change border color
    } else if (errorCode === 'auth/email-already-in-use'){
        errorMessage.innerText = "email already exists"; // display error
        emailInput.classList.add("error"); // change border color
        passwordInput.classList.remove("error"); // change border color
    } else if (errorCode === 'auth/missing-password'){
        errorMessage.innerText = "missing password"; // display error
        passwordInput.classList.add("error"); // change border color
        emailInput.classList.remove("error"); // change border color
    } else {
        errorMessage.innerText = errorCode;
    }
}
const lastSong = localStorage.getItem('lastSong');
if (lastSong) {
    console.log("last song from storage:", lastSong);
}

console.log("current song: ", lastSong);

window.auth = getAuth(app);
window.db = getFirestore(app);


export const getCurrentUser = () => user;
export const getUsername = () => user ? user.displayName : null;
export const getUserId = () => user ? user.uid : null;

export { auth };
window.user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
    getDoc(doc(db, "users", user.uid))
        .then(userDoc => {
            if (userDoc.exists()) {
                const bio = userDoc.data().userBio;
                setCookie("bio", bio, 30);
                setCookie("username", user.displayName, 30);
            }
        })
        .catch(error => {
            console.error("Error fetching user bio:", error);
        });
});


function setCookie(cname, cvalue, exdays) {
    deleteCookie(cname);
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = `${cname}=${cvalue}; ${expires}; path=/`;

}

export {setCookie}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}


export {getCookie}


function deleteCookie(cname) {
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
}

const r = document.querySelector(':root');

let userColor = getCookie("color");

onAuthStateChanged(auth, (user) => {
    if (userColor) {
        getDoc(doc(db, "users", user.uid))
            .then(userDoc => {
                if (userDoc.exists()) {
                    userColor = userDoc.data().color;
                }
            })
    }

});
r.style.setProperty('--profileColor', `${userColor}`);


let highlightColor = getCookie('highlightColor') || '#66d1ff';
let accentColor = getCookie('accentColor') || '#06b7fd';
let accentColorDarker = getCookie('accentColorDarker') || '#0269b8';



let path = window.location.pathname;
if (path.includes('main.html')){
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const themeDoc = await getDoc(doc(db, "users", user.uid, "themes", "currentTheme"));
                if (themeDoc.exists()) {
                    const themeData = themeDoc.data();
                    highlightColor = themeData.highlightColor || '#66d1ff';
                    accentColor = themeData.accentColor || '#06b7fd';
                    accentColorDarker = themeData.accentColorDarker || '#0269b8';

                    applyThemeColors();
                } else {
                    console.log("no theme found using defaults");
                }
            } catch (error) {
                console.error("error fetching theme:", error);
            }
        }
    })
    applyThemeColors();
}

function applyThemeColors() {
    r.style.setProperty('--highlightColor', highlightColor);
    r.style.setProperty('--accentColor', accentColor);
    r.style.setProperty('--accentColorDarker', accentColorDarker);
}


