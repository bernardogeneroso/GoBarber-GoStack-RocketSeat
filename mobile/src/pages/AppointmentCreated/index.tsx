import React from 'react';
import {Button} from 'react-native';

import {useAuth} from '../../hooks/Auth';

import {Container, Text} from './styles';

const AppointmentCreated: React.FC = () => {
  const {signOut} = useAuth();

  return (
    <Container>
      <Text>Olá AppointmentCreated</Text>
      <Button title="Logout" onPress={signOut} />
    </Container>
  );
};

export default AppointmentCreated;
