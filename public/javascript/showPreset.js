export function showPresets(user, presets, profilePosts){
    console.log("done: ", user, presets, profilePosts);
    let userPresets = {};
    profilePosts.innerHTML = '';

    presets.forEach((preset) => {
        console.log(preset.id);
        const presetName = preset.id;
        const presetData = preset.data();
        userPresets[presetName] = user === "likes" ? presetData.presetData.presetValues : presetData.presetValues;


        let calculatedHeight;
        let min = -12;
        let max = 12;
        let spans = '';

        if (!userPresets[presetName]) {
            console.error("skipping preset - no data:", presetName);
            return;
        }

        Object.keys(userPresets[presetName]).forEach(key => {
            const value = userPresets[presetName][key];
            calculatedHeight = (value - min) / (max - min) * 100;
            spans += `<span><span class="slider-value" style="height: ${calculatedHeight}%"></span></span>`;
        });

        if(user === "searchedUser"){
            profilePosts.innerHTML +=
                `<div class="preset" id="${presetName}">
                        <div class="preset-showcase">
                            ${spans}
                        </div>
                        <div class="preset-name">
                            <span>${presetName}</span>
                            <button class="heart like-preset-button">
                                <?xml version="1.0" encoding="UTF-8" standalone="no"?>
                                <svg width="100%" height="100%" viewBox="0 0 11 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                                    <rect x="3" y="3" width="1" height="1"/>
                                    <g transform="matrix(1,0,0,1,1,0)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,-1,1)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,-1,2)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,0,3)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,1,4)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,2,5)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,2,1)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,3,0)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,4,0)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,5,1)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,5,2)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,4,3)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,3,4)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                </svg>

                           </button>
                        </div>
                    </div>`;
        } else if (user === "user"){
            profilePosts.innerHTML +=
                `<div class="preset" id="${presetName}">
                        <div class="preset-showcase">
                            ${spans}
                        </div>
                        <div class="preset-name">
                            <span>${presetName}</span>
                            <button class="delete delete-preset-button" >
                           <?xml version="1.0" encoding="UTF-8" standalone="no"?>
                            
                            <svg width="100%" height="100%" viewBox="0 0 3 3" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                                <g transform="matrix(1,0,0,1,-1,-1)">
                                    <g transform="matrix(1,0,0,1,-3,-3)">
                                        <g transform="matrix(1,0,0,1,4,3)">
                                            <rect x="1" y="2" width="1" height="1"/>
                                        </g>
                                        <g transform="matrix(1,0,0,1,3,2)">
                                            <rect x="1" y="2" width="1" height="1"/>
                                        </g>
                                        <g transform="matrix(1,0,0,1,5,2)">
                                            <rect x="1" y="2" width="1" height="1"/>
                                        </g>
                                        <g transform="matrix(1,0,0,1,5,2)">
                                            <rect x="1" y="2" width="1" height="1"/>
                                        </g>
                                        <g transform="matrix(1,0,0,1,5,4)">
                                            <rect x="1" y="2" width="1" height="1"/>
                                        </g>
                                        <g transform="matrix(1,0,0,1,3,4)">
                                            <rect x="1" y="2" width="1" height="1"/>
                                        </g>
                                    </g>
                                </g>
                            </svg>



                            </button>
                        </div>
                    </div>`;
        } else if (user === "likes"){
            profilePosts.innerHTML +=
                `<div class="preset" id="${presetName}">
                        <div class="preset-showcase">
                            ${spans}
                        </div>
                        <div class="preset-name">
                            <span>${presetData.presetName}</span>
                            <button class="heart dislike-button" >
                               <?xml version="1.0" encoding="UTF-8" standalone="no"?>
                                <svg width="100%" height="100%" viewBox="0 0 11 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                                    <rect x="3" y="3" width="1" height="1"/>
                                    <g transform="matrix(1,0,0,1,1,0)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,-1,1)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,-1,2)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,0,3)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,1,4)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,2,5)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,2,1)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,3,0)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,4,0)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,5,1)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,5,2)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,4,3)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(2,0,0,2,0,-2)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(2,0,0,2,-3,-2)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(3,0,0,2,-5,-1)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,3,4)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                    <g transform="matrix(1,0,0,1,2,4)">
                                        <rect x="3" y="3" width="1" height="1"/>
                                    </g>
                                </svg>

                            </button>
                        </div>
                    </div>`;
        }
    });
}