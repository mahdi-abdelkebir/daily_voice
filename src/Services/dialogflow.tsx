import { DIALOGFLOW_API_CLIENT_EMAIL, DIALOGFLOW_API_PRIVATE_KEY, DIALOGFLOW_API_PROJECT_ID } from "@env";
import { Dialogflow_V2 } from "react-native-dialogflow";
import settings from "../Parameters/settings";

const DialogFlow = Dialogflow_V2
export default DialogFlow;

export function dialog_auth() {
    if (DIALOGFLOW_API_PRIVATE_KEY != undefined) {

        DialogFlow.setConfiguration(
            DIALOGFLOW_API_CLIENT_EMAIL,
            DIALOGFLOW_API_PRIVATE_KEY,
            DialogFlow.LANG_ENGLISH,
            DIALOGFLOW_API_PROJECT_ID,
        );

        Promise.resolve("DialogFlow was loaded successfully");
    } else {
        settings.apis.dialogflow_api = false;
        Promise.reject("Speech was disabled for a good reason.")
    }
}


export function dialog_request(msg, callback, error) {
    return Dialogflow_V2.requestQuery(msg, callback, error);
}