import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import {Keyboard, Pressable, StyleSheet, TextInput, View} from 'react-native';
import Config from 'react-native-config';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSelector} from 'react-redux';
import Text from '../components/Text';

export default function PhoneLogin() {
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
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

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
    const keyboardHandler = Keyboard.addListener('keyboardWillHide', () => {
      nameRef.current?.blur();
      phoneRef.current?.blur();
      authRef.current?.blur();
    });
    return () => {
      keyboardHandler.remove();
    };
  });

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
      authRef.current?.focus();
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
    <View>
      <Text>PhoneLogin</Text>
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
        onSubmitEditing={() => {
          sendAuthNum();
          authRef.current?.focus();
        }}
      />
      {isSent && (
        <TextInput
          placeholder="인증번호"
          style={styles.input}
          placeholderTextColor={'#3C3C4399'}
          value={authNum}
          onChangeText={e => setAuthNum(e.trim())}
          ref={authRef}
        />
      )}
      {isSent && (
        <View>
          <Text style={styles.timer}>{formatSectoMin(time)}</Text>
        </View>
      )}
      {isSent && (
        <Pressable onPress={() => checkAuthNum()}>
          <Text>인증번호 확인</Text>
        </Pressable>
      )}
      {phoneToken && <Text>{phoneToken}</Text>}
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
            : {backgroundColor: '#000000'},
        ]}>
        {!isSent ? <Text>인증번호 받기</Text> : <Text>가입하기</Text>}
      </Pressable>
      <Pressable onPress={() => console.log(accessToken)}>
        <Text>acct</Text>
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
  enterBtn: {
    borderRadius: 7,
  },
  timer: {
    color: '#FF3B30',
  },
});
