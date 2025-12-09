// importované knihovny
import {changeEq} from "./equalizer.js";
import {getImportState} from "./importSong.js";


// global proměnné pro aktuální písničku a přednastavene písničky
let currentSong;
let predefinedSongs = {};
let vinyl;


// hlavni (první) audio element
const audio1 = document.querySelector('.audio');
let audio = audio1;

// objekt, který obsahuje oba zdroje a jejich elementy
const sources = [
    {
        id: 1,
        audio: document.querySelector('.audio'),
        playButton: document.querySelector('.main-wrapper .play-button'),
        timeline: document.querySelector('#volume'),
        vinyl: document.querySelector('.main-wrapper .song_cover'),
        volumeSlider: document.querySelector('#vol'),
        volumeValue: document.querySelector('#volume-value'),
        title: document.querySelector('.main-wrapper .song-name'),
        artist: document.querySelector('.main-wrapper .artist-name'),
        currentTimeText: document.querySelector('#current-song-time'),
        durationText: document.querySelector('#song-duration'),
        bpm: document.querySelector('#bpm'),
        songCover: document.querySelector('.song-cover'),
        startButton: document.querySelector('#start-song-button'),
        endButton: document.querySelector('#end-song-button')
    },
    {
        id: 2,
        audio: document.querySelector('.audio2'),
        playButton: document.querySelector('.second-source .play-button'),
        timeline: document.querySelector('#volume2'),
        vinyl: document.querySelector('.second-source .song_cover'),
        volumeSlider: document.querySelector('#vol-2'),
        volumeValue: document.querySelector('#volume-value-2'),
        title: document.querySelector('.second-source .song-name'),
        artist: document.querySelector('.second-source .artist-name'),
        currentTimeText: document.querySelector('#current-song2-time'),
        durationText: document.querySelector('#song2-duration'),
        bpm: document.querySelector('#bpm-2'),
        songCover: document.querySelector('.second-source .song-cover'),
        startButton: document.querySelector('#start-song-button-2'),
        endButton: document.querySelector('#end-song-button-2')
    }
];



const r = getComputedStyle(document.documentElement);
const highlightColor = r.getPropertyValue('--highlightColor');
const barelyVisible = r.getPropertyValue('--barelyVisible');

const wavesurfer1 = WaveSurfer.create({
    container: '#waveform1',
    media: sources[0].audio,
    waveColor: `${barelyVisible}`,
    progressColor: `${highlightColor}`,
    height: 150
});

const wavesurfer2 = WaveSurfer.create({
    container: '#waveform2',
    media: sources[1].audio,
    waveColor: `${barelyVisible}`,
    progressColor: `${highlightColor}`,
    height: 150
});

const waveformContainer = document.getElementById('waveform-container');
const waveformButtons = document.querySelectorAll('.waveform-button');

const waveform1 = document.querySelector('#waveform1');
const waveform2 = document.querySelector('#waveform2');

if (waveformButtons) {
    waveformButtons.forEach(waveformButton => {
        waveformButton.addEventListener('click', (e) => {
            waveformContainer.classList.add('active');
        });
    })
}

document.addEventListener('click', e => {
    if (!waveformContainer.classList.contains('active')) return;

    const clickedInside =
        waveform1.contains(e.target) ||
        waveform2.contains(e.target) ||
        Array.from(waveformButtons).some(btn => btn.contains(e.target));

    if (!clickedInside) {
        waveformContainer.classList.remove('active');
    }
});


// při zmeně tempa se musí změnit i výška tónu tak funguje většina DJ kontroleru
sources.forEach(source => {
    source.audio.preservesPitch = false;
})


