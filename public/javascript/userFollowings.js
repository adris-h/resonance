import {getFirestore, doc, setDoc, getDoc, getDocs, collection} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
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




onAuthStateChanged(auth, async (user) => {
    if (user) {
        const followingDocs = await getDocs(collection(db, "users", user.uid, "following"));

        followingDocs.forEach((doc) => {
            const followedUser = doc.data();

            const anchor = document.createElement('a');
            anchor.className = 'followed-user';

            let name = followedUser.followedUserName;
            if(name.length > 15){
                name = name.substring(0, 12) + '...';
            }
            anchor.innerHTML = `
                    <span class="followed-user-avatar">${followedUser.followedUserName[0]}</span>
                    <span class="followed-user-name">${name}</span>
                `;
            anchor.addEventListener('click', () => {
                localStorage.setItem('searchedUser', JSON.stringify({
                    name: followedUser.followedUserName,
                    bio: followedUser.userBio || "",
                    id: followedUser.followedUserId,
                    followed: true
                }));
                location.href = './searchedUser.html?userId=' + followedUser.followedUserId;
            });

            followingList.appendChild(anchor);
        });
    }

    // serazeni uzivatelu

    let currentOrder = "ascending";
    let currentFilter = "alphabetical";
    sortUsers(currentFilter, currentOrder);

    const sortSelect= document.getElementById("sort-select");

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