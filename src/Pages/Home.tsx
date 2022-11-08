
import React, {useCallback, useEffect, useRef} from 'react';
import { View, ScrollView, InteractionManager } from 'react-native';
import Tts from 'react-native-tts';
import {Dialogflow_V2} from 'react-native-dialogflow';

import dialogflowConfig from '../env/dialogflow';
import MessageBubble from '../components/MessageBubble';
import SpeechBar from '../components/SpeechBar';
import { globalStyles } from '../assets/css/global';
import AppBar from '../components/AppBar';
// import { NavigationContainer } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

import settings, { updateVoice } from '../env/settings';
import services, { preferences, sendAPIRequest } from '../env/services';

import LoadingScreen from '../components/LoadingScreen';
import WeatherAPI from '../utils/WeatherAPI';
import getFormattedService from '../env/formatter';

type Message = {
  who: string,
  msg: string,
}

export default function Home ({ navigation }) {
  const [isInit, setIsInit] = React.useState(true);
  const [isReady, setIsReady] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isMuted, setMuted] = React.useState<boolean>(settings.voice.mute);
  const scrollView = useRef<any>();

  function loadConfiguration() {
    setIsReady(false);
    
    InteractionManager.runAfterInteractions(() => {
      var accentId = settings.voice.accentId;
      if (accentId != '') {
        Tts.setDefaultVoice(accentId).catch(e => {
          alert("voice not found. "+accentId)
        });
      }

      if (isMuted != settings.voice.mute) { 
        setMuted(settings.voice.mute);
      }

    }).then(() => {
      if (isInit == true) {
        InteractionManager.runAfterInteractions(() => {
          setIsReady(true)
          Tts.getInitStatus();
        }).then(() => {
            setIsInit(false);
            handleGoogleResponse("Hello user, what do you want to know about today?");
        });
      } else {
        setIsReady(true)
      }
    });
  }

  useEffect(() => {
    Tts.setDucking(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      Dialogflow_V2.setConfiguration(
        dialogflowConfig.client_email,
        dialogflowConfig.private_key,
        Dialogflow_V2.LANG_ENGLISH_US,
        dialogflowConfig.project_id,
      );
      loadConfiguration();
    }, [])
  );
  
  
  function getResponse(msg: string) {    
    Dialogflow_V2.requestQuery(msg, 
      (result:any)=> {
        if (result.queryResult)
          handleGoogleResponse(result.queryResult.fulfillmentMessages[0].text.text[0])
        else {
          alert(result.error.code+" - "+result.error.status)
        }
      }, 
      error=> handleGoogleResponse("Error. "+error.message),
    );
  }
    
  function says(who : string, message: string) {
    var newMessage : Message = {who: who, msg: message};
    setMessages(messages => (
      messages.concat(newMessage)
    ));
  }

  function handleGoogleResponse(data : any) {
      says("bot", data);
      if (!isMuted) {
        Tts.speak(data);
      }
  }


  function test() {
    Object(services).forEach(async (service) => {
        var key = service.key ;
        if (key != "spotify" && key != "weather") {
          sendAPIRequest(service)
            .then(data => {
              handleGoogleResponse(key+" "+getFormattedService(key, data))
            })
            .catch(err => handleGoogleResponse("Error. "+key+":  "+err));
          }
      });
  }

  function handleUserRequest(result : string | null) {
    if (result != null) {
      says("user", result.charAt(0).toUpperCase() + result.slice(1));

      var isNormal = true;
      var r = result.toLowerCase();

      const commands = settings.commands;
      for(var k in commands) {
        if (r == commands[k].toLowerCase()) {
          isNormal = false;

          switch(r) {
            case settings.commands.Settings:
              navigation.navigate("Settings");
              break;
            case settings.commands.Mute:
              if (isMuted == false) {
                updateVoice("mute", true);
                setMuted(true);
                handleGoogleResponse(";(")
              } else {
                handleGoogleResponse("why tho")
              }
              break;
            case settings.commands.Unmute:
              if (isMuted == true) {
                updateVoice("mute", false);
                setMuted(false);
                handleGoogleResponse("*deep breath*")
              }
              break;
            case settings.commands.Summary:
              handleGoogleResponse("Executing summary command")
              break;
          }

          return;
        }
      }

      Object(services).forEach((service) => {
        if (r == preferences.phrases[service.key].toLowerCase()) {
          var key = service.key ;
          isNormal = false;
          if (service.key == "spotify") {
            navigation.navigate("Player");
          } else {
            if (key != "spotify" && key != "weather") {
              handleGoogleResponse("Alright, wait a second.")
              sendAPIRequest(service)
                .then(data => {
                  handleGoogleResponse(getFormattedService(key, data))
                })
                .catch(err => handleGoogleResponse("Error. "+key+":  "+err));
            } else {
              handleGoogleResponse("Sorry, these features are not implemented yet.")
            }
          }
        }
      });
    
      if (isNormal)
        getResponse(result);
    }
  }

  function request(service : string, index : number) {
    if (service == "weather") {
      return WeatherAPI();
    } else {
      return sendAPIRequest(index);
    }
  }

  function onPressSpeaker() {
    const muted = !isMuted;
    updateVoice("mute", muted);
    setMuted(muted);
  };
  // muteHandle(isMuted) {
    
  //   if (isMuted) {
  //     Tts.setDefaultPitch(0)
  //   } else {
  //     Tts.setDefaultPitch(1)
  //   }

  //   this.setState({
  //     'mute': isMuted
  //   })
  // }

  if (!isReady)
    return <LoadingScreen/>
  else
    return (
      <View style={globalStyles.outer}>
          <AppBar
           navigation = {navigation}
          />
          <ScrollView ref={scrollView} style={globalStyles.messages}
          onContentSizeChange={ () => {  
            scrollView.current.scrollToEnd( { animated: false } )
        } } >
            <View style={{height: 10}}/> 
              {
                messages.map(function(item, index) {
                    return <MessageBubble key = {index} who={item.who} message={item.msg} />
                })
              }
              <View style={{height: 5}}/> 
          </ScrollView>

          <SpeechBar
            isMuted = {isMuted}
            muteCallback = {onPressSpeaker}
            resultCallback = {handleUserRequest}
          />
      </View>
    );
}