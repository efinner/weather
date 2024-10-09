document.getElementById("getWeatherBtn").addEventListener("click", function() {
    const citySelect = document.getElementById("citySelect");
    const spinner = document.getElementById("spinner");
    const weatherDisplay = document.getElementById("weatherDisplay");
    const forecastDisplay = document.getElementById("forecastDisplay");
  
    // Clear previous weather data
    weatherDisplay.innerHTML = "";
    forecastDisplay.innerHTML = "";
    
    // Get the selected city coordinates
    let cityCoordinates = citySelect.value;
    if (!cityCoordinates) {
      alert('Please select a city.');
      return;
    }
  
    let [latitude, longitude] = cityCoordinates.split(',');
  
    // Get the selected temperature unit (metric for °C, imperial for °F)
    let unit = document.querySelector('input[name="unit"]:checked').value;
  
    // Construct the Open-Meteo API URL
    let apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=${unit}&timezone=America%2FNew_York`;
  
    // Log the constructed API URL to debug
    console.log('Constructed API URL:', apiUrl);
  
    // Show the spinner
    spinner.style.display = "block";
  
    // Fetch data from the API
    fetch(apiUrl)
      .then(response => {
        console.log('Response Status:', response.status); // Log the response status
        if (!response.ok) {
          throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API Response:', data); // Log the full API response
  
        // Ensure the response contains the expected daily temperature data
        if (!data.daily || !data.daily.temperature_2m_max || !data.daily.temperature_2m_min) {
          throw new Error('API response is missing expected temperature data');
        }
  
        // Display today's weather
        let maxTemp = data.daily.temperature_2m_max[0];
        let minTemp = data.daily.temperature_2m_min[0];
        
        weatherDisplay.innerHTML = `
          <h2>Today's Weather</h2>
          <p>Max Temp: ${maxTemp}°${unit === 'metric' ? 'C' : 'F'}</p>
          <p>Min Temp: ${minTemp}°${unit === 'metric' ? 'C' : 'F'}</p>
        `;
  
        // Display the 3-5 day forecast
        let forecastHtml = `<h3>3-5 Day Forecast</h3>`;
        let daysToShow = Math.min(5, data.daily.temperature_2m_max.length); // Adjust if fewer days available
        for (let i = 1; i < daysToShow; i++) {
          let dayMaxTemp = data.daily.temperature_2m_max[i];
          let dayMinTemp = data.daily.temperature_2m_min[i];
          forecastHtml += `
            <div>
              <strong>Day ${i + 1}:</strong> 
              Max Temp: ${dayMaxTemp}°${unit === 'metric' ? 'C' : 'F'}, 
              Min Temp: ${dayMinTemp}°${unit === 'metric' ? 'C' : 'F'}
            </div>`;
        }
        forecastDisplay.innerHTML = forecastHtml;
  
        // Hide the spinner after success
        spinner.style.display = "none";
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        weatherDisplay.innerHTML = `An error occurred: ${error.message}`;
        spinner.style.display = "none"; // Hide spinner in case of error
      });
  });
  