import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Pressable, StyleSheet, View} from 'react-native';
import Config from 'react-native-config';
import {SignInNavParamList} from '../../AppInner';
import Text from '../components/Text';

type SignInPageNavigationProp = NativeStackNavigationProp<
  SignInNavParamList,
  'SignIn'
>;

type SignInProps = {
  navigation: SignInPageNavigationProp;
};

export default function SignIn(props: SignInProps) {
  const navigation = props.navigation;
  return (
    <View>
      <Text>{Config.API_URL}</Text>
      <Pressable style={styles.kakao}>
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
