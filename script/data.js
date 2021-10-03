//key CWB-DF43EB11-677B-4A24-9926-DFA8909CC957
//各縣市一周天氣  https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-DF43EB11-677B-4A24-9926-DFA8909CC957&format=JSON
//各縣市36小時天氣報導 https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=https%3A%2F%2Fopendata.cwb.gov.tw%2Fapi%2Fv1%2Frest%2Fdatastore%2FF-D0047-091%3FAuthorization%3DCWB-DF43EB11-677B-4A24-9926-DFA8909CC957%26format%3DJSON
//空汙 "https://data.epa.gov.tw/api/v1/aqx_p_432?api_key=c202e445-80d0-40bb-a134-788865b48beb"



let weekWeather, AQI;
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
        //select the array I want
        .then(([weekWeatherJson, aqiJson]) => {
            weekWeather = weekWeatherJson.records.locations[0].location;
            const aqi = aqiJson.records;
            console.log(weekWeather)
            handleAqiData(aqi);
            putCityInSelect(weekWeather);
            showWeather()
        })
        .catch(error => console.log(error));
}


/**
 * @description Because the aqi data from CWB is too complicated,
 *              Some locations are subdivided into towns.
 *              As a result, a location may have multiple pieces of data,
 *              so it needs to be aggregated and averaged.
 * @param {Object} aqi -aqi data
 * @property {Object} newAqiFetch -fetch new aqi container (./json/aqi.json)
 * @property {Object} AQI -new aqi container
 * @property {Number} aqiVar -accumulate this data and finally calculate the average
 * @property {Object} matchingLocation -the newly created json and CWB compare the results of the same location
 *  
 */
async function handleAqiData(aqi) {
    try {
        const newAqiFetch = await fetch('./json/aqi.json');
        AQI = await newAqiFetch.json();
        AQI.forEach((item) => {
            let aqiVar = 0;
            let matchingLocation = aqi.filter((element) => {
                return element.County == item.Country
            });
            matchingLocation.forEach((item) => {
                aqiVar += parseInt(item.AQI);
            })
            return Object.assign(item, { "AQI": Math.floor(aqiVar / matchingLocation.length) });
        })
        console.log(AQI);
    } catch (error) {
        console.log(error)
    }
}


/**
 * @description put location name in select
 * @param {Object} weekWeather -weekWeather data
 * @property {Object} select -select DOM select element (id:city) 
 * @property {Object} option -create DOM option element
 */
function putCityInSelect(weekWeather) {
    const select = document.querySelector('#city');
    weekWeather.forEach(element => {
        const option = document.createElement('option');
        option.innerHTML = element.locationName;
        select.appendChild(option);
    });
    select.addEventListener('change', showWeather)
}

/**
 * @description Visualize the data
 * @param {Object} weekWeather -weekWeather data
 * @property {String} select_cityName -value from select eventListener, default:"新竹縣"
 * @property {Object} MinT_MaxT - select DOM span element (id:MinT_MaxT) 
 * @property {Object} Wx - select DOM span element (id:Wx) 
 * @property {Number} WxValue - store Wx value for icon
 * @property {Object} location - find the same location name(select value) in weekWeather
 */
function showWeather() {
    let select_cityName = this.value || '新竹縣';
    const MinT_MaxT = document.querySelector('#MinT_MaxT');
    const Wx = document.querySelector('#Wx');
    let WxValue = 0;
    let location = weekWeather.filter((element) => {
        return element.locationName === select_cityName;
    })
    MinT_MaxT.innerHTML = `${location[0].weatherElement[8].time[0].elementValue[0].value}°C 
                            ~ ${location[0].weatherElement[12].time[0].elementValue[0].value}°C`;

    Wx.innerHTML = `${location[0].weatherElement[6].time[0].elementValue[0].value}`;
    WxValue = parseInt(location[0].weatherElement[6].time[0].elementValue[1].value);
}