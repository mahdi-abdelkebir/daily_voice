import { OPENWEATHER_API_KEY } from '@env';
import { getWeather, dailyForecast, showWeather, getLocation } from 'react-native-weather-api';


export async function getWeatherInfo() : Promise<any | undefined> {
    var weather : any | undefined;

    await getLocation().then(async (location) => {
        await getWeather({
            key: OPENWEATHER_API_KEY,
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            unit: "metric"
    
        }).then(() => {
            weather = new showWeather();
        });
    });

    return Promise.resolve(weather);
}
