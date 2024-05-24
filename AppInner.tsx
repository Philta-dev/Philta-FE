import React, {useState} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {useSelector} from 'react-redux';
import {RootState} from './src/store';

import {svgList} from './src/assets/svgList';
import {SvgXml} from 'react-native-svg';

import {NavigationContainer} from '@react-navigation/native';
import {Safe} from './src/components/Safe';
import Typing from './src/pages/Typing';
import SignIn from './src/pages/SignIn';
import Indexing from './src/pages/Indexing';
import Favorite from './src/pages/Favorite';

export type RootStackParamList = {
  SignIn: undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type RootTabParamList = {
  Typing: undefined;
  Indexing: undefined;
  Favorite: undefined;
};

export type RootTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const CustomTabbar = ({state, descriptors, navigation}: any) => {
  if (state.index === 0) return <></>;
  return (
    <View style={{flexDirection: 'row'}}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <View
            key={index}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
              onPress={onPress}
              onLongPress={onLongPress}
              style={{color: isFocused ? '#673ab7' : '#222'}}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

function AppInner() {
  // const isLoggedIn = useSelector(
  //   (state: RootState) => !!state.user.accessToken,
  // );
  const isLoggedIn = true;
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Safe color="#ffffff">
          <Tab.Navigator
            initialRouteName="Typing"
            tabBar={props => <CustomTabbar {...props} />}>
            <Tab.Screen name="Typing" component={Typing} />
            <Tab.Screen name="Indexing" component={Indexing} />
            <Tab.Screen name="Favorite" component={Favorite} />
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
