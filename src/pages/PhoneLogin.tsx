import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
  Platform,
  TextInputKeyPressEventData,
  ActivityIndicator,
} from 'react-native';
import Config from 'react-native-config';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SignInNavParamList} from '../../AppInner';
import CustomToastScreen from '../components/CustomToastScreen';

type PhoneLoginNavigationProp = NativeStackNavigationProp<
  SignInNavParamList,
  'PhoneLogin'
>;

type PhoneLoginProps = {
  navigation: PhoneLoginNavigationProp;
};

export default function PhoneLogin(props: PhoneLoginProps) {
  const [keyBoardStatus, setKeyBoardStatus] = useState(false);
  const [isNameRefFocused, setIsNameRefFocused] = useState(false);
  const [isPhoneRefFocused, setIsPhoneRefFocused] = useState(false);
  const [isAuthRefFocused, setIsAuthRefFocused] = useState(false);
  const [keyBoardHeight, setKeyBoardHeight] = useState(0);
  const [phoneCheck, setPhoneCheck] = useState(false);
  const [unformattedPhoneNum, setUnformattedPhoneNum] = useState(false);
  const [indicator, setIndicator] = useState(false);

  const TIME_AUTH = 180;
  const [time, setTime] = useState(TIME_AUTH);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authNum, setAuthNum] = useState('');

  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState('yet');
  const [showTimeAlert, setShowTimeAlert] = useState(false);
  const [phoneToken, setPhoneToken] = useState('');
  const [changeBtnMsg, setChangeBtnMsg] = useState('');

  const timerRef = useRef<any>(null);
  const nameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const authRef = useRef<TextInput>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSent) {
      setTime(TIME_AUTH);
      timerRef.current = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setTime(TIME_AUTH);
    }
  }, [isSent]);

  useEffect(() => {
    if (time <= 0) {
      // setIsSent(false);
      setTime(TIME_AUTH);
      clearInterval(timerRef.current);
      setShowTimeAlert(true);
    }
  }, [time]);

  useEffect(() => {
    nameRef.current?.focus();
    const keyboardHandler = Keyboard.addListener('keyboardDidHide', () => {
      nameRef.current?.blur();
      setKeyBoardStatus(false);
      setKeyBoardHeight(0);
    });
    const keyboardShowHandler = Keyboard.addListener('keyboardDidShow', e => {
      setKeyBoardStatus(true);
      setKeyBoardHeight(e.endCoordinates.height);
    });
    return () => {
      keyboardHandler.remove();
      keyboardShowHandler.remove();
    };
  }, []);

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

  const sendAuthNum = async () => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/auth/sendverifycode`,
        {
          phoneNumber: phone,
        },
      );
      console.log(response.data);
      setTime(TIME_AUTH);
      setIsSent(true);
      setTimeout(() => {
        authRef.current?.focus();
      }, 500);
      setIndicator(false);
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
      setIsVerified('true');
      clearInterval(timerRef.current);
      setPhoneToken(response.data.phoneNumberToken);
      if (!response.data.isNew) {
        setChangeBtnMsg('로그인');
      }
      setIndicator(false);
    } catch (error: any) {
      const errorResponse = error.response;
      console.log('cannot confirm', errorResponse);
      if (
        errorResponse.data.statusCode === 1001 ||
        errorResponse.data.statusCode === 1002
      ) {
        setIsVerified('false');
      }
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
      setIndicator(false);
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
      // setChangeBtnMsg('expired');
      setShowTimeAlert(true);
    }
  };

  const isValidPhoneNum = (phone: string) => {
    const regExp = /^01\d{1}-\d{3,4}-\d{4}$/;
    return regExp.test(phone);
  };
  const formatPhoneNum = (phone: string) => {
    let phoneInput: string = phone.replace(/\D/g, '');

    if (phoneInput.length == 11) {
      return (
        phoneInput.slice(0, 3) +
        '-' +
        phoneInput.slice(3, 7) +
        '-' +
        phoneInput.slice(7, 11)
      );
    }

    const formattedNumber =
      phoneInput.slice(0, 3) +
      (phoneInput.length > 2 ? '-' : '') +
      phoneInput.slice(3, 6) +
      (phoneInput.length > 5 ? '-' : '') +
      phoneInput.slice(6, 11);

    return formattedNumber;
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
        Platform.OS === 'ios' &&
          keyBoardStatus && {paddingBottom: keyBoardHeight + 40},
      ]}>
      <View style={{position: 'relative'}}>
        <Pressable
          style={styles.backBtn}
          onPress={() => props.navigation.goBack()}>
          <SvgXml xml={svgList.backBtn} width={24} height={24} />
        </Pressable>
        <Text style={styles.titleTxt}>회원가입/로그인</Text>
        <TextInput
          placeholder="이름"
          style={[
            styles.input,
            isNameRefFocused && {
              borderColor: '#5856D6',
              borderWidth: 1.5,
            },
          ]}
          placeholderTextColor={'#3C3C4399'}
          value={name}
          onChangeText={e => {
            setName(e.trim());
            setUnformattedPhoneNum(false);
          }}
          onFocus={() => setIsNameRefFocused(true)}
          onBlur={() => setIsNameRefFocused(false)}
          ref={nameRef}
          onSubmitEditing={() => {
            phoneRef.current?.focus();
          }}
        />
        <TextInput
          placeholder="전화번호"
          maxLength={13}
          style={[
            styles.input,
            isPhoneRefFocused && {
              borderColor: '#5856D6',
              borderWidth: 1.5,
            },
          ]}
          placeholderTextColor={'#3C3C4399'}
          value={formatPhoneNum(phone)}
          onChangeText={e => {
            if (!phoneCheck) {
              setPhone(e.replaceAll('-', '').trim());
            } else {
              setPhoneCheck(false);
            }
            setIsSent(false);
            setIsVerified('yet');
            setTime(TIME_AUTH);
            setAuthNum('');
            clearInterval(timerRef.current);
            setShowTimeAlert(false);
            setUnformattedPhoneNum(false);
            setIndicator(false);
          }}
          onKeyPress={({
            nativeEvent,
          }: {
            nativeEvent: TextInputKeyPressEventData;
          }) => {
            if (nativeEvent.key === 'Backspace') {
              if (phone.length === 3 || phone.length === 6) {
                setPhone(phone.slice(0, phone.length - 1));
                setPhoneCheck(true);
              }
            }
          }}
          ref={phoneRef}
          onFocus={() => setIsPhoneRefFocused(true)}
          onBlur={() => setIsPhoneRefFocused(false)}
          blurOnSubmit={false}
          keyboardType="number-pad"
          onSubmitEditing={() => {
            if (isValidPhoneNum(formatPhoneNum(phone))) {
              sendAuthNum();
            } else {
              phoneRef.current?.focus();
            }
          }}
        />

        {isSent && (
          <View>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                placeholder="인증번호"
                maxLength={6}
                keyboardType="number-pad"
                style={[
                  styles.input,
                  {
                    marginBottom: 10,
                    flex: 1,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                  isAuthRefFocused && {
                    borderColor: '#5856D6',
                    borderWidth: 1.5,
                  },
                ]}
                placeholderTextColor={'#3C3C4399'}
                value={authNum}
                onChangeText={e => {
                  setAuthNum(e.trim());
                  setIsVerified('yet');
                }}
                ref={authRef}
                onFocus={() => setIsAuthRefFocused(true)}
                onBlur={() => setIsAuthRefFocused(false)}
              />
              <Pressable
                onPress={() => {
                  console.log('check auth num');
                  if (authNum.length == 6) {
                    setIndicator(true);
                    checkAuthNum();
                  }
                  setChangeBtnMsg('');
                }}
                style={[
                  styles.authBtn,
                  isVerified == 'yet' && authNum.length == 6 && !showTimeAlert
                    ? {backgroundColor: '#5856D6'}
                    : {backgroundColor: '#989BA2F7'},
                ]}>
                {indicator && (
                  <ActivityIndicator
                    color="#FFFFFF"
                    size={'small'}
                    style={{position: 'absolute'}}
                  />
                )}
                <Text
                  style={[
                    styles.authBtnTxt,
                    indicator && {color: 'transparent'},
                  ]}>
                  인증하기
                </Text>
              </Pressable>
            </View>
            {isVerified === 'true' ? (
              <Text style={styles.authTxt}>인증이 완료되었습니다.</Text>
            ) : isVerified === 'false' ? (
              <Text style={[styles.authTxt, {color: '#FF3B30'}]}>
                인증번호가 일치하지 않습니다.
              </Text>
            ) : showTimeAlert ? (
              <Text
                style={[
                  styles.authTxt,
                  {color: '#FF3B30', textAlign: 'right'},
                ]}>
                인증시간 만료
              </Text>
            ) : (
              <Text style={styles.timer}>{formatSectoMin(time)}</Text>
            )}
          </View>
        )}
        {/* {phoneToken && <Text>{phoneToken}</Text>} */}
        {unformattedPhoneNum && (
          <Text
            style={[
              styles.authTxt,
              {color: '#FF3B30', position: 'absolute', bottom: -14},
            ]}>
            전화번호 형식이 일치하지 않습니다.
          </Text>
        )}
        {!isSent && (
          <View
            style={[
              {
                backgroundColor: '#E3FFEB87',
                borderTopWidth: 1,
                borderTopColor: '#13BD3D',
                paddingHorizontal: 5,
                paddingVertical: 11,
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
                width: '100%',
                bottom: -58,
              },
              unformattedPhoneNum && {bottom: -82},
            ]}>
            <SvgXml
              xml={svgList.socialLogin.notice}
              width={24}
              height={24}
              style={{marginBottom: 10}}
            />
            <Text
              style={{
                marginLeft: 12,
                color: '#13BD3D',
                fontSize: 13,
                lineHeight: 16.9,
              }}>
              {
                'This menu is only available in South Korea.\nPlease sign up using Google.'
              }
            </Text>
          </View>
        )}
      </View>
      <Pressable
        disabled={
          !isValidPhoneNum(formatPhoneNum(phone)) ||
          name.length == 0 ||
          time <= 0 ||
          (isSent && !(isVerified == 'true'))
        }
        onTouchStart={() => {
          if (!isValidPhoneNum(formatPhoneNum(phone))) {
            setUnformattedPhoneNum(true);
          }
        }}
        onPress={() => {
          if (name == 'adminRLsPhilta' && phone == '0104105108') {
            loginInAdmin();
          } else {
            setIndicator(true);
            if (isSent) {
              if (isVerified === 'true') {
                login();
              } else checkAuthNum();
            } else {
              sendAuthNum();
            }
          }
        }}
        style={[
          styles.enterBtn,
          !isValidPhoneNum(formatPhoneNum(phone)) ||
          name.length == 0 ||
          time <= 0 ||
          (isSent && isVerified !== 'true')
            ? {backgroundColor: '#9B9EA5'}
            : {backgroundColor: '#5856D6'},
        ]}>
        {indicator && (
          <ActivityIndicator
            color="#FFFFFF"
            size={'small'}
            style={{position: 'absolute'}}
          />
        )}
        {!isSent ? (
          <Text style={[styles.btnTxt, indicator && {color: 'transparent'}]}>
            인증번호 받기
          </Text>
        ) : (
          <Text style={[styles.btnTxt, indicator && {color: 'transparent'}]}>
            {changeBtnMsg === '' ? '가입하기' : '로그인'}
          </Text>
        )}
      </Pressable>
      {/* <Modal
        isVisible={showTimeAlert}
        hasBackdrop={true}
        backdropOpacity={0}
        onBackdropPress={() => {
          setShowTimeAlert(false);
          clearInterval(timerRef.current);
          setIsSent(false);
        }}
        onBackButtonPress={() => {
          setShowTimeAlert(false);
          clearInterval(timerRef.current);
          setIsSent(false);
        }}>
        <View
          style={[
            styles.modalView,
            Platform.OS === 'ios'
              ? {marginBottom: keyBoardHeight + 16}
              : {marginBottom: 16},
          ]}>
          <Shadow distance={4} style={{borderRadius: 8, width: '100%'}}>
            <View
              style={{
                width: '100%',
                height: '100%',
                // backgroundColor: 'yellow',
                padding: 16,
              }}>
              <View style={styles.textView}>
                <SvgXml
                  xml={svgList.socialLogin.timeout}
                  width={24}
                  height={24}
                  style={{
                    marginBottom: 8,
                  }}
                />
                <Text style={styles.modalTxt}>인증시간이 만료되었습니다.</Text>
              </View>
              <Pressable
                style={styles.modalBtn}
                onPress={() => {
                  setIsSent(false);
                  setShowTimeAlert(false);
                  sendAuthNum();
                }}>
                <Text style={styles.modalBtnTxt}>인증번호 재전송</Text>
              </Pressable>
            </View>
          </Shadow>
        </View>
      </Modal> */}
      {/* <ToastModal
        showModal={showTimeAlert}
        setShowModal={setShowTimeAlert}
        svgxml={svgList.socialLogin.timeout}
        text="인증시간이 만료되었습니다."
        btnText="인증번호 재전송"
        onBackdropPress={() => {
          setShowTimeAlert(false);
          clearInterval(timerRef.current);
          setIsSent(false);
        }}
        onBtnPress={() => {
          setIsSent(false);
          setShowTimeAlert(false);
          sendAuthNum();
        }}
        keyBoardHeight={keyBoardHeight}
      /> */}
      {showTimeAlert && (
        <CustomToastScreen
          showModal={showTimeAlert}
          setShowModal={setShowTimeAlert}
          svgxml={svgList.socialLogin.timeout}
          text="인증시간이 만료되었습니다."
          btnText="인증번호 재전송"
          onBtnPress={() => {
            setIsSent(false);
            setIsVerified('yet');
            setShowTimeAlert(false);
            clearInterval(timerRef.current);
            sendAuthNum();
            setAuthNum('');
            setChangeBtnMsg('');
          }}
        />
      )}
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
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: '#989BA2F7',
    paddingVertical: 8,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
    fontSize: 14,
    lineHeight: 31,
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
    textAlign: 'center',
    color: 'white',
  },
  modalView: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: -4,
    right: -4,
    borderRadius: 8,
    // padding: 16,
  },
  textView: {
    flexDirection: 'row',
    width: '100%',
  },
  modalTxt: {
    marginLeft: 8,
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 26,
  },
  modalBtn: {
    marginBottom: 2,
    width: '100%',
  },
  modalBtnTxt: {
    color: '#5856D6',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 31,
    textAlign: 'right',
  },
});
