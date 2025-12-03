//import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
const songButtons = document.querySelectorAll('.song-button');
const audioButtons = document.querySelectorAll('#audio-choice span button');
import {loadSongs} from './audioPlay.js'
import {hideLibrary} from "./showLibrary.js";

// defaultne nastaveni audia
let audioChosen = "audio1";

// pridani event listeneru na kazde audio tlacitko
audioButtons.forEach((button, i) => {
    button.addEventListener('click', () => {
        audioButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // nastaveni vybraneho audia
        if(audioButtons[1].classList.contains('active')){
            audioChosen = "audio2";
            console.log("chosen audio", audioChosen);
        } else{
            audioChosen = "audio1";
            console.log("chosen audio", audioChosen);
        }
    })
})

// pridani event listeneru na kazde tlacitko pro vyber pisnicky
songButtons.forEach(btn => {
    btn.addEventListener('click', async () =>{

        // ziskani klice pisnicky z datoveho atributu
        const key = btn.dataset.song;

        // odstraneni aktivniho stavu ze vsech tlacitek a pridani na to, ktere bylo prave zmacknuto
        songButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // ulozeni vybrane pisnicky do local storage podle vybraneho audia
        if (audioChosen === "audio1") {
            localStorage.setItem('lastSong_audio1', key);
        } else if (audioChosen === "audio2") {
            localStorage.setItem('lastSong_audio2', key);
        }

        // po vyberu pisnicky okamzite nahrat pisnicku a skryt knihovnu
        await loadSongs();
        hideLibrary();
    })
})
songButtons.forEach(btn => {
    btn.scrollTo();
})

// ulozeni aktualni pisnicky do globalni promenne
window.currentSong = currentSong;

