import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MyPageNavStackParamList} from '../navigations/MyPageNav';
import {BackHandler, Pressable, StyleSheet, View} from 'react-native';
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
  useEffect(() => {
    const backHanlder = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        props.navigation.goBack();
        return true;
      },
    );
    return () => {
      backHanlder.remove();
    };
  }, [props.navigation]);
  return <View style={styles.entire}></View>;
}

const styles = StyleSheet.create({
  entire: {},
});
