const API_KEY = '52d48b7e51f03b6318f262318ce1e18f';
const API_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';

const cityinput = document.getElementById('cityinput');
const searchbtn = document.getElementById('searchbtn');
const errorMessage = document.getElementById('error-msg');
const weatherDisplay = document.getElementById('weather-display');

const weatherIcons = {
    'Clear': 'fa-sun',
    'Clouds': 'fa-cloud',
    'Rain': 'fa-cloud-showers-heavy',
    'Thunderstorm': 'fa-bolt',
    'Snow': 'fa-snowflake',
    'Mist': 'fa-smog',
    'Haze': 'fa-smog'
};

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

async function fetchweather(cityname) {
    if (!cityname || cityname.trim() === '') {
        showError("Please enter a city name");
        return;
    }

    hideError();

    try {
        const weatherurl = `${API_ENDPOINT}?q=${cityname}&appid=${API_KEY}&units=metric`;
        const response = await fetch(weatherurl);

        if (!response.ok) {
            if (response.status === 404) throw new Error('City not found');
            if (response.status === 401) throw new Error('Invalid API key');
            if (response.status === 429) throw new Error('API rate limit exceeded');
            if (response.status >= 500) throw new Error('Server error');
            throw new Error('Error fetching weather');
        }

        const data = await response.json();
        displayweatherdata(data);

    } catch (error) {
        showError(error.message);
    }
}

function displayweatherdata(data) {
    weatherDisplay.classList.remove('hidden');

    document.getElementById('location').textContent =
        `${data.name}, ${data.sys.country}`;

    document.getElementById('date-time').textContent =
        new Date().toLocaleString();

    document.getElementById('description').textContent =
        data.weather[0].description;

    document.getElementById('temperature-label').textContent =
        `${Math.round(data.main.temp)} °C`;

    document.getElementById('humidity').textContent =
        `${data.main.humidity}%`;

    document.getElementById('windspeed').textContent =
        `${data.wind.speed} m/s`;

    //Update icon
    const condition = data.weather[0].main;
    const iconClass = weatherIcons[condition] || 'fa-cloud';

    const iconElement = document.querySelector('.weather-icon');
    iconElement.className = `weather-icon fas ${iconClass}`;

    // Update background
    updateBackground(condition);
}

function updateBackground(condition) {
    const gradients = {
        'Clear': ['#FFD700', '#FF8C00'],
        'Clouds': ['#7F7FD5', '#86A8E7'],
        'Rain': ['#005C97', '#363795'],
        'Thunderstorm': ['#232526', '#414345'],
        'Snow': ['#83A4D4', '#B6FBFF'],
        'Mist': ['#606C88', '#3F4C6B'],
        'Haze': ['#606C88', '#3F4C6B']
    };

    const colors = gradients[condition] || ['#bdc3c7', '#2c3e50'];

    document.body.style.background =
        `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`;
}


searchbtn.addEventListener('click', () => {
    fetchweather(cityinput.value);
});

cityinput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchweather(cityinput.value);
    }
});
