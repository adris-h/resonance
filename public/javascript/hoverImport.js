const hoverElement = document.getElementById('song-name_hover');
const popUpElement = document.getElementById('song-choice_pop-up');


const onMoveOutside = (element1, element2, callback) => {
    document.addEventListener('mouseout', e => {
        if (!element1.contains(e.target) && !element2.contains(e.target)) callback();
    });
};

const elementY = hoverElement.getBoundingClientRect().y - 20;
if (hoverElement) {
    hoverElement.addEventListener("mouseover",(e) => {
        if(!popUpElement.classList.contains('active')){
            popUpElement.classList.add('active');

            const xCord = e.clientX;
            const yCord = e.clientY - 20; //e.clientY elementY
            popUpElement.style.transform = `translate(${xCord}px, ${yCord}px)`;
        }
    })

    onMoveOutside(
        hoverElement,
        popUpElement,
        () => {
            popUpElement.classList.remove('active');
        }
    )
}


