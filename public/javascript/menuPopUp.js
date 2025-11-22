const menuPopUp = document.querySelector('.user-profile_menu');
const menuButton = document.querySelector('.menu_button');
const menuLinks = document.querySelectorAll('.user-profile_menu a');


let menuActive = false;



if (menuPopUp){
    menuButton.addEventListener('click', () => {
        if (!menuActive) {
            menuActive = true;
            menuPopUp.classList.add('active');
            setTimeout(() => {
                menuLinks.forEach(link => {
                    link.classList.add('active');
                })

            },  200)
        } else{
            menuActive = false;
            menuLinks.forEach(link => {
                link.classList.remove('active');
            })

            setTimeout(() => {
                menuPopUp.classList.remove('active');
            },  200)
        }

        console.log("button clicked");
        //  console.log(menuPopUp.classList);
    })
}

const onClickOutside = (element1, element2, callback) => {
    document.addEventListener('click', e => {
        if (!element1.contains(e.target) && !element2.contains(e.target)) callback();
    });
};

onClickOutside(
    menuPopUp,
    menuButton,
    () => {
        menuPopUp.classList.remove('active')
        menuLinks.forEach(link => {
            link.classList.remove('active');
        })
        menuActive = false;
    }
);



