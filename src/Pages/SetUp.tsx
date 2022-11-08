
import React, { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

import SettingsList from 'react-native-settings-list';
import settings, { updateVoice } from '../env/settings';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import services, { preferences } from '../env/services';
import { InteractionManager} from 'react-native';
import LoadingScreen from '../components/LoadingScreen';


export function SettingsPage({ navigation }) {
    var [isReady, setReady] = React.useState<any>(false);
    var [services, setServices] = React.useState<any>();

    function loadScreen() {
      InteractionManager.runAfterInteractions(() => {
        setServices(preferences.services);
      }).then(() => {
        setReady(true)
      });
    }
    
    function onSummaryDailyChange(service) {
        const val = !service.daily_summary;
        const updatedValue = {daily_summary: val}
        const updatedService = {
            ...service,
            ...updatedValue
          }
          
        setServices(item => ({
            ...item,
            ...updatedService
          }));
    }

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
                title='Mute Bot'
            />
            <SettingsList.Item
              title='Accent'
              onPress = {() => navigation.navigate("Accent")}
              itemWidth={70}
              titleStyle={{color:'black', fontSize: 16}}
              hasNavArrow={true}
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