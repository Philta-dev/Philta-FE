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
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {trackEvent} from '../services/trackEvent.service';
import TextBold from '../components/TextBold';

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
  const windowHeight = useWindowDimensions().height;
  let itemHeight = (windowHeight / 2 - 48) / 4;
  const [loading, setLoading] = useState(false);

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

  const scrollToTestament = (index: number, data: string[]) => {
    console.log('scrollToTestament');
    if (index >= 0 && index < data.length) {
      setTimeout(() => {
        scrollRef1.current?.scrollToOffset({
          animated: true,
          offset: index * buttonWidth,
        });
      }, 0);
    }
  };
  const scrollToBook = (index: number, data: string[]) => {
    console.log('scrollToBook');
    if (index >= 0 && index < data.length) {
      setTimeout(() => {
        scrollRef2.current?.scrollToOffset({
          animated: true,
          offset: index * buttonWidth,
        });
      }, 0);
    }
  };
  const scrollToChap = (index: number, data: number[]) => {
    console.log('scrollToChap');
    if (index >= 0 && index < data.length) {
      setTimeout(() => {
        scrollRef3.current?.scrollToOffset({
          animated: true,
          offset: index * buttonWidth,
        });
      }, 0);
    }
  };
  const scrollToVerse = (index: number, data: number[]) => {
    console.log('scrollToVerse');
    if (index >= 0 && index < data.length) {
      setTimeout(() => {
        scrollRef4.current?.scrollToOffset({
          animated: true,
          offset: index * buttonWidth,
        });
      }, 0);
    }
  };

  const handleScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    {
      ref,
      type,
      datalen,
      selectedIndex,
      setSelectedIndex,
    }: {
      ref: React.RefObject<FlatList>;
      type: string;
      datalen: number;
      selectedIndex: number;
      setSelectedIndex: React.Dispatch<SetStateAction<number>>;
    },
  ) => {
    console.log('handleScroll', selectedIndex);
    const offsetX = e.nativeEvent.contentOffset.x;
    // let direction = offsetX > selectedIndex * buttonWidth ? 'right' : 'left';
    const index = Math.round(offsetX / buttonWidth);
    console.log('offsetX', offsetX);
    if (index !== selectedIndex) {
      console.log('index', index, 'selectedIndex', selectedIndex);
      setSelectedIndex(index);
      if (type == 'testament') {
        scrollToTestament(index, testament);
        scrollToBook(0, book);
        scrollToChap(0, chap);
        scrollToVerse(0, verse);
        setBookFocusedIndex(0);
        setChapFocusedIndex(0);
        setVerseFocusedIndex(0);
      } else if (type == 'book') {
        scrollToBook(index, book);
        setChapFocusedIndex(0);
        scrollToChap(0, chap);
        setVerseFocusedIndex(0);
        scrollToVerse(0, verse);
      } else if (type == 'chap') {
        scrollToChap(index, chap);
        // scrollRef3.current?.scrollToOffset({
        //   animated: true,
        //   offset: index * buttonSmallWidth + 20,
        // });
        setVerseFocusedIndex(0);
        scrollToVerse(0, verse);
      } else {
        scrollToVerse(index, verse);
        // console.log('scrollToVerse', index, index * buttonSmallWidth + 20);
        // scrollRef4.current?.scrollToOffset({
        //   animated: true,
        //   offset: index * buttonSmallWidth + 20,
        // });
      }
    } else {
      console.log('same index');
      // if (
      //   (type == 'chap' || type == 'verse') &&
      //   offsetX > (datalen - 1) * buttonSmallWidth + 20
      // ) {
      //   console.log('overflow', type, index, datalen - 1);
      //   ref.current?.scrollToOffset({
      //     animated: true,
      //     offset: index * buttonSmallWidth + 20,
      //   });
      // } else if (type == 'chap' || type == 'verse') {
      //   ref.current?.scrollToOffset({
      //     animated: true,
      //     offset: index * buttonSmallWidth + 20,
      //   });
      // }
      setLoading(false);
    }
  };

  useEffect(() => {
    const focusListener = props.navigation.addListener('focus', () => {
      setLoading(true);
      trackEvent('Sreen Viewed - Indexing');
      setTimeout(() => getData(), 0);
    });
    const blurListener = props.navigation.addListener('blur', () => {
      setTestamentFocusedIndex(0);
      // scrollToIndex(
      //   'testament',
      //   0,
      //   testament,
      //   scrollRef1,
      //   setTestamentFocusedIndex,
      // );
      scrollToTestament(0, testament);
      setBookFocusedIndex(0);
      // scrollToIndex('book', 0, book, scrollRef2, setBookFocusedIndex);
      scrollToBook(0, book);
      setChapFocusedIndex(0);
      // scrollToIndex('chap', 0, chap, scrollRef3, setChapFocusedIndex);
      scrollToChap(0, chap);
      setVerseFocusedIndex(0);
      // scrollToIndex('verse', 0, verse, scrollRef4, setVerseFocusedIndex);
      scrollToVerse(0, verse);
    });
    return () => {
      focusListener();
      blurListener();
    };
  }, [
    reduxTestament,
    reduxBook,
    reduxChap,
    reduxVerse,
    testamentFocusedIndex,
    bookFocusedIndex,
    chapFocusedIndex,
    verseFocusedIndex,
    version,
  ]);

  useEffect(() => {
    setLoading(true);
    console.log('useEffect > getData');
    setTimeout(() => getData(), 0);
  }, [
    testamentFocusedIndex,
    bookFocusedIndex,
    chapFocusedIndex,
    verseFocusedIndex,
    version,
  ]);

  const getData = async () => {
    console.log('getData');
    try {
      const response = await axios.get(
        reduxTestament !== -1
          ? `${Config.API_URL}/index/baseinfo?T=${reduxTestament + 1}&B=${
              reduxBook + 1
            }&C=${reduxChap + 1}&V=${reduxVerse + 1}`
          : `${Config.API_URL}/index/baseinfo?T=${
              testamentFocusedIndex + 1
            }&B=${bookFocusedIndex + 1}&C=${chapFocusedIndex + 1}&V=${
              verseFocusedIndex + 1
            }`,
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
      if (reduxTestament !== -1) {
        checkRedux(response.data.books);
      }
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };

  const checkRedux = (books: string[]) => {
    console.log('redux', reduxTestament, reduxBook, reduxChap, reduxVerse);
    if (reduxTestament !== -1) {
      setTestamentFocusedIndex(reduxTestament);
      setBookFocusedIndex(reduxBook);
      setChapFocusedIndex(reduxChap);
      setVerseFocusedIndex(reduxVerse);
      setTimeout(() => {
        scrollToTestament(reduxTestament, testament);
        scrollToBook(reduxBook, books);
        scrollToChap(reduxChap, chap);
        scrollToVerse(reduxVerse, verse);
      }, 0);
      dispatch(
        userSlice.actions.setIndex({
          testament: -1,
          book: -1,
          chapter: -1,
          verse: -1,
        }),
      );
    }
    setLoading(false);
  };

  const handlePointer = async () => {
    console.log('verseId', verseId);
    try {
      const response = await axios.post(`${Config.API_URL}/index/current`, {
        verseId: verseId,
      });
      console.log(response.data);
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
                  scrollToTestament(index, testament);
                  setBookFocusedIndex(0);
                  scrollToBook(0, book);
                  setChapFocusedIndex(0);
                  scrollToChap(0, chap);
                  setVerseFocusedIndex(0);
                  scrollToVerse(0, verse);
                }}
                style={[styles.item, {height: itemHeight}]}>
                <TextBold
                  style={[
                    styles.itemText,
                    index === testamentFocusedIndex
                      ? {fontSize: 18}
                      : {fontSize: 17},
                  ]}>
                  {item}
                </TextBold>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={buttonWidth}
            decelerationRate={'fast'}
            onScrollBeginDrag={() => {
              setLoading(true);
            }}
            onMomentumScrollEnd={e =>
              handleScroll(e, {
                ref: scrollRef1,
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
                  scrollToBook(index, book);
                  setChapFocusedIndex(0);
                  scrollToChap(0, chap);
                  setVerseFocusedIndex(0);
                  scrollToVerse(0, verse);
                }}
                style={[styles.item, {height: itemHeight}]}>
                <TextBold
                  style={[
                    styles.itemText,
                    index === bookFocusedIndex
                      ? {fontSize: 18}
                      : {fontSize: 17},
                  ]}>
                  {item}
                </TextBold>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={buttonWidth}
            decelerationRate="fast"
            onScrollBeginDrag={() => {
              setLoading(true);
            }}
            onMomentumScrollEnd={e =>
              handleScroll(e, {
                ref: scrollRef2,
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
            scrollEnabled={true}
            ref={scrollRef3}
            data={chap}
            // onLayout={() => {
            //   scrollRef3.current?.scrollToOffset({offset: 20, animated: false});
            // }}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  setChapFocusedIndex(index);
                  scrollToChap(index, chap);
                  setVerseFocusedIndex(0);
                  scrollToVerse(0, verse);
                }}
                style={[
                  styles.item,
                  // chapFocusedIndex !== index && {width: buttonSmallWidth},
                  {height: itemHeight},
                ]}>
                <TextBold
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
                </TextBold>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            onScrollBeginDrag={() => {
              setLoading(true);
            }}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={buttonWidth}
            onScrollEndDrag={e => {
              if (e.nativeEvent.velocity?.x === 0) {
                handleScroll(e, {
                  ref: scrollRef3,
                  type: 'chap',
                  datalen: chap.length,
                  selectedIndex: chapFocusedIndex,
                  setSelectedIndex: setChapFocusedIndex,
                });
              }
            }}
            onMomentumScrollEnd={e =>
              handleScroll(e, {
                ref: scrollRef3,
                type: 'chap',
                datalen: chap.length,
                selectedIndex: chapFocusedIndex,
                setSelectedIndex: setChapFocusedIndex,
              })
            }
            contentContainerStyle={{
              paddingHorizontal: (screenWidth - buttonWidth) / 2,
            }}
          />
          <View style={{height: 16}} />
          <FlatList
            scrollEnabled={true}
            ref={scrollRef4}
            data={verse}
            // onLayout={() => {
            //   scrollRef4.current?.scrollToOffset({offset: 20, animated: false});
            // }}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  setVerseFocusedIndex(index);
                  scrollToVerse(index, verse);
                }}
                style={[
                  styles.item,
                  // verseFocusedIndex !== index && {width: buttonSmallWidth},
                  {height: itemHeight},
                ]}>
                <TextBold
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
                </TextBold>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={buttonWidth}
            decelerationRate="fast"
            onScrollBeginDrag={() => {
              setLoading(true);
            }}
            onScrollEndDrag={e => {
              if (e.nativeEvent.velocity?.x === 0) {
                console.log('velocity 0');
                handleScroll(e, {
                  ref: scrollRef4,
                  type: 'verse',
                  datalen: verse.length,
                  selectedIndex: verseFocusedIndex,
                  setSelectedIndex: setVerseFocusedIndex,
                });
              }
            }}
            onMomentumScrollEnd={e =>
              handleScroll(e, {
                ref: scrollRef4,
                type: 'verse',
                datalen: verse.length,
                selectedIndex: verseFocusedIndex,
                setSelectedIndex: setVerseFocusedIndex,
              })
            }
            contentContainerStyle={{
              paddingHorizontal: (screenWidth - buttonWidth) / 2,
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
              marginTop: windowHeight > 600 ? 10 : 24,
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
          <TextBold
            style={[styles.confirmBtnTxt, loading && {color: 'transparent'}]}>
            완료
          </TextBold>
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
    lineHeight: 24,
    letterSpacing: -0.32,
  },
});
