import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Pressable, StyleSheet, View, Text, Platform} from 'react-native';
import Config from 'react-native-config';
import {SignInNavParamList} from '../../AppInner';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import axios, {AxiosError} from 'axios';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import appleAuth from '@invertase/react-native-apple-authentication';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import {Ex, Splash} from '../components/animations';
import {useEffect} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useSelector} from 'react-redux';

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
  const lang = useSelector((state: RootState) => state.user.lang);

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

  useEffect(() => {
    if (Platform.OS === 'ios') {
      console.log(Config.GOOGLE_IOS_CLIENT_ID);
      console.log(Config.GOOGLE_CLIENT_ID);
      GoogleSignin.configure({
        iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
        webClientId: Config.GOOGLE_CLIENT_ID,
        offlineAccess: true,
      });
    } else {
      GoogleSignin.configure({
        webClientId: Config.GOOGLE_CLIENT_ID,
        offlineAccess: true,
      });
    }
  }, []);
  const LoginWithGoogle = async () => {
    console.log('구글 로그인');
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const res = await fetch('https://www.googleapis.com/oauth2/v3/token', {
        method: 'POST',
        body: JSON.stringify({
          code: userInfo.serverAuthCode,
          clientId: Config.GOOGLE_CLIENT_ID,
          clientSecret: Config.GOOGLE_CLIENT_SECRET,
          grant_type: 'authorization_code',
        }),
      });
      const data = await res.json();
      const response = await axios.post(`${Config.API_URL}/auth/login`, {
        socialType: 'google',
        googleAccessToken: data.access_token,
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
      console.log(error);
    }
  };

  return (
    <View style={styles.entire}>
      <View style={styles.title}>
        <Splash loop={true} />
      </View>
      <View style={styles.btnView}>
        <Pressable
          style={[styles.btn, {backgroundColor: '#FEE500'}]}
          onPress={() => LoginWithKakao()}>
          <SvgXml
            xml={
              lang == 'en'
                ? svgList.socialLogin.kakaoEng
                : svgList.socialLogin.kakao
            }
          />
        </Pressable>
        {Platform.OS == 'ios' && (
          <Pressable
            style={[styles.btn, {backgroundColor: '#000000'}]}
            onPress={() => LoginWithApple()}>
            <SvgXml
              xml={
                lang == 'en'
                  ? svgList.socialLogin.appleEng
                  : svgList.socialLogin.apple
              }
              width={160}
              height={32}
            />
          </Pressable>
        )}
        <Pressable
          style={[
            styles.btn,
            {
              backgroundColor: 'white',
              borderRadius: 7,
              borderWidth: 1,
              borderColor: '#DEDEDE',
            },
          ]}
          onPress={() => LoginWithGoogle()}>
          <SvgXml
            xml={
              lang == 'en'
                ? svgList.socialLogin.googleEng
                : svgList.socialLogin.kakao
            }
          />
        </Pressable>
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
