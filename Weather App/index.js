const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "29d9c5221f96aafc042aa6d89dc595f3";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error.message);
        }
    }
    else{
        displayError("Please enter a city name.");
    }

});

async function getWeatherData(city) {
    const params = new URLSearchParams({
        q: city,
        appid: apiKey,
        units: "imperial"
    });
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${params}`;
    const response = await fetch(apiUrl);
    if(!response.ok){
        if(response.status === 404){
            throw new Error("City not found. Check the spelling and try again.");
        }
        if(response.status === 401){
            throw new Error("Weather service authentication failed. Please check the API key.");
        }
        if(response.status === 429){
            throw new Error("Weather service is busy. Please try again later.");
        }
        throw new Error(`Unable to fetch weather data (HTTP ${response.status}). Please try again.`);
    }
    return await response.json();
}

function displayWeatherInfo(data){
    const{name:city,main:{temp,humidity},weather:[{description,id}]} = data;
    card.textContent="";
    card.style.display="flex";

    const cityDisplay=document.createElement("h1");
    const tempDisplay=document.createElement("p");
    const humidityDisplay=document.createElement("p");
    const descDisplay=document.createElement("p");
    const weatherEmoji=document.createElement("p");

    cityDisplay.textContent=city;
    tempDisplay.textContent=`Temperature: ${temp.toFixed(1)}°F`;
    humidityDisplay.textContent=`Humidity: ${humidity}%`;
    descDisplay.textContent=`Description: ${description}`;
    weatherEmoji.textContent=getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}
function getWeatherEmoji(weatherId){
    switch(true){
        case weatherId>=200 && weatherId<300:
            return "⛈️"; // Thunderstorm
        case weatherId>=300 && weatherId<400:
            return "🌦️"; // Drizzle
        case weatherId>=500 && weatherId<600:
            return "🌧️"; // Rain
        case weatherId>=600 && weatherId<700:
            return "❄️"; // Snow
        case weatherId>=700 && weatherId<800:
            return "🌫️"; // Mist
        case weatherId===800:
            return "☀️"; // Clear
        case weatherId>800 && weatherId<=804:
            return "☁️"; // Clouds
        default:
            return "❓"; // Unknown
    }

}

function displayError(message) {
    const errorDisplay=document.createElement("p");
    errorDisplay.textContent=message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent="";
    card.style.display="flex";
    card.appendChild(errorDisplay);
}