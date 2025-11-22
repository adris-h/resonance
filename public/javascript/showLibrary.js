const libBtn = document.getElementById("lib-btn");
const library = document.getElementById("song-library");

let libActive = false;

libBtn.addEventListener("click", () =>{
    if(libActive){
       hideLibrary();

    } else{
        libActive = true;
        library.classList.add("active");
        libBtn.classList.add("active");
    }
   // console.log("library: ", libActive);
})



function hideLibrary(){
    libActive = false;
    library.classList.remove("active");
    // console.log("library: ", libActive);
    libBtn.classList.remove("active");
}

export {hideLibrary};

onClickOutside(libBtn, library, hideLibrary);

function onClickOutside(element1, element2, callback){
    document.addEventListener('click', e => {
        if (!element1.contains(e.target) && !element2.contains(e.target)) callback();
    });
}
