import { preferences } from "../Services/services";
import { showWeather } from 'react-native-weather-api';
import React from "react";


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
          videoString += `${counter}. '${video.title}' by the author ${video.author} with ${video.number_of_views}. The video was published ${video.published_time} ${video.is_live_content != null? "(Live)" : ""}. 
          `
          counter++;
          if (counter == 6) {
            break;
          }
      }
    
      // ${videoString}
      // ${data.videos}
      return `There are ${data.number_of_videos} Youtube videos ${category != "Now"? "about "+category: ""} are trending in the ${country} today. The top 5 trending videos are:
    ${videoString}`;
    } else {
      return "Cannot get any Youtube video from the internet service now. Please try again later. "+JSON.stringify(data)
    }
  }
  
  function getNetflix(data) {
    var str = "";
    
    function render(data, type) {
      var arrayString = `
      - ${type}: `
      for (const item of data) {
        arrayString += `
  ${item.list}.  '${item.name}', viewed ${item.hoursviewed} times. 
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
    if (data != undefined) {
      return  `Buckle up. The current weather in ${data.name} is '${data.description}', with a humidity value of ${data.humidity} and wind speed of ${data.wind}.`
    } else {
      return  "Cannot get any weather data from the internet. Please enable your permissions first or try again later.";
    }
  }



  export default getFormattedService;