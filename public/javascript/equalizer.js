import {getMode} from "./audioPlay.js";
import {getImportState, setImportState} from "./importSong.js";
import {setDoc, doc, getDocs, collection} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {auth} from "./main.js";


const equalizers = {
    track1: {
        container: document.getElementById('eq1'),
        sliders: document.querySelectorAll('#eq1 .eq-slider'),
        filters: [],
        audio: document.querySelector('.audio'),
        quickBtns: [
            document.querySelector('#eq1 .max-eq'),
            document.querySelector('#eq1 .mid-eq'),
            document.querySelector('#eq1 .min-eq'),
        ]
    },
    track2: {
        container: document.getElementById('eq2'),
        sliders: document.querySelectorAll('#eq2 .eq-slider'),
        filters: [],
        audio: document.querySelector('.audio2'),
        quickBtns: [
            document.querySelector('#eq2 .max-eq'),
            document.querySelector('#eq2 .mid-eq'),
            document.querySelector('#eq2 .min-eq'),
        ]
    }
}

let activeEQ = equalizers.track1;

const eqBands = [
    { freq: 32, sliderID: "slider32" },
    { freq: 64, sliderID: "slider64" },
    { freq: 125, sliderID: "slider125" },
    { freq: 250, sliderID: "slider250" },
    { freq: 500, sliderID: "slider500" },
    { freq: 1000, sliderID: "slider1k" },
    { freq: 2000, sliderID: "slider2k" },
    { freq: 4000, sliderID: "slider4k" },
    { freq: 8000, sliderID: "slider8k" },
    { freq: 16000, sliderID: "slider16k" }
];

