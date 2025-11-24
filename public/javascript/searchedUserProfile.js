import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

//document.title = "userInfo.username";
import {showPresets} from "./showPreset.js";


const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');


const username = document.getElementById("profile-username");
const bio = document.getElementById("profile-bio");
const userAvatar = document.getElementById("user-avatar");
const searchedUserCached = JSON.parse(localStorage.getItem('searchedUser'));
const profilePosts = document.getElementById("profile-posts");


const followButton = document.getElementById("follow-button");

if (searchedUserCached && searchedUserCached.id === userId) {
    username.innerHTML = searchedUserCached.name;
    bio.innerHTML = searchedUserCached.bio;
    userAvatar.innerHTML = searchedUserCached.name[0];
    if(searchedUserCached.followed === true) {
        followButton.innerText = "Unfollow";
    }
}

const presets = await getDocs(collection(db, "users", userId, "presets"));
showPresets("searchedUser", presets, profilePosts);



const userDoc = await getDoc(doc(db, "users", userId));
username.innerHTML = userDoc.data().displayName;
bio.innerHTML = userDoc.data().bio;
userAvatar.innerHTML = userDoc.data().displayName[0];

let userPresets = {};

presets.forEach((preset) => {
    const presetName = preset.id;
    userPresets[presetName] = preset.data();
})


followButton.addEventListener("click", followUser);


const user = auth.currentUser;
function followUser() {
    if (user) {
        console.log(user.displayName + " followed " + searchedUserCached.name);
        followButton.innerText = "Unfollow";

        setDoc(doc(db, "users", user.uid, "following", searchedUserCached.id), {
            followedAt: new Date(),
            followedUserId: searchedUserCached.id,
            followedUserName: searchedUserCached.name
        })

        localStorage.setItem('searchedUser', JSON.stringify({
            name: searchedUserCached.name,
            bio: searchedUserCached.bio || "",
            id: searchedUserCached.id,
            followed: true
        }));
    }
}

const followingDocs = await getDocs(collection(db, "users", user.uid, "following"));

followingDocs.forEach((doc) => {
    const followedUser = doc.data();
    if (followedUser.followedUserId === searchedUserCached.id) {
        followButton.innerText = "Unfollow";
        followButton.removeEventListener("click", followUser);
        followButton.addEventListener("click", unfollowUser);
    }
});

function unfollowUser() {
    if (user) {
        console.log(user.displayName + " unfollowed " + searchedUserCached.name);
        deleteDoc(doc(db, "users", user.uid, "following", searchedUserCached.id));
        followButton.innerText = "Follow";

        localStorage.setItem('searchedUser', JSON.stringify({
            name: searchedUserCached.name,
            bio: searchedUserCached.bio || "",
            id: searchedUserCached.id,
            followed: false
        }));
    }
}



const likeButtons = document.querySelectorAll(".like-preset-button");
likeButtons.forEach(button => {
    button.addEventListener("click", async () => {
        let currentPreset = button.closest(".preset");
        likePreset(currentPreset)
    })
});



function likePreset(currentPreset) {
    console.log("Liked preset: " + currentPreset.id);

    setDoc(doc(db, "users", user.uid, "likes", currentPreset.id), {
        presetData: userPresets[currentPreset.id],
        presetName: searchedUserCached.name + " - " +  currentPreset.id,
        likedAt: new Date(),
        author: userId
    });
}

function unlikePreset(currentPreset) {
    console.log("Unliked preset: " + currentPreset.id);

    deleteDoc(doc(db, "users", user.uid, "likes", currentPreset.id));
}


