
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";



// https://firebase.google.com/docs/web/setup#available-libraries



// firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCStdq2XovV_DxXknQCCHsRELFoeeFC-Yw",
    authDomain: "klauzury2025.firebaseapp.com",
    projectId: "klauzury2025",
    storageBucket: "klauzury2025.firebasestorage.app",
    messagingSenderId: "651354005038",
    appId: "1:651354005038:web:82f771acea5d61b9a849bf",
    measurementId: "G-HQ3GTYZS9J",
}

const signInPage = "index.html";
const userPage = "user.html";
let currentPage = window.location.pathname
const mainPage = "main.html";

function relocateToUserPage(){
    window.location.href = mainPage;

}

function relocateToSignInPage(){
    window.location.href = signInPage;
}

function relocateToMainPage(){
    window.location.href = mainPage;
}

window.onload = () => {
    console.log("current page:", currentPage);
};

// initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);

/*
const continueButtons = document.querySelectorAll(".continue-button");
const cookiesWrapper = document.getElementById("cookies");

const yesCookies = document.getElementById("yes-cookies");
const noCookies = document.getElementById("no-cookies");
continueButtons.forEach((button) => {
    button.addEventListener("click", () => {
        cookiesWrapper.style.visibility = "hidden";
        cookiesWrapper.style.opacity = "0";

        setTimeout(()=>{
            cookiesWrapper.remove()
        }, 400)
    });
})*/

/*if(yesCookies && noCookies){
    yesCookies.addEventListener("click", () => {
        setCookie("cookies", "true")
        localStorage.setItem("cookies", "true");
    })

    noCookies.addEventListener("click", () => {
        localStorage.setItem("cookies", "false");
    })
}*/
localStorage.setItem("cookies", "true");




function signUp(){
    // CREATE NEW USER
    const email = emailInput.value;
    const password = passwordInput.value;
    const username = document.getElementById("username-input").value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // --------- user created
            const user = userCredential.user;

            return updateProfile(user, {
                displayName: username
            }).then(() => {
                return setDoc(doc(db, "users", user.uid), {
                    displayName: user.displayName,
                    bio: ""
                });
            }).then(() => {
                console.log("User signed up:", user.uid, "Username:", user.displayName);
                relocateToUserPage();
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.code;
            console.error("Sign up error:", errorCode, errorMessage);
            displayError(errorCode);
        });

}

function signIn(){
    // SIGN IN EXISTING USER
    const email = emailInput.value;
    const password = passwordInput.value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // ----------- user signed in
            const user = userCredential.user;
            console.log("User signed in:", user.uid);
            relocateToUserPage();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.code;
            console.error("Sign up error:", errorCode, errorMessage);
            displayError(errorCode);
        });
}

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

