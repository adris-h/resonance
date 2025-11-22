import { getDocs, collection, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {showPresets} from "./showPreset.js";

const profilePosts = document.querySelector("#profile-posts");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const presets = await getDocs(collection(db, "users", user.uid, "presets"));

        showPresets("user", presets, profilePosts);

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

