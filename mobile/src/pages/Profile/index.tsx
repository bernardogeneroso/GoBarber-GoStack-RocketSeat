import React, {useRef, useCallback} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';

import * as Yup from 'yup';

import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';

import api from '../../services/api';
import {useAuth} from '../../hooks/Auth';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  BackButton,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const {user, updateUser} = useAuth();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('The Name field is required'),
          email: Yup.string()
            .required('The E-mail field is required')
            .email('Write a valid email'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (old_password) => !!old_password.length,
            then: Yup.string().required('Required field'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('password', {
              is: (password) => !!password.length,
              then: Yup.string().required('Required field'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Passwords must match'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = Object.assign({
          name,
          email,

          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        });

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert('Profile has been updated');

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const erros = getValidationErrors(err);

          formRef.current?.setErrors(erros);

          return;
        }

        Alert.alert('Profile update error', err.response.data.message);
      }
    },
    [navigation, updateUser],
  );

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Select an avatar',
      },
      (response) => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Error updating avatar...');
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          uri: response.uri,
          name: 'photo.jpg',
          type: 'image/jpg',
        });

        api.patch('/users/avatar', data).then((apiResponse) => {
          updateUser(apiResponse.data);
        });
      },
    );
  }, [updateUser, user.id]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView
          contentContainerStyle={{flex: 1}}
          keyboardShouldPersistTaps="handled">
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{uri: user.avatar_url}} />
            </UserAvatarButton>

            <View>
              <Title>Your profile</Title>
            </View>

            <Form
              initialData={{name: user.name, email: user.email}}
              ref={formRef}
              onSubmit={handleSignUp}
              style={{width: '100%'}}>
              <Input
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
                name="name"
                icon="user"
                placeholder="Name"
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
                name="email"
                icon="mail"
                placeholder="E-mail"
              />
              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                textContentType="password"
                returnKeyType="next"
                containerStyle={{marginTop: 16}}
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
                name="old_password"
                icon="lock"
                placeholder="Old password"
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus();
                }}
                name="password"
                icon="lock"
                placeholder="New password"
              />

              <Input
                ref={confirmPasswordInputRef}
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
                name="passowrd_confirmation"
                icon="lock"
                placeholder="Confirm password"
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}>
                Confirm changes
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