// asynchronní funkce pro načtení písniček ze souboru
async function loadSongs() {
    try {
        // získání písniček ze songs.json
        const response = await fetch('javascript/songs.json');
        const songs = await response.json();
        predefinedSongs = songs;


        // načtení naposledy přehrávané písničky z localStorage
        const savedSong1 = localStorage.getItem('lastSong_audio1');
        const savedSong2 = localStorage.getItem('lastSong_audio2');

        // ověřit jestli už byla uložena poslední písnička
        if (savedSong1 && predefinedSongs[savedSong1]) {
            updateSong(savedSong1, 'audio1');
        }
        if (savedSong2 && predefinedSongs[savedSong2]) {
            updateSong(savedSong2, 'audio2');
        }
    } catch (error) {
        console.log("Couldn't load songs:", error);
    }
}

// spuštění funkce načítání písniček
loadSongs();
export {loadSongs}



// funkce pro přehrání zdroje, změní ikonu tlačítka a spustí přehrávání
function playSource(source, button){
    button.innerHTML = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
        '<svg width="100%" height="100%" viewBox="0 0 13 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">\n' +
        '    <g>\n' +
        '        <g transform="matrix(9,0,0,9,-16,-16)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:white;"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(5,0,0,1,-6,-1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:white;"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(5,0,0,1,-6,9)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:white;"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(-0.00309,4.999999,-1,-0.000618,4.007724,-5.998761)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:white;"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(-0.00309,4.999999,-1,-0.000618,14.009269,-5.998453)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:white;"/>\n' +
        '        </g>\n' +
        '    </g>\n' +
        '    <g>\n' +
        '        <g transform="matrix(1,0,0,1,4,-2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,5,-2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,3,-2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,2,-2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,6,-2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,7,-1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,8,-1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,9,0)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,9,1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,10,2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,10,3)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,10,4)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,10,5)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,10,6)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,9,7)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,9,8)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,8,9)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,7,9)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,6,10)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,5,10)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,4,10)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,3,10)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,2,10)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,1,9)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,1,9)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,0,9)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-1,8)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-1,7)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-1,7)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-2,6)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-2,5)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-2,4)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-2,4)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-2,3)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-2,2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-1,1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-1,0)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-1,0)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,0,-1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,1,-1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '    </g>\n' +
        '    <g transform="matrix(1,0,0,1,1,0)">\n' +
        '        <g>\n' +
        '            <g transform="matrix(1,0,0,1,2,2)">\n' +
        '                <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '            </g>\n' +
        '            <g transform="matrix(1,0,0,1,2,3)">\n' +
        '                <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '            </g>\n' +
        '            <g transform="matrix(1,0,0,1,2,4)">\n' +
        '                <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '            </g>\n' +
        '            <g transform="matrix(1,0,0,1,2,6)">\n' +
        '                <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '            </g>\n' +
        '            <g transform="matrix(1,0,0,1,2,5)">\n' +
        '                <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '            </g>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,2,0)">\n' +
        '            <g transform="matrix(1,0,0,1,2,2)">\n' +
        '                <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '            </g>\n' +
        '            <g transform="matrix(1,0,0,1,2,3)">\n' +
        '                <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '            </g>\n' +
        '            <g transform="matrix(1,0,0,1,2,4)">\n' +
        '                <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '            </g>\n' +
        '            <g transform="matrix(1,0,0,1,2,6)">\n' +
        '                <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '            </g>\n' +
        '            <g transform="matrix(1,0,0,1,2,5)">\n' +
        '                <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '            </g>\n' +
        '        </g>\n' +
        '    </g>\n' +
        '</svg>\n'
    source.play();
}

