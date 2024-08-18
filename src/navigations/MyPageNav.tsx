import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {svgList} from '../assets/svgList';
import {Keyboard, Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import Text from '../components/Text';
import TextBold from '../components/TextBold';
import Favorite from '../pages/Favorite';
import MyPage from '../pages/MyPage';
import Statistics from '../pages/Statistics';
import Search from '../pages/Search';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {trackEvent} from '../services/trackEvent.service';
import DropDownModal from '../components/DropDownModal';
import Record from '../pages/Record';
import {useSelector} from 'react-redux';

export type MyPageNavStackParamList = {
  MyPage: undefined;
  Favorite: undefined;
  Statistics: undefined;
  Record: undefined;
  Search: {page: string};
  Typing: undefined;
};

export type MyPageStackNavigationProp =
  NativeStackNavigationProp<MyPageNavStackParamList>;

const Stack = createNativeStackNavigator<MyPageNavStackParamList>();

export default function MyPageNav() {
  const dispatch = useAppDispatch();
  const lang = useSelector((state: RootState) => state.user.lang);
  const [dropDown, setDropDown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
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
      const response = await axios.post(
        `${Config.API_URL}/index/changeversion`,
        {
          version: dropDownItems[index],
        },
      );
      console.log(response.data);
      getVersionData();
      dispatch(
        userSlice.actions.setVersion({
          version: dropDownItems[index],
        }),
      );
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };

  useEffect(() => {
    getVersionData();
  }, []);
  useEffect(() => {
    if (selectedIndex === -1) return;
    if (!dropDown) return;
    trackEvent('Version Changed', {
      version: dropDownItems[selectedIndex],
    });
    selectVersion(selectedIndex);
  }, [selectedIndex]);
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator
        screenOptions={{
          contentStyle: {backgroundColor: '#FFFFFF'},
        }}>
        <Stack.Screen
          name="MyPage"
          component={MyPage}
          options={{
            header: props => (
              <View style={styles.header}>
                <View style={styles.headerLeft} />
                <View style={styles.headerCenter}>
                  <TextBold style={styles.headerTitleTxt}>
                    {lang == 'en' ? 'my page' : '마이페이지'}
                  </TextBold>
                </View>
                <View style={styles.headerRight}>
                  <View style={{width: 24}} />

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
        <Stack.Screen
          name="Statistics"
          component={Statistics}
          options={{
            header: props => (
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Pressable
                    style={{marginLeft: 24}}
                    onPress={() => props.navigation.goBack()}>
                    <SvgXml xml={svgList.backBtn} width={24} height={24} />
                  </Pressable>
                </View>
                <View style={styles.headerCenter}>
                  <TextBold style={styles.headerTitleTxt}>
                    {lang == 'en' ? 'progress' : '나의 통계'}
                  </TextBold>
                </View>
                <View style={styles.headerRight}>
                  <View style={{width: 24}} />

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
        <Stack.Screen
          name="Record"
          component={Record}
          options={{
            header: props => (
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Pressable
                    style={{marginLeft: 24}}
                    onPress={() => props.navigation.goBack()}>
                    <SvgXml xml={svgList.backBtn} width={24} height={24} />
                  </Pressable>
                </View>
                <View style={styles.headerCenter}>
                  <TextBold style={styles.headerTitleTxt}>
                    {lang == 'en' ? 'progress' : '나의 통계'}
                  </TextBold>
                </View>
                <View style={styles.headerRight}>
                  <View style={{width: 24}} />

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
        <Stack.Screen
          name="Favorite"
          component={Favorite}
          options={{
            header: props => (
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Pressable
                    style={{marginLeft: 24}}
                    onPress={() => props.navigation.goBack()}>
                    <SvgXml xml={svgList.backBtn} width={24} height={24} />
                  </Pressable>
                </View>
                <View style={styles.headerCenter}>
                  <TextBold style={styles.headerTitleTxt}>북마크</TextBold>
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
        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>

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
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#3C3C432E',
  },
  headerLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
