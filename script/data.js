//key CWB-DF43EB11-677B-4A24-9926-DFA8909CC957
//各縣市一周天氣  https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-DF43EB11-677B-4A24-9926-DFA8909CC957&format=JSON
//各縣市36小時天氣報導 https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=https%3A%2F%2Fopendata.cwb.gov.tw%2Fapi%2Fv1%2Frest%2Fdatastore%2FF-D0047-091%3FAuthorization%3DCWB-DF43EB11-677B-4A24-9926-DFA8909CC957%26format%3DJSON
//空汙 "https://data.epa.gov.tw/api/v1/aqx_p_432?api_key=c202e445-80d0-40bb-a134-788865b48beb"



getData();


/**
 * @description fetch the api and turn it to json
 * @property {Object} weekWeatherFetch -weekly weather data from CWB
 * @property {Object} aqiFetch -daily aqi data from CWB
 * @property {Object} aqi -aqi data
 */
function getData() {
    const weekWeatherFetch = fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-DF43EB11-677B-4A24-9926-DFA8909CC957&format=JSON');
    const aqiFetch = fetch('https://data.epa.gov.tw/api/v1/aqx_p_432?api_key=c202e445-80d0-40bb-a134-788865b48beb');
    Promise.all([weekWeatherFetch, aqiFetch])
        //fetch data -> json format
        .then(values => {
            return Promise.all(values.map(value => value.json()));
        })
        .then(([weekWeatherJson, aqiJson]) => {
            //select the array I want
            const weekWeather = weekWeatherJson.records.locations[0].location;
            const aqi = aqiJson.records;
            dataProcess(weekWeather, aqi);//create new aqi data
            forecast(weekWeather);
        })
        .catch(error => console.log(error));
}


/**
 * @description Because the aqi data from CWB is too complicated,
 *              Some locations are subdivided into towns.
 *              As a result, a location may have multiple pieces of data,
 *              so it needs to be aggregated and averaged.
 * @param {Object} weekWeather -weekWeather data
 * @param {Object} aqi -aqi data
 * @property {Object} newAqiFetch -fetch new aqi container (./json/aqi.json)
 * @property {Object} AQI -new aqi container
 * @property {Number} aqiVar -accumulate this data and finally calculate the average
 * @property {Object} matchingLocation -the newly created json and CWB compare the results of the same location
 */
async function dataProcess(weekWeather, aqi) {
    try {
        const newAqiFetch = await fetch('./json/aqi.json');
        const AQI = await newAqiFetch.json();
        AQI.forEach((item) => {
            let aqiVar = 0;
            let matchingLocation = aqi.filter((element) => {
                return element.County == item.Country
            });
            matchingLocation.forEach((item) => {
                aqiVar += parseInt(item.AQI);
            })
            return Object.assign(item, { "AQI": Math.floor(aqiVar / matchingLocation.length) });//assign new data to aqi.json
        })
        return putCityInSelect_And_EventListen(weekWeather, AQI)
    } catch (error) {
        console.log(error)
    }
}

/**
 * @description put location name in select
 * @param {Object} weekWeather -weekWeather data
 * @param {Object} AQI -AQI data(new)
 * @property {Object} select -select DOM select element (id:city) 
 * @property {Object} option -create DOM option element
 */
function putCityInSelect_And_EventListen(weekWeather, AQI) {
    const select = document.querySelector('#city');
    console.log(weekWeather)
    weekWeather.forEach(element => {
        const option = document.createElement('option');
        option.innerHTML = element.locationName;
        select.appendChild(option);
    });

    show_MiddleWare('新竹縣', weekWeather, AQI);//first time in this application 

    select.addEventListener('change', () => {
        show_MiddleWare(select.value, weekWeather, AQI);
    })
}


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
    const MinT_MaxT = document.querySelector('#MinT_MaxT');
    const Wx = document.querySelector('#Wx');

    let WxValue = 0;

    MinT_MaxT.innerHTML = `${location[0].weatherElement[8].time[0].elementValue[0].value}°C 
                            ~ ${location[0].weatherElement[12].time[0].elementValue[0].value}°C`;
    Wx.innerHTML = `${location[0].weatherElement[6].time[0].elementValue[0].value}`;

    //use Wx to setting icon and wallpaper 
    WxValue = parseInt(location[0].weatherElement[6].time[0].elementValue[1].value);
    switch (WxValue) {
        //sunny
        case 1:
            settingImg('sunny')
            break;
        //sunny + cloud
        case 2: case 3:
            settingImg('mostlyCloudy')
            break;
        //cloud
        case 4: case 5: case 6: case 7:
            settingImg('cloud');
            break;
        //rain
        case 8: case 9: case 10: case 11: case 12: case 13: case 14: case 20: case 29:
        case 30: case 31: case 32: case 37:
            settingImg('rain');
            break;
        //thunder + rain
        case 15: case 16: case 17: case 18: case 33: case 34: case 35: case 36:
            settingImg('thunderRain');
            break;
        //sun + rain
        case 19:
            settingImg('sunRain');
            break;
        //sun + thunder + rain
        case 21: case 22:
            settingImg('sunThunderRain');
            break;
        //snow
        case 23: case 41: case 42:
            settingImg('snow');
            break;
        //fog
        case 24: case 25: case 26: case 27: case 28: case 38: case 39:
            settingImg('fog');
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
    const aqi_icon = document.querySelector('.aqi_icon');
    const aqi_data = document.querySelector('.aqi_data');
    let aqi_value = location[0].AQI;
    aqi_data.innerHTML = `${aqi_value}`;
    switch (Math.floor(aqi_value / 50)) {
        case 0:
            aqi_icon.src = `./img/emoji/1.png`;
            break;
        case 1:
            aqi_icon.src = `./img/emoji/2.png`;
            break;
        case 2:
            aqi_icon.src = `./img/emoji/3.png`;
            break;
        case 3:
            aqi_icon.src = `./img/emoji/4.png`;
            break;
        case 4: case 5:
            aqi_icon.src = `./img/emoji/5.png`;
            break;
        case 6: case 7:
            aqi_icon.src = `./img/emoji/5.png`;
            break;
        default:
            alert('Wear your mask up,Now!');
            aqi_icon.src = `./img/emoji/warning.png`;
            break;
    }
}


/**
 * @description according the data choose the img today 
 * @param {String} img -img src 
 */
function settingImg(img) {
    const temp_icon = document.querySelector('.temp_icon');
    temp_icon.src = `./img/icon/${img}.png`;

    document.body.style.backgroundImage = `url('./img/wallpaper/${img}.jpg')`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
}

function forecast(weekWeather) {

}