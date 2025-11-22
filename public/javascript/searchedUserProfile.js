import {
    getDoc,
    doc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

//document.title = "userInfo.username";

import {showPresets} from "./showPreset.js";


const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
console.log(`User ID: ${userId}`);


const username = document.getElementById("profile-username");
const bio = document.getElementById("profile-bio");
const userAvatar = document.getElementById("user-avatar");
const searchedUserCached = JSON.parse(localStorage.getItem('searchedUser'));
const profilePosts = document.getElementById("profile-posts");


if (searchedUserCached && searchedUserCached.id === userId) {
    username.innerHTML = searchedUserCached.name;
    bio.innerHTML = searchedUserCached.bio;
    userAvatar.innerHTML = searchedUserCached.name[0];
}

// Fetch that user's presets
const presets = await getDocs(collection(db, "users", userId, "presets"));
showPresets("searchedUser", presets, profilePosts);



const userDoc = await getDoc(doc(db, "users", userId));
username.innerHTML = userDoc.data().displayName;
bio.innerHTML = userDoc.data().bio;
userAvatar.innerHTML = userDoc.data().displayName[0];


