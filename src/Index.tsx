import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsPage } from './Pages/Settings';
import Home from './Pages/Home';
import settings  from './settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen'

import { AccentPage } from './Pages/Settings/Accent';
import services, { preferences } from './Services/services';
import { SpotifyPlayer } from './Pages/SpotifyPlayer';
import { ServiceSettings } from './Pages/Settings/ServiceSettings';
import LoadingScreen from './components/LoadingScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import { useEffect, useState, useCallback } from 'react';
import { DIALOGFLOW_API_CLIENT_EMAIL, DIALOGFLOW_API_PRIVATE_KEY, DIALOGFLOW_API_PROJECT_ID, RAPIDAPI_KEY } from "@env";
// import { AppRegistry } from 'react-native';

export default function Index() {
  // const { data, error } = useSWR("/api/peopl");
  const [isLoaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    loadConfig();
  }, [])

  async function loadConfig() {
    SplashScreen.hide();

    setMessage("Loading settings...")
    await loadSettings().catch(() => {
      settings.first_time = true;
    });

    setMessage("Loading the main services...")
    var dialogflow_key = DIALOGFLOW_API_PRIVATE_KEY;
    if (dialogflow_key != undefined && DIALOGFLOW_API_CLIENT_EMAIL && DIALOGFLOW_API_PROJECT_ID) {
      Dialogflow_V2.setConfiguration(
        DIALOGFLOW_API_CLIENT_EMAIL,
        dialogflow_key!,
        Dialogflow_V2.LANG_ENGLISH,
        DIALOGFLOW_API_PROJECT_ID,
      );
      console.log("DialogFlow was loaded successfully")
    } else {
      settings.apis.dialogflow_api = false;
      console.warn("Speech was disabled for a good reason.")
    }
    
    var services_apikey = RAPIDAPI_KEY;
    if (services_apikey == undefined) {
      settings.apis.service_api = false;
      console.warn("Services are disabled for a good reason.")
    } else {
      console.log("RAPIDAPI was loaded successfully")
    }


    if (settings.first_time == false) {
      setMessage("Loading user preferences...")
      await loadPreferences();
    }

    setLoaded(true);
  }

  if (isLoaded) {
     return <Navigation/>;
  } else {
    return <LoadingScreen  message = {message} />
  }
}
 
const Stack = createStackNavigator();  
function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown:false}}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsPage} 
          options={({navigation, route}) => ({
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => navigation.navigate('Home')}
              />
            ),
            headerTintColor: "white",
            headerStyle: {
              backgroundColor:"#263238"
            }
       })}
          
        />

      <Stack.Screen 
          name="Accent" 
          component={AccentPage} 
          options={{ 
            headerTintColor: "white",
            headerStyle: {
              backgroundColor:"#263238"
            } 
          }}

        />

      <Stack.Screen 
          name="Spotify" 
          component={SpotifyPlayer} 
          options={{ 
            headerTintColor: "white",
            headerStyle: {
              backgroundColor:"#263238"
            } 
          }}

        />

      <Stack.Screen 
          name="Service Settings" 
          component={ServiceSettings} 
          options={{ 
            headerTintColor: "white",
            headerStyle: {
              backgroundColor:"#263238"
            } 
          }}

        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


async function loadSettings() {
  return AsyncStorage.getItem("app_voice_settings").then((value) => {
    if(value !== null) {
        settings.voice = JSON.parse(value); // phrase
    }
  })
}

async function loadPreferences() {
    // await AsyncStorage.clear();

    await AsyncStorage.getItem("user_services").then((value) => {
      if(value !== null) {
          preferences.services = JSON.parse(value); // phrase
      }
    }).catch(() => {
      console.warn("User service preferences are missing.")
    });
  // });:
  
    await AsyncStorage.getItem("user_phrases").then((value) => {
      if(value !== null) {
        preferences.phrases = JSON.parse(value); // phrase
      }
    }).catch(() => {
      console.warn("User phrase preferences are missing.")
    });
}