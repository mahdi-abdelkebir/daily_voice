import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsPage } from './Pages/Settings';
import Home from './Pages/Home';
import settings  from './settings/globalsettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen'

import { AccentPage } from './Pages/Settings/Accent';
import services, { dialogflowConfig, preferences } from './settings/services';
import { Player } from './Pages/Player';
import { ServiceSettings } from './Pages/Settings/ServiceSettings';
import LoadingScreen from './components/LoadingScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import { useEffect } from 'react';
import { useState } from 'react';
import { DIALOGFLOW_API_PRIVATE_KEY, RAPIDAPI_KEY } from "@env";
// import { AppRegistry } from 'react-native';


export default function Index() {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    SplashScreen.hide();

    var dialogflow_key = DIALOGFLOW_API_PRIVATE_KEY;
    if (dialogflow_key != undefined) {
      Dialogflow_V2.setConfiguration(
        dialogflowConfig.client_email,
        dialogflow_key!,
        Dialogflow_V2.LANG_ENGLISH_US,
        dialogflowConfig.project_id,
      );
      console.log("success")
    } else {
      settings.apis.dialogflow_api = false;
      console.log("Speech was disabled for a good reason.")
    }
    
    var services_apikey = RAPIDAPI_KEY;
    if (services_apikey == undefined) {
      settings.apis.service_api = false;
      console.warn("Services are disabled for a good reason.")
    } else {
      console.log("success")
    }

    loadSettings().catch((e) => {
      alert("Could not load settings! But that's alright. "+JSON.stringify(e))
    }).finally(() => {
      setLoaded(true)
    });
  }, [])

  
  if (isLoaded) {
     return <Navigation />;
  } else {
    return <LoadingScreen  message = "Loading settings..." />
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
          name="Player" 
          component={Player} 
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
    // await AsyncStorage.clear();
    await AsyncStorage.getItem("mute").then((value) => {
      if(value !== null) {
          settings.voice.mute = eval(value);
      }
    });

    await AsyncStorage.getItem("volume").then((value) => {
      if(value !== null) {
          settings.voice.volume = eval(value);
      }
    });

    await AsyncStorage.getItem("languageId").then((value) => {
      if(value !== null) {
          settings.voice.languageId = value;
      }
    });

    await AsyncStorage.getItem("accentId").then((value) => {
      if(value !== null) {
          settings.voice.accentId = value;
      }
    });

    // getting phrases
    Object.keys(services).forEach(async () => {
      await AsyncStorage.getItem("user_services").then((value) => {
        if(value !== null) {
            preferences.services = JSON.parse(value); // phrase
        }
      });
    });
    
    Object.keys(services).forEach(async () => {
      await AsyncStorage.getItem("user_phrases").then((value) => {
        if(value !== null) {
            preferences.phrases = JSON.parse(value); // phrase
        }
      });
    });
}