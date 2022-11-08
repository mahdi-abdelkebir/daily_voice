
import {StyleSheet} from 'react-native';

export const speechBarStyles = StyleSheet.create({

  section: {
    // borderTopWidth: 1,
    // borderTopColor: '#f0d1fc',

    backgroundColor:  '#fafafa',
    height:80,
    shadowColor: 'black',
  },
  
  volumeSection: {
    // position: 'absolute',
    top:25,
    left:20,
    height: 30,
    width:50,
    borderRadius: 30/2,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:  '#e8e3e38C',
    color: '#676762'
  },

  soundSection: {
    position: 'absolute',
    top:20,
    right:20,
    height: 40,
    width:40,
    borderRadius: 40/2,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:  '#e8e3e38C',
    color: '#676762'
  },

  
  buttonSection: {
    position: 'absolute',
    bottom:8,
    right:"40%"
  },

  buttonView: {
    marginBottom:0,
    marginRight:20
  },

  button: {
      width: 70,
      height: 70,
      borderRadius: 70/2,
      justifyContent: 'center',
      alignItems:'center',
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 20
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 2,
      backgroundColor:  '#e3e3D6'
    },
  
    // circleText: {
    //   color: 'black'
    // },

    microphone: {
      color: '#676762',
      elevation:20
      // color: 'black',
    },

    microphoneActive: {
      color: '#D866FF',
      // shadowColor: 'black',
      // elevation:20
    },


    volume: {
      color: '#c90000',
      elevation:20
      // color: 'black',
    }
});