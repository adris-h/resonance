
// importovani moduly Firebase
// pro Firestore databazi
import {
    getDoc,
    doc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const searchInput = document.querySelector("#user-search-input");
const searchResult = document.querySelector("#user-search-result");

let username, userPresets;

// pridani event listeneru na input pole pro hledani uzivatelu
searchInput.addEventListener("input", async () => {
    searchResult.classList.add("active");

    // ziskani uzivatelskeho id z input pole
    const searchUserId = searchInput.value;

    // prochazeni Firestore databaze pro uzivatele s danym id
    const userDoc = await getDoc(doc(db, "users", searchUserId));

    // pokud uzivatel existuje zobrazit jeho jmeno a avatar
    if (userDoc.exists()) {
        username = userDoc.data().displayName;
        console.log("username: ", username);

        searchResult.innerHTML = `
            <span id="user-search-avatar">${username[0]}</span>
            <span id="user-search-username">${username}</span>
        `

        userPresets = await getDocs(collection(db, "users", searchUserId, "presets"));
        userPresets.forEach((preset) => {
            console.log(preset.id, preset.data());
        })

        let isFollowed = false;

        const user = auth.currentUser;

        const followingDocs = await getDocs(collection(db, "users", user.uid, "following"));
        followingDocs.forEach((doc) => {
            if (doc.id === searchUserId) {
                isFollowed = true;
            }
        })

        // pridani onclick eventu na vysledek hledani
        searchResult.onclick = () => {
            localStorage.setItem('searchedUser', JSON.stringify({
                name: username,
                bio: userDoc.data().userBio || "",
                id: searchUserId,
                followed: isFollowed,
                color: userDoc.data().userColor || "#FFFFFF",
            }));

            // presmerovani na stranku hledaneho uzivatele
            location.href = './searchedUser.html?userId=' + searchUserId;
        };
    } else {
        // pokud uzivatel neexistuje zobrazit "no user found"
        searchResult.innerHTML = `
            no user found
        `
    }
})

