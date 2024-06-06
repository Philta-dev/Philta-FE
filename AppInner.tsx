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

import Typing from './src/pages/Typing';
import SignIn from './src/pages/SignIn';
import Indexing from './src/pages/Indexing';
import Favorite from './src/pages/Favorite';
import EnterName from './src/pages/EnterName';
import PhoneLogin from './src/pages/PhoneLogin';

import Text from './src/components/Text';
import EncryptedStorage from 'react-native-encrypted-storage';
import userSlice from './src/slices/user';
import axios from 'axios';
import Config from 'react-native-config';
import useAxiosInterceptor from './src/hooks/useAxiosInterceptor';

export type SignInNavParamList = {
  SignIn: undefined;
  EnterName: undefined;
  PhoneLogin: undefined;
};

export type SignInNavNavigationProp =
  NativeStackNavigationProp<SignInNavParamList>;

const Stack = createNativeStackNavigator<SignInNavParamList>();

export type RootTabParamList = {
  Typing: undefined;
  Indexing: {test: number; book: number; chapter: number; verse: number};
  Favorite: undefined;
};

export type RootTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;

const Tab = createBottomTabNavigator<RootTabParamList>();

const CustomTabbar = ({state, descriptors, navigation}: any) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const iconList = [
    svgList.tabbar.typing,
    svgList.tabbar.indexing,
    svgList.tabbar.favorite,
  ];
  const iconPressedList = [
    svgList.tabbar.typingPressed,
    svgList.tabbar.indexingPressed,
    svgList.tabbar.favoritePressed,
  ];
  const labelList = ['구절 타이핑', '전체 성경', '북마크'];

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  if (keyboardVisible) {
    return null; // 키보드가 보일 때 탭 바 숨기기
  }
  return (
    <View style={styles.tabBar}>
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
          <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            key={index}
            style={styles.tabBarButton}>
            <SvgXml
              xml={isFocused ? iconPressedList[index] : iconList[index]}
              width={24}
              height={24}
              // style={index == 2 && {marginHorizontal: 4, marginVertical: 3}}
            />
            <Text
              style={[
                styles.tabBarButtonText,
                isFocused ? {color: '#000000'} : {color: '#9B9EA5'},
              ]}>
              {labelList[index]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

function AppInner() {
  // useAxiosInterceptor();
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken,
  );
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const reissue = async () => {
    const refreshToken = await EncryptedStorage.getItem('refreshToken');
    console.log(refreshToken);
    if (!refreshToken) {
      dispatch(
        userSlice.actions.setToken({
          accessToken: '',
        }),
      );
    }
    const response = await axios.post(`${Config.API_URL}/auth/token`, {
      refreshToken: refreshToken,
      // accessToken: accessToken,
    });
    dispatch(
      userSlice.actions.setToken({
        accessToken: response.data.accessToken,
      }),
    );
    await EncryptedStorage.setItem('refreshToken', response.data.refreshToken);
    console.log('Token 재발급');
  };
  // useEffect(() => {
  //   reissue();
  // }, [isLoggedIn]);
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

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopColor: '#7878805C',
    borderTopWidth: 1,
  },
  tabBarButton: {
    flex: 1,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarButtonText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.32,
  },
});
