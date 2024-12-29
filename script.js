document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const countryName = document.getElementById('countryInput').value.trim();
    if (!countryName) {
        alert("Please enter a country name!");
        return;
    }

    try {
        // Fetch country data
        const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!countryResponse.ok) {
            throw new Error("Country not found!");
        }
        const countryData = await countryResponse.json();
        const country = countryData[0];

        // Fetch weather data using proxy to handle CORS issues
        const capitalCity = country.capital ? country.capital[0] : null;
        let weather = null;
        if (capitalCity) {
            const weatherAPI = `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${capitalCity}`;
            const proxy = `https://cors-anywhere.herokuapp.com/`; // Add proxy to bypass CORS issues
            const weatherResponse = await fetch(proxy + weatherAPI);
            if (weatherResponse.ok) {
                weather = await weatherResponse.json();
            } else {
                console.warn("Weather data not available for the given city.");
            }
        }

        // Display the data
        displayCountryData(country, weather);
    } catch (error) {
        console.error("Error:", error.message);
        alert(error.message || "An error occurred while fetching data.");
    }
});

function displayCountryData(country, weather) {
    const resultsContainer = document.getElementById('countryResults');
    resultsContainer.innerHTML = `
        <div class="col-12">
            <div class="card">
                <img src="${country.flags.svg}" class="card-img-top" alt="Flag of ${country.name.common}" style="max-height: 200px; object-fit: contain;">
                <div class="card-body">
                    <h5 class="card-title">${country.name.common}</h5>
                    <p class="card-text"><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p class="card-text"><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                    <p class="card-text"><strong>Region:</strong> ${country.region}</p>
                    ${
                        weather
                            ? `<p class="card-text"><strong>Weather:</strong> ${weather.current.temp_c}°C, ${weather.current.condition.text}</p>
                               <img src="${weather.current.condition.icon}" alt="${weather.current.condition.text}" style="max-width: 50px;">`
                            : `<p class="card-text text-warning">Weather data not available</p>`
                    }
                </div>
            </div>
        </div>
    `;
}
