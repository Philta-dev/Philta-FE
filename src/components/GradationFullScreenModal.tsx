import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Platform,
  Linking,
  useWindowDimensions,
  Animated,
} from 'react-native';
import {Svg, SvgXml} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import {RootState, useAppDispatch} from '../store';
import paymentSlice from '../slices/payments';
import {svgList} from '../assets/svgList';

import {requestSubscription, getAvailablePurchases} from 'react-native-iap';
import EncryptedStorage from 'react-native-encrypted-storage';
import {trackEvent} from '../services/trackEvent.service';
import {useSelector} from 'react-redux';

type GradationFullScreenModalProps = {
  sku?: string;
  offerToken?: string;
  setIndicator?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function GradationFullScreenModal(
  props: GradationFullScreenModalProps,
) {
  const lang = useSelector((state: RootState) => state.user.lang);
  const {height} = useWindowDimensions();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    setIsSmallScreen(height <= 670);
  }, [height]);
  const dispatch = useAppDispatch();
  const [restoreFailed, setRestoreFailed] = useState(false);

  const _requestSubscription = () => {
    console.log('requestSubscription', props.sku);
    if (props.sku) {
      if (props.setIndicator) {
        props.setIndicator(true);
      }
      if (Platform.OS == 'ios') {
        requestSubscription({
          sku: props.sku,
        });
      } else {
        console.log('requestSubscription', props.sku, props.offerToken);
        requestSubscription({
          subscriptionOffers: [
            {sku: props.sku, offerToken: props.offerToken ?? ''},
          ],
        });
      }
    }
  };

  const _restoreSubscription = () => {
    console.log('restoreSubscription');
    if (props.setIndicator) {
      props.setIndicator(true);
    }
    getAvailablePurchases()
      .then(async purchases => {
        // console.log('getAvailablePurchases', purchases);
        if (purchases.length > 0) {
          let receipt = purchases[0].transactionReceipt;
          if (Platform.OS == 'android' && purchases[0].purchaseToken) {
            receipt = purchases[0].purchaseToken;
          }
          console.log('receipt', receipt);
          await EncryptedStorage.setItem('receipt', receipt);
          trackEvent('Payment Restored');
          dispatch(paymentSlice.actions.setPayModal({payModal: false}));
        } else {
          console.log('no purchases');
          dispatch(paymentSlice.actions.setNeedToPay({needToPay: true}));
          const receipt = await EncryptedStorage.getItem('receipt');
          if (receipt) {
            await EncryptedStorage.removeItem('receipt');
          }
          setRestoreFailed(true);
          // dispatch(paymentSlice.actions.setPayModal({payModal: false}));
        }
        if (props.setIndicator) {
          props.setIndicator(false);
        }
      })
      .catch(async error => {
        console.log('getAvailablePurchases', error);
        if (await EncryptedStorage.getItem('receipt')) {
          await EncryptedStorage.removeItem('receipt');
        }
        if (props.setIndicator) {
          props.setIndicator(false);
        }
        dispatch(paymentSlice.actions.setPayModal({payModal: false}));
      });
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (restoreFailed) {
      const timer = setTimeout(() => {
        setRestoreFailed(false);
      }, 2000);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      return () => clearTimeout(timer);
    }
  }, [restoreFailed]);

  return (
    <View style={styles.entire}>
      <LinearGradient
        colors={['#ABB0BA80', '#1C1B1F', '#1C1B1F']}
        locations={[0, 0.5, 1]}
        style={styles.entire}
      />
      <View style={{position: 'relative', width: '100%', alignItems: 'center'}}>
        <Pressable
          style={{position: 'absolute', top: 0, right: 24, zIndex: 10}}
          onPress={() => {
            dispatch(paymentSlice.actions.setPayModal({payModal: false}));
          }}>
          <SvgXml width={24} height={24} xml={svgList.modal.xBtn} />
        </Pressable>
        <SvgXml
          width={isSmallScreen ? 64 : 80}
          height={isSmallScreen ? 64 : 80}
          xml={svgList.appLogo}
        />
      </View>
      <View style={{height: isSmallScreen ? 8 : 28}} />
      <Text
        style={[
          styles.txt,
          {
            fontFamily: 'Pretendard-Medium',
            lineHeight: isSmallScreen ? (lang == 'en' ? 25.6 : 24) : 25.6,
            letterSpacing: isSmallScreen
              ? lang == 'en'
                ? 0.48
                : -0.3
              : lang == 'en'
              ? 0.48
              : -0.32,
            fontSize: isSmallScreen ? (lang == 'en' ? 16 : 15) : 16,
          },
        ]}>
        {lang == 'en'
          ? 'Greetings from the development team.'
          : '안녕하세요, 개발팀입니다.'}
      </Text>
      <View
        style={{
          height: isSmallScreen
            ? lang == 'en'
              ? 8
              : 16.4
            : lang == 'en'
            ? 10
            : 10.5,
        }}
      />

      {lang == 'en' ? (
        <SvgXml
          width={isSmallScreen ? 320 : 320}
          xml={
            isSmallScreen
              ? svgList.modal.sloganSmallEng
              : svgList.modal.sloganEng
          }
        />
      ) : (
        <SvgXml
          width={isSmallScreen ? 262 : 312}
          xml={isSmallScreen ? svgList.modal.sloganSmall : svgList.modal.slogan}
        />
      )}
      {lang == 'en' ? (
        <View style={{height: isSmallScreen ? 11 : 21}} />
      ) : (
        <View style={{height: isSmallScreen ? 13.27 : 25.55}} />
      )}

      <Text
        style={[
          styles.txt,
          {
            fontFamily: 'Pretendard-Medium',

            lineHeight: isSmallScreen
              ? lang == 'en'
                ? 22.88
                : 22.08
              : lang == 'en'
              ? 22.88
              : 24.31,
            fontSize: isSmallScreen
              ? lang == 'en'
                ? 16
                : 16
              : lang == 'en'
              ? 16
              : 17,
            textAlign: 'center',
          },
          lang == 'en' && {letterSpacing: 0.32},
        ]}>
        {lang == 'en'
          ? 'so we started with the vision to'
          : '현대인에게 가장 친숙한 핸드폰을\n말씀을 위한 도구로 바꾸기 위해'}
      </Text>
      {lang == 'en' ? (
        <View style={{height: isSmallScreen ? 2 : 3}} />
      ) : (
        <View style={{height: isSmallScreen ? 1 : 4}} />
      )}

      {lang == 'en' ? (
        <SvgXml
          width={isSmallScreen ? 275 : 320}
          xml={
            isSmallScreen
              ? svgList.modal.slogan2SmallEng
              : svgList.modal.slogan2Eng
          }
        />
      ) : (
        <SvgXml
          width={isSmallScreen ? 204 : 280}
          xml={
            isSmallScreen ? svgList.modal.slogan2Small : svgList.modal.slogan2
          }
        />
      )}
      {lang != 'en' && (
        <>
          <View style={{height: isSmallScreen ? 1 : 6}} />
          <Text
            style={[
              styles.txt,
              {
                fontFamily: 'Pretendard-Medium',

                lineHeight: isSmallScreen ? 22.08 : 24.31,
                fontSize: isSmallScreen ? 16 : 17,
              },
            ]}>
            {'라는 비전을 갖고 시작했습니다.'}
          </Text>
        </>
      )}
      {lang == 'en' ? (
        <View style={{height: isSmallScreen ? 20 : 21}} />
      ) : (
        <View style={{height: isSmallScreen ? 14 : 20}} />
      )}

      <SvgXml width={120} xml={svgList.modal.separator} />
      {lang == 'en' ? (
        <View style={{height: isSmallScreen ? 13 : 19}} />
      ) : (
        <View style={{height: isSmallScreen ? 13 : 14}} />
      )}

      <Text
        style={[
          styles.txt,
          {
            fontFamily: 'Pretendard-Medium',

            lineHeight: isSmallScreen
              ? lang == 'en'
                ? 18.6
                : 19.6
              : lang == 'en'
              ? 18.6
              : 22.4,
            fontSize: lang == 'en' ? 15 : 14,
            letterSpacing: lang == 'en' ? 0.3 : -0.28,
            textAlign: 'center',
          },
        ]}>
        {lang == 'en'
          ? 'A small server fee is required to\nstore and maintain the 66 books\nin a personalized database.'
          : '성경 66권을 개인마다 데이터베이스에\n저장하고 유지하기 위해서는\n소량의 서버비용(3천원)이 소요됩니다.'}
      </Text>
      {lang == 'en' ? (
        <View style={{height: isSmallScreen ? 14 : 48}} />
      ) : (
        <View style={{height: isSmallScreen ? 8 : 39}} />
      )}

      <Text
        style={[
          styles.txt,
          {
            color: '#ABABF5',
            fontFamily: 'Pretendard-Medium',

            fontSize: lang == 'en' ? 14 : 13,
            letterSpacing: lang == 'en' ? 0.28 : -0.26,
            textAlign: 'center',
          },
        ]}>
        {lang == 'en'
          ? 'You can cancel whenever you want.'
          : '원하실 때 취소하실 수 있습니다.'}
      </Text>
      {lang == 'en' ? (
        <View style={{height: 13}} />
      ) : (
        <View style={{height: 14}} />
      )}

      <Pressable
        style={styles.btn}
        onPress={() => {
          _requestSubscription();
        }}>
        <Text
          style={{
            color: 'white',
            fontFamily:
              lang == 'en' ? 'Pretendard-Bold' : 'Pretendard-ExtraBold',
            fontSize: 18,
            lineHeight: 24,
            letterSpacing: lang == 'en' ? 0.18 : -0.32,
            textAlign: 'center',
          }}>
          {lang == 'en' ? 'Start a subscription' : '구독 시작하기'}
        </Text>
        <View style={{width: 10}} />
        <SvgXml width={20} height={20} xml={svgList.modal.backBtn} />
      </Pressable>
      <View style={{height: isSmallScreen ? 18 : 33}} />

      <Pressable
        onPress={() => {
          if (restoreFailed) {
            Linking.openURL('https://open.kakao.com/o/saLj2nTg');
          } else _restoreSubscription();
        }}>
        <Text
          style={[
            styles.txt,
            {
              color: '#ABABF5',
              fontFamily: 'Pretendard-Medium',

              fontSize: isSmallScreen
                ? lang == 'en'
                  ? 13
                  : 12
                : lang == 'en'
                ? 14
                : 13,
              letterSpacing: isSmallScreen
                ? lang == 'en'
                  ? 0.13
                  : -0.24
                : lang == 'en'
                ? 0.14
                : -0.26,
              textAlign: 'center',
              lineHeight: 20,
            },
          ]}>
          {restoreFailed
            ? ''
            : lang == 'en'
            ? 'We welcome developer suggestions to reduce costs.'
            : '비용을 줄일 수 있는 개발자 분들의 자문 환영합니다.'}
        </Text>
        <Text
          style={[
            styles.txt,
            {
              color: '#ABABF5',
              fontFamily: 'Pretendard-Medium',
              textDecorationStyle: 'solid',
              textDecorationLine: 'underline',
              textDecorationColor: '#ABABF5',

              fontSize: isSmallScreen
                ? lang == 'en'
                  ? 13
                  : 12
                : lang == 'en'
                ? 14
                : 13,
              letterSpacing: isSmallScreen
                ? lang == 'en'
                  ? 0.13
                  : -0.24
                : lang == 'en'
                ? 0.14
                : -0.26,
              textAlign: 'center',
              lineHeight: 20,
            },
          ]}>
          {restoreFailed
            ? ''
            : lang == 'en'
            ? 'Already subscribed?'
            : '이미 구독 중이신가요?'}
        </Text>
      </Pressable>
      {restoreFailed && (
        <View
          style={{
            backgroundColor: '#3E3D51',
            position: 'absolute',
            left: isSmallScreen ? 9 : lang == 'en' ? 23 : 20,
            right: isSmallScreen ? 11 : lang == 'en' ? 17 : 20,
            bottom: isSmallScreen ? 14 : lang == 'en' ? 24 : 21,
            flexDirection: 'row',
            paddingHorizontal: isSmallScreen ? 8 : 5,
            paddingVertical: isSmallScreen ? 6 : 11,
            borderTopWidth: 1,
            borderTopColor: '#FFF',
          }}>
          <SvgXml width={24} height={24} xml={svgList.modal.toastIcon} />
          <View style={{width: isSmallScreen ? 12 : lang == 'en' ? 12 : 18}} />
          <Text
            style={[
              {
                color: 'white',
                fontFamily: 'Pretendard-Medium',
                fontSize: 13,
                lineHeight: isSmallScreen ? 18.2 : lang == 'en' ? 16.9 : 18.2,
              },
              lang != 'en' && {
                letterSpacing: -0.26,
              },
            ]}>
            {lang == 'en'
              ? 'It appears that you are not currently subscribed to\nour system. If you believe this is an error, please\ndo not hesitate to contact us for assistance.'
              : '시스템상에서 구독 중이 아니신 것으로 파악됩니다.\n오류라고 생각되시면 문의 부탁드립니다.\n(마이페이지 > 문의하기)'}
          </Text>
        </View>
      )}
    </View>
  );
}
// ''

const styles = StyleSheet.create({
  entire: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  txt: {
    color: 'white',
    fontFamily: 'Pretendard',
  },
  btn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 40,
    backgroundColor: '#5856D6',
    borderWidth: 1,
    borderColor: '#FCFCFE',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
});
