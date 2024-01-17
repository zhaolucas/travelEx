// ---------------Pseudo Code--------------------
// when User searches for a city (clicks search button - click event):
// - Fetch data from a Travel API
// - store the user input in a variable
// - use a fetch api to get the hotel/transport data for that city
// - store that city into local storage
// ---------------------------------------------------------
// when User searches for a country (clicks search button - click event):
// - Fetch data from a currency API
// - store the user input in a variable
// - use a fetch api to get the currency data for that country
// - store that country into local storage
// ----------------------------------------------------------
// - use data in local.storage to create a city button under the travel search area for city history
// - use data in local.storage to create a country button under the currency search area for country history
// - when you click the city button it re-displays the hotel/transport data for that city
// - when you click the country button it re-displays the currency data for that country

//User inputs are Currency From and Curreny To
//Output is the currency exchange
const currencyurl = 'https://currency-exchange.p.rapidapi.com/exchange?from=GBP&to=USD&q=1.0';
const currencyoptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'ef11899325mshfa3ab5c07bdaacbp1c7deajsne4943a99efb8',
        'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
    }
};

var currency = async function () {
    try {
        const response = await fetch(currencyurl, currencyoptions);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

//User Input is location
//Output is th geoID to use in the next fetch
const locUrl = 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=London';
const locOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'ef11899325mshfa3ab5c07bdaacbp1c7deajsne4943a99efb8',
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
    }
};

var locations = async function () {
    try {
        const response = await fetch(locUrl, locOptions);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

//Input = geoID, check In date, Checkout date
//Output = ALOT!!!
const hotelUrl = 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels?geoId=186338&checkIn=2024-01-18&checkOut=2024-01-19&pageNumber=1&currencyCode=GBP';
const hotelOptions = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'ef11899325mshfa3ab5c07bdaacbp1c7deajsne4943a99efb8',
		'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
	}
};

var Hotels = async function () {
try {
	const response = await fetch(hotelUrl, hotelOptions);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}
}

currency();
locations();
Hotels();







