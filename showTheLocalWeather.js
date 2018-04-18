//https://www.freecodecamp.org/challenges/show-the-local-weather
$(document).ready( function() {  
  localWeather();
});

function localDate() {

  var curDate = new Date();
  var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var day = curDate.getDay();
  var weekDay = week[day];
  var hour = (curDate.getHours() < 10 ? "0" : "") + curDate.getHours();
  var minute = (curDate.getMinutes() < 10 ? "0" : "") + curDate.getMinutes();
  var date =  weekDay + " " + hour + ":" + minute;
  return date;

}

function timeConverter(unixTime) {

  var uTime = new Date(unixTime * 1000);
  var uHour = (uTime.getHours() < 10 ? "0" : "") + uTime.getHours();
  var uMinute = (uTime.getMinutes() < 10 ? "0" : "") + uTime.getMinutes();
  var convertedTime = uHour + ":" + uMinute;
  return convertedTime;

}

function degConverter(deg) {

  var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  deg = Math.floor((deg / 22.5) + 0.5);
  var dir = arr[(deg % 16)];
  return dir;

}

function tempToF(temp) { return Math.floor(((temp * 1.8) + 32) * 10) / 10; }

function localWeather() {

  var name = $("#location");
  var dateDisplay = $("#date");
  var updateIcon = $("#update");
  var iconDisplay = $("#icon");
  var mainTemp = $("#main-temp");
  var descript = $("#description");
  var degC = $("#degC");
  var degButtonC = degC.append($('<input type="button" title="Show Celcius" id="#degC-btn" class="deg d-hover d-active" value="°C">'));      
  var degF = $("#degF");
  var degButtonF = degF.append($('<input type="button" title="Show Farenheit" id="#degF-btn" class="deg d-hover d-active" value="°F">'));

  var tempMinMax = $("#main-temp-min-max");
  var mainHumidity = $("#main-humidity");
  var pressure = $("#main-pressure");
  var wind = $("#wind");
  var visibility = $("#visibility");
  var sRiseSet = $("#sunrise-set");

  var update = function() { location.reload(true); }
  var geoLocation = navigator.geolocation;

  if (geoLocation) {

    geoLocation.getCurrentPosition(function(position) {

   /*$.getJSON("//freegeoip.net/json/?callback=?", function(dataFromIP) {

    var latitude = dataFromIP.latitude;
    var longitude = dataFromIP.longitude;
    var country = dataFromIP.country_name;*/

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var url = "https://fcc-weather-api.glitch.me/api/current?lat=" + latitude + "&lon=" + longitude;
     
    $.getJSON(url, function(json) {

      var loc = json.name + ", " + json.sys.country;
      var icon = json.weather[0].icon;
      var temp = Math.round(json.main.temp * 10) / 10;
      var description = json.weather[0].description;

      var tMin = json.main.temp_min;
      var tMax = json.main.temp_max;
      var humidity = json.main.humidity;
      var press = Math.floor(json.main.pressure * 10) / 10;
      var vis = json.visibility / 1000;
      var windS = json.wind.speed;
      var windSKm = Math.floor(windS * 1.609344);
      var windD = json.wind.deg;
      var sunrise = json.sys.sunrise;
      var sunset = json.sys.sunset;

      var tempF = tempToF(temp);
      var tMinF = tempToF(tMin);
      var tMaxF = tempToF(tMax);
      var pressIn = Math.floor(press * 0.295301 * 10) / 100;
      var visMi = Math.floor(vis / 1.609344);

      name.html("<b>" + loc);
      dateDisplay.html(localDate());
      updateIcon.addClass("fa fa-refresh pointer").css("color", "blue").attr("title", "Update").click(update);
      iconDisplay.attr("src", icon);
      mainTemp.html("<b>" + temp);
      descript.html("<b>" + description.charAt(0).toUpperCase() + description.slice(1));

      tempMinMax.html("Min/Max<b><br>" + tMin + "°/" + tMax + "°<hr>");
      mainHumidity.html("Humidity<b><br>" + humidity + "%<hr>");
      pressure.html("Pressure<b><br>" + press + " hpa<hr>");
      wind.html("Wind<b><br>" + degConverter(windD) + " " + windSKm + " km/h<hr>");
      visibility.html("Visibility<b><br>" + vis + " km<hr>");
      sRiseSet.html("Sunrise/Sunset<b><br>" + timeConverter(sunrise) + "/" + timeConverter(sunset));      

     degButtonC.click( function() {

       mainTemp.html("<b>" + temp);
       tempMinMax.html("Min/Max<b><br>" + tMin + "°/" + tMax + "°<hr>");
       pressure.html("Pressure<b><br>" + press + " hpa<hr>");
       wind.html("Wind<b><br>" + degConverter(windD) + " " + windSKm + " km/h<hr>");
       visibility.html("Visibility<b><br>" + vis + " km<hr>");

     });

     degButtonF.click( function() {

       mainTemp.html("<b>" + tempF);
       tempMinMax.html("Min/Max<b><br>" + tMinF + "°/" + tMaxF + "°<hr>");
       pressure.html("Pressure<b><br>" + pressIn + " in<hr>");
       wind.html("Wind<b><br>" + degConverter(windD) + " " + windS + " mi/h<hr>");
       visibility.html("Visibility<b><br>" + visMi + " mi<hr>");

     });

    });

    });

  } else {
      alert("Browser not supported.");
    }
}