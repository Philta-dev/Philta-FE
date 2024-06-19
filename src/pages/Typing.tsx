import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  Dimensions,
  StatusBar,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import {useCallback, useEffect, useRef, useState} from 'react';
import {SvgXml} from 'react-native-svg';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootTabParamList} from '../navigations/BaseNav';
import MenuModal from '../components/MenuModal';
import Text from '../components/Text';
import {svgList} from '../assets/svgList';
import ProgressBar from '../components/ProgessBar';
import {useFocusEffect} from '@react-navigation/native';
import {StatusBarHeight} from '../components/Safe';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import Clipboard from '@react-native-clipboard/clipboard';
import {useSelector} from 'react-redux';
import FadingView from '../components/Fading';
import ToastModal from '../components/ToastModal';
import ToastScreen from '../components/ToastScreen';
import CustomToastScreen from '../components/CustomToastScreen';
type TypingScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Typing'
>;
// type TypingWithSearchScreenNavigationProp = NativeStackNavigationProp<
//   NavParamList,
//   'Base'
// >;
type TypingProps = {
  navigation: TypingScreenNavigationProp;
  // navigation: TypingWithSearchScreenNavigationProp;
};

type verseContent = {
  id: number;
  content: string;
  chapter_id: number;
  verse_number: number;
};

