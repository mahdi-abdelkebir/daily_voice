import AsyncStorage from "@react-native-async-storage/async-storage";

//Default Settings
var settings = {
    apis: {
        service_api: true,
        dialogflow_api: true
    },
    clear: false,
    voice: {
        mute: false,
        volume: 1,
        languageId: 'en-US',
        accentId: '',
    },
    // engineId: '',
    commands: {
        Mute: "shut up",
        Unmute: "talk",
        Summary: "summary",
        Settings: "settings",
    }
};

export const updateVoice = (key : string, value : any)  => {
    try {
        AsyncStorage.setItem(key, value.toString()); // for future init
        settings.voice[key] = value // for every other view
    } catch (e) {
        alert("Error. Cannot save settings.")
    }
}

export default settings;