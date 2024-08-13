import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MyPageNavStackParamList} from '../navigations/MyPageNav';
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Platform,
} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSelector} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import Text from '../components/Text';
import TextBold from '../components/TextBold';

type MyPageNavigationProp = NativeStackNavigationProp<
  MyPageNavStackParamList,
  'MyPage'
>;

type MyPageProps = {
  navigation: MyPageNavigationProp;
};

export default function MyPage(props: MyPageProps) {
  return (
    <View>
      <Pressable
        onPress={() => {
          props.navigation.navigate('Statistics');
        }}>
        <Text>나의 통계</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          props.navigation.navigate('Favorite');
        }}>
        <Text>북마크</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {},
});
