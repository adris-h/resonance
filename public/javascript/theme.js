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

let themeMode = getCookie('themeMode') || 'dark-mode';

const darkMode = document.getElementById("dark-mode");
const lightMode = document.getElementById("light-mode");
let darkModeActive = true;

if (themeMode === 'dark-mode') {
    setDarkMode();
} else if (themeMode === 'light-mode') {
    setLightMode();
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const themeDoc = await getDoc(doc(db, "users", user.uid, "themes", "currentTheme"));
            const themeModeDoc = await getDoc(doc(db, "users", user.uid, "themes", "themeMode"));


            if (themeDoc.exists()) {
                const themeData = themeDoc.data();
                highlightColor = themeData.highlightColor || '#66d1ff';
                accentColor = themeData.accentColor || '#06b7fd';
                accentColorDarker = themeData.accentColorDarker || '#0269b8';

                applyThemeColors();
            } else if(themeModeDoc.exists()) {
                const themeModeData = themeDoc.data();
                if(themeModeData.theme === 'dark-mode') {
                    setDarkMode();
                } else {
                    setLightMode();
                }

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


if(darkMode && lightMode){
    darkMode.addEventListener("click", async () => {
        setDarkMode()

        console.log(getCookie("themeMode"));
        console.log("clicked")

        setCookie("themeMode", "dark-mode");

        darkModeActive = true;

        await setDoc(doc(db, "users", user.uid, "themes", "mode"), {
            theme: "dark-mode",
        }, { merge: true });
    })

    lightMode.addEventListener("click", async() => {
        setLightMode()
        setCookie("themeMode", "light-mode");

        darkModeActive = false;

        await setDoc(doc(db, "users", user.uid, "themes", "mode"), {
            theme: "light-mode",
        }, { merge: true });
    })
}


function setDarkMode() {
    let bcgColor = '#0c0c0f';
    let textColor = '#dedede';
    let barelyVisible = '#232324';

    let buttonBcg = '#101016FF'

    let buttonGrad1 = '#13131CFF'
    let buttonGrad2 = '#0D0D12FF'

    let buttonBorder1 = '#10101F'
    let buttonBorder2 = '#2A2B2E99'

    let activeButtonColor = '#232324'

    let buttonTextColor = '#33333b'

    setMode(bcgColor, textColor, barelyVisible, buttonBcg, buttonGrad1, buttonGrad2, buttonBorder1, buttonBorder2, activeButtonColor, buttonTextColor);

    if (darkMode || lightMode) {
        darkMode.classList.add("active");
        lightMode.classList.remove("active");
    }
}

function setLightMode() {
    let bcgColor = '#FAF3E1';
    let textColor = '#0c0c0f';

    let barelyVisible = '#dfd2b9';

    let buttonBcg = '#dfd2b9'

    let buttonGrad1 = '#ede0be'
    let buttonGrad2 = '#e9dabf'

    let buttonBorder1 = '#eee0c7'
    let buttonBorder2 = '#dfd2b9'

    let activeButtonColor = '#dfd2b9'
    let buttonTextColor = '#0c0c0f'
    setMode(bcgColor,textColor, barelyVisible, buttonBcg, buttonGrad1, buttonGrad2, buttonBorder1, buttonBorder2, activeButtonColor, buttonTextColor);

    if (darkMode || lightMode) {
        darkMode.classList.remove("active");
        lightMode.classList.add("active");
    }

}

function setMode(bcgColor, textColor, barelyVisible, buttonBcg, buttonGrad1, buttonGrad2, buttonBorder1, buttonBorder2, activeButtonColor, buttonTextColor) {
    r.style.setProperty('--bcgColor', bcgColor);
    r.style.setProperty('--textColor', textColor);
    r.style.setProperty('--barelyVisible', barelyVisible);
    r.style.setProperty('--buttonBackground', buttonBcg);
    r.style.setProperty('--buttonGradient1', buttonGrad1);
    r.style.setProperty('--buttonGradient2', buttonGrad2);
    r.style.setProperty('--buttonBorder1', buttonBorder1);
    r.style.setProperty('--buttonBorder2', buttonBorder2);
    r.style.setProperty('--activeButtonText', activeButtonColor);
    r.style.setProperty('--buttonText', buttonTextColor);
}
