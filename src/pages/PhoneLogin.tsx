import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
} from 'react-native';
import Config from 'react-native-config';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSelector} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SignInNavParamList} from '../../AppInner';

type PhoneLoginNavigationProp = NativeStackNavigationProp<
  SignInNavParamList,
  'PhoneLogin'
>;

type PhoneLoginProps = {
  navigation: PhoneLoginNavigationProp;
};

export default function PhoneLogin(props: PhoneLoginProps) {
  const [keyBoardStatus, setKeyBoardStatus] = useState(false);
  const [time, setTime] = useState(180);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authNum, setAuthNum] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [phoneToken, setPhoneToken] = useState('');
  const timerRef = useRef<any>(null);
  const nameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const authRef = useRef<TextInput>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSent) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    }
  }, [isSent]);

  useEffect(() => {
    if (time <= 0) {
      setIsSent(false);
      setTime(180);
    }
  }, [time]);

  useEffect(() => {
    nameRef.current?.focus();
    const keyboardHandler = Keyboard.addListener('keyboardDidHide', () => {
      nameRef.current?.blur();
      setKeyBoardStatus(false);
    });
    const keyboardShowHandler = Keyboard.addListener('keyboardDidShow', () => {
      setKeyBoardStatus(true);
    });
    return () => {
      keyboardHandler.remove();
      keyboardShowHandler.remove();
    };
  }, []);

  const sendAuthNum = async () => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/auth/sendverifycode`,
        {
          phoneNumber: phone,
        },
      );
      console.log(response.data);
      setIsSent(true);
      setTimeout(() => {
        authRef.current?.focus();
      }, 500);
    } catch (error: any) {
      const errorResponse = error.response;
      console.log('cannot send auth msg', error);
    }
  };

  const checkAuthNum = async () => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/auth/confirmverifycode`,
        {
          phoneNumber: phone,
          verifyCode: authNum,
        },
      );
      console.log(response.data);
      setIsVerified(true);
      clearInterval(timerRef.current);
      setPhoneToken(response.data.phoneNumberToken);
    } catch (error: any) {
      const errorResponse = error.response;
      console.log('cannot confirm', errorResponse);
    }
  };

  const login = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/auth/login`, {
        socialType: 'phone',
        name: name,
        phoneNumberToken: phoneToken,
      });
      console.log(response.data.accessToken);
      dispatch(
        userSlice.actions.setToken({accessToken: response.data.accessToken}),
      );
      await EncryptedStorage.setItem(
        'refreshToken',
        response.data.refreshToken,
      );
      console.log('login success');
    } catch (error: any) {
      const errorResponse = error.response;
      console.log('cannot login', errorResponse);
    }
  };

  const isValidPhoneNum = (phone: string) => {
    const regExp = /^\d{3}\d{3,4}\d{4}$/;
    return regExp.test(phone);
  };
  const formatSectoMin = (sec: number) => {
    const min = Math.floor(sec / 60);
    const remainSec = sec % 60;
    return `${min}:${remainSec > 9 ? '' : '0'}${remainSec}`;
  };
  return (
    <View
      style={[
        styles.entire,
        keyBoardStatus ? {paddingBottom: 40} : {paddingBottom: 80},
      ]}>
      <View>
        <Pressable
          style={styles.backBtn}
          onPress={() => props.navigation.goBack()}>
          <SvgXml xml={svgList.backBtn} width={24} height={24} />
        </Pressable>
        <Text style={styles.titleTxt}>회원가입</Text>
        <TextInput
          placeholder="이름"
          style={styles.input}
          placeholderTextColor={'#3C3C4399'}
          value={name}
          onChangeText={e => setName(e.trim())}
          editable={!isSent}
          ref={nameRef}
          onSubmitEditing={() => {
            phoneRef.current?.focus();
          }}
        />
        <TextInput
          placeholder="전화번호"
          style={styles.input}
          placeholderTextColor={'#3C3C4399'}
          value={phone}
          onChangeText={e => {
            setPhone(e.trim());
          }}
          editable={!isSent}
          ref={phoneRef}
          blurOnSubmit={false}
          keyboardType="number-pad"
          onSubmitEditing={() => {
            if (isValidPhoneNum(phone)) {
              sendAuthNum();
            } else {
              phoneRef.current?.focus();
            }
          }}
        />
        {isSent && (
          <View>
            <Pressable
              onPress={() => checkAuthNum()}
              style={[
                styles.authBtn,
                authNum.length == 6
                  ? {backgroundColor: '#5856D6'}
                  : {backgroundColor: '#989BA2F7'},
              ]}>
              <Text style={styles.authBtnTxt}>인증하기</Text>
            </Pressable>

            <TextInput
              placeholder="인증번호"
              style={[styles.input, {marginBottom: 10}]}
              placeholderTextColor={'#3C3C4399'}
              value={authNum}
              onChangeText={e => setAuthNum(e.trim())}
              ref={authRef}
            />
            <Text style={styles.timer}>{formatSectoMin(time)}</Text>
            {isVerified && (
              <Text style={styles.authTxt}>인증이 완료되었습니다.</Text>
            )}
          </View>
        )}
        {phoneToken && <Text>{phoneToken}</Text>}
      </View>
      <Pressable
        disabled={
          !isValidPhoneNum(phone) ||
          name.length == 0 ||
          time <= 0 ||
          (isSent && !isVerified)
        }
        onPress={() => {
          if (isSent) {
            if (isVerified) {
              login();
            } else checkAuthNum();
          } else {
            sendAuthNum();
          }
        }}
        style={[
          styles.enterBtn,
          !isValidPhoneNum(phone) ||
          name.length == 0 ||
          time <= 0 ||
          (isSent && !isVerified)
            ? {backgroundColor: '#C6C6C8'}
            : {backgroundColor: '#5856D6'},
        ]}>
        {!isSent ? (
          <Text style={styles.btnTxt}>인증번호 받기</Text>
        ) : (
          <Text style={styles.btnTxt}>가입하기</Text>
        )}
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
    fontFamily: 'Eulyoo1945-SemiBold',
    marginVertical: 24,
  },
  input: {
    borderColor: '#3C3C4399',
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: 'white',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
  },
  authBtn: {
    borderRadius: 4,
    backgroundColor: '#989BA2F7',
    position: 'absolute',
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 24,
    zIndex: 1,
  },
  authBtnTxt: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  timer: {
    color: '#FF3B30',
    width: '100%',
    textAlign: 'right',
  },
  authTxt: {
    color: '#3C3C4399',
    fontWeight: '600',
    fontFamily: 'Eulyoo1945-SemiBold',
    fontSize: 14,
  },
  enterBtn: {
    borderRadius: 7,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Eulyoo1945-SemiBold',
    textAlign: 'center',
    color: 'white',
  },
});
