//import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
const songButtons = document.querySelectorAll('.song-button');
const audioButtons = document.querySelectorAll('#audio-choice span button');
import {loadSongs} from './audioPlay.js'
import {hideLibrary} from "./showLibrary.js";

let audioChosen = "audio1";

audioButtons.forEach((button, i) => {
    button.addEventListener('click', () => {
        //console.log("audio btn clicked: ", audioButtons[i]);

        audioButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');


        if(audioButtons[1].classList.contains('active')){
            audioChosen = "audio2";
            console.log("chosen audio", audioChosen);
        } else{
            audioChosen = "audio1";
            console.log("chosen audio", audioChosen);
        }
    })
})

songButtons.forEach(btn => {
    btn.addEventListener('click', async () =>{
        const key = btn.dataset.song;

        // save the choice

        // remove any active class from every button
        songButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");


        if (audioChosen === "audio1") {
            localStorage.setItem('lastSong_audio1', key);
        } else if (audioChosen === "audio2") {
            localStorage.setItem('lastSong_audio2', key);
        }

        // after choice immediatelly load the sonfg
        loadSongs();
        hideLibrary();

        /*if (window.auth?.currentUser) {
            await setDoc(doc(window.db, "users", window.auth.currentUser.uid), { lastSong: key }, { merge: true });
        }*/

        // go to the player page
        //window.location.href = "main.html";
    })
})

songButtons.forEach(btn => {
    btn.scrollTo();
})


window.currentSong = currentSong;