// funkce pro pozastavení zdroje, změní ikonu tlačítka a pozastaví přehrávání
function pauseSource(source, button){
    button.innerHTML = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
        '<svg width="100%" height="100%" viewBox="0 0 13 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">\n' +
        '    <g>\n' +
        '        <g transform="matrix(9,0,0,9,-16,-16)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:white;"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(5,0,0,1,-6,-1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:white;"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(5,0,0,1,-6,9)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:white;"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(-0.00309,4.999999,-1,-0.000618,4.007724,-5.998761)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:white;"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(-0.00309,4.999999,-1,-0.000618,14.009269,-5.998453)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:white;"/>\n' +
        '        </g>\n' +
        '    </g>\n' +
        '    <g>\n' +
        '        <g transform="matrix(1,0,0,1,4,-2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,5,-2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,3,-2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,2,-2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,6,-2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,7,-1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,8,-1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,9,0)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,9,1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,10,2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,10,3)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,10,4)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,10,5)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,10,6)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,9,7)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,9,8)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,8,9)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,7,9)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,6,10)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,5,10)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,4,10)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,3,10)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,2,10)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,1,9)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,1,9)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,0,9)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-1,8)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-1,7)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-1,7)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-2,6)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-2,5)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-2,4)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-2,4)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-2,3)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-2,2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-1,1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-1,0)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,-1,0)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,0,-1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,1,-1)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '    </g>\n' +
        '    <g transform="matrix(1,0,0,1,1,0)">\n' +
        '        <g transform="matrix(1,0,0,1,3,2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,3,3)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,3,4)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,3,5)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,3,5)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,4,4)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,4,3)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,4,5)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,3,6)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,2,2)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,2,3)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,2,4)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,2,5)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,2,6)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '        <g transform="matrix(1,0,0,1,5,4)">\n' +
        '            <rect x="2" y="2" width="1" height="1" style="fill:rgb(13,0,0);"/>\n' +
        '        </g>\n' +
        '    </g>\n' +
        '</svg>\n'
    source.pause();
}

// exxportování funkce pauseSource pro použití v jiných souborech
export {pauseSource};

let audioSource;


// funkce pro převod času v sekundách na  minuty:sekundy
function getMinSeconds(time){
    let mind = time % (60 * 60); // zbytek po dělení hodinou
    let minutes = Math.floor(mind / 60); // celé minuty

    let secd = mind % 60; // zbytek po dělení minutou
    let seconds = Math.floor(secd);  // celé sekundy

    // pokud jsou sekundy menší než 10 tak přidat nulu před sekundou
    if(seconds < 10){
        seconds = "0" + seconds;
    }

    return minutes.toString() + ":" + seconds.toString();
}

// aktualizace aktuálně přehrávané písničky - název, obal, umelec, atd.
function updateSong(songKey, chosenAudio){
    const song = predefinedSongs[songKey]
    //console.log(song)

    if(!song)return; // pokud písnička neexistuje, ukonči funkci

    currentSong = songKey;

    // aktualizace informací pro první audio zdroj
    if (chosenAudio === 'audio1') {
        sources[0].audio.src = song.src;
        sources[0].title.innerHTML = song.name;
        sources[0].artist.innerHTML = song.artist;
        sources[0].vinyl.style.backgroundImage = `url(${song.cover})`;
        sources[0].bpm.innerHTML = song.bpm;
        sources[0].originalBPM = parseInt(song.bpm);

    } else if (chosenAudio === 'audio2') {
        // aktualizace informací pro druhý audio zdroj
        sources[1].audio.src = song.src;
        sources[1].title.innerHTML = song.name;
        sources[1].artist.innerHTML = song.artist;
        sources[1].vinyl.style.backgroundImage = `url(${song.cover})`;
        sources[1].bpm.innerHTML = song.bpm;
        sources[1].originalBPM = parseInt(song.bpm);

    }
    wavesurfer1.load(sources[0].audio.src);
    wavesurfer2.load(sources[1].audio.src);
    window.wavesurfer1 = wavesurfer1;
    window.wavesurfer2 = wavesurfer2;

    sources.forEach(source => {
        audioSource = source.audio;

        // event listener pro načtení metadat -> zobrazí celkovou délku písničky
        source.audio.addEventListener('loadedmetadata', () => {
            source.durationText.innerHTML = getMinSeconds(source.audio.duration);
        });

        // event listener pro aktualizaci času - průběžně aktualizuje čas
        source.audio.addEventListener('timeupdate', () => {
            source.currentTimeText.innerHTML = getMinSeconds(source.audio.currentTime);
        });

        // inicializace rotace vinylu
        source.currentRotation = 0;
    })
}
// inicializace rotace a animation framu pro každý zdroj
sources.forEach(source => {
    source.currentRotation = 0;
    source.rotationFrame = null;
});

