
import React, {useCallback, useEffect, useRef} from 'react';
import { View, ScrollView, InteractionManager, Pressable} from 'react-native';
import Tts from 'react-native-tts';
import NetInfo from "@react-native-community/netinfo";

import MessageBubble from '../Components/MessageBubble';
import SpeechBar from '../Components/SpeechBar';
import { globalStyles } from '../Assets/css/global';
import AppBar from '../Components/AppBar';
// import { NavigationContainer } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

import settings, { updateSettings } from '../Parameters/settings';
import services, { requestAPI } from '../Parameters/services';

import LoadingScreen from '../Components/LoadingScreen';
import getFormattedService from '../Tools/api_formatter';
import preferences from '../Parameters/preferences';
import { dialog_request } from '../Services/dialogflow';
import NetworkDetector from '../Components/NetworkDetector';

type Message = {
  who: string,
  msg: string,
}

export default function Home ({ navigation }) {
  const [isReady, setIsReady] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isMuted, setMuted] = React.useState<boolean>(settings.voice.mute);
  const scrollView = useRef<any>();

  useEffect(() => {
    Tts.setDucking(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadConfiguration();
    }, [])
  );
  
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
              botResponse("Hello user! Nice to meet you! Say F.A.Q. for details on what this application is about and advices on what to say, and please visit the settings menu and check out our available services!");
            } else {
              botResponse("Welcome back, what do you want to know about today?"); 
            }
        });
      } else {
        setIsReady(true)
      }
    });
  }
  
  
  function getDialogResponse(msg: string) {    
    dialog_request(msg, 
      (result:any)=> {
        try {
          // if (result.queryResult.fulfillmentText)
          // if (result.queryResult.fulfillmentMessages[0])
          //   botResponse(result.queryResult.fulfillmentMessages[0].text.text[0])
          // else
            botResponse(result.queryResult.fulfillmentText)
        } catch (e) {
          console.warn(e+" - "+JSON.stringify(result))
        }
      }, 
      error=> {
        botResponse("Error. "+error)
      }
    );
  }
    
  function says(who : string, message: string) {
    var newMessage : Message = {who: who, msg: message};
    setMessages(messages => (
      messages.concat(newMessage)
    ));
  }

  function botResponse(data : any) {
      says("bot", data);
      if (!isMuted) {
        Tts.speak(data);
      }
  }

  async function userRequest(result : string | null) {
    if (result != null) {
      says("user", result.charAt(0).toUpperCase() + result.slice(1));

      var connectionState =  await NetInfo.fetch();
      if (!connectionState.isConnected) {
        if (Math.round(Math.random()) == 1)
          botResponse("User. Please connect to the internet first, so that I can process your words.")
        else
          botResponse("User. Internet connection is required to use this application, so please connect to the internet before talking more.")
        
        return;
      }

      var isNormal = true;
      var r = result.toLowerCase();

      const commands = settings.commands;
      for(var k in commands) {
        if (r == commands[k].toLowerCase()) {
          isNormal = false;

          switch(r) {
            case settings.commands.Faq:
                botResponse("Let me show you the ropes.")
                botResponse("First, I'll tell you about the application. This application was designed to reduce your daily meaningless scrolling thorough Facebook and Youtube pages like a ghost, and set a clear target for yourself.");
                botResponse("Although, our services are limited but our developpers are pretty invested in this application and they may choose to add more later on.");
                botResponse("Next, we have some voice commands. You can choose mute me by telling me to shut up (and please don't do that), you can unmute me by telling me to speak.");
                botResponse("You can check what commands and services we currently have available in the Settings menu. To get there, you can either simply say 'Settings' or click on the Cogwheel icon on your top-right.");
                botResponse("Also, I have to say, we can also just chat casually, as my developpers decided to increase my sense of humour so I think I'm a pretty funny robot.");
                break;
            case settings.commands.Settings:
              navigation.navigate("Settings");
              break;
            case settings.commands.Mute:
              if (isMuted == false) {
                updateSettings("mute", true);
                setMuted(true);
                botResponse(";(")
              } else {
                botResponse("why tho")
              }
              break;
            case settings.commands.Unmute:
              if (isMuted == true) {
                updateSettings("mute", false);
                setMuted(false);
                botResponse("*deep breath*")
              } else {
                botResponse("What are you doing? Are you testing something?")
              }
              break;
            case settings.commands.Summary:
              if (settings.apis.service_api == true) {
                var output : any = false;
                botResponse("Alright. Let me set things up.");
                await Object(services).forEach(async (service) => {
                  var key = service.key;
                  var pref = preferences.services[key];
                  
                  if (pref && pref.daily_summary === true) {
                    output = true;
                    requestAPI(service)
                      .then(data => {
                        botResponse(getFormattedService(key, data))
                      })
                      .catch(err => botResponse("Error ("+service.title+"): "+err));
                    }
                });
                
                if (output == false) {
                  botResponse("All services summaries are disabled.");
                }
              } else {
                botResponse("Sorry, this feature is disabled. I'm just a regular chatbot now.");
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
                botResponse("Alright, wait a second.")
                requestAPI(service)
                  .then(data => {
                    botResponse(getFormattedService(key, data))
                  })
                  .catch(err => botResponse("Error ("+service.title+"): "+err));
              } else {
                botResponse("Sorry, this feature ("+ service.title +") are not implemented yet.")
              }
            // }
          } else {
            botResponse("Sorry, this feature is disabled. I'm just a regular chatbot now.");
          }
        }
      });
    
      if (isNormal)
        getDialogResponse(result);
    }
  }

  function onPressSpeaker() {
    const muted = !isMuted;
    if (muted) {
      Tts.stop();
    }
    updateSettings("mute", muted);
    setMuted(muted);
  };

  async function repeatThis(item : Message) {
    if (item.who == "bot") {
      await Tts.stop();
      Tts.speak(item.msg);
    }
  };
  

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
            resultCallback = {userRequest}
          />
      </View>
    );
}