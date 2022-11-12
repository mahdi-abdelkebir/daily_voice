
import React, { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Alert
} from 'react-native';

import SettingsList from 'react-native-settings-list';
import settings, { clearAllData, updateSettings } from '../Parameters/settings';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import services from '../Parameters/services';
import { InteractionManager} from 'react-native';
import LoadingScreen from '../Components/LoadingScreen';
import preferences from '../Parameters/preferences';


export function SettingsPage({ navigation }) {
    var [isReady, setIsReady] = React.useState(false);
    var [isMuted, setMute] = React.useState<boolean>();
    var [language, setLanguage] = React.useState<string>();
    var [phrases, setPhrases] = React.useState<any>();

    function loadScreen() {
      setIsReady(false)
      InteractionManager.runAfterInteractions(() => {
        setMute(settings.voice.mute);
        setLanguage(settings.voice.languageId);
        // setServices(preferences.services);
        setPhrases({
          services: preferences.phrases,
          commands: settings.commands,
        })
      }).then(() => {
        setIsReady(true)
      });
    }
    
    useFocusEffect(
        useCallback(() => {
          loadScreen();
            
            // Do something when the screen is focused
            // return () => {
            //     alert('Screen was unfocused');
            //     Do something when the screen is unfocused
            //     Useful for cleanup functions
            // };
        }, [])
    );

    // useEffect(() => {
    //   loadScreen();
    // }, [])

    function renderService(service) {
      return (<SettingsList.Item
        key={service.key}
        title={service.title}
        titleInfo={phrases.services[service.key]}
        itemWidth={70}
        onPress={() => navigation.navigate("Service Settings", {service: service, serviceKey: service.key})}
        titleStyle={{color:'black', fontSize: 15}}
        icon={
          <View style={styles.imageStyle}>
              <CommunityIcon name={service.icon} size={30} />
          </View>
        }
      />)
    }
    
    function onMutedChange() {
        try {
            var newState = !isMuted;
            setMute(newState) // for rendering this view
            updateSettings("mute", newState)
        } catch (e) {
            alert("error, can't change data")
        }
    };

    if(!isReady)
      return <LoadingScreen />
    else
      return (<View style={{backgroundColor:'#f6f6f6',flex:1}}>
        <View style={{backgroundColor:'#f6f6f6',flex:1}}>
          <SettingsList borderColor='#d6d5d9' defaultItemSize={50}>
            <SettingsList.Item
                hasNavArrow={false}
                title='Assistant Voice Settings'
                titleStyle={{color:'#009688', marginBottom:10, fontWeight:'500'}}
                itemWidth={50}
                borderHide={'Both'}
            />
            <SettingsList.Item
                hasSwitch={true}
                switchState={isMuted}
                switchOnValueChange={onMutedChange}
                hasNavArrow={false}
                title='Mute Voice'
            />
            <SettingsList.Item
              title='Accent'
              onPress = {() => navigation.navigate("Accent")}
              itemWidth={70}
              titleStyle={{color:'black', fontSize: 16}}
              hasNavArrow={true}
            />

           <SettingsList.Item
              title='Clear session'
              onPress = {() => {
                Alert.alert(
                  "Clear session",
                  "Are you sure about this? All the previous dialogue will be gone.",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    { text: "Yes", onPress: async () => {
                      await clearAllData();

                      settings.clear = true;
                      settings.init = true;
                      settings.session_start_datetime = "",
                      alert("Successfully cleared.");
                    }}
                  ]
                );
              }}
              itemWidth={70}
              titleStyle={{color:'black', fontSize: 16}}
            />

            <SettingsList.Item
              title='Clear Application Data'
              onPress = {async () => {
                Alert.alert(
                  "Clear Application Data",
                  "Are you sure about this? All your custom settings and phrases will be deleted.",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    { text: "Yes", onPress: async () => {
                      await clearAllData();
                      alert("Please restart the application.");
                    }}
                  ]
                );
              }}
              itemWidth={70}
              titleStyle={{color:'black', fontSize: 16}}
            />


            <SettingsList.Header headerStyle={{marginTop:-5}}/>
            <SettingsList.Item
              title='Available Services'

              titleStyle={{color:'#009688', marginBottom:10}}
              itemWidth={70}
              borderHide={'Both'}
              hasNavArrow={false}
            />
            { 
              services.map(service => renderService(service))
            }
            <SettingsList.Header headerStyle={{marginTop:-5}}/>
            <SettingsList.Item
              title='Voice Commands'
              titleStyle={{color:'#009688', marginBottom:10}}
              itemWidth={70}
              borderHide={'Both'}
              hasNavArrow={false}
            />
            <SettingsList.Item
              icon={
                <View style={styles.imageStyle}>
                    <CommunityIcon name="volume-mute" size={30} />
                </View>
              }
              // onPress={() => navigation.navigate("Change Voice Command", props.title, props.titleInfo, setMute)}
              title='Mute'
              titleInfo={phrases.commands.Mute}
              itemWidth={70}
              titleStyle={{color:'black', fontSize: 15}}
              hasNavArrow={false}
            />
            <SettingsList.Item
              icon={
                <View style={styles.imageStyle}>
                    <CommunityIcon name="volume-high" size={30} />
                </View>
              }
              title='Unmute'
              
              titleInfo={phrases.commands.Unmute}
              itemWidth={70}
              titleStyle={{color:'black', fontSize: 15}}
              hasNavArrow={false}
            />
            <SettingsList.Item
              icon={
                <View style={styles.imageStyle}>
                    <CommunityIcon name="post" size={30} />
                </View>
              }
              title='Summary'
              titleInfo={phrases.commands.Summary}
              itemWidth={70}
              titleStyle={{color:'black', fontSize: 15}}
              hasNavArrow={false}
            />

            <SettingsList.Item
              icon={
                <View style={styles.imageStyle}>
                    <CommunityIcon name="application-settings" size={30} />
                </View>
              }
              title='Settings'
              titleInfo={phrases.commands.Settings}
              itemWidth={70}
              titleStyle={{color:'black', fontSize: 15}}
              hasNavArrow={false}
            />
            
            <SettingsList.Item
              icon={
                <View style={styles.imageStyle}>
                    <CommunityIcon name="help-rhombus-outline" size={30} />
                </View>
              }
              title='Settings'
              titleInfo={phrases.commands.Faq}
              itemWidth={70}
              titleStyle={{color:'black', fontSize: 15}}
              hasNavArrow={false} />

            <SettingsList.Header headerStyle={{marginTop: -5}}/>
          </SettingsList>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  imageStyle:{
    marginLeft:15,
    marginRight:20,
    alignSelf:'center',
    width:30,
    height:30,
    justifyContent:'center'
  }
});

AppRegistry.registerComponent('Settings', () => SettingsPage);