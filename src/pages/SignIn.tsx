import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Pressable, StyleSheet, View} from 'react-native';
import Config from 'react-native-config';
import {SignInNavParamList} from '../../AppInner';
import Text from '../components/Text';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import axios from 'axios';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import appleAuth from '@invertase/react-native-apple-authentication';

type SignInPageNavigationProp = NativeStackNavigationProp<
  SignInNavParamList,
  'SignIn'
>;

type SignInProps = {
  navigation: SignInPageNavigationProp;
};

export default function SignIn(props: SignInProps) {
  const navigation = props.navigation;
  const dispatch = useAppDispatch();

  const LoginWithKakao = async () => {
    console.log('카카오 로그인');
    const token = await KakaoLogin.login();
    const profile = await KakaoLogin.getProfile();
    try {
      console.log(token);
      console.log(profile.nickname);
      const response = await axios.post(`${Config.API_URL}/auth/login`, {
        socialType: 'kakao',
        kakaoAccessToken: token.accessToken,
      });
      console.log(response.data);
      if (response.data.isNew) {
        dispatch(
          userSlice.actions.setUser({
            preAcc: response.data.accessToken,
            preRef: response.data.refreshToken,
          }),
        );

        navigation.navigate('EnterName');
      } else {
        dispatch(
          userSlice.actions.setToken({accessToken: response.data.accessToken}),
        );
        await EncryptedStorage.setItem(
          'refreshToken',
          response.data.refreshToken,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const LoginWithApple = async () => {
    console.log('애플 로그인');
    const applelAuthResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    console.log(applelAuthResponse);
    const {authorizationCode, fullName} = applelAuthResponse;

    const familyName = fullName?.familyName;
    const givenName = fullName?.givenName;
    let name = '';
    if (familyName !== null) {
      name = name + familyName;
    }
    if (givenName !== null) {
      name = name + givenName;
    }
    try {
      console.log(authorizationCode);
      console.log(name);
      const response = await axios.post(`${Config.API_URL}/auth/login`, {
        socialType: 'apple',
        appleAccessToken: authorizationCode,
      });
      console.log(response.data);
      if (response.data.isNew) {
        dispatch(
          userSlice.actions.setUser({
            preAcc: response.data.accessToken,
            preRef: response.data.refreshToken,
          }),
        );

        navigation.navigate('EnterName');
      } else {
        dispatch(
          userSlice.actions.setToken({accessToken: response.data.accessToken}),
        );
        await EncryptedStorage.setItem(
          'refreshToken',
          response.data.refreshToken,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      {/* <Text>{Config.API_URL}</Text> */}
      <Pressable style={styles.kakao} onPress={() => LoginWithKakao()}>
        <Text>카카오</Text>
      </Pressable>
      <Pressable style={styles.apple}>
        <Text>애플</Text>
      </Pressable>
      <Pressable
        style={styles.phone}
        onPress={() => {
          navigation.navigate('PhoneLogin');
        }}>
        <Text>전화번호</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  kakao: {
    backgroundColor: '#FEE500',
  },
  apple: {
    backgroundColor: '#000000',
  },
  phone: {
    backgroundColor: '#999999F7',
  },
});
