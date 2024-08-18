import React, {useEffect, useState} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Keyboard, Platform, Pressable, StyleSheet, View} from 'react-native';

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
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken,
  );
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
      setShowCustomSplash(true);
      await BootSplash.hide({fade: true});
      setTimeout(() => {
        setShowCustomSplash(false);
      }, 2200);
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
      setLoadingPage(false);
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
        {'인터넷 연결 없음.\n네트워크를 확인해주세요.'}
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
    </NavigationContainer>
  );
}

export default AppInner;
