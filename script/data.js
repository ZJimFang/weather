
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
    weekWeather.forEach(element => {
        const option = document.createElement('option');
        option.innerHTML = element.locationName;
        select.appendChild(option);
    });

    show_MiddleWare('新竹縣', weekWeather, AQI);//first time in this application 

    select.addEventListener('change', () => {
        if (document.querySelector(".thunder")) {
            let node = document.querySelector(".thunder");
            node.remove();
        }
        show_MiddleWare(select.value, weekWeather, AQI);
    })
}
