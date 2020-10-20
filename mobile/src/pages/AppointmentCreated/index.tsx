import React, {useCallback} from 'react';
import Icon from 'react-native-vector-icons/Feather';

import {useNavigation, useRoute} from '@react-navigation/native';

import {Container, Title, Description, OkButton, OkButtonText} from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const {reset} = useNavigation();
  const {params} = useRoute();

  const routeParams = params as RouteParams;

  const handleOkPressed = useCallback(() => {
    reset({
      routes: [
        {
          name: 'Dashboard',
        },
      ],
      index: 0,
    });
  }, [reset]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Scheduling complete</Title>
      <Description>
        Descrição grande tesrte som teste sonfehfehfuejhfjeh
      </Description>

      <OkButton onPress={handleOkPressed}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
