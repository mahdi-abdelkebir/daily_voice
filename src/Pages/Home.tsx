
import React, {useCallback, useEffect, useRef} from 'react';
import { View, ScrollView, InteractionManager, Pressable } from 'react-native';
import Tts from 'react-native-tts';
import {Dialogflow_V2} from 'react-native-dialogflow';

import MessageBubble from '../components/MessageBubble';
import SpeechBar from '../components/SpeechBar';
import { globalStyles } from '../assets/css/global';
import AppBar from '../components/AppBar';
// import { NavigationContainer } from '@react-navigation/native';
import { Link, useFocusEffect } from '@react-navigation/native';

import settings, { updateVoice } from '../settings';
import services, { preferences, sendAPIRequest } from '../Services/services';

import LoadingScreen from '../components/LoadingScreen';
import getFormattedService from '../utils/api_formatter';
import { getWeatherInfo } from '../Services/weatherapi';

type Message = {
  who: string,
  msg: string,
}

export default function Home ({ navigation }) {
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
          alert("Voice not found. "+accentId)
        });
      }

      // fetch("http://192.168.1.7:3000/").then((v) => {
      //     alert(JSON.stringify(v))
      // }).catch((e) => {
      //     alert(e)
      // });

      if (isMuted != settings.voice.mute) { 
        setMuted(settings.voice.mute);
      }

      if (settings.clear == true) { 
        setMessages([]);
        settings.clear = false;
      }
    }).then(() => {
      if (settings.init == true) {
        settings.init = false;

        InteractionManager.runAfterInteractions(() => {
          setIsReady(true)
        }).then(async () => {
            if (settings.first_time) {

            }
            handleGoogleResponse("Welcome back, what do you want to know about today?");
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
      loadConfiguration();
    }, [])
  );
  
  
  function getResponse(msg: string) {    
    Dialogflow_V2.requestQuery(msg, 
      (result:any)=> {
        try {
          // if (result.queryResult.fulfillmentText)
          // if (result.queryResult.fulfillmentMessages[0])
          //   handleGoogleResponse(result.queryResult.fulfillmentMessages[0].text.text[0])
          // else
            handleGoogleResponse(result.queryResult.fulfillmentText)
        } catch (e) {
          alert(e+" - "+JSON.stringify(result))
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


  // function test() {
  //   Object(services).forEach(async (service) => {
  //       var key = service.key ;
  //       if (key != "spotify" && key != "weather") {
  //         sendAPIRequest(service)
  //           .then(data => {
  //             handleGoogleResponse(key+" "+getFormattedService(key, data))
  //           })
  //           .catch(err => handleGoogleResponse("Error. "+key+":  "+err));
  //         }
  //     });
  // }

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
              if (settings.apis.service_api == true) {
                var output : any = false;
                handleGoogleResponse("Alright. Let me set things up.");
                Object(services).forEach(async (service) => {
                  var key = service.key ;
                  if (preferences.services[key].daily_summary == true) {
                    output = true;
                    if (key != "spotify") {
                      request(service)
                        .then(data => {
                          handleGoogleResponse(getFormattedService(key, data))
                        })
                        .catch(err => handleGoogleResponse("Error ("+service.title+"): "+err));
                      }
                    }
                });
                
                if (output == true) {
                  handleGoogleResponse("All services summaries are disabled.");
                }
              } else {
                handleGoogleResponse("Sorry, this feature is disabled. I'm just a regular chatbot now.");
              }
              break;
              
          }

          return;
        }
      }

      Object(services).forEach(async (service) => {
        if (r == preferences.phrases[service.key].toLowerCase()) {
          if (settings.apis.service_api == true) {
            var key = service.key ;
            isNormal = false;
            // if (service.key == "spotify") {
            //   navigation.navigate("Player");
            // } else {
              if (key != "spotify") {
                handleGoogleResponse("Alright, wait a second.")
                request(service)
                  .then(data => {
                    console.log(key +" response data: ")
                    console.log(data)
                    handleGoogleResponse(getFormattedService(key, data))
                  })
                  .catch(err => handleGoogleResponse("Error ("+service.title+"): "+err));
              } else {
                handleGoogleResponse("Sorry, this feature ("+ service.title +") are not implemented yet.")
              }
            // }
          } else {
            handleGoogleResponse("Sorry, this feature is disabled. I'm just a regular chatbot now.");
          }
        }
      });
    
      if (isNormal)
        getResponse(result);
    }
  }

  async function request(service) {
    if (service.key == "weather") {
      return await getWeatherInfo();
    } else {
      return await sendAPIRequest(service);
    }
  }

  function onPressSpeaker() {
    const muted = !isMuted;
    updateVoice("mute", muted);
    setMuted(muted);
  };

  function repeatThis(item : Message) {
    if (item.who == "bot") {
      Tts.speak(item.msg);
    }
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
                    return (
                    <Pressable key = {index} onLongPress={() => { repeatThis(item) }}  >
                        <MessageBubble who={item.who} message={item.msg} />
                    </Pressable>);
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