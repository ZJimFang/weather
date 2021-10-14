/**
 * @description input value then change the css global variable to set the height
 * @param {Number} value -The larger the value, the more serious the air pollution
 */
function AQI_effect(value) {
    document.documentElement.style.setProperty('--height', value + 'px');
}

/**
 * @description 
 * @param {Number} value -The larger the value, the higher the chance of rain
 */
function rain_effect(value) {
    const rain = document.querySelector('.rain');
    console.log(value);
    if (value > 0) {
        rain.classList.add("rainEffect");
    }
    else {
        rain.classList.remove("rainEffect");
    }
}