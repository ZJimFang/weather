/**
 * @description The middleware that return the location we select match in data then pass the location to
 *              show_Temp(location) show_Rain(location) show_Aqi(location)
 * @param {String} select_value - the city we selected
 * @param {Object} weekWeather - weekWeather data
 * @param {Object} AQI - AQI data
 * @property {String} select_cityName - select_value container
 * @property {String} select_cityName -value from select eventListener, default:"新竹縣"
 * @property {Object} location - find the same location name(select value) in weekWeather
 */
function show_MiddleWare(select_value, weekWeather, AQI) {
    let select_cityName = select_value;
    let weekWeather_location = weekWeather.filter((element) => {
        return element.locationName === select_cityName;
    })
    let AQI_location = AQI.filter((element) => {
        return element.Country === select_cityName;
    })
    show_Temp(weekWeather_location);
    show_forecast(weekWeather_location);
    show_Rain(weekWeather_location);
    show_AQI(AQI_location);
}


/**
 * @description Visualize the temp block
 * @param {Object} location -the city filter from show_MiddleWare
 * @property {Object} MinT_MaxT - select DOM span element (id:MinT_MaxT) 
 * @property {Object} Wx - select DOM span element (id:Wx) 
 * @property {Number} WxValue - store Wx value for icon
 */
function show_Temp(location) {
    const date = new Date();
    const temp_date = document.querySelector('.temp_date');
    const MinT_MaxT = document.querySelector('#MinT_MaxT');
    const Wx = document.querySelector('#Wx');

    let month = date.getMonth() + 1;
    let day = date.getDay() + 3;
    let WxValue = 0;

    temp_date.innerHTML = `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`;
    MinT_MaxT.innerHTML = `${location[0].weatherElement[8].time[0].elementValue[0].value}°C 
                            ~ ${location[0].weatherElement[12].time[0].elementValue[0].value}°C`;
    Wx.innerHTML = `${location[0].weatherElement[6].time[0].elementValue[0].value}`;

    //use Wx to setting icon and wallpaper 
    WxValue = parseInt(location[0].weatherElement[6].time[0].elementValue[1].value);
    judgeIcon('today', WxValue);
}

/**
 * find the forecast(5day) data 
 * pass it to judgeIcon() to select the right weather icon
 * @param {Object} location
 * @property {Number} WxValue -Wx value  
 * @property {Object} date -Date Object
 * @property {Object} forecast_date -select DOM div element
 */
function show_forecast(location) {
    console.log(location)
    const date = new Date();
    const forecast_date = document.querySelectorAll('.forecast_date');
    const forecast_T = document.querySelectorAll('.forecast_T');
    let month = date.getMonth() + 1;
    let day = date.getDay() + 4;
    for (let index = 0; index < 5; index++) {
        let WxValue = parseInt(location[0].weatherElement[6].time[index * 2 + 2].elementValue[1].value);
        forecast_date[index].innerHTML = `${month < 10 ? '0' + month : month}/${day + index < 10 ? '0' + (day + index) : (day + index)}`;
        forecast_T[index].innerHTML = `${location[0].weatherElement[1].time[index * 2 + 2].elementValue[0].value}°C`;
        judgeIcon('forecast', WxValue);
    }
}

/**
 * @description According the Wx value choose the Img
 * pass it to settingImg() to setting
 * @param {String} information -Convenient to pass to the settingImg() when it is time to divert
                                'today':to set today's icon and wallpaper
                                'forecast':to set forecast icon
                                'AQI':to set AQI icon
 * @param {Number} WxValue -from weekWeather data 
 */
function judgeIcon(information, WxValue) {
    switch (WxValue) {
        //sunny
        case 1:
            settingImg(information, 'sunny')
            break;
        //sunny + cloud
        case 2: case 3:
            settingImg(information, 'mostlyCloudy')
            break;
        //cloud
        case 4: case 5: case 6: case 7:
            settingImg(information, 'cloud');
            break;
        //rain
        case 8: case 9: case 10: case 11: case 12: case 13: case 14: case 20: case 29:
        case 30: case 31: case 32: case 37:
            settingImg(information, 'rain');
            break;
        //thunder + rain
        case 15: case 16: case 17: case 18: case 33: case 34: case 35: case 36:
            settingImg(information, 'thunderRain');
            break;
        //sun + rain
        case 19:
            settingImg(information, 'sunRain');
            break;
        //sun + thunder + rain
        case 21: case 22:
            settingImg(information, 'sunThunderRain');
            break;
        //snow
        case 23: case 41: case 42:
            settingImg(information, 'snow');
            break;
        //fog
        case 24: case 25: case 26: case 27: case 28: case 38: case 39:
            settingImg(information, 'fog');
            break;
        default:
            break;
    }
}

/**
 * @description Visualize the rain block
 * @param {Object} location -the city filter from show_MiddleWare
 * @property {Object} chanceOfRain - select DOM div element
*/
function show_Rain(location) {
    const chanceOfRain = document.querySelector('.chanceOfRain');
    chanceOfRain.innerHTML = `${location[0].weatherElement[0].time[0].elementValue[0].value}%`;
}


/**
 * @description Visualize the AQI block
 * @param {Object} location -the city filter from show_MiddleWare
 * @property {Object} aqi_icon - select DOM div element
 * @property {Object} aqi_data - select DOM div element
 * @property {Number} aqi_value -this location's aqi value
*/
function show_AQI(location) {
    const aqi_data = document.querySelector('.aqi_data');
    let aqi_value = location[0].AQI;
    aqi_data.innerHTML = `${aqi_value}`;
    switch (Math.floor(aqi_value / 50)) {
        case 0:
            settingImg('AQI', 1);
            AQI_effect(0);
            break;
        case 1:
            settingImg('AQI', 2);
            AQI_effect(42);
            break;
        case 2:
            settingImg('AQI', 3);
            AQI_effect(84);
            break;
        case 3:
            settingImg('AQI', 4);
            AQI_effect(126);
            break;
        case 4: case 5:
            settingImg('AQI', 5);
            AQI_effect(170);
            break;
        case 6: case 7:
            settingImg('AQI', 5);
            AQI_effect(212);
            break;
        default:
            alert('Wear your mask up,Now!');
            settingImg('AQI', 'warning');
            AQI_effect(250);
            break;
    }
}


/**
 * @description according the data choose the img
 * @param {String} information -'today':to set today's icon and wallpaper
                                'forecast':to set forecast icon
                                'AQI':to set AQI icon
 * @param {String} img -img src 
 * @property {Object} temp_icon -select DOM div element
 * @property {Object} aqi_icon -select DOM div element
 * @property {Object} forecast_icon -select DOM div element
 */
let i = 0;//to count the forecast_icon index to 5 will return 0
function settingImg(information, src) {
    if (information === 'today') {
        const temp_icon = document.querySelector('.temp_icon');
        temp_icon.src = `./img/icon/${src}.png`;

        document.body.style.backgroundImage = `url('./img/wallpaper/${src}.jpg')`;
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
    }
    else if (information === 'AQI') {
        const aqi_icon = document.querySelector('.aqi_icon');
        aqi_icon.src = `./img/AQI/${src}.png`;
    }
    else if (information === 'forecast') {
        const forecast_icon = document.querySelectorAll('.forecast_icon');
        forecast_icon[i].src = `./img/icon/${src}.png`;
        i++;
        i === 5 ? i = 0 : i;
    }
}