import { OPENWEATHER_API_KEY } from '@env';
import { getWeather, showWeather, getLocation } from 'react-native-weather-api';


export async function weatherAPIRequest() : Promise<any | undefined> {
    var status : string = "success";
    var weather : any | undefined;

    await getLocation().then(async (location) => {
        await getWeather({
            key: OPENWEATHER_API_KEY,
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            unit: "metric"
    
        }).then(() => {
            weather = new showWeather();
        }).catch(() => {
            status = "Sorry, we couldn't get your weather data info from our API.";
        });
    }).catch(() => {
        status = "Sorry, you have to enable location permission to use this feature";
    });

    if (status == "success")
        return Promise.resolve(weather);
    else 
        return Promise.reject(status);
}