// nastavení animace rotace při přehrávání a pozastavení
sources.forEach(source => {

    function updateRotation() {
        source.vinyl.style.transform = source.songCover.classList.contains('vinyl')
            ? `rotate(${source.currentRotation}deg)`
            : `rotate(0deg)`;
    }

    function rotateVinyl() {
        if (!source.audio.paused) {
            source.currentRotation += 0.3;
            updateRotation();
            source.rotationFrame = requestAnimationFrame(rotateVinyl);
        }
    }

    // spuštění rotace při přehrávání
    source.audio.addEventListener('play', () => {
        if (!source.rotationFrame) source.rotationFrame = requestAnimationFrame(rotateVinyl);
    });

    // zastavení rotace při zastavení
    source.audio.addEventListener('pause', () => {
        cancelAnimationFrame(source.rotationFrame);
        source.rotationFrame = null;
    });
});

// export aktuální písničky do window objektu
window.currentSong = currentSong;


/*const vinylState = {
    rotation: 0
};*/

let isDragging = false;
let currentRotation = 0;
let startAngle = 0;

/*const savedRotation = vinylState.rotation || 0;
currentRotation = savedRotation;
updateRotation();*/
/*
function getAngle(e) {
    sources.forEach(source => {
        vinyl = source.vinyl;
        if (vinyl && vinyl.classList.contains('vinyl')) {
            // get the position of the vinyl in the browser
            const rect = vinyl.getBoundingClientRect();

            // calculate the center point of the vinyl
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // find the angle between the mouse and the center
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            return angle * (180 / Math.PI);
        }
    })
    return 0;
}
let lastAngle = 0;
let totalRotation = 0;
if (vinyl && vinyl.classList.contains('vinyl')) {
    vinyl.addEventListener('mousedown', (e) => {
        isDragging = true;
        startAngle = getAngle(e);
        lastAngle = getAngle(e);
    });

    let angleDelta = 0;

    let moving = false;


    // CHANGEITUP vinyl shouldnt do anything on click onyl when dragging so it doesnt skip arround
    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !vinyl.classList.contains('vinyl')) return;
        const angle = getAngle(e);

        currentRotation = angle - startAngle;

        //const normalized = ((currentRotation % 360) + 360) % 360;
        angleDelta = angle - lastAngle;
        if (angleDelta > 180) angleDelta -= 360
        else if (angleDelta < -180) angleDelta += 360

        if(Math.abs(angleDelta) > 1) moving = true;

        totalRotation += angleDelta;

        console.log("angle ", angleDelta );

        if(moving){
            audio.currentTime = (totalRotation / 360)  * (audio.duration);
        }

        lastAngle = angle;
        /!*updateRotation();
        saveRotation();*!/
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}*/

