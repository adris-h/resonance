
// importovane moduly Firebase
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

// dve konstanty pre ikony srdecka
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


// ziskani parametru uzivatel z url
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

// ziskani elementu profilu
const username = document.getElementById("profile-username");
const bio = document.getElementById("profile-bio");
const userAvatar = document.getElementById("user-avatar");
const followButton = document.getElementById("follow-button");


// nacteni dat hledaneho uzivatele z localStorage
const searchedUserCached = JSON.parse(localStorage.getItem('searchedUser'));
const profilePosts = document.getElementById("profile-posts");


// pokud jsou data v localStorage tak se nastavi do profilu
// nejdriv local storage aby to bylo rychle
if (searchedUserCached && searchedUserCached.id === userId) {
    username.innerHTML = searchedUserCached.name; // nastaveni jmena
    bio.innerHTML = searchedUserCached.bio; // nastaveni bia
    userAvatar.innerHTML = searchedUserCached.name[0]; // nastaveni text avataru na prvni pismeno jmena
    if(searchedUserCached.followed === true) { // pokud je uzivatel sledovan tak se změeí tlacitko na "Unfollow"
        followButton.innerText = "Unfollow";
    }
    userAvatar.style.backgroundColor = searchedUserCached.color; // nastaveni barvy avataru
}

// nacteni presetu hledaneho uzivatele z Firestore
const presets = await getDocs(collection(db, "users", userId, "presets"));
showPresets("searchedUser", presets, profilePosts);

// nacteni informaci o hledanem uzivateli z Firestore
const userDoc = await getDoc(doc(db, "users", userId));

// nastaveni informaci do profilu
// kdyby nahodou nebyly v localStorage nebo byly spatne tak se nactou z Firestore
username.innerHTML = userDoc.data().displayName;
bio.innerHTML = userDoc.data().userBio === undefined ? " " : userDoc.data().userBio;
userAvatar.innerHTML = userDoc.data().displayName[0];
userAvatar.style.backgroundColor = userDoc.data().userColor || "#FFFFFF";


// zatim prazdny objekt pro uzivatelske presety
let userPresets = {};

// aktualne prihlaseny uzivatel
const user = auth.currentUser;

// nacteni presetu ktere uzivatel lajknul
const likedPreset = await getDocs(collection(db, "users", user.uid, "likes"));

// projiti vsech presetu hledaneho uzivatele
presets.forEach((preset) => {
    const presetName = preset.id;
    userPresets[presetName] = preset.data();


    // a zkontrolovani jestli je uzivatel lajknul
    // pokud jo tak se změní ikona tlacitka na plne srdicko
    let isLiked = false;
    likedPreset.forEach((doc) => {
        const likedPresetData = doc.data();
        const presetId = likedPresetData.presetName.split(" - ")[1];
        if(presetId === presetName) {
            isLiked = true;
        }
    });

    // ziskani elementu presetu a tlacitka pro lajkovani
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


// pridani event listeneru na follow tlacitko
followButton.addEventListener("click", followUser);



// ziskani vsech uzivatelu ktere aktualne prihlaseny uzivatel sleduje
const followingDocs = await getDocs(collection(db, "users", user.uid, "following"));

// projiti vsech sledovanych uzivatelu a pokud je mezi nimi hledany uzivatel
// tak se změní tlacitko na "Unfollow" a priradi se mu funkce pro odsledovani
followingDocs.forEach((doc) => {
    const followedUser = doc.data();
    if (followedUser.followedUserId === searchedUserCached.id) {
        followButton.innerText = "Unfollow";
        followButton.removeEventListener("click", followUser);
        followButton.addEventListener("click", unfollowUser);
    }
});

// funkce pro sledovani uzivatele
function followUser() {
    if (user) {
        followButton.innerText = "Unfollow";

        // nastaveni dokumentu do kolekce following s informacemi o sledovanem uzivateli
        setDoc(doc(db, "users", user.uid, "following", searchedUserCached.id), {
            followedAt: new Date(),
            followedUserId: searchedUserCached.id,
            followedUserName: searchedUserCached.name
        })

        localStorage.setItem('searchedUser', JSON.stringify({
            name: searchedUserCached.name,
            bio: searchedUserCached.bio,
            id: searchedUserCached.id,
            color: searchedUserCached.color,
            followed: true
        }));


    }
}

// funkce pro odsledovani uzivatele
function unfollowUser() {
    if (user) {
        // smazani dokumentu z kolekce following
        deleteDoc(doc(db, "users", user.uid, "following", searchedUserCached.id));
        followButton.innerText = "Follow";

        localStorage.setItem('searchedUser', JSON.stringify({
            name: searchedUserCached.name,
            bio: searchedUserCached.bio || "",
            id: searchedUserCached.id,
            color: searchedUserCached.color,
            followed: false
        }));
    }
}


// pridani event listeneru na vsechna tlacitka pro lajkovani presetu
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


// funkce pro lajkovani presetu
async function likePreset(currentPreset) {
    await setDoc(doc(db, "users", user.uid, "likes", `${userId}_${currentPreset.id}`), {
        presetData: userPresets[currentPreset.id],
        presetName: searchedUserCached.name + " - " +  currentPreset.id,
        likedAt: new Date(),
        author: userId
    });
}

// funkce pro odlajkovani presetu
async function dislikePreset(currentPreset) {
    await deleteDoc(doc(db, "users", user.uid, "likes", `${userId}_${currentPreset.id}`));
}

