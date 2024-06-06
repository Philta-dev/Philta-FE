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
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Text from '../components/Text';
import {NavParamList} from '../../AppInner';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';

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
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);
  const [testamentFocusedIndex, setTestamentFocusedIndex] = useState(0);
  const [bookFocusedIndex, setBookFocusedIndex] = useState(0);
  const [chapFocusedIndex, setChapFocusedIndex] = useState(0);
  const [verseFocusedIndex, setVerseFocusedIndex] = useState(0);

  useEffect(() => {
    if (reduxTestament !== testamentFocusedIndex) {
      setTestamentFocusedIndex(reduxTestament);
      // scrollToIndex(
      //   reduxTestament,
      //   testament,
      //   scrollRef1,
      //   setTestamentFocusedIndex,
      // );
    }
    if (reduxBook !== bookFocusedIndex) {
      setBookFocusedIndex(reduxBook);
      // scrollToIndex(reduxBook, book, scrollRef2, setBookFocusedIndex);
    }
    if (reduxChap !== chapFocusedIndex) {
      setChapFocusedIndex(reduxChap);
      // scrollToIndex(reduxChap, chap, scrollRef3, setChapFocusedIndex);
    }
    if (reduxVerse !== verseFocusedIndex) {
      setVerseFocusedIndex(reduxVerse);
      // scrollToIndex(reduxVerse, verse, scrollRef4, setVerseFocusedIndex);
    }
  }, [reduxTestament, reduxBook, reduxChap, reduxVerse]);
  useEffect(() => {
    const blurListener = props.navigation.addListener('blur', () => {
      dispatch(
        userSlice.actions.setIndex({
          testament: testamentFocusedIndex,
          book: bookFocusedIndex,
          chapter: chapFocusedIndex,
          verse: verseFocusedIndex,
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

  const testament = ['구약', '신약'];
  const [book, setBook] = useState([
    '창세기',
    '출애굽기',
    '레위기',
    '민수기',
    '신명기',
  ]);
  useEffect(() => {
    if (testamentFocusedIndex === 0) {
      setBook(['창세기', '출애굽기', '레위기', '민수기', '신명기']);
    } else {
      setBook(['마태복음', '마가복음', '누가복음', '요한복음', '사도행전']);
    }
  }, [testamentFocusedIndex]);
  const chap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const verse = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const scrollToIndex = (
    type: string,
    index: number,
    data: string[] | number[],
    ref: React.RefObject<FlatList>,
    setSelectedIndex: React.Dispatch<SetStateAction<number>>,
  ) => {
    if (index >= 0 && index < data.length) {
      // setSelectedIndex(index);
      if (type == 'testament' || type == 'book') {
        ref.current?.scrollToOffset({
          animated: true,
          offset: index * buttonWidth,
        });
      } else if (type == 'chap' || type == 'verse') {
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
    const index =
      type == 'testament' || type == 'book'
        ? Math.round(offsetX / buttonWidth)
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
  return (
    <View style={{backgroundColor: 'white'}}>
      <Text>좌우로 스크롤하여 구절 선택</Text>
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
                style={styles.item}>
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
                style={styles.item}>
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
            data={chap}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  setChapFocusedIndex(index);
                  setVerseFocusedIndex(0);
                }}
                style={[
                  styles.item,
                  chapFocusedIndex !== index && {width: buttonSmallWidth},
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
                }}
                style={[
                  styles.item,
                  verseFocusedIndex !== index && {width: buttonSmallWidth},
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
            colors={['white', 'transparent', 'white']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.overlay]}
          />
        </View>
        <View style={styles.overlayFocus} pointerEvents="none">
          <View style={styles.overlayVisible}></View>
        </View>
      </View>
      <Text style={styles.itemText}>{`
        ${testament[testamentFocusedIndex]} ${book[bookFocusedIndex]} ${chap[chapFocusedIndex]}장 ${verse[verseFocusedIndex]}절
      `}</Text>
      <Pressable
        onPress={() => {
          props.navigation.navigate('Search', {page: 'indexing'});
        }}>
        <Text>search</Text>
      </Pressable>
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
});
