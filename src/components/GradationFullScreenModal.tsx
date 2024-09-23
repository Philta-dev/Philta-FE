import React, {useState, useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Pressable, Text} from 'react-native';
import {Svg, SvgXml} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import {useAppDispatch} from '../store';
import paymentSlice from '../slices/payments';
import {svgList} from '../assets/svgList';

type GradationFullScreenModalProps = {};

export default function GradationFullScreenModal(
  props: GradationFullScreenModalProps,
) {
  useEffect(() => {}, []);
  const dispatch = useAppDispatch();

  return (
    <View style={styles.entire}>
      <LinearGradient
        colors={['#ABB0BA80', '#1C1B1F', '#1C1B1F']}
        locations={[0, 0.5, 1]}
        style={styles.entire}
      />
      <View style={{position: 'relative', width: '100%', alignItems: 'center'}}>
        <Pressable
          style={{position: 'absolute', top: 0, right: 24}}
          onPress={() => {
            dispatch(paymentSlice.actions.setNeedToPay({needToPay: false}));
          }}>
          <SvgXml width={24} height={24} xml={svgList.modal.xBtn} />
        </Pressable>
        <SvgXml width={80} height={80} xml={svgList.modal.logo} />
      </View>

      <Text
        style={[
          styles.txt,
          {
            fontFamily: 'Pretendard-Medium',
            lineHeight: 25.6,
            letterSpacing: -0.32,
            fontSize: 16,
            marginTop: 28,
            marginBottom: 10,
          },
        ]}>
        안녕하세요, 개발팀입니다.
      </Text>
      <SvgXml width={312} xml={svgList.modal.slogan} />
      <Text
        style={[
          styles.txt,
          {
            fontFamily: 'Pretendard-Medium',

            lineHeight: 24.31,
            fontSize: 17,
            textAlign: 'center',
            marginTop: 25,
            marginBottom: 4,
          },
        ]}>
        {'현대인에게 가장 친숙한 핸드폰을\n말씀을 위한 도구로 바꾸기 위해'}
      </Text>
      <SvgXml width={280} xml={svgList.modal.slogan2} />
      <Text
        style={[
          styles.txt,
          {
            fontFamily: 'Pretendard-Medium',

            lineHeight: 24.31,
            fontSize: 17,
            marginTop: 6,
            marginBottom: 20,
          },
        ]}>
        {'라는 비전을 갖고 시작했습니다.'}
      </Text>
      <SvgXml width={120} xml={svgList.modal.separator} />
      <Text
        style={[
          styles.txt,
          {
            fontFamily: 'Pretendard-Medium',

            lineHeight: 22.4,
            fontSize: 14,
            letterSpacing: -0.28,
            textAlign: 'center',
            marginTop: 14,
          },
        ]}>
        {
          '성경 66권을 개인마다 데이터베이스에\n저장하고 유지하기 위해서는\n소량의 서버비용(3천원)이 소요됩니다.'
        }
      </Text>
      <Text
        style={[
          styles.txt,
          {
            color: '#ABABF5',
            fontFamily: 'Pretendard-Medium',

            fontSize: 13,
            letterSpacing: -0.26,
            textAlign: 'center',
            marginTop: 39,
          },
        ]}>
        {'원하실 때 취소하실 수 있습니다.'}
      </Text>
      <Pressable style={styles.btn}>
        <Text
          style={{
            color: 'white',
            fontFamily: 'Pretendard-ExtraBold',
            fontSize: 18,
            lineHeight: 24,
            letterSpacing: -0.32,
            textAlign: 'center',
          }}>
          구독 시작하기
        </Text>
        <View style={{width: 10}} />
        <SvgXml width={20} height={20} xml={svgList.modal.backBtn} />
      </Pressable>
      <Text
        style={[
          styles.txt,
          {
            color: '#ABABF5',
            fontFamily: 'Pretendard-Medium',

            fontSize: 13,
            letterSpacing: -0.26,
            textAlign: 'center',
            marginTop: 56,
          },
        ]}>
        {'비용을 줄일 수 있는 개발자 분들의 자문 환영합니다'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  txt: {
    color: 'white',
    fontFamily: 'Pretendard',
  },
  btn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 40,
    backgroundColor: '#5856D6',
    borderWidth: 1,
    borderColor: '#FCFCFE',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
});
