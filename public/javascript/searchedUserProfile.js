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

const fullHeartIcon = `
        <?xml version="1.0" encoding="UTF-8" standalone="no"?>
        <svg width="100%" height="100%" viewBox="0 0 11 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
            <rect x="3" y="3" width="1" height="1"/>
            <g transform="matrix(1,0,0,1,1,0)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,-1,1)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,-1,2)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,0,3)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,1,4)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,2,5)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,2,1)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,3,0)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,4,0)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,5,1)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,5,2)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,4,3)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(2,0,0,2,0,-2)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(2,0,0,2,-3,-2)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(3,0,0,2,-5,-1)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,3,4)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
            <g transform="matrix(1,0,0,1,2,4)">
                <rect x="3" y="3" width="1" height="1"/>
            </g>
        </svg>

`

const heartIcon = `

<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 11 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <rect x="3" y="3" width="1" height="1"/>
    <g transform="matrix(1,0,0,1,1,0)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
    <g transform="matrix(1,0,0,1,-1,1)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
    <g transform="matrix(1,0,0,1,-1,2)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
    <g transform="matrix(1,0,0,1,0,3)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
    <g transform="matrix(1,0,0,1,1,4)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
    <g transform="matrix(1,0,0,1,2,5)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
    <g transform="matrix(1,0,0,1,2,1)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
    <g transform="matrix(1,0,0,1,3,0)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
    <g transform="matrix(1,0,0,1,4,0)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
    <g transform="matrix(1,0,0,1,5,1)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
    <g transform="matrix(1,0,0,1,5,2)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
    <g transform="matrix(1,0,0,1,4,3)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
    <g transform="matrix(1,0,0,1,3,4)">
        <rect x="3" y="3" width="1" height="1"/>
    </g>
</svg>
`


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




followButton.addEventListener("click", followUser);


const user = auth.currentUser;
const likedPreset = await getDocs(collection(db, "users", user.uid, "likes"));

presets.forEach((preset) => {
    const presetName = preset.id;
    userPresets[presetName] = preset.data();

    let isLiked = false;
    likedPreset.forEach((doc) => {
        const likedPresetData = doc.data();
        const presetId = likedPresetData.presetName.split(" - ")[1];
        if(presetId === presetName) {
            isLiked = true;
        }
    });

    const presetElement = document.getElementById(presetName);
    if(presetElement) {
        const likeButton = presetElement.querySelector('.like-preset-button');
        if(likeButton) {
            if(isLiked) {
                likeButton.classList.add('liked');
                likeButton.innerHTML = fullHeartIcon;
            }
        }
    }

})


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
        if(button.classList.contains("liked")) {
            button.classList.remove('liked');
            button.innerHTML = heartIcon;
            await dislikePreset(currentPreset);
        }else{
            button.classList.add('liked');
            button.innerHTML = fullHeartIcon;
            await likePreset(currentPreset)
        }
    })
});

async function likePreset(currentPreset) {
    console.log("Liked preset: " + currentPreset.id);
    await setDoc(doc(db, "users", user.uid, "likes", `${userId}_${currentPreset.id}`), {
        presetData: userPresets[currentPreset.id],
        presetName: searchedUserCached.name + " - " +  currentPreset.id,
        likedAt: new Date(),
        author: userId
    });
}


async function dislikePreset(currentPreset) {
    console.log("Unliked preset: " + currentPreset.id);
    await deleteDoc(doc(db, "users", user.uid, "likes", `${userId}_${currentPreset.id}`));
}

