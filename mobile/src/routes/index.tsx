import React from 'react';
import {View, ActivityIndicator} from 'react-native';

import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

import {useAuth} from '../hooks/Auth';

const Routes: React.FC = () => {
  const {user, loading} = useAuth();

  if (loading) {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
