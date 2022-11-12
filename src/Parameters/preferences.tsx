import AsyncStorage from "@react-native-async-storage/async-storage";

const preferences = {
    services: {
        astrology: {
            daily_summary: true,
            sign: {label: "capricorn", value: 0}
        },
        netflix: {
            daily_summary: true,
            category: {"label": "Both", value: 0}
        },
        youtube: {
            daily_summary: true,
            category: {label: "Now", value: 0},
            country: {label: "US", value: 0},
        },

        spotify: {
            playlist_id: "0SXwwegrQui5FwmQSaoNSM"
        }
    },
    phrases: {
        astrology: 'Astrology',
        netflix: 'Netflix',
        youtube: 'Youtube',
        weather: 'Weather',
        quote: 'Random quote',
        namegenerator: 'Random name',
        spotify: 'Music',
    },
}

export default preferences;

export const savePreference = async (service: string, key: string, value: any) => {
    try {
        if (key == "phrase") {
            preferences.phrases[service] = value;
            await AsyncStorage.setItem("user_phrases", JSON.stringify(preferences.phrases));
            console.log("phrase saved.");
        } else {
            preferences.services[service][key] = value;
           await AsyncStorage.setItem("user_services", JSON.stringify(preferences.services));
        }

        return true;
    } catch (e) {
        alert("Error. Cannot save settings.")
        return false;
    }
}