//key CWB-DF43EB11-677B-4A24-9926-DFA8909CC957
//各縣市一周天氣  https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-DF43EB11-677B-4A24-9926-DFA8909CC957&format=JSON
//各縣市36小時天氣報導 https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=https%3A%2F%2Fopendata.cwb.gov.tw%2Fapi%2Fv1%2Frest%2Fdatastore%2FF-D0047-091%3FAuthorization%3DCWB-DF43EB11-677B-4A24-9926-DFA8909CC957%26format%3DJSON
//空汙 "https://data.epa.gov.tw/api/v1/aqx_p_432?api_key=c202e445-80d0-40bb-a134-788865b48beb"
//😄😐🙁😷🤧
const items = document.querySelectorAll('.item');
items.forEach(item => {
    item.addEventListener('click', changeItem)
});

const shows = document.querySelectorAll('.show');
shows.forEach(show => {
    show.style.display = "none";
});

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

function changeItem() {
    shows.forEach(show => {
        show.style.display = "none";
        if (this.id == show.id) {
            show.style.display = "";
        }
    })
}