export default function Typing(props: TypingProps) {
  const [pressedButton, setPressedButton] = useState('');
  const [status, setStatus] = useState('');
  const fadingTime = 200;
  const [red, setRed] = useState(false);

  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(false);
  const [keyBoardStatus, setKeyBoardStatus] = useState(false);
  const ref = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const [keyBoardHeight, setKeyBoardHeight] = useState(0);
  const dispatch = useAppDispatch();
  const reduxVersion = useSelector((state: RootState) => state.user.version);

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        ref.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }, []),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCursor(prevValue => !prevValue);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const KeyboardDismiss = Keyboard.addListener('keyboardDidHide', () => {
      setKeyBoardHeight(0);
      console.log('keyboard dismiss');
      ref.current?.blur();
      setKeyBoardStatus(false);
    });
    const KeyboardShow = Keyboard.addListener('keyboardDidShow', e => {
      setKeyBoardHeight(e.endCoordinates.height);
      ref.current?.focus();
      setKeyBoardStatus(true);
    });
    const blurListener = props.navigation.addListener('blur', () => {
      setText('');
    });

    return () => {
      KeyboardDismiss.remove();
      KeyboardShow.remove();
      blurListener();
    };
  }, []);

  const handleTextChange = (textEntered: string) => {
    if (textEntered.length < 1) {
      setText('');
      return;
    }
    if (textEntered.length == 1) {
      setText(textEntered);
      return;
    }
    if (textEntered === givenText) {
      setText(textEntered);
      setEditable(false);
      complete();
      return;
    }
    if (
      textEntered.slice(0, textEntered.length - 2) ===
      givenText.slice(0, textEntered.length - 2)
    ) {
      if (
        textEntered.slice(0, textEntered.length - 1) ===
        givenText.slice(0, textEntered.length - 1)
      ) {
        setRed(false);
      } else {
        setRed(true);
      }
      setText(textEntered);
      if (textEntered.length >= givenText.length / 2) {
        scrollRef.current?.scrollToEnd({animated: true});
      } else {
        scrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
      }
      if (
        textEntered.length === givenText.length + 1 &&
        textEntered.slice(0, textEntered.length - 1) === givenText
      ) {
        console.log('done');
        complete();
        // if (nextVerse) handlePointer(nextVerse?.id);
      }
    } else {
      // setText(textEntered.slice(0, textEntered.length - 2)) +
      //   textEntered.slice(-1);
      setRed(true);
    }
  };
  const [givenText, setGivenText] = useState('');
  const [editable, setEditable] = useState(true);
  const [givenVerse, setGivenVerse] = useState<verseContent>();
  const [prevVerse, setPrevVerse] = useState<verseContent>();
  const [nextVerse, setNextVerse] = useState<verseContent>();
  const [testament, setTestament] = useState(0);
  const [book, setBook] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [verse, setVerse] = useState(0);
  const [version, setVersion] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [completed_count, setCompletedCount] = useState(0);
  const [progress_bar, setProgressBar] = useState(0);
  const [is_last_in_chapter, setIsLastInChapter] = useState(false);
  const [is_last_in_book, setIsLastInBook] = useState(false);
  const [current_location, setCurrentLocation] = useState('');
  useEffect(() => {
    const focusListener = props.navigation.addListener('focus', () => {
      getData();
    });
    return focusListener;
  }, [reduxVersion]);
  const getData = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/typing/baseinfo`);
      console.log(response.data);
      setTestament(response.data.T - 1);
      setBook(response.data.B - 1);
      setChapter(response.data.C - 1);
      setVerse(response.data.V - 1);
      setGivenText(response.data.current_verse.content);
      setGivenVerse({
        id: response.data.current_verse.id,
        content: response.data.current_verse.content,
        chapter_id: response.data.C,
        verse_number: response.data.V,
      });
      if (response.data.previous_verse && response.data.is_first_in_chapter) {
        setPrevVerse({
          id: response.data.previous_verse.id,
          content: '',
          chapter_id: -1,
          verse_number: -1,
        });
      } else {
        setPrevVerse(response.data.previous_verse);
      }
      if (response.data.next_verse && response.data.is_last_in_chapter) {
        setNextVerse({
          id: response.data.next_verse.id,
          content: '',
          chapter_id: -1,
          verse_number: -1,
        });
      } else {
        setNextVerse(response.data.next_verse);
      }
      setVersion(response.data.version);
      setBookmarked(response.data.bookmarked);
      setCompletedCount(response.data.completed_count);
      setProgressBar(response.data.progress_bar);
      setCurrentLocation(response.data.current_location);
      setIsLastInBook(response.data.is_last_in_book);
      setIsLastInChapter(response.data.is_last_in_chapter);
      setEditable(true);
      console.log('prevVerse', prevVerse);
      ref.current?.focus();
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  const complete = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/typing/complete`, {
        verseId: givenVerse?.id,
      });
      console.log(response.data);
      if (is_last_in_chapter || is_last_in_book) setShowToast(true);
      else {
        if (nextVerse) handlePointer(nextVerse?.id);
      }
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  const bookmark = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/favorite/add`, {
        verseId: givenVerse?.id,
      });
      console.log(response.data);
      setBookmarked(true);
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  const unbookmark = async () => {
    try {
      const response = await axios.delete(`${Config.API_URL}/favorite/delete`, {
        data: {verseId: givenVerse?.id},
      });
      console.log(response.data);
      setBookmarked(false);
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  const handlePointer = async (id: number) => {
    try {
      const response = await axios.post(`${Config.API_URL}/index/current`, {
        verseId: id,
      });
      console.log(response.data);
      setText('');
      setStatus('changing');
      setTimeout(() => {
        getData();
        setStatus('');
      }, fadingTime);
    } catch (error) {
      const errorResponse = (
        error as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  return (
    <View style={styles.entire}>
      <View style={{flex: 1}}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="white"
          // translucent={true}
          // hidden={true}
        />
        {status === 'changing' && <FadingView time={fadingTime} />}
        <ProgressBar
          height={4}
          width={Dimensions.get('window').width - 1}
          progressColor={'#5656D6'}
          nonProgressColor={'#EBEBF5'}
          progress={progress_bar}
          borderRadius={8}
        />
        <Pressable onPress={() => setShowModal(true)} style={styles.menuBtn}>
          {showModal ? (
            <View style={{height: 24}} />
          ) : (
            <SvgXml xml={svgList.typing.menu} />
          )}
        </Pressable>
        <View
          style={[{justifyContent: 'center'}, !keyBoardStatus && {flex: 1}]}>
          <View style={styles.typingArea}>
            {prevVerse &&
            prevVerse.chapter_id != -1 &&
            prevVerse.id != undefined ? (
              <Pressable
                style={styles.anotherVerseArea}
                onPress={() => {
                  if (prevVerse) handlePointer(prevVerse?.id);
                }}>
                <Text style={styles.anotherVerseNum}>
                  {prevVerse?.verse_number}
                </Text>
                <Text
                  style={styles.anotherVerseContent}
                  numberOfLines={
                    keyBoardStatus ? 2 : windowHeight >= 680 ? 4 : 2
                  }>
                  {prevVerse?.content}
                </Text>
              </Pressable>
            ) : (
              <View style={styles.anotherVerseArea} />
            )}
            <Pressable
              style={styles.currentVerseArea}
              onPress={() => {
                setPressedButton('keyboard');
                setPressedButton('');
                ref.current?.focus();
                console.log('pressed');
              }}>
              <TextInput
                style={{
                  height: 40,
                  backgroundColor: 'transparent',
                  color: 'transparent',
                  padding: 0,
                  position: 'absolute',
                  top: -10000,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
                editable={editable}
                maxLength={givenText.length + 1}
                caretHidden={true}
                onChangeText={text => handleTextChange(text)}
                value={text}
                ref={ref}
                blurOnSubmit={false}
                onSubmitEditing={() => handleTextChange(text + ' ')}
              />
              <View style={styles.bookmarked}>
                {bookmarked && (
                  <SvgXml
                    xml={svgList.typing.bookmarkBlue}
                    width={16}
                    height={16}
                    color={'#5856D6'}
                  />
                )}
              </View>
              <View>
                <Text style={styles.currentVerseNum}>{verse + 1}</Text>
              </View>
              <ScrollView
                style={[
                  styles.currentVerseContent,
                  keyBoardStatus && {height: 170},
                  // keyBoardStatus && {maxHeight: 170},
                ]}
                ref={scrollRef}>
                <Text style={{flexWrap: 'wrap'}}>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 20,
                      fontWeight: '400',
                      lineHeight: 30,
                      letterSpacing: -0.36,
                      zIndex: 1,
                    }}>
                    {text.length >= 2 && text.slice(0, text.length - 2)}
                  </Text>
                  <Text
                    style={{
                      color: red ? 'red' : '#000000',
                      fontSize: 20,
                      fontWeight: '400',
                      lineHeight: 30,
                      letterSpacing: -0.36,
                      zIndex: 1,
                    }}>
                    {text.slice(text.length - 2, text.length)}
                  </Text>
                  <Text
                    style={[
                      {
                        fontSize: 20,
                        fontWeight: '100',
                        lineHeight: 30,
                        letterSpacing: -5,
                        zIndex: 1,
                      },
                      cursor ? {color: 'transparent'} : {color: 'red'},
                    ]}>
                    |
                  </Text>
                  <Text
                    style={{
                      // backgroundColor: 'pink',
                      color: '#9B9EA5',
                      fontSize: 20,
                      fontWeight: '400',
                      lineHeight: 30,
                      letterSpacing: -0.36,
                    }}>
                    {givenText.slice(text.length)}
                  </Text>
                </Text>
              </ScrollView>
            </Pressable>
            {nextVerse && nextVerse.chapter_id != -1 ? (
              <Pressable
                style={styles.anotherVerseArea}
                onPress={() => {
                  if (nextVerse) handlePointer(nextVerse?.id);
                }}>
                <Text style={styles.anotherVerseNum}>
                  {nextVerse?.verse_number}
                </Text>
                <Text
                  style={styles.anotherVerseContent}
                  numberOfLines={
                    keyBoardStatus ? 2 : windowHeight >= 680 ? 4 : 2
                  }>
                  {nextVerse?.content}
                </Text>
              </Pressable>
            ) : (
              <View style={styles.anotherVerseArea} />
            )}
          </View>
        </View>
        {keyBoardStatus && (
          <View
            style={[
              styles.keyBoardBtnView,
              Platform.OS == 'ios' && {bottom: keyBoardHeight},
            ]}>
            <View style={{flex: 0.8}} />

            <Pressable
              onPress={() => {
                if (bookmarked) {
                  unbookmark();
                } else {
                  bookmark();
                }
              }}>
              {bookmarked ? (
                <SvgXml
                  xml={svgList.typing.bookmarkBlack}
                  width={32}
                  height={32}
                />
              ) : (
                <SvgXml
                  xml={svgList.typing.bookmarkAdd}
                  width={32}
                  height={32}
                />
              )}
            </Pressable>
            <View style={{flex: 1}} />
            <Pressable
              style={styles.keyBoradBtn}
              onPress={() => {
                dispatch(
                  userSlice.actions.setIndex({
                    testament: testament,
                    book: book,
                    chapter: chapter,
                    verse: verse,
                  }),
                );
                props.navigation.navigate('Indexing');
              }}>
              <Text>{current_location}</Text>
            </Pressable>
            <View style={{flex: 1}} />
            <Pressable style={styles.keyBoradBtn}>
              <Text>{version}</Text>
            </Pressable>
            <View style={{flex: 1}} />
            <Pressable
              onPressIn={() => {
                setPressedButton('clipboard');
              }}
              onPressOut={() => {
                setPressedButton('');
              }}
              onPress={() => {
                setPressedButton('clipboard');
                Clipboard.setString(`${givenText} (${current_location})`);
              }}>
              {pressedButton == 'clipboard' ? (
                <SvgXml
                  xml={svgList.typing.clipboardPressed}
                  width={32}
                  height={32}
                />
              ) : (
                <SvgXml xml={svgList.typing.clipboard} width={32} height={32} />
              )}
            </Pressable>
            <View style={{flex: 2}} />
            <Pressable
              onPressIn={() => {
                setPressedButton('keyboard');
              }}
              onPressOut={() => {
                setPressedButton('');
              }}
              onPress={() => {
                if (keyBoardStatus) {
                  setPressedButton('keyboard');
                  setPressedButton('');
                  ref.current?.blur();
                  setKeyBoardStatus(false);
                } else {
                  ref.current?.focus();
                  setKeyBoardStatus(true);
                }
              }}>
              {pressedButton == 'keyboard' ? (
                <SvgXml
                  xml={svgList.typing.keyboardDownPressed}
                  width={32}
                  height={32}
                />
              ) : (
                <SvgXml
                  xml={svgList.typing.keyboardDown}
                  width={32}
                  height={32}
                />
              )}
            </Pressable>
            <View style={{flex: 0.8}} />
          </View>
        )}

        <MenuModal showModal={showModal} setShowModal={setShowModal}>
          <SvgXml
            xml={svgList.typing.menux}
            width={24}
            height={24}
            style={[
              {marginBottom: 16},
              Platform.OS == 'ios'
                ? {marginTop: StatusBarHeight}
                : {marginTop: 12},
            ]}
          />
          <Pressable
            style={styles.modalBtn}
            onPress={() => console.log(StatusBarHeight)}>
            <View style={[styles.modalBtnIcon, {backgroundColor: '#EBEBF599'}]}>
              <SvgXml
                xml={svgList.tabbar.modal.typing}
                width={20}
                height={20}
              />
            </View>
            <Text style={[styles.modalBtnTxt, {color: '#EBEBF599'}]}>
              구절 타이핑
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setShowModal(false);
              dispatch(
                userSlice.actions.setIndex({
                  testament: -1,
                  book: -1,
                  chapter: -1,
                  verse: -1,
                }),
              );
              props.navigation.navigate('Indexing');
            }}
            style={styles.modalBtn}>
            <View style={styles.modalBtnIcon}>
              <SvgXml
                xml={svgList.tabbar.modal.indexing}
                width={40}
                height={40}
              />
            </View>
            <Text style={styles.modalBtnTxt}>전체 성경</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setShowModal(false);
              props.navigation.navigate('Favorite');
            }}
            style={styles.modalBtn}>
            <View style={styles.modalBtnIcon}>
              <SvgXml
                xml={svgList.tabbar.modal.favorite}
                width={40}
                height={40}
              />
            </View>
            <Text style={styles.modalBtnTxt}>북마크</Text>
          </Pressable>
        </MenuModal>
        {/* <ToastModal
          showModal={showToast}
          svgxml={svgList.modal.check}
          text="모든 절 타이핑을 완료했습니다."
          btnText={
            is_last_in_book ? '다음 책으로 넘어가기' : '다음 장으로 넘어가기'
          }
          onBtnPress={() => {
            setShowToast(false);
            if (nextVerse) handlePointer(nextVerse?.id);
          }}
        /> */}
      </View>
      {/* <ToastScreen
        message="모든 절 타이핑을 완료했습니다."
        height={40}
        marginBottom={
          Platform.OS == 'ios' && keyBoardStatus ? keyBoardHeight + 16 : 60
        }
        onClose={() => {}}
      /> */}
      {showToast && (
        <CustomToastScreen
          showModal={showToast}
          setShowModal={setShowToast}
          svgxml={svgList.modal.check}
          text="모든 절 타이핑을 완료했습니다."
          btnText={
            is_last_in_book ? '다음 책으로 넘어가기' : '다음 장으로 넘어가기'
          }
          onBtnPress={() => {
            setShowToast(false);
            if (nextVerse) handlePointer(nextVerse?.id);
          }}
          time={2000}
          onTimeEnd={() => {
            setShowToast(false);
            if (nextVerse) handlePointer(nextVerse?.id);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  menuBtn: {
    width: 24,
    height: 24,
    marginLeft: 24,
    marginVertical: 8,
  },
  modalBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  modalBtnIcon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  modalBtnTxt: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
    letterSpacing: -0.32,
    fontFamily: 'Eulyoo1945-SemiBold',
  },
  typingArea: {
    paddingHorizontal: 40,
  },
  anotherVerseArea: {
    flexDirection: 'row',
  },
  anotherVerseNum: {
    width: 20,
    color: '#D6D6D6',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.12,
  },
  anotherVerseContent: {
    color: '#D6D6D6',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: -0.32,
    overflow: 'hidden',
  },
  currentVerseArea: {
    // flex: 1,
    flexDirection: 'row',
    marginVertical: 24,
    flexWrap: 'nowrap',
  },
  bookmarked: {
    position: 'absolute',
    top: 3,
    left: -18,
    width: 16,
    height: 16,
  },
  currentVerseNum: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    width: 20,
  },
  currentVerseContent: {
    // height: 200,
    // backgroundColor: 'yellow',
    // flexDirection: 'row',
  },
  keyBoardBtnView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  keyBoradBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
  },
});
