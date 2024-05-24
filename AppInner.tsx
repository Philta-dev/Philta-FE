import React, {useState} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Platform, StyleSheet} from 'react-native';

import {useSelector} from 'react-redux';
import {RootState} from './src/store';

import {svgList} from './src/assets/svgList';
import {SvgXml} from 'react-native-svg';

import {NavigationContainer} from '@react-navigation/native';
import {Safe} from './src/components/Safe';
import Home from './src/pages/Home';
import SignIn from './src/pages/SignIn';

export type RootStackParamList = {
  SignIn: undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type RootTabParamList = {
  Home: undefined;
};

export type RootTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function AppInner() {
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken,
  );
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Safe color="#ffffff">
          <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="Home" component={Home} />
          </Tab.Navigator>
        </Safe>
      ) : (
        <Safe color="#202020">
          <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignIn} />
          </Stack.Navigator>
        </Safe>
      )}
    </NavigationContainer>
  );
}

export default AppInner;

const styles = StyleSheet.create({});
