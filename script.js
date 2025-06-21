const API_KEY = '5df6412bf9232feaa6a190977e1c4c0b';
const WEATHERSTACK_API = 'http://api.weatherstack.com';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cityElement = document.getElementById('city-name');
const dateElement = document.getElementById('date-time');
const tempElement = document.getElementById('temp');
const weatherIconElement = document.getElementById('weather-icon');
const weatherDescElement = document.getElementById('weather-desc');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const feelsLikeElement = document.getElementById('feels-like');
const precipitationElement = document.getElementById('precipitation');
const uvIndexElement = document.getElementById('uv-index');
const visibilityElement = document.getElementById('visibility');

// Weather icons mapping
const weatherIcons = {
    'sunny': '<i class="fas fa-sun"></i>',
    'partly cloudy': '<i class="fas fa-cloud-sun"></i>',
    'cloudy': '<i class="fas fa-cloud"></i>',
    'rain': '<i class="fas fa-cloud-rain"></i>',
    'thunderstorm': '<i class="fas fa-bolt"></i>',
    'snow': '<i class="fas fa-snowflake"></i>',
    'mist': '<i class="fas fa-smog"></i>',
    'fog': '<i class="fas fa-smog"></i>',
    'default': '<i class="fas fa-cloud"></i>'
};

// Format date and time
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get weather icon based on description
function getWeatherIcon(description) {
    const condition = description.toLowerCase();
    for (let key in weatherIcons) {
        if (condition.includes(key)) {
            return weatherIcons[key];
        }
    }
    return weatherIcons.default;
}

// Update weather icon element
function updateWeatherIcon(iconHtml) {
    const iconElement = document.getElementById('weather-icon');
    iconElement.innerHTML = iconHtml;
}

// Update weather display
async function updateWeather(city) {
    try {
        const weatherCard = document.querySelector('.weather-card');
        
        // Show loading state
        weatherCard.innerHTML = `
            <div class="location-info">
                <div class="city-name">Loading...</div>
                <div class="date-time">Loading...</div>
            </div>
            <div class="main-weather">
                <div class="temperature">--°C</div>
                <div class="weather-details-grid">
                    <div class="weather-icon"></div>
                    <div class="weather-desc">
                        <p>Loading...</p>
                        <div class="feels-like">
                            <i class="fas fa-temperature-half"></i>
                            <span>Feels like --°C</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="additional-info">
                <div class="info-grid">
                    <div class="info-item">
                        <i class="fas fa-tint"></i>
                        <div class="info-value">--%</div>
                        <div class="info-label">Humidity</div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-wind"></i>
                        <div class="info-value">-- km/h</div>
                        <div class="info-label">Wind</div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-cloud-rain"></i>
                        <div class="info-value">--%</div>
                        <div class="info-label">Precipitation</div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-sun"></i>
                        <div class="info-value">--</div>
                        <div class="info-label">UV Index</div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-eye"></i>
                        <div class="info-value">-- km</div>
                        <div class="info-label">Visibility</div>
                    </div>
                </div>
            </div>
        `;

        // Make the API call
        const response = await fetch(`${WEATHERSTACK_API}/current?access_key=${API_KEY}&query=${city}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.info || 'Invalid API response');
        }
        
        const data = await response.json();
        console.log('Weatherstack Response:', data);

        // Update weather display
        weatherCard.innerHTML = `
            <div class="location-info">
                <div class="city-name">${data.location.name}</div>
                <div class="date-time">${formatDate(data.location.localtime)}</div>
            </div>
            <div class="main-weather">
                <div class="temperature">${Math.round(data.current.temperature)}°C</div>
                <div class="weather-details-grid">
                    <div class="weather-icon">${getWeatherIcon(data.current.weather_descriptions[0])}</div>
                    <div class="weather-desc">
                        <p>${data.current.weather_descriptions[0]}</p>
                        <div class="feels-like">
                            <i class="fas fa-temperature-half"></i>
                            <span>Feels like ${Math.round(data.current.feelslike)}°C</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="additional-info">
                <div class="info-grid">
                    <div class="info-item">
                        <i class="fas fa-tint"></i>
                        <div class="info-value">${data.current.humidity}%</div>
                        <div class="info-label">Humidity</div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-wind"></i>
                        <div class="info-value">${Math.round(data.current.wind_speed)} km/h</div>
                        <div class="info-label">Wind</div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-cloud-rain"></i>
                        <div class="info-value">${data.current.precip}%</div>
                        <div class="info-label">Precipitation</div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-sun"></i>
                        <div class="info-value">${data.current.uv_index}</div>
                        <div class="info-label">UV Index</div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-eye"></i>
                        <div class="info-value">${Math.round(data.current.visibility / 1000)} km</div>
                        <div class="info-label">Visibility</div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Weather error:', error);
        
        // Show error state
        const weatherCard = document.querySelector('.weather-card');
        weatherCard.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${error.message}</span>
            </div>
        `;
    }
}

// Event listeners
searchBtn.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        updateWeather(city);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            updateWeather(city);
        }
    }
});
