import { getDocs, collection, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {showPresets} from "./showPreset.js";

const profilePosts = document.querySelector("#profile-posts");
const profileLikes = document.querySelector("#profile-likes");

const likesButton = document.querySelector("#likes-button");
const presetsButton = document.querySelector("#posts-button");

async function sortPresetsByDate(presetsQuery) {
    const presets = await getDocs(presetsQuery);
    const sortedPresets = [];
    presets.forEach(doc => {
        sortedPresets.push(doc);
    });
    return sortedPresets;
}


onAuthStateChanged(auth, async (user) => {
    if (user) {

        const presetsQuery = query(collection(db, "users", user.uid, "presets"), orderBy("createdAt", "desc"));
        const userPresets = await sortPresetsByDate(presetsQuery);

       showPresets("user", userPresets, profilePosts);

        if(likesButton && presetsButton){
            likesButton.addEventListener("click", async () => {
                const likedPresetsQuery = await query(collection(db, "users", user.uid, "likes"), orderBy("likedAt", "desc"));
                const likedPresets = await sortPresetsByDate(likedPresetsQuery);

                console.log("Number of liked presets:", likedPresets.length);
                console.log("Liked presets:", likedPresets);

                profilePosts.classList.remove("active");
                profileLikes.classList.add("active");
                likesButton.classList.add("active");
                presetsButton.classList.remove("active");

                showPresets("likes", likedPresets, profileLikes);

                const dislikeButton = document.querySelectorAll(".dislike-button");
                dislikeButton.forEach(button => {
                    button.addEventListener("click", async () => {
                        let currentPreset = button.closest(".preset");
                        await dislikePreset(currentPreset)
                    })
                });

                async function dislikePreset(currentPreset) {
                    console.log("Unliked preset: " + currentPreset.id);
                    await deleteDoc(doc(db, "users", user.uid, "likes", currentPreset.id));
                    location.reload();

                }
            })

            presetsButton.addEventListener("click", () => {
                profileLikes.classList.remove("active");
                profilePosts.classList.add("active");
                presetsButton.classList.add("active");
                likesButton.classList.remove("active");

                showPresets("user", userPresets, profilePosts);

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

    if(deleteButtons){
        deleteButtons.forEach(button => {
            button.addEventListener("click", () => {
                currentPreset = button.closest(".preset");
                deletePresetContainer.classList.add("active");
            })
        })
    }
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


