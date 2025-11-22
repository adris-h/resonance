const keybindButtons = document.querySelectorAll(".keybind-button");
let activeButton = null;

keybindButtons.forEach(button => {
    button.addEventListener("click", e => {
        if(button.classList.contains("active")) {
            button.classList.remove("active");
            activeButton = null;
        } else{
            keybindButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            activeButton = button;


        }
        console.log(activeButton)
    })
})

document.addEventListener('click', e => {
    if (activeButton !== null && !activeButton.contains(e.target)) {
        activeButton.classList.remove("active");
        activeButton = null;
    }
});

let forbidden = ["1", "2", "3", "4", "7", "8", "9", "0", "O", "P"]

let canSubmit = true;

document.addEventListener("keydown", e => {
    if(activeButton !== null){
        const action = activeButton.dataset.action;
        activeButton.innerText = (e.key).toUpperCase();
        user_keybinds[action] = e.code;

        otherKeys(e, activeButton)

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

        if (canSubmit) {
            activeButton.closest("div").querySelector("h2").style.color = "white";
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
            //submitKeybinds(button, action)

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
console.log("user submitted? ", checkTrue);

console.log("saved binds ", savedBinds);

if(checkTrue === "true"){
    console.log("sdsd");
    keybindButtons.forEach(button => {
        console.log("sdji");
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