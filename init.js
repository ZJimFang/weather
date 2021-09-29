//😄😐🙁😷🤧

const items = document.querySelectorAll('.item');
const shows = document.querySelectorAll('.show');

init();
settingImg('sunny');

/**
 * hide all show and set the EventListener to item
 */
function init() {
    shows.forEach(show => {
        show.style.display = "none";
    });
    items.forEach(item => {
        item.addEventListener('click', changeItem)
    });
}

/**
 * according the data choose the wallpaper today 
 * @param {*} wallpaperSrc -wallpaper src 
 */
function settingImg(wallpaperSrc) {
    document.body.style.backgroundImage = `url('./img/wallpaper/${wallpaperSrc}.jpg')`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
}

/**
 * If the user scales the window size, the content should be adaptive
 */
window.onresize = function () {
    if (screen.width <= 768) {
        shows.forEach(show => {
            show.style.display = "";
        })
    } else {
        shows.forEach(show => {
            show.style.display = "none";
        })
    }
}


/**
 * only one show on the screen need to hide others
 */
function changeItem() {
    shows.forEach(show => {
        show.style.display = "none";
        if (this.id == show.id) {
            show.style.display = "";
        }
    })
}