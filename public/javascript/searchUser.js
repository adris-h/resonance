
import {
    getDoc,
    doc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const searchInput = document.querySelector("#user-search-input");
const searchResult = document.querySelector("#user-search-result");

let username, userPresets;

searchInput.addEventListener("input", async () => {

    searchResult.classList.add("active");

    const searchUserId = searchInput.value;
    const userDoc = await getDoc(doc(db, "users", searchUserId));

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

        searchResult.onclick = () => {
            localStorage.setItem('searchedUser', JSON.stringify({
                name: username,
                bio: userDoc.data().userBio || "",
                id: searchUserId,
                followed: isFollowed,
            }));
            location.href = './searchedUser.html?userId=' + searchUserId;
            console.log(searchUserId);
        };
    } else {
        searchResult.innerHTML = `
            no user found
        `
    }


})

