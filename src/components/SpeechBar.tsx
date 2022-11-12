import React, { Component } from 'react';
import {
    Pressable,
  TouchableOpacity,
  View,
} from 'react-native';

import Voice, {
  SpeechResultsEvent,
} from '@react-native-voice/voice';
import { check_record_permission, request_record_permission } from '../Tools/record_permission';

import { speechBarStyles } from '../Assets/css/speechBar';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {BoxShadow} from 'react-native-shadow';
import Tts from 'react-native-tts';
import settings from '../Parameters/settings';
import AudioBox from './AudioBox';

type Props = {
    resultCallback: (result: string | null) => void;
    muteCallback: () => void;
    isMuted: boolean;
};

type State = {
    started: boolean
    state: string
    error: string
    log: string
    speakerMuted: boolean
};

class SpeechBar extends Component<Props, State> {
    hasPermissions : boolean = false; 
    timeout: boolean = false;
    result: string | null = '';

    state : State = {
        started: false,
        state: '',
        error: '',
        log: '',
        speakerMuted: settings.voice.mute,
    };

    constructor(props: Props) {
        super(props);
        Voice.onSpeechResults = this.onSpeechResults;
        Voice.onSpeechEnd = this.onSpeechEnd;
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.isMuted !== this.props.isMuted) {
            this.setState({speakerMuted: this.props.isMuted})
        }
    }

    componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
    }

    onSpeechResults = (e: SpeechResultsEvent) => {
        if (e.value != undefined) {
            this.result = e.value[0];
            this._finishListening().then(() => {
                this.props.resultCallback(this.result);
            });
        }
    };

    onSpeechEnd = () => {
        if (this.state.started == true) {
            this.setState({started: false})
        }
    };

    async _startRecognizing() {
        try {
            await Tts.stop();
            await Voice.start('en-US');
        
            this.setState({
                started: true
            });
        } catch (e) {
            console.error(e);
        }
    };


    async _finishListening() { // automatically detect in android; this is for ios
        try {
            this.setState({
                started: false
            });
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    }

  
    async handleSpeech() {
        // this.setState({timeout: true});
        // setTimeout(() => {
        //     this.setState({timeout: false});
        // }, 1000);

        if (this.state.started == false) {

            if (this.hasPermissions == false) {
                // this.setState({
                //     state: 'checking permissions'
                // });

                var permissed = await check_record_permission();
                if (!permissed) {
        
                    // this.setState({
                    //     state: 'no permission'
                    // });
        
                    permissed = await request_record_permission();
        
                    if (!permissed) {
                        return;
                    }
                }

                this.hasPermissions = true;
                // this.setState({
                //     state: 'permission checked!'
                // });
            }
            
            this._startRecognizing();
        } else {
            this._finishListening();
        }
    }

    render() {

        return (
        <View style={[speechBarStyles.section]}>
            {/* <FadeView visible={this.state.started}> */}
            <AudioBox isStarted = {this.state.started}/>
            {/* </FadeView>  */}
            <View style={speechBarStyles.buttonSection}>

                    {/* <Text>{this.state.log}</Text> */}
                    {/* <Text>{this.state.state}</Text> */}

                <View style={speechBarStyles.button} >
                    <TouchableOpacity onPress={() => { this.handleSpeech() }} disabled = {!settings.apis.dialogflow_api}  >
                        <FontAwesomeIcon name="microphone" size={30} style={ this.state.started == true? [speechBarStyles.microphone, speechBarStyles.microphoneActive]: speechBarStyles.microphone} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={speechBarStyles.soundSection}>
                {/* <BoxShadow setting={{
                    height: 40,
                    width:30,
                    radius: 40/2,
                    style:{marginVertical:2, alignItems:'center'},
                    y:1,
                    opacity:0.06,
                    ...microShadow
                }}>  */}
                    <Pressable onPress={() => {
                        this.setState( state => ({
                            speakerMuted: !state.speakerMuted
                        }), () => {
                            this.props.muteCallback();
                        })}}>
                        <MaterialCommunityIcon  name={ this.state.speakerMuted == false? "speaker": "speaker-off"} color="black" size={30} />
                    </Pressable>
                {/* </BoxShadow> */}
            </View>
        </View>
        );
    }
}

export default SpeechBar;
