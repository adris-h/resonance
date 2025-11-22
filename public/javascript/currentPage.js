const accountLink = document.querySelector('.account-link');
const profileLink = document.querySelector('.profile-link');
const themesLink = document.querySelector('.theme-link');
const projectLink = document.querySelector('.project-link');
const creatorLink = document.querySelector('.creator-link');
const keybindslink = document.querySelector('.key-link');

let path = window.location.pathname;
if (path.includes('account.html')) {
    accountLink.classList.add('active');
    profileLink.classList.remove('active');
    themesLink.classList.remove('active');
    projectLink.classList.remove('active');
    creatorLink.classList.remove('active');
    keybindslink.classList.remove('active');
}

if (path.includes('theme.html')) {
    accountLink.classList.remove('active');
    profileLink.classList.remove('active');
    themesLink.classList.add('active');
    projectLink.classList.remove('active');
    creatorLink.classList.remove('active');
    keybindslink.classList.remove('active');
}

if (path.includes('profile.html')) {
    accountLink.classList.remove('active');
    profileLink.classList.add('active');
    themesLink.classList.remove('active');
    projectLink.classList.remove('active');
    creatorLink.classList.remove('active');
    keybindslink.classList.remove('active');
}

if (path.includes('about-creator.html')) {
    accountLink.classList.remove('active');
    profileLink.classList.remove('active');
    themesLink.classList.remove('active');
    projectLink.classList.remove('active');
    creatorLink.classList.add('active');
    keybindslink.classList.remove('active');
}
if (path.includes('about-project.html')) {
    accountLink.classList.remove('active');
    profileLink.classList.remove('active');
    themesLink.classList.remove('active');
    projectLink.classList.add('active');
    creatorLink.classList.remove('active');
    keybindslink.classList.remove('active');
}

if (path.includes('keybinds.html')) {
    accountLink.classList.remove('active');
    profileLink.classList.remove('active');
    themesLink.classList.remove('active');
    projectLink.classList.remove('active');
    creatorLink.classList.remove('active');
    keybindslink.classList.add('active');
}