import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';

import {useAuth} from '../../hooks/Auth';
import api from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  CalendarTitle,
} from './styles';
import {Platform} from 'react-native';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const {providerId} = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {user} = useAuth();
  const {goBack} = useNavigation();

  useEffect(() => {
    api.get('/providers').then((response) => {
      const providerList = response.data;

      const providerSelected = providerList.find(
        (provider: Provider) => provider.id === selectedProvider,
      );
      const providersRemovedSelected = providerList.filter(
        (provider: Provider) => provider.id !== selectedProvider,
      );

      const providerNewList = [providerSelected, ...providersRemovedSelected];

      setProviders(providerNewList);
    });

    if (!user.avatar_url)
      user.avatar_url =
        'https://img.pngio.com/simple-user-icon-transparent-png-stickpng-user-logo-png-2240_2240.png';
  }, []);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((id: string) => {
    setSelectedProvider(id);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state);
  }, [showDatePicker]);

  const handleDateChange = useCallback(() => {}, []);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Hairdressers</HeaderTitle>

        <UserAvatar source={{uri: user.avatar_url}} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={(provider) => provider.id}
          renderItem={({item: provider}) => (
            <ProviderContainer
              selected={provider.id === selectedProvider}
              onPress={() => {
                handleSelectProvider(provider.id);
              }}>
              <ProviderAvatar
                source={{
                  uri: provider.avatar_url
                    ? provider.avatar_url
                    : 'https://img.pngio.com/simple-user-icon-transparent-png-stickpng-user-logo-png-2240_2240.png',
                }}
              />
              <ProviderName selected={provider.id === selectedProvider}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>

      <Calendar>
        <CalendarTitle>Choose the date</CalendarTitle>

        <OpenDatePickerButton onPress={handleToggleDatePicker}>
          <OpenDatePickerButtonText>Select other date</OpenDatePickerButtonText>
        </OpenDatePickerButton>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            onChange={handleDateChange}
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          />
        )}
      </Calendar>
    </Container>
  );
};

export default CreateAppointment;
