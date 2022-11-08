
import React, { useState,  useEffect } from 'react';
import { Text, View } from 'react-native';
import { appBarStyles } from '../assets/css/appBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Pressable,
} from 'react-native'


function AppBar ({ navigation }) {
    const [currentDate, setCurrentDate] = useState('');
    
    useEffect(() => {
        setCurrentDate(
          "Session started at "+ new Date().toLocaleString()
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