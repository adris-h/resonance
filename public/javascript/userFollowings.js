import { getDocs, collection} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


const followingButton = document.getElementById("following-button");
const followingContainer = document.getElementById("following-container");
const followingList = followingContainer.querySelector("#following-list");


followingButton.addEventListener("click", () => {
    followingContainer.classList.add("active");
})

document.addEventListener("click", (e) => {
    if(followingContainer.classList.contains("active")){
        if(!followingContainer.contains(e.target) && e.target !== followingButton){
            followingContainer.classList.remove("active");
        }
    }
})

// nacteni sledujicich uzivatelu
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const followingDocs = await getDocs(collection(db, "users", user.uid, "following"));
        const users = await getDocs(collection(db, "users"));

        // vypsani sledujicich uzivatelu
        followingDocs.forEach((doc) => {

            // ziskani dat sledujiciho uzivatele
            const followedUser = doc.data();

            // nalezeni dokumentu sledujiciho uzivatele v kolekci uzivatelu
            const userDoc = users.docs.find(uDoc => uDoc.id === followedUser.followedUserId);

            // vytvoreni odkazu na sledujiciho uzivatele
            const anchor = document.createElement('a');
            anchor.className = 'followed-user';

            // zkraceni jmena pokud je prilis dlouhe
            let name = followedUser.followedUserName;

            // pokud je jmeno prilis dlouhe, zkratit ho a pridat ...
            if(name.length > 15){
                name = name.substring(0, 12) + '...';
            }

            // naplneni odkazu daty sledujiciho uzivatele
            anchor.innerHTML = `
                    <span class="followed-user-avatar">${followedUser.followedUserName[0]}</span>
                    <span class="followed-user-name">${name}</span>
                `;

            // pridani event listeneru na kliknuti na uzivatele
            anchor.addEventListener('click', () => {
                localStorage.setItem('searchedUser', JSON.stringify({
                    name: userDoc.data().displayName,
                    bio:  userDoc.data().userBio === undefined ? "" : userDoc.data().userBio,
                    color: userDoc.data().userColor || "#FFFFFF",
                    id: userDoc.id,
                    followed: true
                }));
                location.href = './searchedUser.html?userId=' + userDoc.id;
            });
            followingList.appendChild(anchor);
        });
    }

    // implementace sortovani sledujicich uzivatelu
    let currentOrder = "ascending";
    let currentFilter = "alphabetical";
    sortUsers(currentFilter, currentOrder);
    const sortSelect= document.getElementById("sort-select");

    // pridani event listeneru na kliknuti na tlacitko pro zmenu razeni
    sortSelect.addEventListener("click", () => {
        if(currentOrder === "ascending"){
            sortSelect.innerText = "desc";
            currentOrder = "descending";
            sortUsers(currentFilter, currentOrder);

        } else{
            sortSelect.innerText = "asc";
            currentOrder = "ascending";
            sortUsers(currentFilter, currentOrder);
        }
    })
});

// funkce pro sortovani sledujicich uzivatelu
function sortUsers(filter, order){
    const elements = Array.from(followingList.children);
    if(filter === "alphabetical"){
        if(order === "ascending"){
            sortAlphabetically(true, elements);
        } else{
            sortAlphabetically(false, elements);
        }
    }
    elements.forEach(a => followingList.appendChild(a));
}

// funkce pro sortovani podle abecedy
function sortAlphabetically(ascending, elements) {
    if(ascending) {
        elements.sort((a, b) => {
            return a.textContent.trim().localeCompare(b.textContent.trim());
        });
    } else{
        elements.sort((b, a) => {
            return a.textContent.trim().localeCompare(b.textContent.trim());
        });
    }
}