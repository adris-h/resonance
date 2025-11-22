const vinylToggle = document.querySelector('.vinyl-toggle input');
const songCover = document.querySelector('.song-cover');

const songCover2 = document.querySelector('.second-source .song-cover');

const vinylButton = document.querySelector('#vinyl-button');
const coverButton = document.querySelector('#cover-button');

const vinylButton2 = document.querySelector('#vinyl2-button');
const coverButton2 = document.querySelector('#cover2-button');




function getVinylState(){
    let savedVinylState = localStorage.getItem('savedVinylState');
    let savedVinyl2State = localStorage.getItem('savedVinyl2State');
    if (!songCover) return;
    if (savedVinylState) {
        if (savedVinylState === "false"){
            coverButton.classList.add('active');
            songCover.classList.remove('vinyl');
            songCover.style.transform = "rotate(0deg)";
        } else {
            vinylButton.classList.add('active');
            songCover.classList.add('vinyl');
        }
    } else{
        vinylButton.classList.add('active');

    }

    if (savedVinyl2State) {
        if (savedVinyl2State === "false"){
            coverButton2.classList.add('active');
            songCover2.classList.remove('vinyl');
            songCover2.style.transform = "rotate(0deg)";
        } else {
            vinylButton2.classList.add('active');
            songCover2.classList.add('vinyl');
        }
    } else{
        vinylButton2.classList.add('active');
    }
  //  console.log("vinyl state on load: ", localStorage.getItem('savedVinylState'));
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('load', getVinylState);
    vinylButton.addEventListener('click', function(){
        vinylButton.classList.add('active');
        coverButton.classList.remove('active');
        songCover.classList.add('vinyl');
        localStorage.setItem('savedVinylState', "true");
      //  console.log("vinyl state: ", localStorage.getItem('savedVinylState'));
    })

    coverButton.addEventListener('click', function(){
        coverButton.classList.add('active');
        vinylButton.classList.remove('active');
        songCover.classList.remove('vinyl');
        songCover.style.transform = "rotate(0deg)";
        localStorage.setItem('savedVinylState', "false");
     //   console.log("vinyl state: ", localStorage.getItem('savedVinylState'));
    })

    vinylButton2.addEventListener('click', function(){
        vinylButton2.classList.add('active');
        coverButton2.classList.remove('active');
        songCover2.classList.add('vinyl');
        localStorage.setItem('savedVinyl2State', "true");
      //  console.log("vinyl state: ", localStorage.getItem('savedVinyl2State'));
    })

    coverButton2.addEventListener('click', function(){
        coverButton2.classList.add('active');
        vinylButton2.classList.remove('active');
        songCover2.classList.remove('vinyl');
        songCover2.style.transform = "rotate(0deg)";
        localStorage.setItem('savedVinyl2State', "false");
      //  console.log("vinyl state: ", localStorage.getItem('savedVinyl2State'));
    })
})


/* if (vinylToggle.checked) {
                songCover.classList.remove('vinyl');
                songCover.style.transform = "rotate(0deg)";
                localStorage.setItem('vinyl', "false");
                console.log("vinyl state: ", localStorage.getItem('vinyl'));
            } else {
                songCover.classList.add('vinyl');
                localStorage.setItem('vinyl', "true");
                console.log("vinyl state: ", localStorage.getItem('vinyl'));
            }

* */

