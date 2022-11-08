
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoadingScreen = (props) => {
    return (
        <View style={styles.centered}>
            <Text style = {styles.loading}>{props.message? props.message : "Loading..." }</Text>
        </View>
      );
}


const styles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFF7F7",
    },
  
    loading: {
      fontSize: 18,
      marginVertical: 2,
    },
  })
  
export default LoadingScreen;