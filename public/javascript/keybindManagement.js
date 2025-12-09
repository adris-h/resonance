const keybindButtons = document.querySelectorAll(".keybind-button");
let activeButton = null;

// prochazi vsemi buttony pro keybinds
keybindButtons.forEach(button => {
    // jakmile se button klikne tak se nastavi jako aktivni
    button.addEventListener("click", e => {
        if(button.classList.contains("active")) {
            button.classList.remove("active");
            activeButton = null;
        } else{
            keybindButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            activeButton = button;
        }
    })
})

// jestli uz je nejaky button aktivni a neni to ten na ktery se prave klika tak se odstrani s aktivnich tlaitek
document.addEventListener('click', e => {
    if (activeButton !== null && !activeButton.contains(e.target)) {
        activeButton.classList.remove("active");
        activeButton = null;
    }
});

// list s klavesy ktere nemuze uzivatel vyuizit
let forbidden = ["1", "2", "3", "4", "7", "8", "9", "0", "O", "P"]
let canSubmit = true;

// event listern pro stisknuti klavesy
document.addEventListener("keydown", e => {
    // jestli je nejaky aktivni button
    if(activeButton !== null){
        // konstanta ktera obsahuje atribut aktivniho tlacitka
        const action = activeButton.dataset.action;
        // uvnitr tlacitka se vlozi text ktery odpovida klavese
        activeButton.innerText = (e.key).toUpperCase();
        // pro klic ktery odpovida atributu tlacitka se nastavi kod klavesy
        user_keybinds[action] = e.code;
        // funkce, ktera nastavuje texxt uvnitr tlacitka ( pro klavesy ktere se maji jinak napsane e.key)
        otherKeys(e, activeButton)
        // promenna aktera obsahuje prave stisknute tlacitko
        let inputed = (e.key).toUpperCase();
        canSubmit = true
        keybindButtons.forEach(btn => {
            if(btn !== activeButton) {
                console.log(btn);
                if(inputed === btn.innerHTML || forbidden.includes(inputed)) {
                    canSubmit = false
                    activeButton.closest("div").querySelector("h2").style.color = "red";
                }
            }
        });

        const rootStyles = getComputedStyle(document.documentElement);
        if (canSubmit) {
            let textColor = rootStyles.getPropertyValue('--textColor').trim()
            activeButton.closest("div").querySelector("h2").style.color = textColor;
        }
        console.log("can submit: ", canSubmit);
    }
})



function otherKeys(e, button){
    switch(e.key) {
        case "ArrowDown":
            button.innerText = "ArrowDown"
            break;
        case "ArrowUp":
            button.innerText = "ArrowUp"
            break;
        case "ArrowLeft":
            button.innerText = "ArrowLeft"
            break;
        case "ArrowRight":
            button.innerText = "ArrowRight"
            break;
    }

    switch(e.code) {
        case "Space":
            button.innerText = "Space"
            break;
        case "Enter":
            button.innerText = "Enter"
            break;
    }
}

const DEFAULT_KEYBINDS = {
    increase: "ArrowUp",
    decrease: "ArrowDown",
    volumeTrack1: "KeyQ",
    volumeTrack2: "KeyE",
    mute: "KeyM",
    seek: "KeyW",
    playTrack1: "KeyS",
    playTrack2: "KeyK",
    playBothTracks: "Space",
    library: "KeyL",
    tempoTrack1: "KeyT",
    tempoTrack2: "KeyY",
    tempoReset: "Backspace",
    eq1: "KeyO",
    eq2: "KeyP"
};

let user_keybinds = {
    increase: "ArrowUp",
    decrease: "ArrowDown",
    volumeTrack1: "KeyQ",
    volumeTrack2: "KeyE",
    mute: "KeyM",
    seek: "KeyW",
    playTrack1: "KeyS",
    playTrack2: "KeyK",
    playBothTracks: "Space",
    library: "KeyL",
    tempoTrack1: "KeyT",
    tempoTrack2: "KeyY",
    tempoReset: "Backspace",
    eq1: "KeyO",
    eq2: "KeyP"
}

const submitBtn = document.querySelector("#submit-key");
const resetBtn = document.querySelector("#reset-key");



let userBinds = false;
if (submitBtn && resetBtn) {
    submitBtn.addEventListener("click", e => {
        keybindButtons.forEach( () => {
            submit();

        })
    })

    resetBtn.addEventListener("click", e => {
        keybindButtons.forEach(button => {
            let action = button.dataset.action;

            resetKeybinds(button, action)
            resetButtons(button, action)

            localStorage.removeItem('userKeybinds');

            userBinds = false;
            localStorage.setItem("areBindsUsers", userBinds);
        })
    })
}

function submit(){
    if(!canSubmit) return;
    localStorage.setItem("userKeybinds", JSON.stringify(user_keybinds));
    console.log("local storage: ", localStorage.getItem("userKeybinds"));

    userBinds = true;
    localStorage.setItem("areBindsUsers", userBinds);
}

function resetButtons(button, action){
    button.innerText = codeToKey(DEFAULT_KEYBINDS[action]);
}

function resetKeybinds(button, action){
    user_keybinds[action] = codeToKey(DEFAULT_KEYBINDS[action]);
    console.log("button action: ", user_keybinds[action]);
}

let checkTrue = localStorage.getItem("areBindsUsers");
let savedBinds = JSON.parse(localStorage.getItem("userKeybinds"));

if(checkTrue === "true"){;
    keybindButtons.forEach(button => {
        let action = button.dataset.action;
        button.innerText = codeToKey(savedBinds[action]);
    })
} else{

    // if user has not submitted binds - use binds from default key binds
    keybindButtons.forEach(button => {
        let action = button.dataset.action;
        console.log("hello? ", action);
        button.innerText =  codeToKey(DEFAULT_KEYBINDS[action]);
    })
}

function codeToKey(code){
    if (!code) return "";
    switch(code){
        case "Space": return "Space";
        case "Enter": return "Enter";
        case "ArrowUp": return "ArrowUp";
        case "ArrowDown": return "ArrowDown";
        case "ArrowLeft": return "ArrowLeft";
        case "ArrowRight": return "ArrowRight";
        default:
            if(code.startsWith("Key")) return code.slice(3);
            if(code.startsWith("Digit")) return code.slice(5);
            return code;
    }
}