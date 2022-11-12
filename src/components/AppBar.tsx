
import React, { useState,  useEffect } from 'react';
import { Text, View } from 'react-native';
import { appBarStyles } from '../Assets/css/appBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Pressable,
} from 'react-native'
import settings from '../Parameters/settings';


function AppBar ({ navigation }) {
    const [currentDate, setCurrentDate] = useState('');
    
    useEffect(() => {
        if (settings.session_start_datetime == "") {
          settings.session_start_datetime = new Date().toLocaleString();
        }

        setCurrentDate(
          "Session started at "+ settings.session_start_datetime
        );
      }, []
    );

    return (
        
        <View style={appBarStyles.AppBar}>
            <Text style={appBarStyles.appTitle}>
                {currentDate}
            </Text>
            <Pressable onPress = {() => navigation.navigate('Settings')}>
              <Ionicons name="settings-sharp" color="#887700" size={21} style={{color: 'black'}} />
            </Pressable>
            
        </View>
      );
}

export default AppBar;