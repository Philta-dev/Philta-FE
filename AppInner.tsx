import React, {useEffect, useState} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  View,
} from 'react-native';

import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from './src/store';

import {svgList} from './src/assets/svgList';
import {SvgXml} from 'react-native-svg';

import {NavigationContainer} from '@react-navigation/native';
import {Safe} from './src/components/Safe';

import SignIn from './src/pages/SignIn';

import EnterName from './src/pages/EnterName';
import PhoneLogin from './src/pages/PhoneLogin';

import Text from './src/components/Text';
import EncryptedStorage from 'react-native-encrypted-storage';
import userSlice from './src/slices/user';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import useAxiosInterceptor from './src/hooks/useAxiosInterceptor';
import Search from './src/pages/Search';
import BaseNav from './src/navigations/BaseNav';
import {useNetInfo} from '@react-native-community/netinfo';
import BootSplash from 'react-native-bootsplash';
import {Splash} from './src/components/animations';
import {resetTrackUser, setTrackUser} from './src/services/trackEvent.service';
import {getLocales} from 'react-native-localize';

import {
  PurchaseError,
  Subscription,
  SubscriptionAndroid,
  SubscriptionPurchase,
  clearProductsIOS,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  getSubscriptions,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import GradationFullScreenModal from './src/components/GradationFullScreenModal';
import paymentSlice from './src/slices/payments';
import DeviceInfo from 'react-native-device-info';
import TextBold from './src/components/TextBold';

export type SignInNavParamList = {
  SignIn: undefined;
  EnterName: undefined;
  PhoneLogin: undefined;
};

export type SignInNavNavigationProp =
  NativeStackNavigationProp<SignInNavParamList>;

const Stack = createNativeStackNavigator<SignInNavParamList>();

export type NavParamList = {
  Base: undefined;
  Search: {page: string};
  Favorite: undefined;
  Indexing: undefined;
  Typing: undefined;
};

export type NavNavigationProp = NativeStackNavigationProp<NavParamList>;

const BaseStack = createNativeStackNavigator<NavParamList>();

function AppInner() {
  useAxiosInterceptor();
  const dispatch = useAppDispatch();
  const lang = useSelector((state: RootState) => state.user.lang);
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken,
  );
  const needToPay = useSelector((state: RootState) => state.payments.needToPay);
  const payModal = useSelector((state: RootState) => state.payments.payModal);

  const compareVersions = (myversion: string, minimumVersion: string) => {
    const myVersionParts = myversion.split('.').map(Number);
    const minimumVersionParts = minimumVersion.split('.').map(Number);

    const maxLength = Math.max(
      myVersionParts.length,
      minimumVersionParts.length,
    );

    for (let i = 0; i < maxLength; i++) {
      const v1 = myVersionParts[i] || 0;
      const v2 = minimumVersionParts[i] || 0;

      if (v1 > v2) {
        return true; // myversion이 더 높음
      }
      if (v1 < v2) {
        return false; // minimumVersion이 더 높음
      }
    }

    return true;
  };
  const [appVersionModal, setAppVersionModal] = useState(false);
  useEffect(() => {
    const version = DeviceInfo.getVersion();
    const versionCheck = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/auth/appversion`);
        console.log('App Version Check', response.data.current_app_version);
        // if (response.data.version != version) {
        console.log('App Version Check', version);
        if (!compareVersions(version, response.data.current_app_version)) {
          setAppVersionModal(true);
        } else {
          setAppVersionModal(false);
        }
        // }
      } catch (error) {
        const errorResponse = (
          error as AxiosError<{message: string; statusCode: number}>
        ).response;
        console.log(errorResponse?.data);
      }
    };
    versionCheck();
  }, []);

  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const reissue = async () => {
    try {
      // await EncryptedStorage.removeItem('refreshToken');
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      // console.log('before', refreshToken);
      if (!refreshToken) {
        resetTrackUser();
        dispatch(
          userSlice.actions.setToken({
            accessToken: '',
          }),
        );
        return;
      }
      const response = await axios.post(`${Config.API_URL}/auth/token`, {
        refreshToken: refreshToken,
      });
      dispatch(
        userSlice.actions.setToken({
          accessToken: response.data.accessToken,
        }),
      );
      await EncryptedStorage.setItem(
        'refreshToken',
        response.data.refreshToken,
      );
      // console.log('after', response.data.refreshToken);
      console.log('Token 재발급(자동로그인)');
      // console.log('accessToken', response.data.accessToken);
    } catch (error) {
      const errorResponse = (
        error as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  useEffect(() => {
    const init = async () => {};
    init().finally(async () => {
      await BootSplash.hide({fade: true});
      setShowCustomSplash(true);
      setTimeout(async () => {
        setShowCustomSplash(false);
      }, 4000);
    });
  }, []);
  const [showCustomSplash, setShowCustomSplash] = useState(false);
  useEffect(() => {
    if (!isLoggedIn) reissue();
    else userInfo();
  }, [isLoggedIn]);
  const internetState = useNetInfo();
  const [loadingPage, setLoadingPage] = useState(false);
  useEffect(() => {
    if (internetState.isConnected) {
      // setTimeout(() => {
      setLoadingPage(false);
      // }, 1000);
    } else {
      setLoadingPage(true);
    }
  }, [internetState.isConnected]);

  const userInfo = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/auth/mixpanel`);
      console.log(response.data);
      setTrackUser(response.data.id, response.data.name);
    } catch (error) {}
  };

  useEffect(() => {
    const getLang = async () => {
      const storageLang = await EncryptedStorage.getItem('lang');
      if (storageLang) {
        dispatch(
          userSlice.actions.setLang({
            lang: storageLang,
          }),
        );
      } else {
        const locales = getLocales();
        for (const locale of locales) {
          if (locale.languageCode === 'ko') {
            dispatch(
              userSlice.actions.setLang({
                lang: 'ko',
              }),
            );
          }
        }
      }
    };
    getLang();
  }, []);

  let purchaseUpdateSubscription: any;
  let purchaseErrorSubscription: any;

  const [subscription, setSubscription] = useState<
    Subscription | SubscriptionAndroid | undefined
  >();
  const [indicator, setIndicator] = useState(false);
  const [offerToken, setOfferToken] = useState('');

  const getReadyForPayments = async () => {
    /*
      clearProductsIOS: ios의 경우 이전에 구매한 상품을 초기화
      initConnection: sdk 초기화
      flushFailedPurchasesCachedAsPendingAndroid: 안드로이드의 경우 실패한 구매를 초기화

      purchaseUpdatedListener: 구매가 업데이트 될 때 호출
      purchaseErrorListener: 구매 에러가 발생할 때 호출

      getSubscriptions: 구독 정보를 가져옴 (앱스토어에 등록된)

      EncryptedStorage.getItem('receipt'): 저장된 receipt를 가져옴
      기기에 저장된 receipt가 있으면 validatePaymentsIOS를 호출하여 결제가 유효한지 확인 => needToPay
    */
    console.log('getReadyForPayments');
    if (Platform.OS == 'ios') clearProductsIOS();
    try {
      console.log('initConnection');
      const result = await initConnection();
      if (Platform.OS == 'android')
        await flushFailedPurchasesCachedAsPendingAndroid();
      console.log('initConnection res', result);
    } catch (error) {
      console.log('error in initConnection', error);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(
      (purchase: SubscriptionPurchase) => {
        console.log('purchaseUpdatedListener', purchase);
        const receiptNow =
          Platform.OS == 'ios'
            ? purchase.transactionReceipt
            : purchase.purchaseToken;
        if (receiptNow) {
          if (Platform.OS == 'ios') {
            validatePaymentsIOS(receiptNow);
            finishTransaction({purchase});
          } else validatePaymentsAndroid(receiptNow, purchase);
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      async (error: PurchaseError) => {
        console.warn('purchaseErrorListener', error);
        if (await EncryptedStorage.getItem('receipt')) {
          EncryptedStorage.removeItem('receipt');
        }
        if (error.code?.toLowerCase().includes('already')) {
          _restoreSubscription();
        }
        dispatch(paymentSlice.actions.setNeedToPay({needToPay: true}));
        dispatch(paymentSlice.actions.setPayModal({payModal: false}));
        setIndicator(false);
      },
    );

    const subscriptions = await getSubscriptions({
      // skus: ['test'],
      skus: ['monthly', 'tyble.monthly'],
    });
    console.log('subscriptions', subscriptions);
    if (subscriptions[0].subscriptionOfferDetails) {
      setOfferToken(
        subscriptions[0].subscriptionOfferDetails[0].offerToken || '',
      );
    }
    setSubscription(subscriptions[0]);

    const receipt = await EncryptedStorage.getItem('receipt');
    if (receipt) {
      if (Platform.OS == 'ios') {
        validatePaymentsIOS(receipt);
      } else {
        validatePaymentsAndroid(receipt);
      }
    } else {
      dispatch(paymentSlice.actions.setNeedToPay({needToPay: true}));
    }
  };

  const validatePaymentsIOS = async (receipt: string) => {
    console.log('validatePayments IOS');
    try {
      const response = await axios.post(
        `${Config.API_URL}/payments/appleverify`,
        {
          receiptData: receipt,
          productId: 'monthly',
        },
      );
      console.log('validation reciept for server', response.data.data.status);
      if (response.data.data.status == 0) {
        console.log('success');
        dispatch(paymentSlice.actions.setNeedToPay({needToPay: false}));
        await EncryptedStorage.setItem('receipt', receipt);
      } else {
        dispatch(paymentSlice.actions.setNeedToPay({needToPay: true}));
        if (await EncryptedStorage.getItem('receipt')) {
          await EncryptedStorage.removeItem('receipt');
        }
      }
      setIndicator(false);
    } catch (error) {
      const errorResponse = (
        error as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
      if (await EncryptedStorage.getItem('receipt')) {
        await EncryptedStorage.removeItem('receipt');
      }
    }
  };

  const validatePaymentsAndroid = async (receipt: string, purchase?: any) => {
    console.log('validatePayments Android', receipt);
    try {
      const response = await axios.post(
        `${Config.API_URL}/payments/googleverify`,
        {
          purchaseToken: receipt,
          productId: 'monthly',
        },
      );
      console.log(
        'validation reciept for server',
        response.data.data.subscriptionState,
      );
      finishTransaction({purchase});
      if (response.data.data.subscriptionState == 'SUBSCRIPTION_STATE_ACTIVE') {
        console.log('success');
        dispatch(paymentSlice.actions.setNeedToPay({needToPay: false}));
        await EncryptedStorage.setItem('receipt', receipt);
      } else {
        dispatch(paymentSlice.actions.setNeedToPay({needToPay: true}));
        if (await EncryptedStorage.getItem('receipt')) {
          await EncryptedStorage.removeItem('receipt');
        }
      }
      setIndicator(false);
    } catch (error) {
      const errorResponse = (
        error as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
      if (await EncryptedStorage.getItem('receipt')) {
        await EncryptedStorage.removeItem('receipt');
      }
    }
  };

  const _restoreSubscription = () => {
    console.log('restoreSubscription');
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
        } else {
          console.log('no purchases');
          dispatch(paymentSlice.actions.setNeedToPay({needToPay: true}));
          if (await EncryptedStorage.getItem('receipt')) {
            await EncryptedStorage.removeItem('receipt');
          }
          dispatch(paymentSlice.actions.setPayModal({payModal: false}));
        }
      })
      .catch(async error => {
        console.log('getAvailablePurchases', error);
        if (await EncryptedStorage.getItem('receipt')) {
          await EncryptedStorage.removeItem('receipt');
        }
        dispatch(paymentSlice.actions.setPayModal({payModal: false}));
      });
  };

  useEffect(() => {
    if (accessToken) {
      getReadyForPayments();
    }
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, [accessToken]);

  // return true ? (
  return showCustomSplash ? (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingRight: 8,
      }}>
      <Splash />
    </View>
  ) : loadingPage ? (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <SvgXml xml={svgList.noInternet} width={48} height={48} />
      <Text
        style={{
          marginTop: 32,
          color: 'black',
          fontSize: 16,
          fontWeight: '400',
          lineHeight: 25,
          textAlign: 'center',
        }}>
        {lang == 'en'
          ? 'no internet connection\nplease check your connection status'
          : '인터넷 연결 없음.\n네트워크를 확인해주세요.'}
      </Text>
    </View>
  ) : (
    <NavigationContainer>
      {isLoggedIn ? (
        <Safe color="#ffffff">
          <BaseStack.Navigator screenOptions={{headerShown: false}}>
            <BaseStack.Screen name="Base" component={BaseNav} />
            <BaseStack.Screen name="Search" component={Search} />
          </BaseStack.Navigator>
        </Safe>
      ) : (
        <Safe color="#202020">
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: {backgroundColor: '#FFFFFF'},
            }}>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="EnterName" component={EnterName} />
            <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
          </Stack.Navigator>
        </Safe>
      )}
      {needToPay && payModal && (
        <GradationFullScreenModal
          sku={subscription?.productId}
          offerToken={offerToken}
          setIndicator={setIndicator}
        />
      )}
      {indicator && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
          }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      {appVersionModal && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#17171985',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            padding: 36,
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextBold
              style={{
                fontSize: 18,
                letterSpacing: -0.1,
                color: '#000',
                marginVertical: 12,
              }}>
              앱 업데이트 안내
            </TextBold>
            <Text
              style={{fontSize: 15, letterSpacing: -0.1, textAlign: 'center'}}>
              {
                '더 나은 서비스를 위해\n타이블 앱이 업데이트 되었습니다.\n최신 앱을 설치해주세요.'
              }
            </Text>
            <View style={{height: 23}} />
            <Pressable
              onPress={() => {
                if (Platform.OS == 'ios') {
                  Linking.openURL(
                    'https://apps.apple.com/kr/app/%ED%95%84%ED%83%80/id6504729498',
                  );
                } else {
                  Linking.openURL(
                    'https://play.google.com/store/apps/details?id=com.philta&pcampaignid=web_share',
                  );
                }
              }}
              style={{
                width: '100%',
                borderRadius: 4,
                backgroundColor: '#5656D6',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 12,
              }}>
              <Text style={{fontSize: 16, color: '#FCFCFE'}}>앱 업데이트</Text>
            </Pressable>
          </View>
        </View>
      )}
    </NavigationContainer>
  );
}

export default AppInner;
