import { PermissionsAndroid, Platform } from "react-native";

export const check_record_permission = async ()=>{    
  if (Platform.OS == "android") {
    return await PermissionsAndroid.check('android.permission.RECORD_AUDIO');
  }

  return true;
}

export const request_record_permission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Audio Recording Permission",
        message:
          "This app requires access to your audio recorder.",
        buttonNegative: "Refuse",
        buttonPositive: "Accept"
      }
    );

    return (granted === PermissionsAndroid.RESULTS.GRANTED);

  } catch (err) {
    console.warn(err);
  }

  return false;
};  