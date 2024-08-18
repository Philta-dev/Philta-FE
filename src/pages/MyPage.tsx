import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MyPageNavStackParamList} from '../navigations/MyPageNav';
import {
  Pressable,
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSelector} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import Text from '../components/Text';
import TextBold from '../components/TextBold';
import {Shadow} from 'react-native-shadow-2';
import ProgressBar from '../components/ProgessBar';
import DeviceInfo from 'react-native-device-info';
import appleAuth from '@invertase/react-native-apple-authentication';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Modal from 'react-native-modal';
import {resetTrackUser} from '../services/trackEvent.service';

type MyPageNavigationProp = NativeStackNavigationProp<
  MyPageNavStackParamList,
  'MyPage'
>;

type MyPageProps = {
  navigation: MyPageNavigationProp;
};

export default function MyPage(props: MyPageProps) {
  const dispatch = useAppDispatch();
  const lang = useSelector((state: RootState) => state.user.lang);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const unsubscriber = appleAuth.onCredentialRevoked(async () => {
      quit();
    });
    return () => {
      unsubscriber();
    };
  }, []);

  const [showQuitModal, setShowQuitModal] = useState(false);
  const [socialType, setSocialType] = useState('');

  const changeLanguage = async (lang: string) => {
    dispatch(userSlice.actions.setLang({lang}));
    EncryptedStorage.setItem('lang', lang);
    console.log('change language to ' + lang);
  };

  const logout = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/auth/logout`);
      console.log(response.data);
      if (socialType === 'kakao') {
        await KakaoLogin.logout();
      } else if (socialType == 'google') {
        await GoogleSignin.signOut();
      }
      resetTrackUser();
      await EncryptedStorage.removeItem('refreshToken');
      dispatch(userSlice.actions.setToken({accessToken: ''}));
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };

  const quit = async () => {
    console.log('quit');
    try {
      const response = await axios.delete(`${Config.API_URL}/auth/quit`);
      console.log(response.data);
      if (socialType === 'kakao') {
        await KakaoLogin.unlink();
      } else if (socialType === 'google') {
        await GoogleSignin.revokeAccess();
      }
      resetTrackUser();
      await EncryptedStorage.removeItem('refreshToken');
      dispatch(userSlice.actions.setToken({accessToken: ''}));
    } catch (error) {
      const errorResponse = (
        error as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };

  return (
    <ScrollView>
      <View
        style={{
          paddingTop: 30,
          paddingHorizontal: 24,
          paddingBottom: 16,
          flex: 2,
        }}>
        <Shadow
          distance={2}
          style={{borderRadius: 8, width: '100%'}}
          startColor="rgba(0, 0, 0, 0.12)"
          endColor="rgba(0, 0, 0, 0)"
          offset={[0.8, 0.8]}>
          <Pressable
            onPress={() => props.navigation.navigate('Statistics')}
            style={{
              paddingHorizontal: 8,
              paddingBottom: 20,
              borderRadius: 8,
              backgroundColor: 'white',
            }}>
            <View style={styles.btnHeader}>
              <View style={styles.btnHeaderInner}>
                <SvgXml xml={svgList.myPage.statistics} />
                <TextBold style={styles.btnHeaderTxt}>
                  {lang == 'en' ? 'progress' : '나의 통계'}
                </TextBold>
              </View>
              <SvgXml xml={svgList.myPage.arrowRight} />
            </View>
            <View style={styles.content}>
              <View style={styles.contentRow}>
                <Text style={styles.contentTxt}>
                  {lang == 'en' ? 'Total' : '전체'}
                </Text>
                <View style={{flex: 1}}>
                  <ProgressBar
                    width={'100%'}
                    height={8}
                    progressColor="#5656D6"
                    nonProgressColor="#F4F4F4"
                    progress={10}
                    borderRadius={8}
                  />
                </View>
              </View>
              <View style={styles.contentRow}>
                <View style={[styles.contentRow, {flex: 1}]}>
                  <Text style={styles.contentTxt}>
                    {lang == 'en' ? 'Old' : '구약'}
                  </Text>
                  <View style={{flex: 1}}>
                    <ProgressBar
                      width={'100%'}
                      height={8}
                      progressColor="#5656D6"
                      nonProgressColor="#F4F4F4"
                      progress={0}
                      borderRadius={8}
                    />
                  </View>
                </View>
                <View style={{width: 8}} />
                <View style={[styles.contentRow, {flex: 1}]}>
                  <Text style={styles.contentTxt}>
                    {lang == 'en' ? 'New' : '신약'}
                  </Text>
                  <View style={{flex: 1}}>
                    <ProgressBar
                      width={'100%'}
                      height={8}
                      progressColor="#5656D6"
                      nonProgressColor="#F4F4F4"
                      progress={50}
                      borderRadius={8}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        </Shadow>
        <View style={{height: 16}} />
        <Shadow
          distance={2}
          style={{borderRadius: 8, width: '100%'}}
          startColor="rgba(0, 0, 0, 0.12)"
          endColor="rgba(0, 0, 0, 0)"
          offset={[0.8, 0.8]}>
          <Pressable
            onPress={() => props.navigation.navigate('Favorite')}
            style={{
              borderRadius: 8,
              backgroundColor: 'white',
            }}>
            <View style={styles.btnHeader}>
              <View style={styles.btnHeaderInner}>
                <SvgXml xml={svgList.myPage.favorite} />
                <TextBold style={styles.btnHeaderTxt}>
                  {lang == 'en' ? 'Bookmark' : '북마크'}
                </TextBold>
              </View>
              <SvgXml xml={svgList.myPage.arrowRight} />
            </View>
          </Pressable>
        </Shadow>
        <View style={{height: 16}} />
      </View>
      <View style={{flex: 3}}>
        <View style={styles.separator}>
          <TextBold style={styles.separatorTxt}>
            {lang == 'en' ? 'Settings' : '회원정보 관리'}
          </TextBold>
        </View>
        <View style={{paddingLeft: 32, paddingRight: 27}}>
          <Pressable style={styles.infoBtn}>
            <Text style={styles.infoBtnTxt}>
              {lang == 'en' ? 'nickname' : '닉네임 변경'}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.infoBtn, {justifyContent: 'space-between'}]}>
            <Text style={styles.infoBtnTxt}>
              {lang == 'en' ? 'default language' : '앱 언어 변경'}
            </Text>
            <View style={styles.switchView}>
              <Pressable
                onPress={() => {
                  if (lang == 'en') return;
                  changeLanguage('en');
                }}>
                <Text
                  style={[
                    styles.switchText,
                    {color: lang == 'en' ? '#5656D6' : '#898A8D'},
                  ]}>
                  English
                </Text>
              </Pressable>
              <Pressable
                style={styles.switchBtn}
                onPress={() => {
                  if (lang == 'en') changeLanguage('ko');
                  else changeLanguage('en');
                }}>
                <View
                  style={[
                    styles.switchKnob,
                    lang == 'en' ? {left: 1.5} : {right: 1.5},
                  ]}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  if (lang == 'ko') return;
                  changeLanguage('ko');
                }}>
                <Text
                  style={[
                    styles.switchText,
                    {color: lang == 'ko' ? '#5656D6' : '#898A8D'},
                  ]}>
                  한국어
                </Text>
              </Pressable>
            </View>
          </Pressable>
          <Pressable
            style={styles.infoBtn}
            onPress={() => {
              Linking.openURL(
                'https://docs.google.com/forms/d/e/1FAIpQLSdW2tb9QZGBT3sA5eHLWRamqixbsrRK-7q1GhGPZ--4CGEnEQ/viewform?usp=sf_link',
              );
            }}>
            <Text style={styles.infoBtnTxt}>
              {lang == 'en' ? 'ask anything' : '문의하기'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.infoBtn}
            onPress={() => {
              logout();
            }}>
            <Text style={styles.infoBtnTxt}>
              {lang == 'en' ? 'log out' : '로그아웃'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.infoBtn}
            onPress={() => {
              setShowQuitModal(true);
              // quit();
            }}>
            <Text style={styles.infoBtnTxt}>
              {lang == 'en' ? 'sign out' : '회원탈퇴'}
            </Text>
          </Pressable>
          <Pressable style={styles.infoBtn}>
            <Text style={styles.infoBtnTxtGray}>
              {'ver ' + DeviceInfo.getVersion()}
            </Text>
          </Pressable>
        </View>
      </View>
      <Modal
        isVisible={showQuitModal}
        backdropOpacity={0.4}
        onBackdropPress={() => setShowQuitModal(false)}
        onBackButtonPress={() => setShowQuitModal(false)}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: 24,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 8,
          }}>
          <TextBold
            style={{
              marginVertical: 8,
              color: 'black',
              fontSize: 18,
              fontWeight: '600',
            }}>
            {lang == 'en' ? 'sign out' : '회원탈퇴'}
          </TextBold>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              marginBottom: 16,
              fontWeight: '400',
            }}>
            {lang == 'en' ? 'All data will be lost' : '정말 탈퇴하시겠어요?'}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Pressable
              onPress={() => {
                setShowQuitModal(false);
                quit();
              }}
              style={{
                flex: 1,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 15,
                // paddingHorizontal: 48,
                backgroundColor: '#FF3B30',
              }}>
              <TextBold
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                {lang == 'en' ? 'confirm' : '탈퇴'}
              </TextBold>
            </Pressable>
            <View style={{width: 15}} />
            <Pressable
              onPress={() => setShowQuitModal(false)}
              style={{
                flex: 1,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 15,
                // paddingHorizontal: 48,
                backgroundColor: '#C6C6C8',
              }}>
              <TextBold
                style={{
                  color: 'black',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                {lang == 'en' ? 'back' : '취소'}
              </TextBold>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  btnHeaderInner: {flexDirection: 'row', alignItems: 'center'},
  btnHeaderTxt: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    letterSpacing: -0.512,
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentTxt: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 21,
    letterSpacing: -0.32,
    marginRight: 9,
  },
  contentCol: {
    flexDirection: 'row',
  },
  separator: {
    marginTop: 30,
    marginBottom: 16,
    marginLeft: 32,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C6C8',
  },
  separatorTxt: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    letterSpacing: -0.512,
  },
  infoBtn: {
    paddingVertical: 7,
    flexDirection: 'row',
  },
  infoBtnTxt: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 21,
    letterSpacing: -0.448,
  },
  infoBtnTxtGray: {
    fontSize: 12,
    color: '#898A8D',
    lineHeight: 18,
    letterSpacing: -0.384,
  },
  switchView: {
    flexDirection: 'row',
  },
  switchText: {
    fontSize: 14,
    lineHeight: 22.4,
    letterSpacing: -0.448,
  },
  switchBtn: {
    marginHorizontal: 12,
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#5856D6',
    justifyContent: 'center',
    paddingHorizontal: 1.5,
    position: 'relative',
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    position: 'absolute',
  },
});