const presets = {
    'bass-boosted': [5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
    'jazz': [2, 1, 1, 0, -1, -1, 0, 1, 2, 3],
    'rnb': [6, 6, 5, 1, -2, -1, 1, 1, 3, 3],
    'pop': [-1, 0, 1, 2, 3, 3, 2, 1, 0, -1],
    'flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'max': [12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
};

const audioContext = new AudioContext();

function updateSliderBackground(slider) {
    const min = Number(slider.min);
    const max = Number(slider.max);
    const value = Number(slider.value);
    const percent = (max - value) / (max - min) * 100;

    const rootStyles = getComputedStyle(document.documentElement);
    const accentColor = rootStyles.getPropertyValue('--accentColor').trim();
    const highlightColor = rootStyles.getPropertyValue('--highlightColor').trim();
    const accentColorDarker = rootStyles.getPropertyValue('--accentColorDarker').trim();
    const unselectedColor = '#1c1c1c';

    slider.style.background = `linear-gradient(
        to top,
        ${unselectedColor} ${percent}%,
        ${highlightColor} ${percent}%,
        ${accentColor},
        ${accentColorDarker} 100%
    )`;
}

function initilzieEqualizer(trackName, containerId, audioSelector) {
    const container = document.getElementById(containerId);
    const sliders = container.querySelectorAll('.eq-slider');
    const audioEl = document.querySelector(audioSelector);
    const trackSource = audioContext.createMediaElementSource(audioEl);

    const quickBtns= [
        container.querySelector('.max-eq'),
        container.querySelector('.mid-eq'),
        container.querySelector('.min-eq'),
    ];

    const filters = eqBands.map((band, i) => {
        const filter = audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = band.freq;
        filter.Q.value = 1;
        filter.gain.value = 0;

        const slider = sliders[i];
        const valueDisplay = slider.closest('.band').querySelector('.eq-slider-value');
        valueDisplay.textContent = slider.value;

        slider.addEventListener('input', () => {
            filter.gain.value = parseFloat(slider.value);
            valueDisplay.textContent = slider.value;
            updateSliderBackground(slider);
        });

        return filter;
    });

    // Connect filters
    trackSource.connect(filters[0]);
    for (let i = 0; i < filters.length - 1; i++) {
        filters[i].connect(filters[i + 1]);
    }
    filters[filters.length - 1].connect(audioContext.destination);

    sliders.forEach(slider => updateSliderBackground(slider));
    return { container, sliders, filters, audioEl, trackSource, quickBtns };

}



equalizers.track1 = initilzieEqualizer('track1', 'eq1', '.audio');
equalizers.track2 = initilzieEqualizer('track2', 'eq2', '.audio2');

activeEQ = equalizers.track1;

document.getElementById('source1-button').addEventListener('click', () => {
    activeEQ = equalizers.track1;
    dbClick(activeEQ)
});
document.getElementById('source2-button').addEventListener('click', () => {
    activeEQ = equalizers.track2;
    dbClick(activeEQ)
});

document.addEventListener('click', async () => {
    if (audioContext.state === 'suspended') await audioContext.resume();
});
document.addEventListener('keydown', async e => {
    if (e.code === 'Space' && audioContext.state === 'suspended') await audioContext.resume();
});

const eqPresets = document.querySelectorAll('.eq-presets');
const customOption = document.querySelectorAll('.custom-eq');
const resetBtn = document.querySelectorAll('.reset-eq');

function applyPreset(values) {
    for (const el of customOption) el.style.display = 'none';
    activeEQ.filters.forEach((filter, i) => {
        const slider = activeEQ.sliders[i];
        const valueDisplay = slider.closest('.band').querySelector('.eq-slider-value');
        slider.value = values[i];
        filter.gain.value = values[i];
        valueDisplay.textContent = values[i];
    });
}

function resetEQ() {
    applyPreset(presets.flat);
    eqPresets.forEach(p => p.value = 'flat');

}

//resetBtn.forEach(btn => btn.addEventListener('click', resetEQ));

eqPresets.forEach(eqPreset => {
    eqPreset.addEventListener('change', () => {
        const presetValues = presets[eqPreset.value];
        const container = eqPreset.closest('.eq-settings');
        let eq;
        if(container.id === 'eq1') eq = equalizers.track1;
        if(container.id === 'eq2') eq = equalizers.track2;


        eq.filters.forEach((filter, i) => {
            const slider = eq.sliders[i];
            const valueDisplay = slider.closest('.band').querySelector('.eq-slider-value');
            slider.value = presetValues[i];
            filter.gain.value = presetValues[i];
            valueDisplay.textContent = presetValues[i];
            updateSliderBackground(slider);
        });

        console.log("container: ", container.id)
    });
});

const keybindsData = 'keybinds.json'

async function getKeys(){
    const response = await fetch(keybindsData);
    return await response.json();
}


getKeys().then(data => {
    // console.log(data);
    updateKeys(data);
})

let keys = [];
let increaseKey, decreaseKey, eqKey1, eqKey2;


let checkTrue = localStorage.getItem('areBindsUsers');
let savedBinds = JSON.parse(localStorage.getItem("userKeybinds"));

function updateKeys(data) {
    let allEqBands = data["equalizerBands"];
    keys = Object.values(allEqBands);
    eqKey1 = data["eq1"];
    eqKey2 = data["eq2"];


    if(checkTrue !== "true"){
        increaseKey = data["increase"];
        decreaseKey = data["decrease"];
    } else{
        increaseKey = savedBinds.increase;
        decreaseKey = savedBinds.decrease;
    }

}

const keysPressed = new Set();



document.addEventListener('keydown', (e) => {

    /*console.log("activeEQ.sliders:", activeEQ.sliders);
    console.log("activeEQ.filters:", activeEQ.filters);*/

    if (getImportState()) {
        console.log("cant use shortcuts");
        return;
    }

    keys.forEach((keyCode, index) => {
        if (e.code === keyCode) {
            keysPressed.add(index);
        }
    });

    if (e.code === increaseKey) {
        keysPressed.forEach(i => {
            const slider = activeEQ.sliders[i];
            const filter = activeEQ.filters[i ];
            slider.value = Number(slider.value) + 1
            if (filter) updateSliderAndFilter(slider, filter);


            /*console.log("slider: ", slider, "slider value:", slider.value);
            console.log("filer: ", filter, "filter value:", filter.gain.value)*/
        });

        activeEQ.container.querySelectorAll('.eq-presets').forEach(sel => sel.value = 'custom');
    }

    if (e.code === decreaseKey) {
        keysPressed.forEach(i => {
            const slider = activeEQ.sliders[i];
            const filter = activeEQ.filters[i];
            slider.value = Number(slider.value) - 1
            if (filter) updateSliderAndFilter(slider, filter);
        });

        activeEQ.container.querySelectorAll('.eq-presets').forEach(sel => sel.value = 'custom');
    }
});

document.addEventListener('keyup', (e) => {

    keys.forEach((keyCode, index) => {
        if (e.code === keyCode) {
            keysPressed.delete(index);
        }
    });
});

function updateSliderAndFilter(slider, filter) {
    const value = Number(slider.value);
    filter.gain.value = value;

    const valueDisplay = slider.closest('.band').querySelector('.eq-slider-value');
    valueDisplay.textContent = value;

    updateSliderBackground(slider);
}



function changeSource(activeBtn, inactiveBtn, activeEq, inactiveEq){

    if(!activeBtn.classList.contains('active')) {
        activeBtn.classList.add('active');
        inactiveBtn.classList.remove('active');
    }

    if(!inactiveEq.classList.contains('hidden')) {
        inactiveEq.classList.add('hidden');
        activeEq.classList.remove('hidden');
    }

}


const eq1 = document.querySelector('#eq1');
const eq2 = document.querySelector('#eq2');

const sc1 = document.getElementById('eq-track-button-1');
const sc2 = document.getElementById('eq-track-button-2');


sc1.addEventListener('click', () => {
    activeEQ = equalizers.track1;
    changeSource(sc1, sc2, eq1, eq2)
});

sc2.addEventListener('click', () => {
    activeEQ = equalizers.track2;
    changeSource(sc2, sc1, eq2, eq1)

});

document.addEventListener('keypress', (e) => {

    if (getImportState()) {
        console.log("cant use shortcuts");
        return;
    }

    if(!getMode()){
        if(e.code === eqKey1){
            activeEQ = equalizers.track1;
            changeSource(sc1, sc2, eq1, eq2)
            // console.log("track 1")
        } else if (e.code === eqKey2) {
            activeEQ = equalizers.track2;
            changeSource(sc2, sc1, eq2, eq1)
            // console.log("track 2")
        }
    }
})

function changeEq(){
    activeEQ = equalizers.track1;
    changeSource(sc1, sc2, eq1, eq2)
    // console.log("track 1")
}

export {changeEq}

dbClick(equalizers.track1);
dbClick(equalizers.track2);

function dbClick(eqChosen){
    let quickButtons = eqChosen.quickBtns;

    quickButtons.forEach((button) => {
        button.addEventListener("dblclick", (e) => {
            let targetValue;

            if(button === quickButtons[0]){
                targetValue = 12
            } else if (button === quickButtons[1]){
                targetValue = 0
            } else {
                targetValue = -12
            }

            eqChosen.sliders.forEach((slider, i) => {
                const filter = eqChosen.filters[i];
                slider.value = targetValue;
                filter.gain.value = targetValue;
                updateSliderAndFilter(slider, filter);
            });
        })
    })
}

let userPresets = {}

const saveEQ = document.querySelector('.save-eq');

const presetSaveButtons = document.querySelectorAll('.preset-save-button');
const presetSaveWrapper = document.querySelector('.preset-save');
const closePresetSaveButton = document.querySelector('.close-preset-save');
const presetSaveBcg = document.querySelector('.preset-save-bcg');

const presetSaveNameInput = document.querySelector('#preset-name');

presetSaveButtons.forEach((button) => {
    button.addEventListener("click", () => {
        console.log("?: ", presetSaveBcg.classList.contains('active'));
        const isActive = presetSaveBcg.classList.contains('active');
        if(!isActive) {
            presetSaveBcg.classList.add('active');
            console.log("clicked", presetSaveBcg);
            setImportState(true);
        }

        closePresetSaveButton.addEventListener("click", () => {
            presetSaveBcg.classList.remove('active');
            setImportState(false);


        })
        onClickOutside(presetSaveWrapper, button, () => {
            presetSaveBcg.classList.remove('active')
            setImportState(false);
        } );

        const count = Object.keys(userPresets).length;
        presetSaveNameInput.value = "preset" + (count + 1);


    })
})




saveEQ.addEventListener('click', () => {
    console.log("length: ", presetSaveNameInput.value.length);
    if(presetSaveNameInput.value.length !== 0){
        const sliders = activeEQ.sliders;
        let newPresetName = presetSaveNameInput.value;
        presetSaveNameInput.value = newPresetName;
        userPresets[newPresetName] = {};




        let currentPreset = userPresets[newPresetName];
        sliders.forEach((slider, i) => {
            currentPreset[i] = Number(slider.value);
        })

        console.log(userPresets);

        eqPresets.forEach(preset => {
            preset.add(new Option(newPresetName))
        })
        presets[newPresetName] = Object.values(currentPreset);

        //console.log("values: ", Object.values(currentPreset));



        const eqSliders = activeEQ.sliders
        const presetArray = Array.from(eqSliders, slider => Number(slider.value));
        presets[newPresetName] = presetArray;

        if (Object.keys(userPresets).length > 0) {
            localStorage.setItem('userPresets', JSON.stringify(userPresets));
        }

        presetSaveNameInput.classList.remove('error');

        presetSaveBcg.classList.remove('active');


        onAuthStateChanged(auth, (user) => {
            if (user) {
                setDoc(doc(db, "users", user.uid, "presets", newPresetName),
                    currentPreset
                );
            }
        });

    } else {
        presetSaveNameInput.classList.add('error');
    }
})


onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userPresets = await getDocs(collection(db, "users", user.uid, "presets"));

        userPresets.forEach((docSnap) => {
            const presetName = docSnap.id;
            const presetData = docSnap.data();

            userPresets[presetName] = presetData;
            presets[presetName] = Object.values(presetData);

            eqPresets.forEach(preset => {
                preset.add(new Option(presetName));
            });
        });
    }
});

function onClickOutside(element1, element2, callback){
    document.addEventListener('click', e => {
        console.log("clicked outside");
        if (!element1.contains(e.target) && !element2.contains(e.target)) callback();
    });
}