// nastavení event listenerů pro každý zdroj
sources.forEach(source => {

    // přepínání mezi přehrávání a zastavení
    source.playButton.addEventListener('click', () => {
        if (source.audio.paused) playSource(source.audio, source.playButton);
        else pauseSource(source.audio, source.playButton);
    });

    // nastavení maximální hodnoty timeline podle délky písničky
    source.audio.addEventListener('loadedmetadata', () => {
        source.timeline.max = Math.floor(source.audio.duration);
    });

    // aktualizace hodnoty timeline při přehrávání
    source.audio.addEventListener('timeupdate', () => {
        source.timeline.value = Math.floor(source.audio.currentTime);
        requestAnimationFrame(updateSlider);
    });

    // přeskočení v písničce pomocí posuvníku
    source.timeline.addEventListener('input', () => {
        source.audio.currentTime = source.timeline.value;
        updateSliderBackground(source.timeline)
    });

    // aktualizace rotace vinylu
    function updateRotation() {
        if (source.songCover.classList.contains('vinyl')) {
            source.vinyl.style.transform = `rotate(${source.currentRotation}deg)`;
        } else{
            source.vinyl.style.transform = `rotate(0deg)`
        }
    }

    // animatční funkce pro rotaci vinylu
    function rotateVinyl(source) {
        if (!source.audio.paused) {
            source.currentRotation += 0.3;
            updateRotation();
            source.rotationFrame = requestAnimationFrame(rotateVinyl);
        }
    }

    function skipToStart(){
        source.audio.currentTime = 0;
    }

    function skipToEnd(){
        source.audio.currentTime = source.audio.duration;
    }

    source.startButton.addEventListener('click', () => {
        skipToStart();
    })

    source.endButton.addEventListener('click', () => {
        skipToEnd();
    })

    // zastavení otáčení při pozastavení audia
    source.audio.addEventListener('pause', () => {
        cancelAnimationFrame(rotateVinyl);
    });

    // spuštění otáčení při přehrávání
    source.audio.addEventListener('play', () => {
        requestAnimationFrame(rotateVinyl);
    });

    // změna hlasitosti pomocí slideru
    source.volumeSlider.addEventListener('input', () => {
        source.audio.volume = source.volumeSlider.value / 100 ; // převod z procent na 0-1
        source.volumeValue.innerHTML = Math.floor(source.volumeSlider.value) + "%";
    })
})

// funkce pro aktualizaci pozadí slideru podle aktuální hodnoty

function updateSliderBackground(slider) {
    const min = Number(slider.min);
    const max = Number(slider.max);
    const value = Number(slider.value);
    const percent = (max - value) / (max - min) * 100;

    const rootStyles = getComputedStyle(document.documentElement);
    const accentColor = rootStyles.getPropertyValue('--accentColor').trim();
    const highlightColor = rootStyles.getPropertyValue('--highlightColor').trim();
    const accentColorDarker = rootStyles.getPropertyValue('--accentColorDarker').trim();
    const unselectedColor = rootStyles.getPropertyValue('--barelyVisible').trim();

    slider.style.background = `linear-gradient(
        -90deg,
        ${unselectedColor} ${percent}%,
        ${highlightColor} ${percent}%,
        ${accentColor},
        ${accentColorDarker} 100%
    )`;
}

// aktualizace všech sliderů
function updateSlider(){
    sources.forEach(source => {
        source.timeline.value = source.audio.currentTime;
        updateSliderBackground(source.timeline);

    })
}

// získání elementů pro hlasitost
const volumeSlider = document.querySelector('#vol');
const volumeValue = document.querySelector('#volume-value');


// nastavení výchozí hlasitosti na 50%
sources[0].audio.volume = .5;
sources[1].audio.volume = .5;

// výběr EQ presetu
const eqPresets = document.getElementById('eq-presets');

if(eqPresets){
    // nastavení maximální hlasitosti při výběru "max" presetu
    eqPresets.addEventListener('change', () => {
        if(eqPresets.value === 'max'){
            audio.volume = 1;
            volumeSlider.value = 100;
            volumeValue.innerHTML = Math.floor(volumeSlider.value) + "%";
            updateVolSliderBackground(volumeSlider);
            console.log("set to max ", volumeSlider.value);
        }
    })
}

// boolean pro režim jednoho nebo dvou zdrojů
let twoSources = false;

// tlačítka pro přepínání mezi jedním a dvěma zdroji
const source1 = document.querySelector('#source1-toggle');
const source2 = document.querySelector('#source2-toggle');

// root element pro css proměnné
let root = document.querySelector(":root");

const main = document.querySelector("#main");

