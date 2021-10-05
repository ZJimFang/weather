//😄😐🙁😷🤧

const items = document.querySelectorAll('.item');
const shows = document.querySelectorAll('.show');

init();

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