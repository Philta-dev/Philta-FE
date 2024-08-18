import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MyPageNavStackParamList} from '../navigations/MyPageNav';
import {Pressable, StyleSheet, View} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import {Svg, SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import Text from '../components/Text';
import TextBold from '../components/TextBold';

type RecordNavigationProp = NativeStackNavigationProp<
  MyPageNavStackParamList,
  'Record'
>;

type RecordProps = {
  navigation: RecordNavigationProp;
};

export default function Record(props: RecordProps) {
  return <View style={styles.entire}></View>;
}

const styles = StyleSheet.create({
  entire: {},
});
