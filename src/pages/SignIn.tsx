import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Pressable, StyleSheet, View, Text} from 'react-native';
import Config from 'react-native-config';
import {SignInNavParamList} from '../../AppInner';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import axios from 'axios';
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
    <View style={styles.entire}>
      {/* <Text>{Config.API_URL}</Text> */}
      <Pressable
        onPress={() =>
          dispatch(userSlice.actions.setToken({accessToken: '1234'}))
        }
        style={styles.title}>
        <Text style={styles.titleTxt}>필타</Text>
      </Pressable>
      <View style={styles.btnView}>
        <Pressable
          style={[styles.btn, {backgroundColor: '#FEE500'}]}
          onPress={() => LoginWithKakao()}>
          <SvgXml xml={svgList.socialLogin.kakao} width={48} height={48} />
          <Text style={[styles.btnTxt, {color: '#191919'}]}>
            카카오로 시작하기
          </Text>
        </Pressable>
        <Pressable style={[styles.btn, {backgroundColor: '#000000'}]}>
          <SvgXml xml={svgList.socialLogin.apple} width={48} height={48} />
          <Text style={[styles.btnTxt, {color: '#FFFFFF'}]}>
            Apple로 시작하기
          </Text>
        </Pressable>
        <Pressable
          style={[styles.btn, {backgroundColor: '#999999F7', padding: 12}]}
          onPress={() => {
            navigation.navigate('PhoneLogin');
          }}>
          <Text style={[styles.btnTxt, {color: '#48484A'}]}>
            핸드폰 번호로 시작하기
          </Text>
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
    // padding: 12,
    marginBottom: 16,
    backgroundColor: '#FEE500',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnTxt: {
    fontSize: 15,
    fontWeight: '700',
  },
});
