$(document).ready(function(){

    /*
    * weather object, stores all relevant weather data points
    */
    var weather = {
        name: "",
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
    * listener that handles when search button is clicked
    * populates weather
    */
    $(".searchBtn").click(function(e){

        //establish current city
        let city = $("#searchInput").val();
        console.log("current city = " + city);

        //buildURL
        url = buildURL(city);
        //ajax call to api
        callAjax(url);
        //populate current weather
        showCurrent();
        //populate 5-day
        showFiveDay();
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
    function callAjax(url){

        $.ajax({
            url: url,
            method: "GET"
          }).then(function(response) {
            weather.name = response.name;
            
            weather.id = response.weather[0].id;
            weather.mainWeather = response.weather[0].main;
            weather.description = response.weather[0].description;
            weather.icon = response.weather[0].icon;

            weather.currentTemp = response.main.temp;
            weather.minTemp = response.main.temp_min;
            weather.maxTemp = response.main.temp_max;
            weather.feelsLike = response.main.feels_like;
            weather.pressure = response.main.pressure;
            weather.humidity = response.main.humidity;

            weather.windSpeed = response.wind.speed;
            weather.windDir = response.wind.deg;
            console.log(weather);
          });
    }

    /*
    * prints current forecast into page
    */
    function showCurrent(){
        $(".todaysWeather")
    }

    /*
    * prints 5-day forecast into page
    */
    function showFiveDay(){

    }

});