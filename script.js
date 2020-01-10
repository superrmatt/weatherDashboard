$(document).ready(function(){

    /*
    * Weather object, stores all relevant weather data points.
    * Information for todays weather only.
    * Each property will be assigned a non-empty value after calls to weather API are returned with information.
    * Spacing between properties just for neatness and human categorization.
    */
    var weather = {
        lat: "",
        lon: "",

        city: "",
        country: "",
        id: "",
        mainWeather: "",
        description: "",
        icon: "",

        currentTemp: "",
        minTemp: "",
        maxTemp: "",
        feelsLike: "",
        pressure: "",
        humidity: "",

        windSpeed: "",
        windDir: "",

        uvIndex: ""
    };

    /*
    * 5 day weather. Aarray of objects, one object for each day.
    * Each day possess four properties.
    * Each property will be assigned a non-empty value after calls to weather API are returned with information.
    */
    var fiveDay = [
        {
            icon: "",
            temperature: "",
            humidity: "",
            date: ""
        }, 
        {
            icon: "",
            temperature: "",
            humidity: "",
            date: ""
        }, 
        {
            icon: "",
            temperature: "",
            humidity: "",
            date: ""
        }, 
        {
            icon: "",
            temperature: "",
            humidity: "",
            date: ""
        }, 
        {
            icon: "",
            temperature: "",
            humidity: "",
            date: ""
        }    
    ];

    /*
    * Listener that handles when search button is clicked.
    * Main or driver function. Handles execution of everything.
    * @param: e event
    */
    $(".searchBtn").click(function(e){

        //establish current city
        let city = $("#searchInput").val();

        //build URLs 1 & 3, 2 is later, read on to learn why.
        //url1 == todays weather api link
        //url3 == 5 day forecast api link
        let url1 = buildURLOne(city);
        let url3 = buildURLThree(city);

        //ajax calls to api, run populateWeather() upon completion via success
        buildWeather(url1, url3);
 
    });

    /*
    * Takes the raw parts of the URL and builds the final link for queryiing todays weather.
    * Builds link to be used for first ajax call.
    * Link is built upon click of the search button. It is then passed as first argument into buildWeather(string, string).
    * @param city: string the searched city to build API URL for.
    * @return: string URL for API call #1
    */
    function buildURLOne(city){
        //link + key + imperial units because USA is ass backwards and doesn't use metric.
        let apiLink = "https://api.openweathermap.org/data/2.5/weather";
        let apiQuery = "?appid=dba8e4e798d907acb9b0e7ea7244cf27&units=imperial";
        
        //replace any spaces with %20
        let resultCity = city.replace(" ", "%20");
        resultCity = "&q=" + resultCity; 
        //add city to link
        let fullURL = apiLink + apiQuery + resultCity;

        return fullURL;
    }

    /*
    * Takes the raw parts of the URL and builds the final link for queryiing UV index.
    * Builds link to be used for second ajax call in buildWeather(string, string).
    * Since we need the coordinates of the location to search, we have to wait for first ajax call to finish
    * Therefore, unlike the other two link building functions, this one is run in buildWeather(string, string), aafter first ajax call is completed.
    * @param lat: string or integer latitude of the searched city to build API URL for.
    * @param lon: string or integer longitude of the searched city to build API URL for.
    * @return: string URL for API call #2
    */
    function buildURLTwo(lat, lon){
        //link + key
        let apiLink = "https://api.openweathermap.org/data/2.5/uvi/forecast";
        let apiQuery = "?appid=dba8e4e798d907acb9b0e7ea7244cf27";

        //snag those coordinates
        let resultCoord = "&lat=" +lat + "&lon=" + lon;
        //add 'em all together
        let fullURL = apiLink + apiQuery + resultCoord;

        return fullURL;
        //unlike the other two calls, this one will never have spaces, so need to replace them with %20, in case anyone was wondering.
    }

    /*
    * Takes the raw parts of the URL and builds the final link for queryiing five day weather forecast.
    * Builds a link to be used for third ajax call in buildWeather(string, string).
    * Link is built upon click of search button. It is then passed as second argument into buildWeather(string, string).
    * @param city: string the searched city to build API URL for.
    * @return string URL for API call #1
    */
    function buildURLThree(city){
        let apiLink = "https://api.openweathermap.org/data/2.5/forecast";
        let apiQuery = "?appid=dba8e4e798d907acb9b0e7ea7244cf27&units=imperial";
        
        let resultCity = city.replace(" ", "%20");
        resultCity = "&q=" + resultCity; 
        let fullURL = apiLink + apiQuery + resultCity;
        console.log("5-day link = " + fullURL);

        return fullURL;
    }

    /*
    * runs api calls
    * There are three calls.
    * 1: gets today's weather, also gets coordinates to run second API call.
    * 2: gets UV index of location based on coordinates of previously searched location.
    * 3: gets 5 day forecast. Forecast is compiled every 3 hours. Meaning the result is an array of 40 objects to be deciphered in popoulateWeather().
    * since ajax calls are asynchronous, we must wait for each to finish in order to compile properly and without buggies, especially since call #2 relies on data from call #1.
    * Therefore, each ajax call waits for a promise from previous call of completion. This way no one is stepping on anyones toes.
    * @param url1: string URL to run first ajax call on.
    * @param url3: string URL to run third ajax call on.
    */
    function buildWeather(url1, url3) {
        
        //gets all weather data
        //first: todays weather
        $.ajax({
            url: url1,
            success: function(response) {

                //populate weather object
                weather.lat = response.coord.lat; 
                weather.lon = response.coord.lon;

                weather.city = response.name;
                weather.country = response.sys.country;
            
                weather.id = response.weather[0].id;
                weather.mainWeather = response.weather[0].main;
                weather.description = response.weather[0].description;
                weather.icon = response.weather[0].icon;
            
                //round 'em, because who, besides meteoroligists or fanatics, measure temperature to the hundredth place.
                weather.currentTemp = Math.round(response.main.temp);
                weather.minTemp = Math.round(response.main.temp_min);
                weather.maxTemp = Math.round(response.main.temp_max);
                weather.feelsLike = Math.round(response.main.feels_like);
                weather.pressure = response.main.pressure;
                weather.humidity = response.main.humidity;
            
                weather.windSpeed = response.wind.speed;

                //now build link for UV index, since lat/long is needed to query successfully. Lat/long obtained in api call #1
                let url2 = buildURLTwo(weather.lat, weather.lon);
                
                //then UV index
                $.ajax({
                    url: url2,
                    success: function(response) {
                        weather.uvIndex = response[0].value;

                        console.log("2nd ajax call done - UV");
                        //lastly 5-day weather
                        $.ajax({
                            url: url3,
                            success: function(response) {
                               
                                //populate five day array.
                                //j 'iterates' the JSON response. 8 since we get weather update every 3 hours, (24/3) = 8.
                                //this ensures one reading per day, all at same time.
                                let j = 7;
                                for(let i = 0; i < fiveDay.length; i++){
                                    console.log("i = " + i);
                                    fiveDay[i].icon = response.list[j].weather[0].icon;
                                    fiveDay[i].temperature = Math.round(response.list[j].main.temp);
                                    fiveDay[i].humidity = response.list[j].main.humidity;
                                    fiveDay[i].date = response.list[j].dt_txt;
                                    j = j + 8;
                                }
                                
                                //now that all data has been retrieved, update webpage via populateWeather()
                                populateWeather();
                            }
                        });
                    } 
                });
            }
        });
    } 
  
    /*
    * prints current forecast onto page.
    * Uses JQuery to edit html values. Consult index.html for initial html structure.
    */
    function populateWeather(){

        let today = moment();
        let todayDate = today.format("MM/DD/YYYY");
        
        //today
        $("#top").html(weather.city + ", " + weather.country + " (" + todayDate + ") <img src=\"./icon_images/" + weather.icon +".png\" alt=\"icon " + weather.icon + "\"></img>");
        $("#tempNow").html("Temperature: " + weather.currentTemp + "&#8457");
        $("#tempMax").html("Low: " + weather.maxTemp + "&#8457");
        $("#tempMin").html("High: " + weather.minTemp + "&#8457");
        $("#tempFeels").html("Feels like: " + weather.minTemp + "&#8457");
        $("#humidity").html("Humidity " + weather.humidity + "%");
        $("#wind").html("Wind: " + weather.windSpeed + "mph");

        //UVindex
        //determine severity of UV index.
        //Disclosure: these calculations are not meant to be guidlines. Any aount of UV radiation is harmful and should be avoided when possible.
        let sevString = "";
        if(weather.uvIndex < 3){
            //0 - 2.99 = low
            sevString = "<div class=\"alert alert-success\" role=\"alert\">";
        }else if(weather.uvIndex >= 3 && weather.uvIndex <= 6){
            //3 - 6 = moderate
            sevString = "<div class=\"alert alert-warning\" role=\"alert\">";
        }else if(weather.uvIndex > 6 && weather.uvIndex <= 10){
            //6 - 10 = high
            sevString = "<div class=\"alert alert-danger\" role=\"alert\">";
        }
        //add html
        $("#uvIndex").html("UV Index: " + sevString + weather.uvIndex + "</div>");
        
        //five day
        $(".fiveDayForecast").text("5-Day Forecast:")
        //for each day
        for(let i = 0; i < fiveDay.length; i ++){
            let day = i + 1;

            let parsedDate = moment(fiveDay[i].date).format("MM/DD/YYYY");

            $("#day" + day + "Date").html(parsedDate);
            $("#day" + day + "Icon").html("<img src=\"./icon_images/" + fiveDay[i].icon +".png\" alt=\"icon " + fiveDay[i].icon + "\"></img>");
            $("#day" + day + "Temp").html("Temp: " + fiveDay[i].temperature);
            $("#day" + day + "Humidity").html("Humidity: " + fiveDay[i].humidity)
        }
        //lastly, style it up!
        style();
    }

    /*
    * Sets up the css on the page for final result.
    * Just some simple JQuery for finishing touches.
    * Check style.css and Bootstrap CSS for initial css setup.
    */
    function style(){
        
        $(".background").css("background-color", "blue");
        //this might look funky, BUT, since Bootstrap has built-in border class, and having borders in these divs before weather is shown looks silly, I thought it best to make a placeholder class with no CSS effects. Now just add Bootstrap border class upon compeltion and viola! Borders.
        $(".addBorder").addClass("border");
        $(".daily").css("margin", "6px");

    }
});