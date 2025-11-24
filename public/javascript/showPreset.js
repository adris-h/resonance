export function showPresets(user, presets, profilePosts){
    console.log("done: ", user, presets, profilePosts);
    let userPresets = {};
    profilePosts.innerHTML = '';

    presets.forEach((preset) => {
        const presetName = preset.id;
        const presetData = preset.data();
        userPresets[presetName] = user === "likes" ? presetData.presetData : presetData;

        let calculatedHeight;
        let min = -12;
        let max = 12;
        let spans = '';

        Object.keys(userPresets[presetName]).forEach(key => {
            const value = userPresets[presetName][key];
            calculatedHeight = (value - min) / (max - min) * 100;
            spans += `<span><span class="slider-value" style="height: ${calculatedHeight}%"></span></span>`;
        });

        console.log(userPresets);

        if(user === "searchedUser"){
            if (profilePosts.lastElementChild) {
                document.querySelector(".preset:nth-child(1)").insertAdjacentHTML('beforebegin',
                    `<div class="preset" id="${presetName}">
                        <div class="preset-showcase">
                            ${spans}
                        </div>
                        <div class="preset-name">
                            <span>${presetName}</span>
                            <span>
                                <span class="preset-settings">
                                    <a class="like-preset-button"><i></i> like </a>
                                    <a class="save-preset-button">save to presets</a>
                                </span>
                            :</span>
                        </div>
                    </div>`
                );
            } else {
                profilePosts.innerHTML +=
                    `<div class="preset" id="${presetName}">
                        <div class="preset-showcase">
                            ${spans}
                        </div>
                        <div class="preset-name">
                            <span>${presetName}</span>
                            <span>
                                <span class="preset-settings">
                                    <a class="like-preset-button"><i></i> like </a>
                                    <a class="save-preset-button">save to presets</a>
                                </span>
                            :</span>
                        </div>
                    </div>`;
            }
        } else if (user === "user"){
            if (profilePosts.lastElementChild) {
                document.querySelector(".preset:nth-child(1)").insertAdjacentHTML('beforebegin',
                    `<div class="preset" id="${presetName}">
                        <div class="preset-showcase">
                            ${spans}
                        </div>
                        <div class="preset-name">
                            <span>${presetName}</span>
                            <span>
                                <span class="preset-settings">
                                    <a class="delete-preset-button"><i></i> delete </a>
                                    <a class="edit-preset-button">edit</a>
                                </span>
                            :</span>
                        </div>
                    </div>`
                );
            } else {
                profilePosts.innerHTML +=
                    `<div class="preset" id="${presetName}">
                        <div class="preset-showcase">
                            ${spans}
                        </div>
                        <div class="preset-name">
                            <span>${presetName}</span>
                            <span>
                                <span class="preset-settings">
                                    <a class="delete-preset-button"><i></i> delete </a>
                                    <a class="edit-preset-button">edit</a>
                                </span>
                            :</span>
                        </div>
                    </div>`;
            }
        } else {
            if (profilePosts.lastElementChild) {
                document.querySelector(".preset:nth-child(1)").insertAdjacentHTML('beforebegin',
                    `<div class="preset" id="${presetName}">
                        <div class="preset-showcase">
                            ${spans}
                        </div>
                        <div class="preset-name">
                            <span>${presetName}</span>
                            <span>
                                <span class="preset-settings">
                                    <a class="dislike-button"><i></i> dislike </a>
                                </span>
                            :</span>
                        </div>
                    </div>`
                );
            } else {
                profilePosts.innerHTML +=
                    `<div class="preset" id="${presetName}">
                        <div class="preset-showcase">
                            ${spans}
                        </div>
                        <div class="preset-name">
                            <span>${presetName}</span>
                            <span>
                                <span class="preset-settings">
                                    <a class="dislike-button"><i></i> dislike </a>
                                </span>
                            :</span>
                        </div>
                    </div>`;
            }
        }
    });
}