/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/index';
import {name as appName} from './app.json';

import Amplify, { Storage } from 'aws-amplify';
import config from './aws-exports'
Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

import { Provider } from 'react-redux';
import store from './src/ReduxStore/store';

const ReduxTutorial = () =>
  <Provider store={store}>
    <App />
  </Provider>

AppRegistry.registerComponent(appName, () => ReduxTutorial);