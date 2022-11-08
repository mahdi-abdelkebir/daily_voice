
//Default Settings

import AsyncStorage from "@react-native-async-storage/async-storage";

const RapidAPI_Key = "08451ee546msh6e596aac72cf34ep12e58cjsn7d9b32e40368";

const services : any[] = [ // must be ordered exactly like voice command in settings!!
    // apis with real links
    {
        key: "astrology", // must be similar to voice command in settings!!
        title:"Astrology News",
        description: "Get your daily astrology news depending on your sign.",
        icon: "star-shooting",
        daily_summary: false,
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
        daily_summary: false,
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
        icon: "weather-cloudy",
        daily_summary: false
    },
    {
        key: "spotify",
        title: "Spotify Play",
        description: "Play your favourite spotify playlist.",
        icon: "spotify"
    }
];


export const preferences = {
    services: {
        astrology: {
            daily_summary: false,
            sign: {label: "capricorn", value: 0}
        },
        netflix: {
            category: {"label": "Both", value: 0}
        },
        youtube: {
            daily_summary: false,
            category: {label: "Now", value: 0},
            country: {label: "US", value: 0},
        },
        weather: {
            daily_summary: false
        },
        spotify: {
            daily_summary: false,
            playlist_id: "0SXwwegrQui5FwmQSaoNSM"
        }
    },
    phrases: {
        astrology: 'Astrology',
        netflix: 'Netflix',
        youtube: 'Youtube',
        weather: 'Weather',
        spotify: 'Music',
    },
}

export const savePreference = async (service: string, key: string, value: any) => {
    try {
        if (key == "phrase") {
            preferences.phrases[service] = value;
            await AsyncStorage.setItem("user_phrases", preferences.phrases.toString());
        } else {
            preferences.services[service][key] = value;
           await AsyncStorage.setItem("user_services", preferences.services.toString());
        }

        return true;
    } catch (e) {
        alert("Error. Cannot save settings.")
        return false;
    }
}


export const sendAPIRequest = async (serviceItem) => {
    const item = serviceItem;

    if (item != null) {
        let params : string = "";
        let options : any = {
            method: item.api.method,
            headers: {
                'X-RapidAPI-Key': RapidAPI_Key,
                'X-RapidAPI-Host': item.api.host
            }
        };
        
        function sendRequest(link) {
            var newLink = "https://"+link+params;
            console.log(newLink);
            return fetch(newLink, options)
            .then(response => {
                var json = response.json()
                return json
            })

        }

        // return Promise.resolve("test");
        console.log("key: "+item.key);
        switch (item.key) {
            case "astrology":
                params = "?sign="+preferences.services.astrology.sign.label+"&day=today"
                return sendRequest(item.api.host);

            case "youtube":
                params = "?country="+preferences.services.youtube.country.label.toLowerCase()+"&section="+preferences.services.youtube.category.label;
                return sendRequest(item.api.host + item.api.routes[0].path);

            case "netflix": 
                var r = {movies: null, series: null};
                var idCategory = preferences.services.netflix.category.value;
                switch (idCategory) {
                    case 0: // TODO/ optimize LATER
                        await sendRequest(item.api.host + item.api.routes[0].path).
                        then((response) => {
                            r.movies = response;
                        });

                        await sendRequest(item.api.host + item.api.routes[0].path).
                        then((response) => {
                            r.series = response;
                        });
                        break;
                    case 1: // both
                        await sendRequest(item.api.host + item.api.routes[0].path).
                        then((response) => {
                            r.movies = response;
                        });
                    case 2: // series
                        await sendRequest(item.api.host + item.api.routes[1].path).
                        then((response) => {
                            r.series = response;
                        });
                        break;
                }

                return Promise.resolve<any>(r)
        }

        return Promise.reject<any>("Unset service API "+item.key);
    } else {
        return Promise.reject<any>("Cannot find key "+item.key);
    }

}

export default services;