const secondSourceWrapper = document.querySelector('.second-source');


// přepnutí na režim jednoho zdroje
source1.addEventListener('click', () => {
    twoSources = false;

    main.style.fontSize = "22px";

    oneSourceMode();
    changeEq();

    // dočasné vypnutí animace přechodu
    root.style.setProperty('--transition', "0");
    setTimeout(() => {
        root.style.setProperty('--transition', "0.3s");
    }, 300)
})

// přepnutí na režim dvou zdrojů
source2.addEventListener('click', () => {
    twoSources = true;

    twoSourceMode();

    main.style.fontSize = "18px";

    // dočasné vypnutí animace přechodu
    root.style.setProperty('--transition', "0");
    setTimeout(() => {
        root.style.setProperty('--transition', "0.3s");
    }, 300)
})

// getter pro zjištění aktuálního režimu
function getMode(){
    return !twoSources;
}
export {getMode}

// skrytí eq tlačítek ve výchozím stavu
const eqButtons = document.querySelectorAll('.eq-track-button');
eqButtons.forEach(eqButton => {
    eqButton.style.display = 'none';
    eqButton.style.visibility = 'hidden';
})

// aktivace režimu dvou zdrojů
function twoSourceMode(){
    audio = audio1;

    source2.classList.add('active');
    source1.classList.remove('active');

    volWrapper2.classList.remove('hidden');
    secondSourceWrapper.classList.remove('hidden');

    // zobrazení eq tlačítek
    eqButtons.forEach(eqButton => {
        eqButton.style.display = 'inline-block';
        eqButton.style.visibility = 'visible';
    })
}

// aktivace režimu jednoho zdroje
function oneSourceMode(){
    source1.classList.add('active');
    source2.classList.remove('active');

    volWrapper2.classList.add('hidden');

    secondSourceWrapper.classList.add('hidden');

    // skrytí eq tlačítek
    eqButtons.forEach(eqButton => {
        eqButton.style.display = 'none';
        eqButton.style.visibility = 'hidden';
    })
}

// set pro ukládání stisknutých kláves protzoe automaticky odstraňuje duplikáty
// defaultne javascript nedokáže zpracovat dvě stisknutí naráz, proto je využit set
const keys = new Set();
const keybindsData = 'keybinds.json'

// asynchronní funkce pro načtení klávesových zkratek ze souboru
async function getKeys(){
    const response = await fetch(keybindsData);
    return await response.json();
}

// načtení a aktualizace klávesových zkratek
getKeys().then(data => {
    updateKeys(data);
})

// proměnné pro jednotlivé klávesové zkratky
let playTrack1, playTrack2, playBoth;
let volumeTrack1, volumeTrack2, seekKey, muteKey;
let increaseKey, decreaseKey;
let tempoTrack1, tempoTrack2, tempoReset;
let savedBinds;

// kontrola jestli uživatel má vlastní klávesové zkratky
let userBinds = localStorage.getItem('areBindsUsers');

if(userBinds === "true"){
    savedBinds = JSON.parse(localStorage.getItem("userKeybinds"));
}
// aktualizace klávesových zkratek buď z výchozích nebo uživatelských
function updateKeys(allKeys){
    // použití výchozích zkratek
    if(userBinds !== "true"){
        volumeTrack1 = allKeys["volumeTrack1"]
        volumeTrack2 = allKeys["volumeTrack2"]

        seekKey = allKeys["seek"]
        muteKey = allKeys["mute"]

        increaseKey = allKeys["increase"]
        decreaseKey = allKeys["decrease"]

        playTrack1 = allKeys["playTrack1"]
        playTrack2 = allKeys["playTrack2"]
        playBoth = allKeys["playBothTracks"]

        tempoTrack1 = allKeys["tempoTrack1"]
        tempoTrack2 = allKeys["tempoTrack2"]
        tempoReset = allKeys["tempoReset"]


    } else {
        // použití uživatelských zkratek
        increaseKey = savedBinds.increase
        decreaseKey = savedBinds.decrease

        console.log("increase button", increaseKey)

        volumeTrack1 = savedBinds.volumeTrack1
        volumeTrack2 = savedBinds.volumeTrack2

        seekKey = allKeys["seek"]
        muteKey = allKeys["mute"]

        playTrack1 = savedBinds.playTrack1
        playTrack2 = savedBinds.playTrack2
        playBoth = savedBinds.playBothTracks

        tempoTrack1 = savedBinds.tempoTrack1
        tempoTrack2 = savedBinds.tempoTrack2
        tempoReset = savedBinds.tempoReset
    }
}

