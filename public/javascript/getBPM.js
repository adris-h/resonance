 function getBPM( audioElements ){
        //console.log('audio.src: ', audioElement.src);
         const beatDetect = new BeatDetect({
        sampleRate: 44100, // Most track are using this sample rate
        log: false, // Debug BeatDetect execution with logs
        perf: false, // Attach elapsed time to result object
        round: false, // To have an integer result for the BPM
        float: 1, // The floating precision in [1, Infinity]
        /*
        * lowPassFreq: 150, // Low pass filter cut frequency
        highPassFreq: 100, // High pass filter cut frequency
        * */
        bpmRange: [90, 180], // The BPM range to output
        timeSignature: 4 // The number of beat in a measure
    });

        for(const audioElement of audioElements){


            beatDetect.getBeatInfo({
                url: audioElement.audio.src
            }).then(info => {
                audioElement.bpmSpan.innerHTML = info.bpm;
                console.log("bpm: ", info.bpm);
                return info.bpm;
            });

            console.log("audio detect: ", audioElement.audio.src);
        }


}

 export {getBPM}