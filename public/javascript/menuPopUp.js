import {getCookie} from "./main.js";
import {getFirestore, doc, getDoc} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {auth} from './main.js';
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


const menuPopUp = document.querySelector('.user-profile_menu');
const menuButton = document.querySelector('.menu_button');
const menuLinks = document.querySelectorAll('.user-profile_menu a');
let menuActive = false;
const userProfile = document.querySelector('#user-profile');

if (userProfile) {
    userProfile.innerText = getCookie("username")[0];
}

if (menuPopUp){
    menuButton.addEventListener('click', () => {
        if (!menuActive) {
            menuActive = true;
            menuPopUp.classList.add('active');
            setTimeout(() => {
                menuLinks.forEach(link => {
                    link.classList.add('active');
                })

            },  200)
        } else{
            menuActive = false;
            menuLinks.forEach(link => {
                link.classList.remove('active');
            })

            setTimeout(() => {
                menuPopUp.classList.remove('active');
            },  200)
        }

        console.log("button clicked");
    })
}

const r = document.documentElement;

const db = getFirestore();

async function applyProfileColor() {
    const cachedColor = getCookie('color');
    if (cachedColor) {
        r.style.setProperty('--profileColor', cachedColor);
        menuButton.style.backgroundColor = cachedColor;
    }

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const color = userData.userColor || '#ffffff';
                    r.style.setProperty('--profileColor', color);
                    menuButton.style.backgroundColor = color;
                    console.log("applied color from Firestore:", color);
                }
            } catch (error) {
                console.error("Error fetching user color:", error);
                // Fallback to default color
                const fallbackColor = '#ffffff';
                r.style.setProperty('--profileColor', fallbackColor);
                menuButton.style.backgroundColor = fallbackColor;
            }
        }
    });
}

applyProfileColor();

const onClickOutside = (element1, element2, callback) => {
    document.addEventListener('click', e => {
        if (!element1.contains(e.target) && !element2.contains(e.target)) callback();
    });
};

onClickOutside(
    menuPopUp,
    menuButton,
    () => {
        menuPopUp.classList.remove('active')
        menuLinks.forEach(link => {
            link.classList.remove('active');
        })
        menuActive = false;
    }
);



