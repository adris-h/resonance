import {setCookie, getCookie} from "./main.js";
import {getFirestore, doc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {auth} from "./main.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const db = getFirestore();
const r = document.documentElement;

const colorCell = document.querySelector('#color-cell-1');
const colorCell2 = document.querySelector('#color-cell-2');
const colorCell3 = document.querySelector('#color-cell-3');
const hexCode = document.querySelector('#hex-code-1');
const hexCode2 = document.querySelector('#hex-code-2');
const hexCode3 = document.querySelector('#hex-code-3');

let highlightColor = getCookie('highlightColor') || '#66d1ff';
let accentColor = getCookie('accentColor') || '#06b7fd';
let accentColorDarker = getCookie('accentColorDarker') || '#0269b8';

applyThemeColors();

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const themeDoc = await getDoc(doc(db, "users", user.uid, "themes", "currentTheme"));

            if (themeDoc.exists()) {
                const themeData = themeDoc.data();
                highlightColor = themeData.highlightColor || '#66d1ff';
                accentColor = themeData.accentColor || '#06b7fd';
                accentColorDarker = themeData.accentColorDarker || '#0269b8';

                applyThemeColors();
            } else {
                console.log("no theme found using defaults");
            }
        } catch (error) {
            console.error("error fetching theme:", error);
        }
        const defaultButton = document.querySelector('#default-theme');
        const submitButton = document.querySelector('#submit-theme');
        if (submitButton) {
            submitButton.addEventListener('click', async () => {
                try {
                    setCookie("highlightColor", highlightColor, 30);
                    setCookie("accentColor", accentColor, 30);
                    setCookie("accentColorDarker", accentColorDarker, 30);

                    await setDoc(doc(db, "users", user.uid, "themes", "currentTheme"), {
                        highlightColor: highlightColor,
                        accentColor: accentColor,
                        accentColorDarker: accentColorDarker
                    }, { merge: true });



                    applyThemeColors();
                } catch (error) {
                    console.error("errror when saving theme:", error);
                }
            });
        }
        if( defaultButton){
            defaultButton.addEventListener('click', async () => {
                highlightColor = '#66d1ff';
                accentColor = '#06b7fd';
                accentColorDarker = '#0269b8';

                try {
                    setCookie("highlightColor", highlightColor, 30);
                    setCookie("accentColor", accentColor, 30);
                    setCookie("accentColorDarker", accentColorDarker, 30);

                    await setDoc(doc(db, "users", user.uid, "themes", "currentTheme"), {
                        highlightColor: highlightColor,
                        accentColor: accentColor,
                        accentColorDarker: accentColorDarker
                    }, { merge: true });

                    applyThemeColors();
                } catch (error) {
                    console.error("errror when saving theme:", error);
                }
            })
        }
    }
});
if(colorCell2 && colorCell && colorCell3){

    colorCell.addEventListener('click', () => {
        const picker = new ColorPicker(colorCell, {
            submitMode: 'instant',
            headless: true,
            formats: false,
            showClearButton: false,
            enableAlpha: false,
            color: colorCell.style.backgroundColor
        })
            .on('pick', color => {
                const hexColor = color.string("hex");
                colorCell.style.backgroundColor = hexColor;
                hexCode.innerHTML = hexColor;
                highlightColor = hexColor;
                applyThemeColors();
            })
            .prompt();
    });

    colorCell2.addEventListener('click', () => {
        const picker = new ColorPicker(colorCell2, {
            submitMode: 'instant',
            headless: true,
            formats: false,
            showClearButton: false,
            enableAlpha: false,
            color: colorCell2.style.backgroundColor
        })
            .on('pick', color => {
                const hexColor = color.string("hex");
                colorCell2.style.backgroundColor = hexColor;
                hexCode2.innerHTML = hexColor;
                accentColor = hexColor;
                applyThemeColors();
            })
            .prompt();
    });
    colorCell3.addEventListener('click', () => {
        const picker = new ColorPicker(colorCell3, {
            submitMode: 'instant',
            headless: true,
            formats: false,
            showClearButton: false,
            enableAlpha: false,
            color: colorCell3.style.backgroundColor
        })
            .on('pick', color => {
                const hexColor = color.string("hex");
                colorCell3.style.backgroundColor = hexColor;
                hexCode3.innerHTML = hexColor;
                accentColorDarker = hexColor;
                applyThemeColors();
            })
            .prompt();
    });
}

function applyThemeColors() {
    r.style.setProperty('--highlightColor', highlightColor);
    r.style.setProperty('--accentColor', accentColor);
    r.style.setProperty('--accentColorDarker', accentColorDarker);

    if(colorCell || colorCell2 || colorCell3 || hexCode || hexCode2 || hexCode3){
        colorCell.style.backgroundColor = highlightColor;
        colorCell2.style.backgroundColor = accentColor;
        colorCell3.style.backgroundColor = accentColorDarker;

        hexCode.innerHTML = highlightColor;
        hexCode2.innerHTML = accentColor;
        hexCode3.innerHTML = accentColorDarker;
    }
}
