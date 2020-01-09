$(document).ready(function(){

    /*
    * weather object, stores all relevant weather data points
    */
    var weather = {
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
        windDir: ""
    };

    /*
    * todays date
    */
    var today = moment().format("DD/MM/YYYY");

    /*
    * listener that handles when search button is clicked
    */
    $(".searchBtn").click(function(e){

        //establish current city
        let city = $("#searchInput").val();
        console.log("current city = " + city);

        //buildURL
        let url = buildURL(city);
        //ajax call to api, run populateWeather() upon completion via callback
        buildWeather(url, populateWeather);
 
    });

    /*
    * takes the raw parts of the URL and builds the final link for querying
    */
    function buildURL(city){
        let apiLink = "https://api.openweathermap.org/data/2.5/weather?appid=dba8e4e798d907acb9b0e7ea7244cf27&units=imperial&q=";
        
        let resultCity = city.replace(" ", "%20");
        let fullURL = apiLink + resultCity;
        console.log("query link = " + fullURL);

        return fullURL;
    }

    /*
    * runs ajax, makes listener a litte neater looking
    */
    function buildWeather(url, callback) {

        $.ajax({
            url: url,
            method: "GET"
          }).then(function(response) {
            //populate weather object
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

            console.log(weather);
            callback();
          });
      }      

    /*
    * prints current forecast onto page
    */
    function populateWeather(){

        $("#top").html(weather.city + ", " + weather.country + " (" + today + ") " + weather.icon);
        $("#tempNow").html("Temperature: " + weather.currentTemp + "&#8457");
        $("#tempMax").html("Minimum: " + weather.maxTemp + "&#8457");
        $("#tempMin").html("Maximum: " + weather.minTemp + "&#8457");
        $("#tempFeels").html("Feels like: " + weather.minTemp + "&#8457");
        $("#humidity").html("Humidity " + weather.humidity + "%");
        $("#wind").html("Wind: " + weather.windSpeed + "mph");

    }
});