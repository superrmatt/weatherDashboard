$(document).ready(function(){

    /*
    * weather object, stores all relevant weather data points
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
    * 5 day weather object
    */
    var fiveDay = {
        icon: "",
        temperature: "",
        humidity: ""
    };

    /*
    * listener that handles when search button is clicked
    */
    $(".searchBtn").click(function(e){

        //establish current city
        let city = $("#searchInput").val();
        console.log("current city = " + city);

        //buildURL
        //url1 == todays weather api link
        //url3 == 5 day forecast api link
        let url1 = buildURLOne(city);
        let url3 = buildURLThree(city);
        //ajax call to api, run populateWeather() upon completion via success
        buildWeather(url1, url3);
 
    });

    /*
    * takes the raw parts of the URL and builds the final link for queryiing todays weather
    */
    function buildURLOne(city){
        let apiLink = "https://api.openweathermap.org/data/2.5/weather";
        let apiQuery = "?appid=dba8e4e798d907acb9b0e7ea7244cf27&units=imperial";
        
        let resultCity = city.replace(" ", "%20");
        resultCity = "&q=" + resultCity; 
        let fullURL = apiLink + apiQuery + resultCity;
        console.log("query link = " + fullURL);

        return fullURL;
    }

    /*
    * takes the raw parts of the URL and builds the final link for queryiing UV index
    */
    function buildURLTwo(lat, lon){
        let apiLink = "https://api.openweathermap.org/data/2.5/uvi/forecast";
        let apiQuery = "?appid=dba8e4e798d907acb9b0e7ea7244cf27";

        let resultCoord = "&lat=" +lat + "&lon=" + lon;
        let fullURL = apiLink + apiQuery + resultCoord;
        console.log("UV link = " + fullURL);

        return fullURL;
    }

    /*
    * takes the raw parts of the URL and builds the final link for queryiing five day
    */
    function buildURLThree(city){
        let apiLink = "https://api.openweathermap.org/data/2.5/weather";
        let apiQuery = "?appid=dba8e4e798d907acb9b0e7ea7244cf27&units=imperial";
        
        let resultCity = city.replace(" ", "%20");
        resultCity = "&q=" + resultCity; 
        let fullURL = apiLink + apiQuery + resultCity;
        console.log("query link = " + fullURL);

        return fullURL;
    }

    /*
    * runs ajax, makes listener a litte neater looking
    */
    function buildWeather(url1, url3) {

        //initialize 
       // var requestCallback = new MyRequestsCompleted({
       //     numRequest: 3
       // });
        
        //gets all weather data
        //first todays weather
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
            
                weather.currentTemp = Math.round(response.main.temp);
                weather.minTemp = Math.round(response.main.temp_min);
                weather.maxTemp = Math.round(response.main.temp_max);
                weather.feelsLike = Math.round(response.main.feels_like);
                weather.pressure = response.main.pressure;
                weather.humidity = response.main.humidity;
            
                weather.windSpeed = response.wind.speed;
            
                console.log("1st ajax call done");

                //need to build link for UV index, since lat/long is needed to query successfully.
                let url2 = buildURLTwo(weather.lat, weather.lon);
                
                //then UV index
                $.ajax({
                    url: url2,
                    success: function(response) {
                        weather.uvIndex = response[0].value;

                        console.log(weather.uvIndex);
                        //then 5-day weather
                        $.ajax({
                            url: url3,
                            success: function(data) {
                                
                                //now that all data has been retrieved, update webpage
                                populateWeather();
                            }
                        });
                    } 
                });
            }
        });
    } 
  
    /*
    * prints current forecast onto page
    */
    function populateWeather(){

        let today = moment();
        let todayDate = today.format("MM/DD/YYYY");
        
        //today
        $("#top").html(weather.city + ", " + weather.country + " (" + todayDate + ") " + weather.icon);
        $("#tempNow").html("Temperature: " + weather.currentTemp + "&#8457");
        $("#tempMax").html("Minimum: " + weather.maxTemp + "&#8457");
        $("#tempMin").html("Maximum: " + weather.minTemp + "&#8457");
        $("#tempFeels").html("Feels like: " + weather.minTemp + "&#8457");
        $("#humidity").html("Humidity " + weather.humidity + "%");
        $("#wind").html("Wind: " + weather.windSpeed + "mph");

        //UVindex
        $("#uvIndex").html("UV Index: " + weather.uvIndex);
        
        //five day
        $(".fiveDayForecast").html("5-Day Forecast:")
        



        /*for(let i = 1; i < 6; i ++){
            let next = moment(today).add(i, 'd');
            let nextDate = next.format("MM/DD/YYYY");
            //consider if blocks to populate for each day.
            //if (i===1){execute code on day1}
            //----------OR----------------
            //if (i===1){set some tracker variable as "day1" or something} <--- this method might prove neater

            $("#day" + i + "Date").html(nextDate);
            $("#day" + i + "Icon").html(weather.icon);
        }*/

        
    }
});