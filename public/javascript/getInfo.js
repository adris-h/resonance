import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {auth, getCookie} from "./main.js";

const profileBio = document.querySelector("#profile-bio");
const db = getFirestore();

const userProfiles = document.querySelectorAll(".user-profile-picture");
const userName = document.querySelector("#profile-username");
const userID = document.querySelector("#profile-id span");

console.log("profile", userProfiles);

let cookiesAllowed = localStorage.getItem("cookies") !== "false";

// LISTEN FOR AUTH STATE CHANGES (runs whenever user signs in/out)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // The user object is available here
        console.log("User logged in as:", user.uid, "Username:", user.displayName);
        console.log(user.displayName[0]);
        if(userProfiles){
            userProfiles.forEach((userProfile) => {
                userProfile.innerHTML = user.displayName[0];
            })
        }
        if(userName){
            userName.innerHTML = user.displayName;
        }
        if(userID){
            userID.innerHTML = user.uid;
        }
        if(profileBio){
            getDoc(doc(db, "users", user.uid))
                .then(userDoc => {
                    if (userDoc.exists()) {
                        profileBio.innerText = userDoc.data().userBio || "";
                    } else {
                        profileBio.innerText = "";
                    }
                })
        }
    } else {
        console.log("User signed out");
    }
});


const profileID = document.querySelector("#profile-id");

if (profileID){
    onAuthStateChanged(auth, (user) => {
        profileID.addEventListener("click", () => {
            navigator.clipboard.writeText(user.uid);
        })
    });

}

function onLoad(){
    userProfiles.forEach((userProfile) => {
        userProfile.innerHTML = getCookie("username")[0];
    })
    if(profileBio && userName){
        profileBio.innerText = getCookie("bio");
        userName.innerHTML = getCookie("username");
    }

}

if(cookiesAllowed){
    onLoad();
}