import {StyleSheet, Text, View} from 'react-native';
import Config from 'react-native-config';

export default function SignIn() {
  return (
    <View>
      <Text>{Config.API_URL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
