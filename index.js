

/**
 * Hiding some pointless logs
 */

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

/**
 * @format CLASS BASED
 */

 import {AppRegistry, LogBox} from 'react-native';
 import {name as appName} from './app.json';
 import Index from './src/Index';
 
 AppRegistry.registerComponent(appName, () => Index);
 