// ---------------Pseudo Code--------------------
// when User searches for a Hotel (clicks search button - click event):
//! - Fetch data from a Travel API
// - store the user inputs in a variable (location, check in date, check out date)
// - use a fetch api to get the hotel data for that location
// - store that city into local storage
// ---------------------------------------------------------
// when User searches for a country (clicks search button - click event):
//! - Fetch data from a currency API
// - store the user inputs in a variable (currency from, currency to)
// - use a fetch api to get the currency data for that country
// - store that country into local storage
// ----------------------------------------------------------
// - use data in local.storage to create a city button under the travel search area for city history
// - use data in local.storage to create a country button under the currency search area for country history
// - when you click the city button it re-displays the hotel/transport data for that city
// - when you click the country button it re-displays the currency data for that country

//Function to get the Exchange Rate
var getExchangeRate = async function (from, to) {
    const currencyUrl = `https://currency-exchange.p.rapidapi.com/exchange?from=${from}&to=${to}&q=1.0`;

    const currencyOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'ef11899325mshfa3ab5c07bdaacbp1c7deajsne4943a99efb8',
            'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
        }
    };
    // Construct the URL based on user inputs
    try {
        const response = await fetch(currencyUrl, currencyOptions);

        // Check if the response status is OK (200)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response as JSON
        const result = await response.json();

        // Now result contains the parsed JSON data
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};

//Function to get the location geoID and pass to the getHotel function
var getLocation = async function (locations) {
    const locUrl = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${locations}`;
    const locOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'ef11899325mshfa3ab5c07bdaacbp1c7deajsne4943a99efb8',
            'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(locUrl, locOptions);

        // Check if the response status is OK (200)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response as JSON
        const result = await response.json();

        // Check if the response has data and at least one result
        if (result && result.data && result.data.length > 0) {
            const geoID = result.data[0].geoId; // Use lowercase "d" in geoId
            console.log("GeoID:", geoID);

            // Pass geoID to the getHotel function
            getHotel(geoID);

            // Return the geoID if needed for further processing
            return geoID;
        } else {
            console.log("No location data found");
        }
    } catch (error) {
        console.error(error);
    }
};

// function to getHotel info 
var getHotel = async function (geoID, checkInDate, checkOutDate) {

    const hotelUrl = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels?geoId=${geoID}&checkIn=${checkInDate}&checkOut=${checkOutDate}&pageNumber=1&currencyCode=GBP`;
    const hotelOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'ef11899325mshfa3ab5c07bdaacbp1c7deajsne4943a99efb8',
            'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(hotelUrl, hotelOptions);
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

// Example usage:
const from = 'GBP'; // Replace with user input from a click event
const to = 'USD'; // Replace with user input from a click event
const locations = 'London'; // Replace with user input from a click event
const checkInDate = '2024-01-22'; // Replace with user input from a click event
const checkOutDate = '2024-01-23'; // Replace with user input from a click event

// Call the function with user inputs - will need to change this to be a click event
getExchangeRate(from, to);

// Now call the remaining functions - will need to change this to be a click event
(async () => {
    const geoID = await getLocation(locations);
    await getHotel(geoID, checkInDate, checkOutDate);
})();



