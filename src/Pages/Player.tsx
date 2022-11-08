import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
// import { LinearGradient } from "expo-linear-gradient";


import AntDesign from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/Feather";
import { 
  auth as SpotifyAuth, 
  remote as SpotifyRemote, 
  ApiScope, 
  ApiConfig,
  PlayerState,
  Track
} from 'react-native-spotify-remote';
import { preferences } from '../env/services';
import { Pressable } from 'react-native';
import { useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';

  // Api Config object, replace with your own applications client id and urls
const spotifyConfig: ApiConfig = {
  clientID: "575c34aa09c54aa1a13f39710652c82d",
  redirectURL: "localhost:8080",
  scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope]
}


export function Player(props) {
  const [isPaused, setPaused] = React.useState(false);
  const [isShuffling, setShuffling] = React.useState(false);
  const [currentPosition, setPosition] = React.useState(0);
  const [onRepeat, setRepeat] = React.useState(0);
  const [track, setTrack] = React.useState<Track>();
  
  async function loadSession() {
    try{
      const session = await SpotifyAuth.authorize(spotifyConfig);
      await SpotifyRemote.connect(session.accessToken);
      await SpotifyRemote.playUri("spotify:playlist:"+preferences.services.spotify.playlist_id);
        // await SpotifyRemote.seek(58000);
      SpotifyRemote.addListener("playerStateChanged", (v : PlayerState) => {
        setTrack(v.track);
        setPosition(v.playbackPosition);
      })

    } catch(err) {
      alert("Couldn't authorize with or connect to Spotify "+err);
      // props.navigation.navigate("Home");
    }   
  }

  useFocusEffect(
    useCallback(() => {
      loadSession(); // this is a promise!
    }, [])
);

  async function nextTrack() {
    await SpotifyRemote.skipToNext();
    setTrack((await SpotifyRemote.getPlayerState()).track)
  }

  async function prevTrack() {
    await SpotifyRemote.skipToPrevious();
    setTrack((await SpotifyRemote.getPlayerState()).track)
  }


  useEffect(() => {
    if (isPaused) {
      SpotifyRemote.pause();
    } else {
      SpotifyRemote.resume();
    }
    // pause or resume accordingly
  }, [isPaused])

  useEffect(() => {
      SpotifyRemote.setShuffling(isShuffling);
  }, [isShuffling])

  useEffect(() => {
    SpotifyRemote.setRepeatMode(onRepeat);
  }, [onRepeat])

  if (!track) 
    return <LoadingScreen />
   else
    return (
      <SafeAreaView style={styles.root}>
        {/* <LinearGradient
          colors={["#0b3057", "#051c30"]}
          style={StyleSheet.absoluteFill}
        /> */}
        <View style={styles.container}>
          <View style={styles.header}>
            {/* <RectButton style={styles.button}>
              <Icon name="chevron-down" color="white" size={24} />
            </RectButton> */}
            <Text style={styles.title}>{track.album.name}</Text>
            {/* <RectButton style={styles.button}>
              <Icon name="more-horizontal" color="white" size={24} />
            </RectButton> */}
          </View>
          <Image source={require("../assets/music.jpg")} style={styles.cover} />
          <View style={styles.metadata}>
            <View>
              <Text style={styles.song}>{track.name}</Text>
              <Text style={styles.artist}>{track.artist.name}</Text>
            </View>
            <AntDesign name="heart" size={24} color="#55b661" />
          </View>
          <View style={styles.slider} />
          <View style={styles.controls}>
            <Pressable onPress = {() => setShuffling(!isShuffling)}>
              <Icon name="shuffle" color={isShuffling? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)"} size={24} /> 
            </Pressable>
            <Pressable onPress = {() => prevTrack()}>
              <AntDesign name="stepbackward" color="white" size={32} />
            </Pressable>
            <Pressable onPress = {() => setPaused(!isPaused)}>
              <AntDesign name={isPaused? "play": "pause"} color="white" size={48} />
            </Pressable>
            <Pressable onPress = {() => nextTrack()}>
              <AntDesign name="stepforward" color="white" size={32} />
            </Pressable>
            <Pressable onPress = {() => setRepeat(onRepeat%3)}>
              <Icon name={onRepeat == 3? "rewind" : "repeat"} color={onRepeat > 0 ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)"} size={24} /> 
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
};


const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  container: {
    margin: 16
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    padding: 16
  },
  title: {
    color: "white",
    padding: 16
  },
  cover: {
    marginVertical: 16,
    width: width - 32,
    height: width - 32
  },
  metadata: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  song: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white"
  },
  artist: {
    color: "white"
  },
  slider: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    width: width - 32,
    borderRadius: 2,
    height: 4,
    marginVertical: 16
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  }
});