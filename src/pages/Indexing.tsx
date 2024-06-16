import HorizontalPicker from '@vseslav/react-native-horizontal-picker';
import React, {SetStateAction, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Text from '../components/Text';
import {NavParamList} from '../../AppInner';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

const buttonWidth = 80;
const buttonSmallWidth = 40;
const screenWidth = Dimensions.get('window').width;

type IndexScreenNavigationProp = NativeStackNavigationProp<
  NavParamList,
  'Indexing'
>;
type IndexProps = {
  navigation: IndexScreenNavigationProp;
};

export default function Indexing(props: IndexProps) {
  const dispatch = useAppDispatch();
  const reduxTestament = useSelector(
    (state: RootState) => state.user.testament,
  );
  const reduxBook = useSelector((state: RootState) => state.user.book);
  const reduxChap = useSelector((state: RootState) => state.user.chapter);
  const reduxVerse = useSelector((state: RootState) => state.user.verse);
  const version = useSelector((state: RootState) => state.user.version);
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);
  const [testamentFocusedIndex, setTestamentFocusedIndex] = useState(0);
  const [bookFocusedIndex, setBookFocusedIndex] = useState(0);
  const [chapFocusedIndex, setChapFocusedIndex] = useState(0);
  const [verseFocusedIndex, setVerseFocusedIndex] = useState(0);
  const [verseId, setVerseId] = useState(0);
  const windowHeight = useWindowDimensions().height;
  let itemHeight = (windowHeight / 2 - 48) / 4;

  useEffect(() => {
    if (reduxTestament !== testamentFocusedIndex) {
      setTestamentFocusedIndex(reduxTestament);
    }
    if (reduxBook !== bookFocusedIndex) {
      setBookFocusedIndex(reduxBook);
    }
    if (reduxChap !== chapFocusedIndex) {
      setChapFocusedIndex(reduxChap);
    }
    if (reduxVerse !== verseFocusedIndex) {
      setVerseFocusedIndex(reduxVerse);
    }
  }, [reduxTestament, reduxBook, reduxChap, reduxVerse]);

  useEffect(() => {
    const blurListener = props.navigation.addListener('blur', () => {
      setTestamentFocusedIndex(0);
      setBookFocusedIndex(0);
      setChapFocusedIndex(0);
      setVerseFocusedIndex(0);
      dispatch(
        userSlice.actions.setIndex({
          testament: 0,
          book: 0,
          chapter: 0,
          verse: 0,
        }),
      );
    });
    return blurListener;
  }, []);
  useEffect(() => {
    scrollToIndex(
      'testament',
      testamentFocusedIndex,
      testament,
      scrollRef1,
      setTestamentFocusedIndex,
    );
  }, [testamentFocusedIndex]);
  useEffect(() => {
    scrollToIndex(
      'book',
      bookFocusedIndex,
      book,
      scrollRef2,
      setBookFocusedIndex,
    );
  }, [bookFocusedIndex]);
  useEffect(() => {
    scrollToIndex(
      'chap',
      chapFocusedIndex,
      chap,
      scrollRef3,
      setChapFocusedIndex,
    );
  }, [chapFocusedIndex]);
  useEffect(() => {
    scrollToIndex(
      'verse',
      verseFocusedIndex,
      verse,
      scrollRef4,
      setVerseFocusedIndex,
    );
  }, [verseFocusedIndex]);

  const [testament, setTestament] = useState(['구약', '신약']);
  const [book, setBook] = useState(['창', '출', '레', '민', '신']);
  // useEffect(() => {
  //   if (testamentFocusedIndex === 0) {
  //     setBook(['창세기', '출애굽기', '레위기', '민수기', '신명기']);
  //   } else {
  //     setBook(['마태복음', '마가복음', '누가복음', '요한복음', '사도행전']);
  //   }
  // }, [testamentFocusedIndex]);
  // const chap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [chap, setChap] = useState(10);
  // const verse = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [verse, setVerse] = useState(10);
  const [fullname, setFullname] = useState('');

  const scrollToIndex = (
    type: string,
    index: number,
    data: string[] | number,
    ref: React.RefObject<FlatList>,
    setSelectedIndex: React.Dispatch<SetStateAction<number>>,
  ) => {
    if (typeof data === 'object') {
      if (index >= 0 && index < data.length) {
        ref.current?.scrollToOffset({
          animated: true,
          offset: index * buttonWidth,
        });
        //   // setSelectedIndex(index);
        //   if (type == 'testament' || type == 'book') {
        //   } else if (type == 'chap' || type == 'verse') {
        //   });
      }
    } else {
      if (index >= 0 && index < data) {
        ref.current?.scrollToOffset({
          animated: true,
          offset: index * buttonSmallWidth + 20,
        });
      }
    }
  };

  const handleScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    {
      type,
      datalen,
      selectedIndex,
      setSelectedIndex,
    }: {
      type: string;
      datalen: number;
      selectedIndex: number;
      setSelectedIndex: React.Dispatch<SetStateAction<number>>;
    },
  ) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    let direction =
      offsetX > chapFocusedIndex * buttonSmallWidth + 20 ? 'right' : 'left';
    const index =
      type == 'testament' || type == 'book'
        ? Math.round(offsetX / buttonWidth)
        : direction == 'right'
        ? Math.round((offsetX - 40) / buttonSmallWidth)
        : Math.round((offsetX - 20) / buttonSmallWidth);
    if (index !== selectedIndex) {
      setSelectedIndex(index);
      if (type == 'testament') {
        setBookFocusedIndex(0);
        setChapFocusedIndex(0);
        setVerseFocusedIndex(0);
      } else if (type == 'book') {
        setChapFocusedIndex(0);
        setVerseFocusedIndex(0);
      } else if (type == 'chap') {
        setVerseFocusedIndex(0);
      }
      if (index >= datalen) {
        setSelectedIndex(datalen - 1);
      }
    }
  };

  useEffect(() => {
    getData();
  }, [
    testamentFocusedIndex,
    bookFocusedIndex,
    chapFocusedIndex,
    verseFocusedIndex,
    version,
  ]);

  const getData = async () => {
    try {
      console.log('redux', reduxTestament, reduxBook, reduxChap, reduxVerse);
      console.log(
        't',
        testamentFocusedIndex,
        'b',
        bookFocusedIndex,
        'c',
        chapFocusedIndex,
        'v',
        verseFocusedIndex,
      );
      const response = await axios.get(
        `${Config.API_URL}/index/baseinfo?T=${testamentFocusedIndex + 1}&B=${
          bookFocusedIndex + 1
        }&C=${chapFocusedIndex + 1}&V=${verseFocusedIndex + 1}`,
      );
      console.log(response.data);
      setTestament([
        response.data.old_testament_name,
        response.data.new_testament_name,
      ]);
      setBook(response.data.books);
      setChap(response.data.chapters);
      setVerse(response.data.verses);
      setFullname(response.data.full_name);
      setVerseId(response.data.verseId);
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };

  const handlePointer = async () => {
    console.log('verseId', verseId);
    try {
      const response = await axios.post(`${Config.API_URL}/index/current`, {
        verseId: verseId,
      });
      console.log(response.data);
      // setTestamentFocusedIndex(0);
      // setBookFocusedIndex(0);
      // setChapFocusedIndex(0);
      // setVerseFocusedIndex(0);
      // dispatch(
      //   userSlice.actions.setIndex({
      //     testament: 0,
      //     book: 0,
      //     chapter: 0,
      //     verse: 0,
      //   }),
      // );
      props.navigation.navigate('Typing');
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };

  return (
    <View style={{backgroundColor: 'white', paddingTop: 8, flex: 1}}>
      <Text style={{marginVertical: 32, marginLeft: 24}}>
        좌우로 스크롤하여 구절 선택
      </Text>
      <View>
        <View>
          <FlatList
            ref={scrollRef1}
            data={testament}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  setTestamentFocusedIndex(index);
                  setBookFocusedIndex(0);
                  setChapFocusedIndex(0);
                  setVerseFocusedIndex(0);
                }}
                style={[styles.item, {height: itemHeight}]}>
                <Text
                  style={[
                    styles.itemText,
                    index === testamentFocusedIndex
                      ? {fontSize: 18}
                      : {fontSize: 17},
                  ]}>
                  {item}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={buttonWidth}
            decelerationRate="fast"
            onMomentumScrollEnd={e =>
              handleScroll(e, {
                type: 'testament',
                datalen: testament.length,
                selectedIndex: testamentFocusedIndex,
                setSelectedIndex: setTestamentFocusedIndex,
              })
            }
            contentContainerStyle={{
              paddingHorizontal: (screenWidth - buttonWidth) / 2,
            }}
          />
          <View style={{height: 16}} />
          <FlatList
            ref={scrollRef2}
            data={book}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  setBookFocusedIndex(index);
                  setChapFocusedIndex(0);
                  setVerseFocusedIndex(0);
                }}
                style={[styles.item, {height: itemHeight}]}>
                <Text
                  style={[
                    styles.itemText,
                    index === bookFocusedIndex
                      ? {fontSize: 18}
                      : {fontSize: 17},
                  ]}>
                  {item}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={buttonWidth}
            decelerationRate="fast"
            onMomentumScrollEnd={e =>
              handleScroll(e, {
                type: 'book',
                datalen: book.length,
                selectedIndex: bookFocusedIndex,
                setSelectedIndex: setBookFocusedIndex,
              })
            }
            contentContainerStyle={{
              paddingHorizontal: (screenWidth - buttonWidth) / 2,
            }}
          />
          <View style={{height: 16}} />
          <FlatList
            ref={scrollRef3}
            data={Array.from({length: chap}, (_, i) => i + 1)}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  setChapFocusedIndex(index);
                  setVerseFocusedIndex(0);
                }}
                style={[
                  styles.item,
                  chapFocusedIndex !== index && {width: buttonSmallWidth},
                  {height: itemHeight},
                ]}>
                <Text
                  style={[
                    styles.itemText,
                    index === chapFocusedIndex
                      ? {fontSize: 18}
                      : {fontSize: 17},
                  ]}>
                  {item + (index === chapFocusedIndex ? '장' : '')}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={buttonSmallWidth}
            decelerationRate="fast"
            onMomentumScrollEnd={e =>
              handleScroll(e, {
                type: 'chap',
                datalen: chap,
                selectedIndex: chapFocusedIndex,
                setSelectedIndex: setChapFocusedIndex,
              })
            }
            contentContainerStyle={{
              paddingHorizontal: (screenWidth - buttonSmallWidth) / 2,
            }}
          />
          <View style={{height: 16}} />
          <FlatList
            ref={scrollRef4}
            data={Array.from({length: verse}, (_, i) => i + 1)}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  setVerseFocusedIndex(index);
                }}
                style={[
                  styles.item,
                  verseFocusedIndex !== index && {width: buttonSmallWidth},
                  {height: itemHeight},
                ]}>
                <Text
                  style={[
                    styles.itemText,
                    index === verseFocusedIndex
                      ? {fontSize: 18}
                      : {fontSize: 17},
                  ]}>
                  {item + (index === verseFocusedIndex ? '절' : '')}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={buttonSmallWidth}
            decelerationRate="fast"
            onMomentumScrollEnd={e =>
              handleScroll(e, {
                type: 'verse',
                datalen: verse,
                selectedIndex: verseFocusedIndex,
                setSelectedIndex: setVerseFocusedIndex,
              })
            }
            contentContainerStyle={{
              paddingHorizontal: (screenWidth - buttonSmallWidth) / 2,
            }}
          />
          <LinearGradient
            pointerEvents="none"
            colors={['white', 'transparent', 'white']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.overlay]}
          />
        </View>
        <View
          style={[styles.overlayFocus, {height: windowHeight / 2}]}
          pointerEvents="none">
          <View
            style={[styles.overlayVisible, {height: windowHeight / 2}]}></View>
        </View>
      </View>

      <View style={styles.bottomView}>
        {/* <Text style={styles.indexingTxt}>{`
        ${book[bookFocusedIndex]} ${chapFocusedIndex}장 ${verseFocusedIndex}절`}</Text> */}
        <Text style={styles.indexingTxt}>{fullname}</Text>
        <Pressable
          style={styles.confirmBtn}
          onPress={() => {
            handlePointer();
          }}>
          <Text style={styles.confirmBtnTxt}>완료</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: buttonWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  itemText: {
    color: 'black',
    fontFamily: 'Eulyoo1945-SemiBold',
    fontWeight: '600',
    lineHeight: 25,
    letterSpacing: -0.32,
  },
  overlayFocus: {
    height: 336,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayVisible: {
    height: 336,
    width: buttonWidth,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
  },
  bottomView: {
    width: '100%',
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  indexingTxt: {
    marginTop: 24,
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 25,
    letterSpacing: -0.32,
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
    backgroundColor: '#5856D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  confirmBtnTxt: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Eulyoo1945-SemiBold',
    lineHeight: 24,
    letterSpacing: -0.32,
  },
});
