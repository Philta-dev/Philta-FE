import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
  Platform,
} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSelector} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import {SignInNavParamList} from '../../AppInner';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import TextBold from '../components/TextBold';

type EnterNameNavigationProp = NativeStackNavigationProp<
  SignInNavParamList,
  'EnterName'
>;

type EnterNameProps = {
  navigation: EnterNameNavigationProp;
};

export default function EnterName(props: EnterNameProps) {
  const [keyBoardStatus, setKeyBoardStatus] = useState(false);
  const [name, setName] = useState('');
  const nameRef = useRef<TextInput>(null);

  useEffect(() => {
    const keyBoardShowListener = Keyboard.addListener('keyboardDidShow', e => {
      setKeyBoardHeight(e.endCoordinates.height);
      setKeyBoardStatus(true);
    });
    const keyBoardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyBoardHeight(0);
      setKeyBoardStatus(false);
      nameRef.current?.blur();
    });
    nameRef.current?.focus();

    return () => {
      keyBoardShowListener.remove();
      keyBoardHideListener.remove();
    };
  }, []);
  const dispatch = useAppDispatch();
  const lang = useSelector((state: RootState) => state.user.lang);
  const accessToken = useSelector((state: RootState) => state.user.preAcc);
  const refreshToken = useSelector((state: RootState) => state.user.preRef);
  const [keyBoardHeight, setKeyBoardHeight] = useState(0);
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
    <View
      style={[
        styles.entire,
        Platform.OS === 'ios'
          ? keyBoardStatus
            ? {paddingBottom: 40 + keyBoardHeight}
            : {paddingBottom: 80 + keyBoardHeight}
          : keyBoardStatus
          ? {paddingBottom: 50}
          : {paddingBottom: 80},
      ]}>
      <View>
        <Pressable
          style={styles.backBtn}
          onPress={() => props.navigation.goBack()}>
          <SvgXml xml={svgList.backBtn} width={24} height={24} />
        </Pressable>
        <Text style={styles.titleTxt}>
          {lang == 'en'
            ? 'Enter a nickname\nto complete registration'
            : '닉네임을 입력하면\n회원가입이 완료됩니다.'}
        </Text>
        <TextInput
          placeholder={lang == 'en' ? 'nickname' : '닉네임'}
          style={styles.input}
          placeholderTextColor={'#3C3C4399'}
          value={name}
          onChangeText={e => setName(e.trim())}
          ref={nameRef}
          maxLength={20}
          onSubmitEditing={() => {
            enterName();
          }}
        />
        <Text
          style={{
            color: '#3C3C4399',
            fontSize: 14,
            lineHeight: 31,
            textAlign: 'right',
          }}>
          {name.length.toString() + '/20'}
        </Text>
      </View>
      <Pressable
        onPress={() => enterName()}
        style={[
          styles.submitBtn,
          name ? {backgroundColor: '#5856D6'} : {backgroundColor: '#9B9EA5'},
        ]}>
        <Text style={styles.btnTxt}>{lang == 'en' ? 'confirm' : '완료'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    padding: 20,
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  backBtn: {
    marginLeft: 4,
  },
  titleTxt: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '600',
    // fontFamily: 'KoPubWorld Batang_Pro Bold',
    marginVertical: 24,
  },
  input: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 12,
    paddingHorizontal: 2,
    textAlignVertical: 'bottom',
  },
  submitBtn: {
    borderRadius: 7,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
});
