import React, {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import { AppRegistry, Text, View } from 'react-native';
import { ScrollView } from 'react-native';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Form, FormItem, Picker } from 'react-native-form-component';
import SettingsList from 'react-native-settings-list';
import { preferences, savePreference } from '../../settings/services';
import LoadingScreen from '../../components/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ServiceSettings({ route, navigation }) {
    const { service, serviceKey} = route.params;
    const [item, setItem]  = useState<any>();
    const [servicePhrase, setServicePhrase]  = useState<string>('');
    
    useEffect(() => {
        setItem(preferences.services[serviceKey]);
        setServicePhrase(preferences.phrases[serviceKey]);
    }, []);

    function onSummaryDailyChange() {
        const val = !item.daily_summary;
        const updatedValue = {daily_summary: val}
        savePreference(serviceKey, "daily_summary", val);
        setItem(item => ({
            ...item,
            ...updatedValue
          }));
    }

    async function setPhrase(newPhrase : string) {
        var result = await savePreference(serviceKey, "phrase", newPhrase);
        if (result == true) {
            alert("Saved with success.")
        } else {
            alert("Error. Save failed.")
        }
    }

    function setAstrology(selectedSign : any) {
        const updatedValue = {sign: selectedSign}
        savePreference(serviceKey, "sign", selectedSign);
        setItem(item => ({
            ...item,
            ...updatedValue
          }));
    }

    function setCategory(selectedCategory : any) {
        const updatedValue = {category: selectedCategory}
        savePreference(serviceKey, "category", selectedCategory)
        setItem(item => ({
            ...item,
            ...updatedValue
          }));
    }

    function setCountry(selectedCountry : any) {
        const updatedValue = {country: selectedCountry}
        savePreference(serviceKey, "country", selectedCountry)
        setItem(item => ({
            ...item,
            ...updatedValue
          }));
    }

    function setPlaylist( newValue : string) {
        const updatedValue = {playlist_id: newValue}
        savePreference(serviceKey, "playlist_id", newValue)
        setItem(item => ({
            ...item,
            ...updatedValue
          }));
    }

    function renderRest() {
        switch( serviceKey) {
            
            case "astrology":
               
                return (
                    // <Text> { JSON.stringify(item) } </Text>)
                    <Picker
                        type="modal"
                        selectedValueStyle={{marginLeft:10}}
                        labelStyle={{marginTop:20, marginBottom:1, "fontSize": 15, marginLeft:10, color: "grey"}}
                        items={ astrologyList }
                        label="Pick a sign"
                        selectedValue={item.sign.value}
                        onSelection={(newItem) => setAstrology(newItem)}
                    />);
            case "youtube":
                return (
                    <>
                    <Picker
                        type="modal"
                        selectedValueStyle={{marginLeft:10}}
                        labelStyle={{marginTop:20, marginBottom:10, "fontSize": 15, marginLeft:10, color: "grey"}}
                        items={ categoryList }
                        label="Pick a category"
                        selectedValue={item.category.value}
                        onSelection={(newItem) => setCategory(newItem)}
                    />
                    <Picker
                        type="modal"
                        selectedValueStyle={{marginLeft:10}}
                        labelStyle={{marginBottom:1, "fontSize": 15, marginLeft:10, color: "grey"}}
                        items={ countryList }
                        label="Pick a country"
                        selectedValue={item.country.value}
                        onSelection={(newItem) => setCountry(newItem)}
                    />
                    </>);
            case "netflix":
                return (
                    <Picker
                        type="modal"
                        selectedValueStyle={{marginLeft:10}}
                        labelStyle={{marginTop:20, marginBottom:1, "fontSize": 15, marginLeft:10, color: "grey"}}
                        items={ catalogueList }
                        label="Pick a category"
                        selectedValue={item.category.value}
                        onSelection={(newItem) => setCategory(newItem)}
                    />);
            case "spotify":
                return (
                    <FormItem
                        labelStyle={{marginTop:15, marginBottom:10, "fontSize": 15, marginLeft:10, color: "grey"}}
                        style= {{"marginBottom":10, borderWidth:1, borderColor: "grey"}}
                        label="Playlist ID"
                        value={item.playlist_id}
                        onChangeText = {(newValue) => setPlaylist(newValue) }
                    />)
        }

    }

    if (!item) 
        return <LoadingScreen message = "Loading service settings..." />
    else 
    return (
      <ScrollView>
        <View style = {{"backgroundColor": "white"}}>
            <View style = {{ "marginBottom":5, "padding":20}}>
                <View style = {{"display": "flex", padding:25, "flexDirection":"row", alignItems:"center", marginBottom:0}}>
                    <CommunityIcon name={service.icon} size={40} /><Text style = {{"color": "black","marginLeft": 30}}>{service.title}</Text></View>
                <Text>{service.description}</Text>
            </View>
            <View style = {{"marginBottom":0, "padding":20}}>
                <Form 
                    buttonStyle={{"marginTop": 20, "marginBottom": 40}}
                    style= {{"marginBottom":20, "backgroundColor": "white", padding:5}} 
                    buttonText = "Edit" 
                    onButtonPress={() => setPhrase(servicePhrase)}>
                    <FormItem
                        style= {{"marginBottom":0, borderWidth:1, borderColor: "grey"}}
                        label="Command"
                        isRequired
                        value={servicePhrase}
                        onChangeText = {(newValue) => setServicePhrase(newValue)}
                    />
                </Form>
                <SettingsList borderColor='#d6d5d9' defaultItemSize={50} >
                    <SettingsList.Item
                        hasNavArrow={false}
                        title='Other'
                        titleStyle={{color:'#009688', marginBottom:10, fontWeight:'500'}}
                        itemWidth={50}
                        borderHide={'Both'}
                    />

                    <SettingsList.Item
                        hasSwitch={true}
                        titleStyle={{fontSize: 15}}
                        switchState={item.daily_summary}
                        switchOnValueChange={onSummaryDailyChange}
                        hasNavArrow={false}
                        title='Daily Summary'   
                    />
                </SettingsList>
                { renderRest() }
            </View>
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
   padding: 20,
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


AppRegistry.registerComponent('Service Settings', () => ServiceSettings);


// TODO: add to service?
const astrologyList = [
    { label: "Aries", value : 0},  { label: "Taurus", value : 1},  { label: "Gemini", value : 2},  { label: "Cancer", value : 3},  { label: "Leo", value : 4},  { label: "Virgo", value : 5}, { label: "Libra", value : 6}, { label: "Scorpio", value : 7}, { label: "Sagittarius", value : 8}, { label: "Capricorn", value : 9}, { label: "Aquarius", value : 10}, { label: "Pisces", value : 11}
];

const categoryList = [
    { label: "All", value : 0},  { label: "Music", value : 1},  { label: "Movies", value : 2}, { label: "Gaming", value : 3}
];

const countryList = [
    { label: "US", value : 0},  { label: "TN", value : 1},  { label: "FR", value : 2}, { label: "TK", value : 3}
];

const catalogueList = [
    { label: "Both", value : 0},  { label: "Movie Only", value : 1},  { label: "Series Only", value : 2}
];