import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Pressable, StyleSheet, View} from 'react-native';
import Config from 'react-native-config';
import {SignInNavParamList} from '../../AppInner';
import Text from '../components/Text';
import * as KakaoLogin from '@react-native-seoul/kakao-login';

type SignInPageNavigationProp = NativeStackNavigationProp<
  SignInNavParamList,
  'SignIn'
>;

type SignInProps = {
  navigation: SignInPageNavigationProp;
};

export default function SignIn(props: SignInProps) {
  const navigation = props.navigation;

  const LoginWithKakao = async () => {
    console.log('카카오 로그인');
    const token = await KakaoLogin.login();
    const profile = await KakaoLogin.getProfile();
    try {
      console.log(token);
      console.log(profile.nickname);
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
