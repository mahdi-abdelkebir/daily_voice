import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsPage } from './Pages/Settings';
import Home from './Pages/Home';
import settings  from './env/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen'

import { AccentPage } from './Pages/Settings/Accent';
import services, { preferences } from './env/services';
import { Player } from './Pages/Player';
import { ServiceSettings } from './Pages/Settings/ServiceSettings';
import LoadingScreen from './components/LoadingScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
export default class Index extends React.Component {
  state: { isLoaded: false }

  constructor(props: any) {
    super(props);
    loadSettings(this);
  }

  render() {
    SplashScreen.hide();

    if (this.state && this.state.isLoaded) {
      return <Navigation />;
    }
    return <LoadingScreen />
  }
}
 
const Stack = createStackNavigator();  
export function Navigation() {
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

async function loadSettings(index : Index) {
  try {
    
    await AsyncStorage.clear();
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

  } catch (e) {
    alert("Loading data ERROR. "+JSON.stringify(e))
  }

  index.setState({"isLoaded": true})
}