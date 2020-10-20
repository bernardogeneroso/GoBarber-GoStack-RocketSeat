import React from 'react';
import {Button} from 'react-native';

import {useAuth} from '../../hooks/Auth';

import {Container, Text} from './styles';

const Profile: React.FC = () => {
  const {signOut} = useAuth();

  return (
    <Container>
      <Text>Olá Profile</Text>
      <Button title="Logout" onPress={signOut} />
    </Container>
  );
};

export default Profile;