const volWrapper = document.querySelector('#volume-slider');

volWrapper.addEventListener('input', () => {
    updateVolSliderBackground(volumeSlider);
});



// event listener pro stisknutí klávesy
document.addEventListener('keydown', (e) => {
    // kontrola jestli není aktivní import aby se předešlo kolizím se zkratkami
    if (getImportState()) {
        console.log("cant use shortcuts");
        return;
    }
    // ovládaní hlasitosti pro jednotlivé tracky ( stopy -_- )

    if(e.code === volumeTrack1){
        keys.add(volumeTrack1);
        console.log("holding: ", volumeTrack1);
        volWrapper.classList.add('active');
    }

    if(e.code === volumeTrack2){
        keys.add(volumeTrack2);
        console.log("holding: ", volumeTrack2);
        volWrapper2.classList.add('active');
    }



    // funkce pro ovládání tempa
    function changeTempo(what, source, reset){
        let originalBPM = source.originalBPM; // originální bpm
        let currentBPM  =  parseInt(source.bpm.innerHTML); // aktuální bpm
        if(!reset){
            if (what === "+"){
                currentBPM += 1; // zvýšení o 1 bpm
            }
            else if(what === "-"){
                currentBPM -= 1 // snížení o 1 BPM
            }

        } else{
            currentBPM = originalBPM; // reset na originální bpm
        }

        source.bpm.innerHTML = currentBPM.toString();
        source.audio.playbackRate = currentBPM / originalBPM; // změna rychlosti přehrávání
    }

    if(e.code === tempoTrack1){
        keys.add(tempoTrack1);
    }
    if(keys.has(tempoTrack1) && e.code === increaseKey){
        changeTempo("+", sources[0], false)
    }

    if(keys.has(tempoTrack1) && e.code === decreaseKey){
        changeTempo("-", sources[0], false)
    }

    if(keys.has(tempoTrack1) && e.code === tempoReset){
        changeTempo("-", sources[0], true)
    }



    if(e.code === tempoTrack2){
        console.log(keys)
        keys.add(tempoTrack2);
    }
    if(keys.has(tempoTrack2) && e.code === increaseKey){
        changeTempo("+", sources[1], false)
    }

    if(keys.has(tempoTrack2) && e.code === decreaseKey){
        changeTempo("-", sources[1], false)
    }

    if(keys.has(tempoTrack2) && e.code === tempoReset){
        changeTempo("-", sources[1], true)
    }





    // VOLUME
    if(keys.has(volumeTrack1) && e.code === increaseKey){
        audio.volume = Math.min(1, Math.max(0, audio.volume + 0.01)); // zajištění hodnoty mezi 0 a 1

        volumeSlider.value = audio.volume * 100;
        updateVolSliderBackground(volumeSlider);
        volumeValue.innerHTML = Math.floor(volumeSlider.value) + "%";
    }

    if(keys.has(volumeTrack1) && e.code === decreaseKey){
        audio.volume = Math.min(1, Math.max(0, audio.volume - 0.01));

        volumeSlider.value = audio.volume * 100;
        updateVolSliderBackground(volumeSlider);
        volumeValue.innerHTML = Math.floor(volumeSlider.value) + "%";
    }

    if(keys.has(volumeTrack2) && e.code === increaseKey){
        sources[1].audio.volume = Math.min(1, Math.max(0, sources[1].audio.volume + 0.01));

        updateVolSliderBackground(sources[1].volumeSlider);
        sources[1].volumeSlider.value = sources[1].audio.volume * 100;
        sources[1].volumeValue.innerHTML = Math.floor(sources[1].volumeSlider.value) + "%";
    }

    if(keys.has(volumeTrack2) && e.code === decreaseKey){
        sources[1].audio.volume = Math.min(1, Math.max(0, sources[1].audio.volume - 0.01));

        updateVolSliderBackground(sources[1].volumeSlider);
        sources[1].volumeSlider.value = sources[1].audio.volume * 100;
        sources[1].volumeValue.innerHTML = Math.floor(sources[1].volumeSlider.value) + "%";
    }

})

