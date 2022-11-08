
import {StyleSheet} from 'react-native';
export const appBarStyles = StyleSheet.create({

    AppBar: {
        height: 40,
        backgroundColor: '#D866FF',
        display:'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        paddingHorizontal:10,
        alignItems:'center',
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: -10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.3,
        elevation:15,
    },
  
    appTitle: {
      color: 'black'
    },

    // microphoneActive: {
    //     color: 'blue',
    //     shadowColor: 'blue',
    //     elevation:5
    // },
  
    // microphoneInactive: {
    //     color: '#c90000',
    //     elevation:20
    //     // color: 'black',
    // },
  
});