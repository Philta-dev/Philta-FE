import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {useEffect, useState} from 'react';
import {svgList} from '../assets/svgList';
import {Keyboard, Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import Text from '../components/Text';
import Typing from '../pages/Typing';
import Indexing from '../pages/Indexing';
import Favorite from '../pages/Favorite';

export type RootTabParamList = {
  Typing: undefined;
  Indexing: undefined;
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

export default function BaseNav() {
  return (
    <Tab.Navigator
      initialRouteName="Typing"
      tabBar={props => <CustomTabbar {...props} />}>
      <Tab.Screen name="Typing" component={Typing} />
      <Tab.Screen name="Indexing" component={Indexing} />
      <Tab.Screen name="Favorite" component={Favorite} />
    </Tab.Navigator>
  );
}

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
