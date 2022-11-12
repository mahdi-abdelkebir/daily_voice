
import { RAPIDAPI_KEY } from "@env";
import preferences from "../Parameters/preferences";

export const rapidAPIRequest = async (serviceItem) => {
    const item = serviceItem;

    if (item != null) {
        let params : string = "";
        let options : any = {
            method: item.api.method,
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': item.api.host
            }
        };
        
        const request = (link)  => {
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

        if (item.key == "quote" || item.key == "namegenerator") {
            return request(item.api.host + item.api.routes[0].path);
        } else {
            switch (item.key) {
                case "astrology":
                    
                    params = "?sign="+preferences.services.astrology.sign.label+"&day=today"
                    return request(item.api.host);

                case "youtube":
                    params = "?country="+preferences.services.youtube.country.label.toLowerCase()+"&section="+preferences.services.youtube.category.label;
                    return request(item.api.host + item.api.routes[0].path);

                case "netflix": 
                    var r = {movies: null, series: null};
                    var idCategory = preferences.services.netflix.category.value;
                    switch (idCategory) {
                        case 0: // both
                            await request(item.api.host + item.api.routes[0].path).
                            then((response) => {
                                r.movies = response;
                            });

                            await request(item.api.host + item.api.routes[1].path).
                            then((response) => {
                                r.series = response;
                            });
                            break;
                        case 1: // movies
                            await request(item.api.host + item.api.routes[0].path).
                            then((response) => {
                                r.movies = response;
                            });
                        case 2: // series
                            await request(item.api.host + item.api.routes[1].path).
                            then((response) => {
                                r.series = response;
                            });
                            break;
                    }

                    return Promise.resolve<any>(r)
            }

            return Promise.reject<any>("Unset service API "+item.key);
        }
    } else {
        return Promise.reject<any>("Cannot find key "+item.key);
    }
}