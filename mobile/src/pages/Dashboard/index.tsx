import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Avatar} from 'react-native-elements';

import api from '../../services/api';
import {useAuth} from '../../hooks/Auth';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProvidersListText,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderInfoName,
  ProviderMeta,
  ProviderMetaText,
} from './styles';
import {ActivityIndicator} from 'react-native';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [providers, setProviders] = useState<Provider[]>([]);

  const {signOut, user} = useAuth();
  const {navigate} = useNavigation();

  useEffect(() => {
    api.get('/providers').then((response) => {
      setProviders(response.data);
      setLoadingList(false);
    });
  }, []);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', {providerId});
    },
    [navigate],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Welcome, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <Avatar
          size="medium"
          rounded
          title={user.name[0]}
          activeOpacity={0.7}
          onPress={navigateToProfile}
          source={{
            uri: user.avatar_url
              ? user.avatar_url
              : 'https://img.pngio.com/simple-user-icon-transparent-png-stickpng-user-logo-png-2240_2240.png',
          }}
          placeholderStyle={{
            backgroundColor: '#39373b',
          }}
        />
      </Header>

      {loadingList ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{flex: 1, justifyContent: 'center'}}
        />
      ) : (
        <ProvidersList
          data={providers}
          keyExtractor={(provider) => provider.id}
          ListHeaderComponent={
            <ProvidersListText>Hair stylist</ProvidersListText>
          }
          renderItem={({item: provider}) => (
            <ProviderContainer
              onPress={() => navigateToCreateAppointment(provider.id)}>
              <ProviderAvatar
                source={{
                  uri: provider.avatar_url
                    ? provider.avatar_url
                    : 'https://img.pngio.com/simple-user-icon-transparent-png-stickpng-user-logo-png-2240_2240.png',
                }}
              />

              <ProviderInfo>
                <ProviderInfoName>{provider.name}</ProviderInfoName>

                <ProviderMeta>
                  <Icon name="calendar" size={14} color="#ff9000" />
                  <ProviderMetaText>Monday to Friday</ProviderMetaText>
                </ProviderMeta>
                <ProviderMeta>
                  <Icon name="clock" size={14} color="#ff9000" />
                  <ProviderMetaText>8am to 6pm</ProviderMetaText>
                </ProviderMeta>
              </ProviderInfo>
            </ProviderContainer>
          )}
        />
      )}
    </Container>
  );
};

export default Dashboard;
