import { useNetInfo } from '@react-native-community/netinfo';
import React from 'react';
import { useEffect } from 'react';
import { dialog_auth } from '../Services/dialogflow';

const NetworkDetector = () => {

    const netInfo = useNetInfo();
    useEffect(() => {
      if (netInfo.isConnected) {
        dialog_auth();
        console.log("DialogAuth: connected")
      } else {
        console.log("DialogAuth: disconnected")
      }
    }, [netInfo]);

    return (
      <>
      </>
    )
}

export default NetworkDetector;