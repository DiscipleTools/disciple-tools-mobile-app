//global.fetch = require('whatwg-fetch');
//import 'isomorphic-fetch'
global.fetch = require('jest-fetch-mock');

import { NativeModules } from 'react-native';

NativeModules.RNCNetInfo = {
  getCurrentConnectivity: jest.fn(),
  isConnectionMetered: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};
