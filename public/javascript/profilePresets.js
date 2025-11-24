import { getDocs, collection, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {showPresets} from "./showPreset.js";

const profilePosts = document.querySelector("#profile-posts");
const profileLikes = document.querySelector("#profile-likes");

const likesButton = document.querySelector("#likes-button");
const presetsButton = document.querySelector("#posts-button");


onAuthStateChanged(auth, async (user) => {
    if (user) {
        const presets = await getDocs(collection(db, "users", user.uid, "presets"));
        //const likedPresets = await getDocs(collection(db, "users", user.uid, "likes"));

        showPresets("user", presets, profilePosts);


        if(likesButton && presetsButton){
            likesButton.addEventListener("click", async () => {
                const likedPresets = await getDocs(collection(db, "users", user.uid, "likes"));
                console.log(likedPresets.size)
                profilePosts.classList.remove("active");
                profileLikes.classList.add("active");
                likesButton.classList.add("active");
                presetsButton.classList.remove("active");

                showPresets("likes", likedPresets, profileLikes);

                const dislikeButton = document.querySelectorAll(".dislike-button");
                dislikeButton.forEach(button => {
                    button.addEventListener("click", async () => {
                        let currentPreset = button.closest(".preset");
                        dislikePreset(currentPreset)
                        console.log("dislike clicked");
                    })
                });

                function dislikePreset(currentPreset) {
                    console.log("Unliked preset: " + currentPreset.id);

                    deleteDoc(doc(db, "users", user.uid, "likes", currentPreset.id));
                }
            })

            presetsButton.addEventListener("click", () => {
                profileLikes.classList.remove("active");
                profilePosts.classList.add("active");
                presetsButton.classList.add("active");
                likesButton.classList.remove("active");

                showPresets("user", presets, profilePosts);

            })





        }

        setupDeleteButtons();
    }
});








let currentPreset;
const deletePresetContainer = document.querySelector("#delete-preset-container");
const confirmDelete = document.querySelector("#confirm-delete");
const cancelDelete = document.querySelector("#cancel-delete");

function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".delete-preset-button");

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentPreset = button.closest(".preset");
            deletePresetContainer.classList.add("active");
        })
    })
}

if(cancelDelete && confirmDelete){
    confirmDelete.addEventListener("click", async () => {
        await deletePreset(currentPreset.id);
        deletePresetContainer.classList.remove("active");
    })

    cancelDelete.addEventListener("click", () => {
        deletePresetContainer.classList.remove("active");
    })
}

async function deletePreset(presetName) {
    const user = auth.currentUser;
    if (user) {
        await deleteDoc(doc(db, "users", user.uid, "presets", presetName));
        location.reload();
    }
}


