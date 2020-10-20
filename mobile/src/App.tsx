import 'react-native-gesture-handler';

import React from 'react';
import {View, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import AppProvider from './hooks';

import Routes from './routes';

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar
      barStyle="light-content"
      backgroundColor="#312e38"
      networkActivityIndicatorVisible
      translucent
    />

    <AppProvider>
      {/* eslint-disable-next-line react-native/no-inline-styles*/}
      <View style={{flex: 1, backgroundColor: '#312e38'}}>
        <Routes />
      </View>
    </AppProvider>
  </NavigationContainer>
);

export default App;
