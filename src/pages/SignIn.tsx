import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Pressable, StyleSheet, View, Text, Platform} from 'react-native';
import Config from 'react-native-config';
import {SignInNavParamList} from '../../AppInner';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import axios, {AxiosError} from 'axios';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import appleAuth from '@invertase/react-native-apple-authentication';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';

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

  const loginInAdmin = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/auth/login`, {
        socialType: 'admin',
        adminId: 'admin',
        adminPw: 'admin-philta',
      });
      dispatch(
        userSlice.actions.setToken({accessToken: response.data.accessToken}),
      );
      await EncryptedStorage.setItem(
        'refreshToken',
        response.data.refreshToken,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const LoginWithKakao = async () => {
    console.log('카카오 로그인');
    const token = await KakaoLogin.login();
    const profile = await KakaoLogin.getProfile();
    try {
      const response = await axios.post(`${Config.API_URL}/auth/login`, {
        socialType: 'kakao',
        kakaoAccessToken: token.accessToken,
      });
      console.log('kakao token:', token.accessToken);
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
      const errorResponse = (
        error as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };

  const quit = async () => {
    try {
      const response = await axios.delete(`${Config.API_URL}/auth/quit`);
      console.log(response.data);
    } catch (error) {
      const errorResponse = (
        error as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };

  const LoginWithApple = async () => {
    console.log('애플 로그인');
    const applelAuthResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      // nonceEnabled: false,
    });
    console.log(applelAuthResponse);
    const {authorizationCode, fullName, user} = applelAuthResponse;

    const credentialState = await appleAuth.getCredentialStateForUser(user);
    if (credentialState === appleAuth.State.REVOKED) {
      console.log('revoked');
      quit();
      return;
    } else if (credentialState === appleAuth.State.AUTHORIZED) {
      try {
        if (!authorizationCode) return;
        console.log('auth', authorizationCode);

        // console.log(name);
        const response = await axios.post(`${Config.API_URL}/auth/login`, {
          socialType: 'apple',
          authCode: authorizationCode,
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
            userSlice.actions.setToken({
              accessToken: response.data.accessToken,
            }),
          );
          await EncryptedStorage.setItem(
            'refreshToken',
            response.data.refreshToken,
          );
        }
      } catch (error) {
        const errorResponse = (
          error as AxiosError<{message: string; statusCode: number}>
        ).response;
        console.log(errorResponse?.data);
      }
    }
  };
  return (
    <View style={styles.entire}>
      <Pressable
        onPress={() =>
          // dispatch(userSlice.actions.setToken({accessToken: '1234'}))
          loginInAdmin()
        }
        style={styles.title}>
        <Text style={styles.titleTxt}>필타</Text>
      </Pressable>
      <View style={styles.btnView}>
        <Pressable
          style={[styles.btn, {backgroundColor: '#FEE500'}]}
          onPress={() => LoginWithKakao()}>
          <SvgXml xml={svgList.socialLogin.kakao} />
        </Pressable>
        {Platform.OS == 'ios' && (
          <Pressable
            style={[styles.btn, {backgroundColor: '#000000'}]}
            onPress={() => LoginWithApple()}>
            <SvgXml xml={svgList.socialLogin.apple} />
          </Pressable>
        )}
        <Pressable
          style={[styles.btn, {backgroundColor: '#F4F4F4'}]}
          onPress={() => {
            navigation.navigate('PhoneLogin');
          }}>
          <SvgXml xml={svgList.socialLogin.phone} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  titleTxt: {
    fontSize: 16,
    fontFamily: 'Eulyoo1945-SemiBold',
    fontWeight: '600',
    color: '#000000',
  },
  btnView: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  btn: {
    width: '100%',
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#FEE500',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
