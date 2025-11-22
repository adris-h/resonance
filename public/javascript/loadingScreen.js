const loadingScreen = document.getElementById("loading-screen");

window.addEventListener('load', function() {
    setTimeout(function(){
        loadingScreen.style.opacity = "0";
        setTimeout(function() {
            loadingScreen.style.display = 'none';
        }, 300)
    }, 500)
})