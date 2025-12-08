const importButton = document.querySelector('#file-import');
const importFilePopUp = document.querySelector('.song-import-wrapper');
const importCloseButton = document.querySelector('.close-import-button');

//const importButton2 = document.querySelector('.file-import2');
import { getBPM } from "./getBPM.js";
import {hideLibrary} from "./showLibrary.js";
import {pauseSource} from "./audioPlay.js";

const deckBtns = document.querySelectorAll('.deck-button');



const decks = [
    {
        id: 1,
        deckBtn: document.querySelector('#deck1btn'),
        audio: document.querySelector('#audio'),
        playBtn: document.querySelector('.main-wrapper .play-button'),
        songPlaying: document.querySelector('.main-wrapper .song-name'),
        artist: document.querySelector('.main-wrapper .artist-name'),
        bpmSpan: document.querySelector('#bpm'),
        songCover: document.querySelector('.main-wrapper .song_cover')

    },
    {
        id: 2,
        deckBtn: document.querySelector('#deck2btn'),
        audio: document.querySelector('#audio2'),
        playBtn: document.querySelector('.second-source .play-button'),
        songPlaying: document.querySelector('.second-source .song-name'),
        artist: document.querySelector('.second-source .artist-name'),
        bpmSpan: document.querySelector('#bpm-2'),
        songCover: document.querySelector('.second-source .song_cover')
    }
]

let currentSource = decks[0];

deckBtns.forEach((button, i) => {
    button.addEventListener('click', () => {
        deckBtns.forEach((button) => button.classList.remove('active'));
        button.classList.add('active')
        currentSource = decks[i];
        console.log("current source: ", currentSource.audio);
        console.log("src: ", currentSource.audio.src);
    })
})


//import { setImportState } from "./importState.js";

let importActive = false;

export function setImportState(state) {
    importActive = state;
    // console.log("Import state set to:", importActive);
}

export function getImportState() {
    // console.log("Import state checked:", importActive);
    return importActive;
}


let source = document.querySelector('.audio');
let button = document.querySelector('.main-wrapper .play-button');

let source2 = document.querySelector('.audio2');
let button2 = document.querySelector('.second-source .play-button');


importButton.addEventListener('click', e => {
    importFilePopUp.classList.remove('hidden');
    setImportState(true);
    console.log(setImportState);
    hideLibrary();

    decks.forEach(deck => {
        pauseSource(deck.audio, deck.playBtn);
    })
})

/*
* importButton2.addEventListener('click', e => {
    importFilePopUp.classList.remove('hidden');
    sourceChosen = 2;
    setImportState(true);
})
* */

importCloseButton.addEventListener('click', e => {
    importFilePopUp.classList.add('hidden');
    setImportState(false);
})




const fileNameText = document.querySelector('.file-name');
const fileInput = document.querySelector('#song-file-import');

let audioName, audioArtist, fileURL;

fileInput.addEventListener('input', e => {
    let fileName = fileInput.files[0].name;
    fileNameText.innerHTML = fileName;
    console.log("file name: ", fileName);
    audioName = document.querySelector('#import-song-name');
    audioArtist = document.querySelector('#import-artist-name');
    fileURL = URL.createObjectURL(fileInput.files[0]);
});


/*let songPlaying = document.querySelector('.song-name');
let artist = document.querySelector('.artist-name');*/

const fileSubmitButton = document.querySelector('.file-submit');

fileSubmitButton.addEventListener('click', e => {
    if(audioName.value.length !== 0 && audioArtist.value.length !== 0){
        window.currentSong = fileInput.files[0];
        console.log("current song: ", window.currentSong);
        currentSource.audio.src = fileURL;
        currentSource.songPlaying.innerHTML = audioName.value;
        currentSource.artist.innerHTML = audioArtist.value;

        getBPM([{ audio: currentSource.audio, bpmSpan: currentSource.bpmSpan}]);

        importFilePopUp.classList.add('hidden');

        currentSource.songCover.style.backgroundImage = 'none';
        currentSource.songCover.style.backgroundColor = '#fff';

        if(currentSource.id === 1 && window.wavesurfer1) {
            window.wavesurfer1.load(currentSource.audio.src);
        }
        if(currentSource.id === 2 && window.wavesurfer2) {
            window.wavesurfer2.load(currentSource.audio.src);
        }

        setImportState(false);
    } else{
        if(audioName.value.length === 0 && audioArtist.value.length === 0){
            audioName.classList.add('error');
            audioArtist.classList.add('error');
        } else{
            if(audioName.value.length !== 0){
                audioName.classList.remove('error');
                audioArtist.classList.add('error');
            } else if(audioArtist.value.length !== 0){
                audioArtist.classList.remove('error');
                audioName.classList.add('error');
            }
        }
    }
});

