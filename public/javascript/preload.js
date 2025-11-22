const imagePaths = [
    "../imgs/song-covers/asphinal-cover-webp",
    "../imgs/song-covers/downfall-cover-webp",
    "../imgs/song-covers/ifelt-cover-webp",
    "../imgs/song-covers/nowisit-cover-webp",
    "../imgs/song-covers/downfall-album-cover-webp",
    "../imgs/song-covers/yggdrasil-cover-webp",
    "../imgs/song-covers/white-cat-cover-webp",
];

function preload(images) {
    for (let i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}


preload(imagePaths);