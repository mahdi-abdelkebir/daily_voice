import { showWeather } from 'react-native-weather-api';
import React from "react";
import preferences from '../Parameters/preferences';


const getFormattedService = (key, data) => {
    switch (key) {
      case "astrology":
        return getAstrology(data);
      case "youtube": 
        return getYoutube(data);
      case "netflix": 
        return getNetflix(data);
      case "weather":
        return getWeatherInfo(data);
      case "quote":
          return getQuote(data);
      case "namegenerator":
        return getGeneratedName(data);
      default:
        return "Service with key "+key +" is not formatted yet!";
    }
  }
  
  const capitalizeFirstChar = str => str.charAt(0).toUpperCase() + str.substring(1);

  function getAstrology(data) {
    if (data["compatibility"]) {
      return `Your astrology sign is ${capitalizeFirstChar(preferences.services.astrology.sign.label)}

Advice: ${data["description"]}

Harmony: Your most compatible sign today is ${data["compatibility"]}, your lucky color is ${data["color"]}, and your lucky number is ${data["lucky_number"]}`;
    } else {
      return "Cannot get any horoscope data from the internet service now. Please fix your API settings first."
    }

  }
  
  function getYoutube(data) {
    if (data.number_of_videos != null ) {
      var service = preferences.services.youtube;
      var category = service.category.label;
      var country = service.country.label;
      
      var videoString = "", counter = 1;
      for (const video of data.videos) {
          videoString += `${counter}. '${video.title}' by the author ${video.author} with ${video.number_of_views} views. The video was published ${video.published_time}${video.is_live_content != null? "(Live)" : ""}.`
          counter++;
          if (counter == 6) {
            break;
          } else {
            videoString += ` 
          
            `
          }
      }
  
      return `There are ${data.number_of_videos} Youtube videos${category != "Now"? "about "+category : ""} are trending in the ${country} today. The top 5 trending videos are:

        ${videoString}`;

    } else {
      return "Cannot get any Youtube video from the internet service now. Please try again later. "+JSON.stringify(data)
    }
  }
  
  function getNetflix(data) {
    var str = "";
    
    function render(data, type) {
      var arrayString = `
- ${type}: 
`
      for (const item of data) {
        arrayString += `
  ${item.list}. '${item.name}', viewed ${item.hoursviewed} times. 
        `
      }

      return arrayString;
    }

    if (data.series != null || data.movies != null) {
      str = `In your weekly Netflix top 10, you have:
      `;

      if (data.series != null) {
        str += render(data.series, "Series")
      } 
  
      if (data.movies != null) {
        str += render(data.movies , "Movies")
      }
    } else {
      str= "Cannot get any movies or series from the internet now. Please try again tommorrow. "+JSON.stringify(data)
    }

    return str;
  }
  
  function getWeatherInfo(info) {
    var data : showWeather = info; 

    function humidity_description(humidity : number) {
      if (humidity <= 40) {
        return "Too dry";
      } else if (humidity >= 60) {
        return "Too humid";
      } else {
        return "Optimal"
      }
    }

    function windspeed_description(windspeed) {
      if (windspeed <= 0.2) {
        return "Calm"
      } else if (windspeed <= 1.5) {
        return "Light air"
      } else if (windspeed <= 3.5) {
        return "Light breeze"
      } else if (windspeed <= 5.5) {
        return "Gentle breeze"
      } else if (windspeed <= 8.8) {
        return "Moderate breeze" 
      } else if (windspeed <= 11) {
        return "Fresh breeze"
      } else if (windspeed >= 20) {
        return "Strong gale"
      } else if (windspeed > 11) {
        return "Strong breeze";
      }
    }
    if (data != undefined) {
      return  `Buckle up. The current weather in ${data.name} is '${data.description}', with a humidity (${humidity_description(data.humidity)}) value of ${data.humidity}% and wind (${windspeed_description(data.wind)}) speed of ${data.wind}m/h.`
    } else {
      return  "Cannot get any weather data from the internet. Please enable your permissions first or try again later.";
    }
  }


  function getQuote(data) {
    if (data != undefined) {
      return  `${data.originator.name} once said. "${data.content}`;
    } else {
      return  "Sorry, we couldn't get you a random quote from our service. Please try again later.";
    }
  }

  function getGeneratedName(data) {
    if (data != undefined) {
      return  `Your generated name is: ${data.random_name}"`;
    } else {
      return  "Sorry, we couldn't get you a random name from our service. Please try again later.";
    }
  }

  export default getFormattedService;