//key CWB-DF43EB11-677B-4A24-9926-DFA8909CC957
//各縣市一周天氣  https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-DF43EB11-677B-4A24-9926-DFA8909CC957&format=JSON
//各縣市36小時天氣報導 https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=https%3A%2F%2Fopendata.cwb.gov.tw%2Fapi%2Fv1%2Frest%2Fdatastore%2FF-D0047-091%3FAuthorization%3DCWB-DF43EB11-677B-4A24-9926-DFA8909CC957%26format%3DJSON
//空汙 "https://data.epa.gov.tw/api/v1/aqx_p_432?api_key=c202e445-80d0-40bb-a134-788865b48beb"
getData();


/**
 * @description fetch the api and turn it to json
 * @property {Object} fetch_weekWeather -weekly weather data from CWB
 * @property {Object} fetch_aqi -daily aqi data from CWB
 * @property {Object} aqi -aqi data
 * @property {Object} weekWeather -weekWeather data
 */
function getData() {
    const fetch_weekWeather = fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-DF43EB11-677B-4A24-9926-DFA8909CC957&format=JSON');
    const fetch_aqi = fetch('https://data.epa.gov.tw/api/v1/aqx_p_432?api_key=c202e445-80d0-40bb-a134-788865b48beb');
    Promise.all([fetch_weekWeather, fetch_aqi])
        //fetch data -> json format
        .then(values => {
            return Promise.all(values.map(value => value.json()));
        })
        //select the array I want
        .then(([weekWeather_json, aqi_json]) => {
            const aqi = aqi_json.records;
            const weekWeather = weekWeather_json.records.locations[0].location;
            handleAqiData(aqi);
        })
        .catch(error => console.log(error));
}


/**
 * @ Because the aqi data from CWB is too complicated,
 *              Some locations are subdivided into towns.
 *              As a result, a location may have multiple pieces of data,
 *              so it needs to be aggregated and averaged.
 * @param {Object} aqi -aqi data
 * @property {Object} newAqi_fetch -fetch new aqi container (./json/aqi.json)
 * @property {Object} AQI -new aqi container
 * @property {Number} aqi_var -accumulate this data and finally calculate the average
 * @property {Object} matchingLocation -the newly created json and CWB compare the results of the same location
 *  
 */
async function handleAqiData(aqi) {
    try {
        const newAqi_fetch = await fetch('./json/aqi.json');
        const AQI = await newAqi_fetch.json();
        AQI.forEach((item) => {
            let aqi_var = 0;
            let matchingLocation = aqi.filter((element) => {
                return element.County == item.Country
            });
            matchingLocation.forEach((item) => {
                aqi_var += parseInt(item.AQI);
            })
            return Object.assign(item, { "AQI": Math.floor(aqi_var / matchingLocation.length) });
        })
        console.log(AQI);
    } catch (error) {
        console.log(error)
    }
}


