// ---------------Pseudo Code--------------------
// when User searches for a Hotel (clicks search button - click event):
//! - Fetch data from a Travel API
//! - store the user inputs in a variable (location, check in date, check out date)
//! - use a fetch api to get the hotel data for that location
//! - store that city into local storage
// ---------------------------------------------------------
// when User searches for a country (clicks search button - click event):
//! - Fetch data from a currency API
//! - store the user inputs in a variable (currency from, currency to)
//! - use a fetch api to get the currency data for that country
//! - store that country into local storage
// ----------------------------------------------------------
//! - use data in local.storage to create a city button under the travel search area for city history
//! - use data in local.storage to create a country button under the currency search area for country history
//! - when you click the city button it re-displays the hotel/transport data for that city
//! - when you click the country button it re-displays the currency data for that country

//Function to get the Exchange Rate
var getExchangeRate = async function (currFrom, currTo) {
    // Construct the URL based on user inputs
    const currencyUrl = `https://currency-exchange.p.rapidapi.com/exchange?from=${currFrom}&to=${currTo}&q=1.0`;

    const currencyOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '66140ba915mshd0ef6c163e6b47dp1cb311jsnb1e8a4f5e694',
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
        const exchangeRate = result;

        // Call the empty function correctly
        $("#fxSearch-results").empty();

        var ExchangeContainer = $("<div>").addClass("current-exchange-container");
        var currentexchange = $("<div>").addClass("current-exchange");
        // Display the currFrom and currTo values in the text
        currentexchange.text(`Currency Exchange Rate from "${currFrom}" to "${currTo}": ${exchangeRate}`);

        ExchangeContainer.append(currentexchange);

        // Append the ExchangeContainer to the element with ID 'fxSearch-results'
        $("#fxSearch-results").append(ExchangeContainer);

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
            'X-RapidAPI-Key': 'b43bed7f99msh71a00619e7227b3p1561c8jsn10cb64e6a2b2',
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
            'X-RapidAPI-Key': 'b43bed7f99msh71a00619e7227b3p1561c8jsn10cb64e6a2b2',
            'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(hotelUrl, hotelOptions);
        const result = await response.json();
        console.log(result);

        // Clear existing hotel cards
        $("#hotelSearch-results").empty();

        // Create a container for hotel cards
        var HotelCardsContainer = $("<div>").addClass("row mt-3");
        $("#hotelSearch-results").append(HotelCardsContainer);

        for (var i = 1; i <= 5; i++) {
            // Create a new card container
            var HotelCard = $("<div>").addClass("col-md-2 Hotel-card Hotel-card-details");

            // Append the card container to the Hotel cards container
            HotelCardsContainer.append(HotelCard);

            // add Hotel Names
            var HotelName = $("<div>").addClass("Hotel-Name").attr("id", "Hotel-Name-" + i);
            HotelName.text("Hotel Name: " + result.data.data[i].title);
            HotelCard.append(HotelName);

            // add Price
            var Price = $("<div>").addClass("Price").attr("id", "Price-" + i);
            Price.text("Price: " + result.data.data[i].priceForDisplay);
            HotelCard.append(Price);

            // add Primary Info
            var primaryInfo = $("<div>").addClass("primaryInfo").attr("id", "primary-info-" + i);
            primaryInfo.text("Primary Info: " + result.data.data[i].primaryInfo);
            HotelCard.append(primaryInfo);
        }
    } catch (error) {
        console.error(error);
    }
}

// Click Event Function for Currency button
$("#submitConvert").on("click", function (event) {
    event.preventDefault();
    var currFrom = $("#currFrom").val();
    var currTo = $("#currTo").val();

    // Check if both currFrom and currTo have values before calling getExchangeRate
    if (currFrom && currTo) {
        // Call the getExchangeRate function
        getExchangeRate(currFrom, currTo);
        // Store the getExchangeRate in local storage
        storeCurrencyInLocalStorage(currFrom, currTo);
        // Update the displayed currency history
        displayCurrencyHistory();
    } else {
        console.error("Invalid currency values");
    }
});

