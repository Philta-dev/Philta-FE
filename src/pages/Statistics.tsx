import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MyPageNavStackParamList} from '../navigations/MyPageNav';
import {BackHandler, Pressable, StyleSheet, View, FlatList} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import Config from 'react-native-config';
import {RootState, useAppDispatch} from '../store';
import {useSelector} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import Text from '../components/Text';
import TextBold from '../components/TextBold';
import ProgressCirle from '../components/ProgressCircle';
import ProgressBar from '../components/ProgessBar';

type StatisticsNavigationProp = NativeStackNavigationProp<
  MyPageNavStackParamList,
  'Statistics'
>;

type StatisticsProps = {
  navigation: StatisticsNavigationProp;
};

export default function Statistics(props: StatisticsProps) {
  const lang = useSelector((state: RootState) => state.user.lang);
  const [testament, setTestament] = useState(true);
  const [book, setBook] = useState(-1);
  useEffect(() => {
    const backButtonHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (book != -1) {
          setBook(-1);
          return true;
        }
        return false;
      },
    );
    return () => {
      backButtonHandler.remove();
    };
  }, [book]);
  const refBook = useRef<FlatList>(null);
  const refChap = useRef<FlatList>(null);
  const bookData = [
    {name: '창세기', progress: 10, id: 3},
    {name: '창세기', progress: 20, id: 4},
    {name: '창세기', progress: 20, id: 5},
    {name: '창세기', progress: 20, id: 6},
    {name: '창세기', progress: 20, id: 7},
    {name: '창세기', progress: 20, id: 8},
    {name: '창세기', progress: 20, id: 9},
    {name: '창세기', progress: 20, id: 10},
    {name: '창세기', progress: 20, id: 11},
    {name: '창세기', progress: 20, id: 12},
    {name: '창세기', progress: 20, id: 13},
    {name: '창세기', progress: 20, id: 14},
    {name: '창세기', progress: 20, id: 15},
    {name: '창세기', progress: 20, id: 16},
    {name: '창세기', progress: 20, id: 17},
  ];
  const chapData = [
    {name: '1장', progress: 10, id: 3},
    {name: '2장', progress: 20, id: 4},
    {name: '3장', progress: 20, id: 5},
    {name: '4장', progress: 20, id: 6},
  ];
  return (
    <View style={styles.entire}>
      <View style={styles.statisticsHeader}>
        <ProgressCirle
          size={56}
          width={6}
          progressColor="#5656D6"
          nonProgressColor="#F4F4F4"
          progress={10}
          selected={testament}
          text={lang == 'en' ? 'Old' : '구약'}
          fonstSize={14}
          fontLineHeight={22.4}
          fontLetterSpacing={-0.32}
          fontSelectedColor="#000"
          fontNonSelectedColor="#9B9EA5"
          onPress={() => {
            setTestament(true);
            setBook(-1);
            refBook.current?.scrollToOffset({offset: 0, animated: true});
          }}
        />
        <View style={{width: 24}} />
        <ProgressCirle
          size={56}
          width={6}
          progressColor="#5656D6"
          nonProgressColor="#F4F4F4"
          progress={10}
          selected={!testament}
          text={lang == 'en' ? 'New' : '신약'}
          fonstSize={14}
          fontLineHeight={22.4}
          fontLetterSpacing={-0.32}
          fontSelectedColor="#000"
          fontNonSelectedColor="#9B9EA5"
          onPress={() => {
            setTestament(false);
            setBook(-1);
            refBook.current?.scrollToOffset({offset: 0, animated: true});
          }}
        />
      </View>
      <View style={styles.statisticsContent}>
        <FlatList
          data={bookData}
          ref={refBook}
          style={[
            book != -1 && {
              maxWidth: 136,
              minWidth: 136,
            },
          ]}
          renderItem={({item, index}) => {
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  setBook(item.id);
                  refChap.current?.scrollToOffset({offset: 0, animated: true});
                }}
                style={[
                  styles.eachRow,
                  index == bookData.length - 1 && {borderBottomWidth: 0},
                ]}>
                <View
                  style={[
                    styles.rowHeader,
                    index == 0 && {borderTopStartRadius: 8},
                    index == bookData.length - 1 && {
                      borderBottomStartRadius: 8,
                    },
                    item.id == book && {backgroundColor: '#5656D6'},
                    item.id != book &&
                      book != -1 && {backgroundColor: '#FCFCFE'},
                  ]}>
                  <Text
                    style={[
                      styles.rowText,
                      item.id == book && {
                        color: '#FCFCFE',
                        fontFamily: 'KoPubWorldBatangPB',
                      },
                      item.id != book && book != -1 && {color: '#9B9EA5'},
                    ]}>
                    {item.name}
                  </Text>
                </View>
                {book == -1 && (
                  <View
                    style={[
                      styles.rowContent,
                      index == 0 && {borderTopEndRadius: 8},
                      index == bookData.length - 1 && {
                        borderBottomEndRadius: 8,
                      },
                    ]}>
                    <ProgressBar
                      width={'100%'}
                      height={6}
                      progressColor="#5656D6"
                      nonProgressColor="#F4F4F4"
                      progress={item.progress}
                      borderRadius={10}
                    />
                    <SvgXml
                      xml={svgList.myPage.arrowRightCircle}
                      width={20}
                      height={20}
                      style={{position: 'absolute', right: 14}}
                    />
                  </View>
                )}
              </Pressable>
            );
          }}
        />
        {book != -1 && (
          <FlatList
            data={chapData}
            ref={refChap}
            renderItem={({item, index}) => {
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    props.navigation.navigate('Record');
                  }}
                  style={[
                    styles.eachRow,
                    index == bookData.length - 1 && {borderBottomWidth: 0},
                  ]}>
                  <View
                    style={[
                      styles.rowContent,
                      index == 0 && {borderTopEndRadius: 8},
                      index == bookData.length - 1 && {
                        borderBottomEndRadius: 8,
                      },
                      {paddingLeft: 64, width: '100%'},
                    ]}>
                    <Text
                      style={[
                        styles.rowText,
                        {position: 'absolute', left: 16},
                      ]}>
                      {item.name}
                    </Text>
                    <ProgressBar
                      width={'100%'}
                      height={6}
                      progressColor="#5656D6"
                      nonProgressColor="#F4F4F4"
                      progress={item.progress}
                      borderRadius={10}
                    />
                    <SvgXml
                      xml={svgList.myPage.arrowRightCircle}
                      width={20}
                      height={20}
                      style={{position: 'absolute', right: 14}}
                    />
                  </View>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    marginBottom: 110,
  },
  statisticsHeader: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statisticsContent: {
    paddingLeft: 24,
    paddingRight: 16,
    width: '100%',
    flexDirection: 'row',
  },
  eachRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#5656D60A',
    height: 56,
  },
  rowHeader: {
    width: 136,
    paddingVertical: 17,
    paddingHorizontal: 16,
  },
  rowText: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.32,
    color: '#000',
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7FF',
    paddingLeft: 16,
    paddingRight: 40,
  },
});
