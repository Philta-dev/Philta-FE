import React, {SetStateAction, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
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
  const [chapWord, setChapWord] = useState('');
  const [verseWord, setVerseWord] = useState('');
  const [verseId, setVerseId] = useState(0);
  const [moving, setMoving] = useState(false);
  const windowHeight = useWindowDimensions().height;
  let itemHeight = (windowHeight / 2 - 48) / 4;
  const [loading, setLoading] = useState(false);
  const [redux, setRedux] = useState(false);

  useEffect(() => {
    if (reduxTestament == -1) {
      setTestamentFocusedIndex(0);
      scrollToIndex(
        'testament',
        0,
        testament,
        scrollRef1,
        setTestamentFocusedIndex,
      );
      setBookFocusedIndex(0);
      scrollToIndex('book', 0, book, scrollRef2, setBookFocusedIndex);
      setChapFocusedIndex(0);
      scrollToIndex('chap', 0, chap, scrollRef3, setChapFocusedIndex);
      setVerseFocusedIndex(0);
      scrollToIndex('verse', 0, verse, scrollRef4, setVerseFocusedIndex);
    } else {
      setRedux(true);
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
      // scrollToIndex(
      //   'testament',
      //   reduxTestament,
      //   testament,
      //   scrollRef1,
      //   setTestamentFocusedIndex,
      // );
      // scrollToIndex('book', reduxBook, book, scrollRef2, setBookFocusedIndex);
      // scrollToIndex('chap', reduxChap, chap, scrollRef3, setChapFocusedIndex);
      // scrollToIndex(
      //   'verse',
      //   reduxVerse,
      //   verse,
      //   scrollRef4,
      //   setVerseFocusedIndex,
      // );
      // dispatch(
      //   userSlice.actions.setIndex({
      //     testament: -1,
      //     book: -1,
      //     chapter: -1,
      //     verse: -1,
      //   }),
      // );
    }
  }, [reduxTestament, reduxBook, reduxChap, reduxVerse]);

  useEffect(() => {
    const blurListener = props.navigation.addListener('blur', () => {
      setTestamentFocusedIndex(0);
      scrollToIndex(
        'testament',
        0,
        testament,
        scrollRef1,
        setTestamentFocusedIndex,
      );
      setBookFocusedIndex(0);
      scrollToIndex('book', 0, book, scrollRef2, setBookFocusedIndex);
      setChapFocusedIndex(0);
      scrollToIndex('chap', 0, chap, scrollRef3, setChapFocusedIndex);
      setVerseFocusedIndex(0);
      scrollToIndex('verse', 0, verse, scrollRef4, setVerseFocusedIndex);
      dispatch(
        userSlice.actions.setIndex({
          testament: -1,
          book: -1,
          chapter: -1,
          verse: -1,
        }),
      );
    });
    return blurListener;
  }, []);
  const [testament, setTestament] = useState(['구약', '신약']);
  const [book, setBook] = useState(['창', '출', '레', '민', '신']);
  const [chap, setChap] = useState(Array.from({length: 10}, (_, i) => i + 1));
  const [verse, setVerse] = useState(Array.from({length: 10}, (_, i) => i + 1));
  const [fullname, setFullname] = useState('');

  const scrollToIndex = (
    type: string,
    index: number,
    data: string[] | number[],
    ref: React.RefObject<FlatList>,
    setSelectedIndex: React.Dispatch<SetStateAction<number>>,
  ) => {
    if (type == 'testament' || type == 'book') {
      if (index >= 0 && index < data.length) {
        setTimeout(() => {
          ref.current?.scrollToOffset({
            animated: true,
            offset: index * buttonWidth,
          });
        }, 0);
      }
    } else {
      if (index >= 0 && index < data.length) {
        setTimeout(() => {
          ref.current?.scrollToOffset({
            animated: true,
            offset: index * buttonSmallWidth + 20,
          });
        }, 0);
      }
    }
    // setMoving(false);
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
    // setMoving(true);
    const offsetX = e.nativeEvent.contentOffset.x;
    let direction =
      type == 'chap' || type == 'verse'
        ? offsetX > selectedIndex * buttonSmallWidth + 20
          ? 'right'
          : 'left'
        : offsetX > selectedIndex * buttonWidth
        ? 'right'
        : 'left';
    const index =
      type == 'testament' || type == 'book'
        ? Math.round(offsetX / buttonWidth)
        : direction == 'right'
        ? Math.round((offsetX - 40) / buttonSmallWidth)
        : Math.round((offsetX - 20) / buttonSmallWidth);
    console.log('offsetX', offsetX);
    console.log(buttonSmallWidth * index);
    // scrollref 받아서 이만큼씩 이동, focused인덱스 바뀌면 스크롤하는 거 없애고 바낄때 offset으로 스크롤하는 걸로 추가하든지
    if (index !== selectedIndex) {
      setSelectedIndex(index);

      if (type == 'testament') {
        scrollToIndex(
          'testament',
          index,
          testament,
          scrollRef1,
          setTestamentFocusedIndex,
        );
        setBookFocusedIndex(0);
        scrollToIndex('book', 0, book, scrollRef2, setBookFocusedIndex);
        setChapFocusedIndex(0);
        scrollToIndex('chap', 0, chap, scrollRef3, setChapFocusedIndex);
        setVerseFocusedIndex(0);
        scrollToIndex('verse', 0, verse, scrollRef4, setVerseFocusedIndex);
      } else if (type == 'book') {
        scrollToIndex('book', index, book, scrollRef2, setBookFocusedIndex);
        setChapFocusedIndex(0);
        scrollToIndex('chap', 0, chap, scrollRef3, setChapFocusedIndex);
        setVerseFocusedIndex(0);
        scrollToIndex('verse', 0, verse, scrollRef4, setVerseFocusedIndex);
      } else if (type == 'chap') {
        scrollToIndex('chap', index, chap, scrollRef3, setChapFocusedIndex);
        setVerseFocusedIndex(0);
        scrollToIndex('verse', 0, verse, scrollRef4, setVerseFocusedIndex);
      } else {
        scrollToIndex('verse', index, verse, scrollRef4, setVerseFocusedIndex);
      }
      if (index >= datalen) {
        setSelectedIndex(datalen - 1);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => getData(), 300);
  }, [
    testamentFocusedIndex,
    bookFocusedIndex,
    chapFocusedIndex,
    verseFocusedIndex,
    version,
  ]);

  const getData = async () => {
    try {
      // setMoving(false);
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
      setChap(Array.from({length: response.data.chapters}, (_, i) => i + 1));
      setVerse(Array.from({length: response.data.verses}, (_, i) => i + 1));
      setChapWord(response.data.chapter);
      setVerseWord(response.data.verse);
      setFullname(response.data.full_name);
      setVerseId(response.data.verseId);
      if (redux) {
        if (scrollRef1.current.offsetX !== reduxTestament * buttonWidth) {
          scrollToIndex(
            'testament',
            reduxTestament,
            testament,
            scrollRef1,
            setTestamentFocusedIndex,
          );
        }
        if (scrollRef2.current.offsetX !== reduxBook * buttonWidth) {
          scrollToIndex(
            'book',
            reduxBook,
            book,
            scrollRef2,
            setBookFocusedIndex,
          );
        }
        if (scrollRef3.current.offsetX !== reduxChap * buttonSmallWidth) {
          scrollToIndex(
            'chap',
            reduxChap,
            chap,
            scrollRef3,
            setChapFocusedIndex,
          );
        }
        if (scrollRef4.current.offsetX !== reduxVerse * buttonSmallWidth) {
          scrollToIndex(
            'verse',
            reduxVerse,
            verse,
            scrollRef4,
            setVerseFocusedIndex,
          );
        }
        setRedux(false);
      }
      setLoading(false);
      // setMoving(false);
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
      <Text
        style={{marginVertical: windowHeight > 600 ? 20 : 32, marginLeft: 24}}>
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
                  scrollToIndex(
                    'testament',
                    index,
                    testament,
                    scrollRef1,
                    setTestamentFocusedIndex,
                  );
                  setBookFocusedIndex(0);
                  scrollToIndex(
                    'book',
                    0,
                    book,
                    scrollRef2,
                    setBookFocusedIndex,
                  );
                  setChapFocusedIndex(0);
                  scrollToIndex(
                    'chap',
                    0,
                    chap,
                    scrollRef3,
                    setChapFocusedIndex,
                  );
                  setVerseFocusedIndex(0);
                  scrollToIndex(
                    'verse',
                    0,
                    verse,
                    scrollRef4,
                    setVerseFocusedIndex,
                  );
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
            // scrollEnabled={!moving}
            snapToInterval={buttonWidth}
            decelerationRate={'fast'}
            onScrollBeginDrag={() => {
              setLoading(true);
            }}
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
            onScrollToIndexFailed={info => {
              console.log('scrolltoindex failed', info);
            }}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  setBookFocusedIndex(index);
                  scrollToIndex(
                    'book',
                    index,
                    book,
                    scrollRef2,
                    setBookFocusedIndex,
                  );
                  setChapFocusedIndex(0);
                  scrollToIndex(
                    'chap',
                    0,
                    chap,
                    scrollRef3,
                    setChapFocusedIndex,
                  );
                  setVerseFocusedIndex(0);
                  scrollToIndex(
                    'verse',
                    0,
                    verse,
                    scrollRef4,
                    setVerseFocusedIndex,
                  );
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
            // scrollEnabled={!moving}
            snapToInterval={buttonWidth}
            decelerationRate="fast"
            onScrollBeginDrag={() => {
              setLoading(true);
            }}
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
            data={chap}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  setChapFocusedIndex(index);
                  scrollToIndex(
                    'chap',
                    index,
                    chap,
                    scrollRef3,
                    setChapFocusedIndex,
                  );
                  setVerseFocusedIndex(0);
                  scrollToIndex(
                    'verse',
                    0,
                    verse,
                    scrollRef4,
                    setVerseFocusedIndex,
                  );
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
                  {/* {item + (index === chapFocusedIndex ? '장' : '')} */}
                  {index === chapFocusedIndex
                    ? chapWord.replace('#', item.toString())
                    : item}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            onScrollBeginDrag={() => {
              setLoading(true);
            }}
            showsHorizontalScrollIndicator={false}
            // scrollEnabled={!moving}
            // snapToInterval={buttonSmallWidth}
            decelerationRate="fast"
            onMomentumScrollEnd={e =>
              handleScroll(e, {
                type: 'chap',
                datalen: chap.length,
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
            data={verse}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  setVerseFocusedIndex(index);
                  scrollToIndex(
                    'verse',
                    index,
                    verse,
                    scrollRef4,
                    setVerseFocusedIndex,
                  );
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
                  {/* {item + (index === verseFocusedIndex ? '절' : '')} */}
                  {index === verseFocusedIndex
                    ? verseWord.replace('#', item.toString())
                    : item}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            // snapToInterval={buttonSmallWidth}
            // scrollEnabled={!moving}
            decelerationRate="fast"
            onScrollBeginDrag={() => {
              setLoading(true);
            }}
            onMomentumScrollEnd={e =>
              handleScroll(e, {
                type: 'verse',
                datalen: verse.length,
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
            colors={['white', 'rgba(255, 255, 255,0)', 'white']}
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
        <Text
          style={[
            styles.indexingTxt,
            {
              marginTop: windowHeight > 600 ? 18 : 24,
            },
          ]}>
          {fullname}
        </Text>
        <Pressable
          disabled={loading}
          style={styles.confirmBtn}
          onPress={() => {
            handlePointer();
          }}>
          <Text
            style={[styles.confirmBtnTxt, loading && {color: 'transparent'}]}>
            완료
          </Text>
          {loading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="small" color="#ffffff" />
            </View>
          )}
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
    position: 'relative',
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
