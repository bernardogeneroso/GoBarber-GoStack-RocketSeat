import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Platform, Alert} from 'react-native';
import {format} from 'date-fns';
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
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  CalendarTitle,
  Schedule,
  ScheduleTitle,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

interface RouteParams {
  providerId: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const {providerId} = route.params as RouteParams;

  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {user} = useAuth();
  const {goBack, navigate} = useNavigation();

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

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((response) => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((id: string) => {
    setSelectedProvider(id);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') setShowDatePicker(false);

    if (date) setSelectedDate(date);
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('/appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', {date: date.getTime()});
    } catch (err) {
      Alert.alert(
        'Error creating appointment',
        'There was an error creating the schedule, please try again!',
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({hour}) => hour < 12)
      .map(({hour, available}) => {
        return {
          hour,
          hourFormated: format(new Date().setHours(hour), 'HH:00'),
          available,
        };
      });
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({hour}) => hour >= 12)
      .map(({hour, available}) => {
        return {
          hour,
          hourFormated: format(new Date().setHours(hour), 'HH:00'),
          available,
        };
      });
  }, [availability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Hairdressers</HeaderTitle>

        <UserAvatar source={{uri: user.avatar_url}} />
      </Header>

      <Content>
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
            <OpenDatePickerButtonText>
              Select other date
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              onChange={handleDateChange}
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              textColor="#f4ede8"
            />
          )}
        </Calendar>

        <Schedule>
          <ScheduleTitle>Choose a time</ScheduleTitle>

          <Section>
            <SectionTitle>Morning</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({available, hourFormated, hour}) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={hourFormated}
                  onPress={() => handleSelectHour(hour)}>
                  <HourText selected={selectedHour === hour}>
                    {hourFormated}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Afternoon</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(({available, hourFormated, hour}) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={hourFormated}
                  onPress={() => handleSelectHour(hour)}>
                  <HourText selected={selectedHour === hour}>
                    {hourFormated}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Schedule</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