// Click Event Function for Hotel button
$("#submitHotel").on("click", async function (event) {
    event.preventDefault();
    var locations = $("#searchLocation").val();
    var checkInDate = $("#checkinDate").val();
    var checkOutDate = $("#checkoutDate").val();

    try {
        // Call the getLocation function and wait for it to complete
        const geoID = await getLocation(locations, checkInDate, checkOutDate);

        // Call the getHotel function with the obtained geoID
        getHotel(geoID, checkInDate, checkOutDate);

        // Store the location, checkInDate, checkOutDate, and geoID in local storage
        storeHotelInLocalStorage(locations, checkInDate, checkOutDate, geoID);
        // Update the displayed Hotel history
        displayHotelHistory();
    } catch (error) {
        console.error(error);
    }
});

// Function to store currency search in local storage
function storeCurrencyInLocalStorage(currFrom, currTo) {
    // Check if there is already a currency history in local storage
    var currencyHistory = JSON.parse(localStorage.getItem("currencyHistory")) || [];

    // Add the new currency fields to the currency history array
    currencyHistory.push({ currFrom: currFrom, currTo: currTo });

    // Store the updated currency history back in local storage
    localStorage.setItem("currencyHistory", JSON.stringify(currencyHistory));
}

// Function to display Currency history buttons
function displayCurrencyHistory() {
    // Get the currency history from local storage
    var currencyHistory = JSON.parse(localStorage.getItem("currencyHistory")) || [];

    // Get the element where you want to display the buttons
    var currencyHistoryContainer = $("#fxSearchhistory");

    // Clear existing content
    currencyHistoryContainer.empty();

    // Create buttons for each currency search in the history
    for (var i = 0; i < currencyHistory.length; i++) {
        // Use a closure to capture the correct value of 'i'
        (function (index) {
            var currencyButton = $("<button>")
                .addClass("btn currency-button")
                .text(`${currencyHistory[index].currFrom} to ${currencyHistory[index].currTo}`)
                .on("click", function () {
                    // Handle button click event, e.g., display exchange rate for the selected currency
                    var selectedCurrencyFrom = currencyHistory[index].currFrom;
                    var selectedCurrencyTo = currencyHistory[index].currTo;
                    getExchangeRate(selectedCurrencyFrom, selectedCurrencyTo);
                });

            // Append the button to the history container
            currencyHistoryContainer.append(currencyButton);
        })(i);
    }
}

// Function to store Hotel search in local storage
function storeHotelInLocalStorage(locations, checkInDate, checkOutDate) {
    // Check if there is already a hotel history in local storage
    var hotelHistory = JSON.parse(localStorage.getItem("hotelHistory")) || [];

    // Add the new hotel fields to the hotel history array
    hotelHistory.push({ locations, checkInDate, checkOutDate });

    // Store the updated hotel history back in local storage
    localStorage.setItem("hotelHistory", JSON.stringify(hotelHistory));
}

// Function to display Hotel history buttons
function displayHotelHistory() {
    // Get the hotel history from local storage
    var hotelHistory = JSON.parse(localStorage.getItem("hotelHistory")) || [];

    // Get the element where you want to display the buttons
    var hotelHistoryContainer = $("#hotelSearchhistory");

    // Clear existing content
    hotelHistoryContainer.empty();

    // Create buttons for each hotel search in the history
    for (var i = 0; i < hotelHistory.length; i++) {
        // Use a closure to capture the correct values
        (function (index) {
            var hotelButton = $("<button>")
                .addClass("btn hotel-button")
                .text(`Location: ${hotelHistory[index].locations}, Check-in: ${hotelHistory[index].checkInDate}, Check-out: ${hotelHistory[index].checkOutDate}`)
                .on("click", function () {
                    // Handle button click event, e.g., display hotel information for the selected search
                    var selectedLocation = hotelHistory[index].locations;
                    var selectedCheckInDate = hotelHistory[index].checkInDate;
                    var selectedCheckOutDate = hotelHistory[index].checkOutDate;

                    // Call the getLocation function and wait for it to complete
                    getLocation(selectedLocation, selectedCheckInDate, selectedCheckOutDate)
                        .then(function (geoID) {
                            // Call the getHotel function with the obtained geoID
                            getHotel(geoID, selectedCheckInDate, selectedCheckOutDate);
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                });

            // Append the button to the history container
            hotelHistoryContainer.append(hotelButton);
        })(i); // Pass the current index to the closure
    }
}

// Call this function to display currency history when the page loads
displayCurrencyHistory();
// Call this function to display Hotel history when the page loads
displayHotelHistory();
