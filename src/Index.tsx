import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsPage } from './Pages/Settings';
import Home from './Pages/Home';
import settings, { clearAllData }  from './Parameters/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen'

import { AccentPage } from './Pages/Settings/Accent';
import { SpotifyPlayer } from './Pages/SpotifyPlayer';
import { ServiceSettings } from './Pages/Settings/ServiceSettings';
import LoadingScreen from './Components/LoadingScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { useEffect, useState } from 'react';
import { DIALOGFLOW_API_PRIVATE_KEY, RAPIDAPI_KEY } from "@env";
import preferences from './Parameters/preferences';
import NetworkDetector from './Components/NetworkDetector';
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

    await AsyncStorage.getItem("first_time").then(async (value) => {
      if(value != null) {
        setMessage("Loading settings...")
        await loadSettings();
  
        setMessage("Loading user preferences...")
        await loadPreferences();
        console.log("old user")
      } else {
        settings.first_time = true;
        AsyncStorage.setItem("first_time", "yes");
        console.log("new user")
      }
    }).catch(async (e) => {
      console.warn("first_time returned error", e)
    });
    
    setMessage("Unraveling some secrets...")
    var services_apikey = RAPIDAPI_KEY;
    if (services_apikey == undefined) {
      settings.apis.service_api = false;
      console.warn("Services are disabled for a good reason.")
    } else {
      console.log("RAPIDAPI was loaded successfully")
    }

    var dialog_key = DIALOGFLOW_API_PRIVATE_KEY;
    if (dialog_key == undefined) {
      settings.apis.dialogflow_api = false;
      console.warn("Speech are disabled for a good reason.")
    } else {
      console.log("DialogFlow was loaded successfully")
    }

    setLoaded(true);
  }

  if (isLoaded) {
     return <>
      { settings.apis.dialogflow_api? (<NetworkDetector/>) : <></> }
      <Navigation/>
     </>;
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
  settings.current_date = new Date().toDateString();
  return AsyncStorage.getItem("app_voice_settings").then((value) => {
    if(value !== null) {
        settings.voice = JSON.parse(value); // phrase
    }
  })
}

async function loadPreferences() {
    await AsyncStorage.getItem("user_services").then((value) => {
      if(value !== null) {
          preferences.services = JSON.parse(value); // phrase
          console.log("Loaded user service preferences.")
      }
    }).catch(() => {
      console.warn("User service preferences are missing.")
    });
  // });:
  
    await AsyncStorage.getItem("user_phrases").then((value) => {
      if(value != null) {
        // console.log(JSON.stringify(value))
        preferences.phrases = JSON.parse(value); // phrase
        console.log("Loaded user phrases.")
      }
    }).catch((e) => {
      console.warn("User phrase preferences are missing. "+e)
    });
}