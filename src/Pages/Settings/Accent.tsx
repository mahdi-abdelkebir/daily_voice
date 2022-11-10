import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native';
import { StyleSheet } from 'react-native';
import { AppRegistry, Text, View } from 'react-native';
import Tts, { Voice } from 'react-native-tts';
import { useFocusEffect } from '@react-navigation/native';
import SettingsList from 'react-native-settings-list'
import settings, { updateVoice } from '../../settings';
import { ScrollView } from 'react-native';
import LoadingScreen from '../../components/LoadingScreen';

export function AccentPage() {
  var [accent, setAccent] = React.useState('');
  // var [selectedEngineId, setEngineSelection] = React.useState('');
  var [isLoaded, setLoaded] = React.useState(false);
  var [languages, setLanguages] = React.useState<Voice[]>([]);
  // var [engines, setEngines] = React.useState<Engine[]>([]);

  function setSelection(languageId, accentId) {
    updateVoice("languageId", languageId);
    updateVoice("accentId", accentId);
    setAccent(accentId);
  }

  // function setEngine(engineId) {
  //   updateSettings("engineId", engineId);
  //   setEngineSelection(engineId);
  // }

  function filterVoices(voice : Voice) {
    if (voice.notInstalled==false&&voice.networkConnectionRequired==false) {
      return true;
    }
    return false;
  }
  
  const loadSettings = async () => {
      setAccent(settings.voice.accentId)

      var voices = await Tts.voices();
      if (languages.length != voices.length) {
        await Tts.voices().then(voices => {
          setLanguages(voices.filter(filterVoices).sort((a, b) => a.language.localeCompare(b.language)));
        });
      }

      // setEngineSelection(settings.engineId)
      // await Tts.engines().then(engines => {
      //   setEngines(engines);
      // });

      setLoaded(true);
  }

  useFocusEffect(
    useCallback(() => {
      setLoaded(false);
      loadSettings();
    }, [])
  );

  if (!isLoaded)
    return (
      <LoadingScreen message = "Loading Accents..." />)
  else
    return (
      <ScrollView  style= {styles.container}>
        <SettingsList borderColor='#d6d5d9' defaultItemSize={5}>
            <SettingsList.Item
                hasNavArrow={false}
                title='Assistant Voice Settings'
                titleStyle={{color:'#009688', marginBottom:10, fontWeight:'500'}}
                itemWidth={50}
                borderHide={'Both'}
            />
            {/* <SettingsList.Item
              titleStyle = {styles.header}
                onPress={() => {
                  Tts.requestInstallEngine().catch((e) => {
                    alert("Error: "+e.message)
                  })
                }}
                title='Download Engines'
                borderHide={'Both'}
            /> */}
            <SettingsList.Item
              titleStyle = {styles.header}
              title='Download Accent'
              onPress={() => Tts.requestInstallData()}
              hasNavArrow={true}
            />
            <SettingsList.Header headerStyle={{marginTop:-5}}/>
          
        {/* <View> */}
          <SettingsList.Item
            hasNavArrow={false}
            title='Available Accents'
            titleStyle={{color:'#009688', marginBottom:10, fontWeight:'500'}}
            itemWidth={50}
            borderHide={'Both'}
          />

        </SettingsList>

        <FlatList
         nestedScrollEnabled = {false}
            data={languages}
            extraData={
              accent     // for single item
            }
            renderItem={(i) => 
              <TouchableOpacity 
                onPress={() => setSelection(i.item.language, i.item.id)}
                
              >
                <View style={i.item.id === accent ? [styles.item, styles.voice_select] : [styles.item]}>
                  <Text>{i.item.name}</Text>
                  <Text>{i.item.language}</Text>
                </View>
              </TouchableOpacity>
          }
          />

          
        {/* <View style = {{ marginBottom:20, marginVertical:20, paddingVertical: 10,backgroundColor: "white"}}>
        <View style = {{ borderColor:'#d6d5d9'}} >
          <Text style = {{color:'#009688',marginBottom:5,padding: 10, paddingHorizontal: 15,fontWeight:'500'}}>All engines (select one)</Text>
        </View>
        <FlatList
         nestedScrollEnabled = {false}
            data={engines}
            extraData={
              selectedEngineId     // for single item
            }
            renderItem={(i) => 
              <TouchableOpacity 
                onPress={() => setEngine(i.item.name)}
                
              >
                  <Text style={i.item.name === selectedEngineId ? [styles.item, styles.engine_select] : [styles.item]} >{i.item.name}</Text>
              </TouchableOpacity>
          }
          />
          </View> */}
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
   paddingTop: 10,
  },

  header: {
    padding: 5,
    fontSize: 13.5,
    height: 40,
  },
  
  item: {
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    backgroundColor: "white",
    padding: 10,
    fontSize: 15,
    height: 44,
  },
  voice_select: {
    color: "white",
    backgroundColor: "#A3B0FF"
  },

  engine_select: {
    color: "white",
    backgroundColor: "#FFA3A3"
  },
});


AppRegistry.registerComponent('Select an accent', () => AccentPage);