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
import DropDownModal from '../components/DropDownModal';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

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
  const [dropDown, setDropDown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropDownItems, setDropDownItems] = useState(['KRV', 'NIV', 'ESV']);
  const getVersionData = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/index/version`);
      console.log(response.data);
      setDropDownItems(response.data.versions);
      setSelectedIndex(
        response.data.versions.indexOf(response.data.current_version),
      );
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  const selectVersion = async (index: number) => {
    try {
      const response = await axios.post(`${Config.API_URL}/index/version`, {
        version: dropDownItems[index],
      });
      console.log(response.data);
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };

  useEffect(() => {
    getVersionData();
  }, [selectedIndex]);
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        initialRouteName="Typing"
        tabBar={props => <CustomTabbar {...props} />}>
        <Tab.Screen name="Typing" component={Typing} />
        <Tab.Screen
          name="Indexing"
          component={Indexing}
          options={{
            header: props => (
              <View style={styles.header}>
                <View style={styles.headerLeft} />
                <View style={styles.headerCenter}>
                  <Text style={styles.headerTitleTxt}>전체 성경</Text>
                </View>
                <View style={styles.headerRight}>
                  <Pressable
                    onPress={() =>
                      props.navigation.navigate('Search', {page: 'indexing'})
                    }>
                    <SvgXml xml={svgList.searchBtn} width={24} height={24} />
                  </Pressable>

                  <Pressable
                    style={styles.headerDropDown}
                    onPress={() => setDropDown(true)}>
                    <Text style={styles.headerDropDownTxt}>
                      {dropDownItems[selectedIndex]}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Favorite"
          component={Favorite}
          options={{
            header: props => (
              <View style={styles.header}>
                <View style={styles.headerLeft} />
                <View style={styles.headerCenter}>
                  <Text style={styles.headerTitleTxt}>북마크</Text>
                </View>
                <View style={styles.headerRight}>
                  <Pressable
                    onPress={() =>
                      props.navigation.navigate('Search', {page: 'favorite'})
                    }>
                    <SvgXml xml={svgList.searchBtn} width={24} height={24} />
                  </Pressable>

                  <Pressable
                    style={styles.headerDropDown}
                    onPress={() => setDropDown(true)}>
                    <Text style={styles.headerDropDownTxt}>
                      {dropDownItems[selectedIndex]}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
      <DropDownModal
        visible={dropDown}
        setVisible={setDropDown}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        dropDownItems={dropDownItems}
      />
    </View>
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
    backgroundColor: '#FFFFFF',
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
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#3C3C432E',
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  headerTitleTxt: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Eulyoo1945-SemiBold',
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  headerRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerDropDown: {
    marginLeft: 8,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDropDownTxt: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: -0.32,
    color: '#FFFFFF',
  },
});