// on release remove from set
document.addEventListener('keyup', (e) => {
    if(e.code === volumeTrack1){
        keys.delete(volumeTrack1);
        volWrapper.classList.remove('active');
    }

    if(e.code === volumeTrack2){
        keys.delete(volumeTrack2);
        volWrapper2.classList.remove('active');
    }

    if(e.code === seekKey){
        keys.delete(seekKey);
    }

    if(e.code === tempoTrack1){
        keys.delete(tempoTrack1);
    }

    if(e.code === tempoTrack2){
        keys.delete(tempoTrack2);
    }
});

// event listener pro uvolnění? klávesy a odstranění ze setu
document.addEventListener('keypress', (e) => {
    if (getImportState()) {
        console.log("cant use shortcuts");
        return;
    }

    if(e.code === muteKey){
        audio.muted = !audio.muted; // if audio is muted unmute it and vice versa
        if (audio.muted) {
            vinyl.classList.add('muted');

        } else {
            vinyl.classList.remove('muted');
        }
    } else if (e.code === playTrack1){
        if(sources[0].audio.paused){
            playSource(sources[0].audio, sources[0].playButton)
        } else{
            pauseSource(sources[0].audio, sources[0].playButton)
        }
    } else if (e.code === playTrack2 && twoSources){
        if(sources[1].audio.paused){
            playSource(sources[1].audio, sources[1].playButton)
        } else{
            pauseSource(sources[1].audio, sources[1].playButton)
        }
    } else if(e.code === playBoth && twoSources){
        if(sources[1].audio.paused || sources[0].audio.paused){
            playSource(sources[0].audio, sources[0].playButton)
            playSource(sources[1].audio, sources[1].playButton)
        } else {
            pauseSource(sources[0].audio, sources[0].playButton)
            pauseSource(sources[1].audio, sources[1].playButton)
        }
    }
})

const volWrapper2 = document.querySelector('#volume-slider-2');
const volumeSlider2 = document.querySelector('#vol-2');

volWrapper2.addEventListener('input', (e) => {
    updateVolSliderBackground(volumeSlider2);
});



function updateVolSliderBackground(slider) {
    const min = Number(slider.min);
    const max = Number(slider.max);
    const value = Number(slider.value);
    const percent = (max - value) / (max - min) * 100;

    const rootStyles = getComputedStyle(document.documentElement);
    const accentColor = rootStyles.getPropertyValue('--accentColor').trim();
    const highlightColor = rootStyles.getPropertyValue('--highlightColor').trim();
    const accentColorDarker = rootStyles.getPropertyValue('--accentColorDarker').trim();
    const unselectedColor = rootStyles.getPropertyValue('--barelyVisible').trim();

    slider.style.background = `linear-gradient(
        to top,
        ${unselectedColor} ${percent}%,
        ${highlightColor} ${percent}%,
        ${accentColor},
        ${accentColorDarker} 100%
    )`;
}
updateVolSliderBackground(volumeSlider);
updateVolSliderBackground(volumeSlider2);