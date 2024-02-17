const imageURL = "https://picsum.photos/1280/720";
const key = "9c398bd4558d0637b56867dcdcada4c4";
// API 호출 방법
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// 도시명으로 찾는 방법
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

async function setRenderBackground() {
    // image는 가져올 때 responseType: "blob"을 추가해줘야 한다.
    const response = await axios.get(imageURL, {responseType: "blob"});
    const body = document.querySelector("body");
    body.style.transition = `all ease 2s 2s`;
    body.style.backgroundImage = `url(${URL.createObjectURL(response.data)})`;
}

function getTimeString(val) {
    if (parseInt(val / 10) > 0) return `${val}`;
    else return `0${val}`;
}

function setTime() {
    const timer = document.querySelector(".timer");
    const timerContent = document.querySelector(".timer-content");
    setInterval(() => {
        const date = new Date();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        timer.textContent = `${getTimeString(hour)}:${getTimeString(minute)}:${getTimeString(second)}`;
        //if (hour)
    });
}

function getMemo() {
    const memo = document.querySelector(".memo");
    const memoValue = localStorage.getItem("todo");
    memo.textContent = memoValue;
}

function setMemo() {
    const memoInput = document.querySelector(".memo-input");
    memoInput.addEventListener("keyup", (e) => {
        if (e.code === "Enter" && e.currentTarget.value) {
            localStorage.setItem("todo", e.currentTarget.value);
            getMemo();

            memoInput.value = "";
        }
    });
}

function deleteMemo() {
    const memo = document.querySelector(".memo");
    memo.addEventListener("click", (e) => {
        localStorage.removeItem("todo");
        e.target.textContent = "";
    })
}

function getPosition(options) {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);        
    });
}

async function renderWeather() {

    let latitude = null;
    let longitude = null;

    try {
        const position = await getPosition();
        console.log(position);
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    } catch (error) {

    }

    // 위도, 경도가 들어오거나 둘 다  null로 들어가거나
    const weatherData = await getWeatherData(latitude, longitude);
    console.log(weatherData);
    const weatherList = weatherData.list.filter(cur => cur.dt_txt.indexOf("18:00:00") > 0);
    console.log(latitude, longitude);


    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = weatherList
    .map(e => weatherWrapperComponent(e))
    .join("");
}

function weatherWrapperComponent(e) {
    console.log(e);
}

function matchIcon(weatherData) {
    if (weatherData === "Clear") return "./images/039-sun.png";
    if (weatherData === "Clouds") return "./images/001-cloud.png";
    if (weatherData === "Rain") return "./images/003-rainy.png";
    if (weatherData === "Snow") return "./images/006-snowy.png";
    if (weatherData === "Thunderstorm") return "./images/008-storm.png";
    if (weatherData === "Drizzle") return "./images/031-snowflake.png";
    if (weatherData === "Atmosphere") return "./images/033-hurricane.png";
}

function changeToCelsius(temp) {
    return (temp - 273.15).toFixed(1);
}

function weatherWrapperComponent(e) {
    return `
        <div class="card bg-transparent flex-grow-1 m-2">
            <div class="card-header text-white text-center">
                ${e.dt_txt.split(" ")[0]}
            </div>
            <div class="card-body d-flex">
                <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                    <h5 class="card-title text-white">${e.weather[0].main}</h5>
                    <img class="weather-img" src="${matchIcon(e.weather[0].main)}">
                    <p class="card-text text-white">${changeToCelsius(e.main.temp)}˚</p>
                </div>
            </div>
        </div>
    `
}

async function getWeatherData(latitude, longitude) {
    let response;
    if (latitude && longitude) {
        const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`;
        response = await axios.get(url);
    } else {
        const url = `http://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=${key}`;
        response = await axios.get(url);
    }

    return response.data;
}


setRenderBackground();
setTime();
getMemo();
setMemo();
deleteMemo();
renderWeather();

setInterval(() => {
    setRenderBackground();
}, 5500);