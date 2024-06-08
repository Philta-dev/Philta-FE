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
import axios from 'axios';
import Config from 'react-native-config';
import useAxiosInterceptor from './src/hooks/useAxiosInterceptor';
import Search from './src/pages/Search';
import BaseNav from './src/navigations/BaseNav';

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
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      console.log('before', refreshToken);
      if (!refreshToken) {
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
      console.log('after', response.data.refreshToken);
      console.log('Token 재발급(자동로그인)');
      console.log('accessToken', response.data.accessToken);
    } catch (error) {
      console.log('error');
    }
  };
  useEffect(() => {
    reissue();
  }, [isLoggedIn]);
  return (
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
