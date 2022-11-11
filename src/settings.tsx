import AsyncStorage from "@react-native-async-storage/async-storage";

//Default Settings
var settings = {
    clear: false,
    init: true,
    first_time:false,
    apis: {
        service_api: true,
        dialogflow_api: true
    },
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
        AsyncStorage.setItem("app_voice_settings", settings.voice.toString());
        settings.voice[key] = value // for every other view
    } catch (e) {
        alert("Error. Cannot save settings.")
    }
}

export default settings;