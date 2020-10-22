import styled from 'styled-components/native';
import { Platform, ImageProps } from 'react-native';


export const Container = styled.View`
  flex: 1;
  
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`;

export const BackButton = styled.TouchableOpacity``

export const UserAvatarContent = styled.View`
  justify-content: center;
  align-items: center;
  height: 150px;
`


