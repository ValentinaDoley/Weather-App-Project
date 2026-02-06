
const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "48c13817ea94f2896436b161f6832664";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault(); // to prevent the default form submission behavior of refreshing

    const city = cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city); //pauses until getweatherdata gets the 'city' (until the promise is settled)
            displayWeatherInfo(weatherData);//returns the value after the promise resolves
        }
        catch(error){ //if promise rejects
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city.")
    }
});

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`; // to fetch the weather data

    const response = await fetch(apiUrl); // each await func will pause the execution of the async funtion until the promise it's awaiting is resolved.
   
    if(!response.ok){
        throw new Error("Could not fetch weather data");
    }

    return await response.json(); // return/await our object converted to json format
}

function displayWeatherInfo(data){
    //object destructuring to access data within an object
    const {name: city,
           main:{temp, humidity}, 
           weather: [{description, id}]} = data; // double object destructuring for accessing weather's array of objects
    
    card.textContent = ""; //to display the card
    card.style.display = "flex";
// create elements now
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    // to change the text content of each elements
    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

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
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️"; //thunderstorm
        case (weatherId >= 300 && weatherId < 400):
            return "🌦️"; //drizzle
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️"; //rain
        case (weatherId >= 600 && weatherId < 700):
            return "❄️"; //snow
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️"; //atmosphere (fog, mist, etc.)
        case (weatherId === 800):
            return "☀️"; //clear sky
        case (weatherId > 801 && weatherId < 900):
            return "☁️"; //clouds
        default:
            return "❓"; //unknown weather condition
    }
}

function displayError(message){
    const errorDisplay = document.createElement("p"); //create a new paragraph element
    errorDisplay.textContent = message; // =to the parameter
    errorDisplay.classList.add("errorDisplay"); // to add css class

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay); // append the element p as a child of the parent container(card)
}