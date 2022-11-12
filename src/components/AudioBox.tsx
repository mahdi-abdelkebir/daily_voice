import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native';

import Voice from '@react-native-voice/voice';
import { speechBarStyles } from '../Assets/css/speechBar';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {BoxShadow} from 'react-native-shadow';

const AudioBox = ({ isStarted }) => {
    const [audioLevel, setAudioLevel] = useState(0);

    useEffect(() => {
        Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    }, []);

    function onSpeechVolumeChanged(e: any) {
        setAudioLevel(e.value);
    };
    
    var volumeIcon;
    if (isStarted == true) {
        if (audioLevel > 7) {
            volumeIcon = 'md-volume-high';
        } else if (audioLevel > 3) {
            volumeIcon = 'md-volume-medium';
        } else if (audioLevel > -2) {
            volumeIcon = 'md-volume-low' // 
        } else {
            volumeIcon = 'md-volume-off' // no sound
        }
    } else {
        volumeIcon = 'ios-volume-off-outline';
    }

    return (
    <>
    {/* <View style={{height: 40}}/> */}
    <View style={[speechBarStyles.section]}>
        {/* <FadeView visible={this.state.started}> */}
        <View style={speechBarStyles.volumeSection}>
            <BoxShadow setting={{
                height: 32,
                width:50,
                radius: 32/2,
                style:{marginVertical:2, alignItems:'center'},
                y:1,
                opacity:0.06,
                ...microShadow
            }}>
                <IonIcon name={volumeIcon} size={30}  style={ isStarted == true? [speechBarStyles.microphone, speechBarStyles.microphoneActive]: speechBarStyles.microphone} />
            </BoxShadow>
        </View>
    </View>
    </>
    );
}

export default AudioBox;

const microShadow = {
    color:"#000",
    border:2,
    x:0,
}