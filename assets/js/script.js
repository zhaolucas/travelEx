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
var getExchangeRate = async function (currFrom, currTo) {
    const currencyUrl = `https://currency-exchange.p.rapidapi.com/exchange?from=${currFrom}&to=${currTo}&q=1.0`;

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
var getLocation = async function (locations, checkInDate, checkOutDate) {
    const locUrl = `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${locations}`;
    const locOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '66140ba915mshd0ef6c163e6b47dp1cb311jsnb1e8a4f5e694',
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
            const geoID = result.data[0].geoId; 
            console.log("GeoID:", geoID);

            // Pass geoID to the getHotel function
            getHotel(geoID, checkInDate, checkOutDate);

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
            'X-RapidAPI-Key': '66140ba915mshd0ef6c163e6b47dp1cb311jsnb1e8a4f5e694',
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



// Click Event Function for Currency button
$("#submitConvert").on("click", function (event) {
    event.preventDefault();
    var currFrom = $("#currFrom").val();
    var currTo = $("#currTo").val();

    //Call the getExchangeRate function
    getExchangeRate(currFrom, currTo);
    // Store the city name in local storage
    storeCurrencyInLocalStorage(currFrom, currTo);

});

// Click Event Function for Currency button
$("#submitHotel").on("click", function (event) {
    event.preventDefault();
    var locations = $("#searchLocation").val();
    var checkInDate = $("#checkinDate").val();
    var checkOutDate = $("#checkoutDate").val();

    //Call the getLocation function
    getLocation(locations,checkInDate,checkOutDate);

});

// Function to store currency in local storage
function storeCurrencyInLocalStorage(from, to) {
    // Check if there is already a currency history in local storage
    var currencyHistory = JSON.parse(localStorage.getItem("currencyHistory")) || [];

    // Add the new currency fields to the currency history array
    currencyHistory.push({ from, to });

    // Store the updated currency history back in local storage
    localStorage.setItem("currencyHistory", JSON.stringify(currencyHistory));
}



