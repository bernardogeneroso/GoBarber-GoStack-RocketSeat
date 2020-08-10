import React from 'react';
import {View, Text, Button} from 'react-native';

import {useAuth} from '../../hooks/Auth';

const Dashboard: React.FC = () => {
  const {signOut} = useAuth();

  return (
    <View>
      <Text>Olá Dashboard</Text>
      <Button title="Logout" onPress={signOut} />
    </View>
  );
};

export default Dashboard;
