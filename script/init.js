//😄😐🙁😷🤧

const items = document.querySelectorAll('.item');
const shows = document.querySelectorAll('.show');

init();
settingImg('sunny');

/**
 * @description If the user scales the window size or different size scree, the content should be adaptive
 */
let contentAdaptive = () => {
    if (document.body.clientWidth <= 768) {
        shows.forEach(show => {
            show.style.display = "";
        })
    } else {
        shows.forEach(show => {
            show.style.display = "none";
        })
    }
}
contentAdaptive();
window.onresize = contentAdaptive;

/**
 * @description hide all show and set the EventListener to item
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
 * @description according the data choose the wallpaper today 
 * @param {String} wallpaperSrc -wallpaper src 
 */
function settingImg(wallpaperSrc) {
    document.body.style.backgroundImage = `url('./img/wallpaper/${wallpaperSrc}.jpg')`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
}

/**
 * @description only one show on the screen need to hide others
 */
function changeItem() {
    shows.forEach(show => {
        show.style.display = "none";
        if (this.id == show.id) {
            show.style.display = "";
        }
    })
}