import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import Text from '../components/Text';
import {useRef, useState} from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSelector} from 'react-redux';

export default function EnterName() {
  const [name, setName] = useState('');
  const nameRef = useRef<TextInput>(null);
  const dispatch = useAppDispatch();
  const accessToken = useSelector((state: RootState) => state.user.preAcc);
  const refreshToken = useSelector((state: RootState) => state.user.preRef);
  const enterName = async () => {
    console.log(accessToken);
    try {
      const response = await axios.patch(
        `${Config.API_URL}/auth/name`,
        {
          name: name,
        },
        {headers: {Authorization: `Bearer ${accessToken}`}},
      );
      console.log(response.data);

      dispatch(userSlice.actions.setToken({accessToken: accessToken}));
      await EncryptedStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      <Text>EnterName</Text>
      <TextInput
        placeholder="이름"
        style={styles.input}
        placeholderTextColor={'#3C3C4399'}
        value={name}
        onChangeText={e => setName(e.trim())}
        ref={nameRef}
        onSubmitEditing={() => {
          enterName();
        }}
      />
      <Pressable onPress={() => enterName()}>
        <Text>이름 입력</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#3C3C4399',
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: 'white',
    color: 'black',
  },
});
