import AsyncStorage from "@react-native-async-storage/async-storage";

//Default Settings
var settings = {
    voice: {
        mute: false,
        volume: 1, // not implemented
        languageId: 'en-US',
        accentId: '',
        // engineId: '',
    },

    apis: {
        service_api: true,
        dialogflow_api: true
    },

    commands: {
        Mute: "shut up",
        Unmute: "talk",
        Summary: "summary",
        Settings: "settings",
        Faq: "faq"
    },

    clear: false, // when to cache results
    init: true, // to prevent welcome message from showing multiple times
    first_time: false, // first time open application
    session_start_datetime: "", // session start
    current_date: "", // current date (for apis)
};

export const updateSettings = (key : string, value : any)  => { // updates stuff in settings.voice
    try {
        settings.voice[key] = value // for every other view
        AsyncStorage.setItem("app_voice_settings", JSON.stringify(settings.voice));
    } catch (e) {
        alert("Error. Cannot save settings.")
    }
}


export const clearAllData = async ()  => {
    await AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
        .then(() => console.warn('successfully deleted all application data'));
}

export default settings;