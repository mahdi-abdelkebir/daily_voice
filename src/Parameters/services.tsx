
//Default Settings


import AsyncStorage from "@react-native-async-storage/async-storage";
import { weatherAPIRequest } from '../Services/weatherapi';
import { rapidAPIRequest } from '../Services/rapidapi';
import settings from "./settings";

const services : any[] = [ // must be ordered exactly like voice command in settings!!
    // apis with real links
    {
        key: "astrology", // must be similar to voice command in settings!!
        title:"Astrology News",
        description: "Get your daily astrology news depending on your sign.",
        icon: "star-shooting",
        cache: true,
        api: {
            method: "POST",
            host: "sameer-kumar-aztro-v1.p.rapidapi.com/",
            default_params: { "day": "today" },
        }
    },
    {
        key: "netflix",
        title:"Netflix Weekly Top 10",
        description: "Find out about the latest netflix movies and series this week.",
        icon: "netflix",
        cache: true,
        api: {
            method: "GET",
            host: "netflix-weekly-top-10.p.rapidapi.com",
            routes: [
                 {name:"Movies", path: "/api/movie"},
                 {name:"Series", path: "/api/tv"},
            ]
        },
    },
    {
        key: "youtube",
        title: "Youtube Trending",
        description: "Get today's most trending videos in the category and country that you like.",
        icon: "youtube",
        limit: 15,
        // cache: true,
        api: {
            method: "GET",
            host:"youtube-v2.p.rapidapi.com",
            routes: [
                {name:"Trending", path: "/trending/"},
           ]
        },  

    },
    // custom apis in the bottom
    {
        key: "weather",
        title:"Weather",
        description: "Get the latest weather forecast of your current location.",
        icon: "weather-cloudy"
    },
    {
        key: "spotify",
        title: "Spotify Play",
        summurizable: false,
        description: "Play your favourite spotify playlist.",
        icon: "spotify"
    },
    {
        key: "quote",
        title: "Random Quote",
        description: "Tells you a random quote",
        icon: "format-quote-open",
        summurizable: false,
        api: {
            method: "GET",
            host:"quotes15.p.rapidapi.com",
            routes: [
                {name:"Random quote", path: "/quotes/random/"},
           ]
        },  
    },
    {
        key: "namegenerator",
        title:"Random Name Generator",
        description: "Get a random name from the internet.",
        icon: "guy-fawkes-mask",
        summurizable: false,
        limit:50,
        api: {
            method: "GET",
            host:"random-name-generator1.p.rapidapi.com",
            routes: [
                {name:"Random name", path: "/name"},
           ]
        }, 
    },
];


export const requestAPI = async (service) => { // filtres requests, caches responses
    if (service.key == "weather") {
      return await weatherAPIRequest();
    } else {
        const current_date = settings.current_date;
        var cache : any, isSavable = false; 

        if (service.cache || service.limit) {
            isSavable = true; // faster hopefully
            cache = await AsyncStorage.getItem("cache_result_"+service.key);
            if (cache) { // if there is cache
                cache = JSON.parse(cache);
                if (cache.cache_date == current_date) {
                    if (service.cache) {
                        return Promise.resolve(cache.data);
                    } else if (service.limit && cache.times >= service.limit) {
                        Promise.reject("Sorry, you surpassed the allowed call limit for this service today ("+service.limit+"). Please try again tomorrow.")
                    }
                }
            }
        }

      return await rapidAPIRequest(service).then((result) => {
        if (isSavable) {
            if (service.cache) {
                cache = {cache_date: current_date, data: result};
                console.log("cached new result "+service.key)
            } else if (service.limit) {
                if (cache) {
                    cache.times++;
                    console.log("cached added to limit "+service.key)
                } else {
                    cache = {cache_date: current_date, limit: 1 };
                    console.log("cached new limit "+service.key)
                }
            }

            AsyncStorage.setItem("cache_result_"+service.key, JSON.stringify(cache))
        }

        return result;
      });
    }
}

// TODO: add to service?
export const astrology_signs = [
    { label: "Aries", value : 0},  { label: "Taurus", value : 1},  { label: "Gemini", value : 2},  { label: "Cancer", value : 3},  { label: "Leo", value : 4},  { label: "Virgo", value : 5}, { label: "Libra", value : 6}, { label: "Scorpio", value : 7}, { label: "Sagittarius", value : 8}, { label: "Capricorn", value : 9}, { label: "Aquarius", value : 10}, { label: "Pisces", value : 11}
];

export const youtube_categories = [
    { label: "All", value : 0},  { label: "Music", value : 1},  { label: "Movies", value : 2}, { label: "Gaming", value : 3}
];

export const countries_codes = [
    { label: "US", value : 0},  { label: "TN", value : 1},  { label: "FR", value : 2}, { label: "TK", value : 3}
];

export const netflix_categories = [
    { label: "Both", value : 0},  { label: "Movie Only", value : 1},  { label: "Series Only", value : 2}
];

export default services;