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
  FlatList,
  Animated,
  BackHandler,
} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import Svg, {Line, SvgXml} from 'react-native-svg';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootTabParamList} from '../navigations/BaseNav';
import MenuModal from '../components/MenuModal';
import Text from '../components/Text';
import TextBold from '../components/TextBold';
import {svgList} from '../assets/svgList';
import ProgressBar from '../components/ProgressBar';
import {StatusBarHeight} from '../components/Safe';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import Clipboard from '@react-native-clipboard/clipboard';
import {useSelector} from 'react-redux';
import FadingView from '../components/Fading';
import CustomToastScreen from '../components/CustomToastScreen';
import {Shadow} from 'react-native-shadow-2';
import {trackEvent} from '../services/trackEvent.service';
import GradationFullScreenModal from '../components/GradationFullScreenModal';
import paymentSlice from '../slices/payments';

type TypingScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Typing'
>;
type TypingProps = {
  navigation: TypingScreenNavigationProp;
};

type verseContent = {
  id: number;
  content: string;
  chapter_id: number;
  verse_number: number;
};

export default function Typing(props: TypingProps) {
  const lang = useSelector((state: RootState) => state.user.lang);
  const payModal = useSelector((state: RootState) => state.payments.payModal);
  const needToPay = useSelector((state: RootState) => state.payments.needToPay);

  const [pressedButton, setPressedButton] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState('');
  const fadingTime = 200;
  const [red, setRed] = useState(false);
  const [pageMove, setPageMove] = useState(false);
  const pageX = useRef(new Animated.Value(0)).current;

  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(false);
  const [keyBoardStatus, setKeyBoardStatus] = useState(false);
  const ref = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const flatlistRef = useRef<FlatList>(null);
  const [showModal, setShowModal] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [versionDropdown, setVersionDropdown] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const [keyBoardHeight, setKeyBoardHeight] = useState(0);
  const [versionModalWidth, setVersionModalWidth] = useState(0);
  const [versionModalLeft, setVersionModalLeft] = useState(0);
  const dispatch = useAppDispatch();
  const reduxVersion = useSelector((state: RootState) => state.user.version);

  useEffect(() => {
    if (!showModal) {
      ref.current?.focus();
    }
  }, [showModal]);
  useEffect(() => {
    const focusListener = props.navigation.addListener('focus', () => {
      getData();
      trackEvent('Screen Viewed - Typing');
      setPage('typing');
    });
    return focusListener;
  }, [reduxVersion]);

  useEffect(() => {
    if (!pageMove) {
      Animated.timing(pageX, {
        toValue: windowWidth,
        duration: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(pageX, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setPageMove(false); // 애니메이션이 끝나면 pageMove를 false로 설정
      });
    }
  }, [pageMove]);

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });

    const interval = setInterval(() => {
      setCursor(prevValue => !prevValue);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const KeyboardDismiss = Keyboard.addListener('keyboardDidHide', () => {
      ref.current?.blur();
      setKeyBoardHeight(0);
      setVersionDropdown(false);
      console.log('keyboard dismiss');
      console.log('page', page);
      if (page == 'typing') {
        trackEvent('Keyboard Dismissed');
      }
      setKeyBoardStatus(false);
    });
    const KeyboardShow = Keyboard.addListener('keyboardDidShow', e => {
      setKeyBoardHeight(e.endCoordinates.height);
      setKeyBoardStatus(true);
    });
    const blurListener = props.navigation.addListener('blur', () => {
      setText('');
      setPage('');
    });

    return () => {
      KeyboardDismiss.remove();
      KeyboardShow.remove();
      blurListener();
    };
  }, [page]);

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
      trackEvent('Complete Verse', {
        verseId: givenVerse?.id,
      });
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
        trackEvent('Complete Verse', {
          verseId: givenVerse?.id,
        });
        // if (nextVerse) handlePointer(nextVerse?.id);
      }
    } else {
      // setText(textEntered.slice(0, textEntered.length - 2)) +
      //   textEntered.slice(-1);
      setRed(true);
    }
  };

  useEffect(() => {
    if (!payModal) {
      ref.current?.focus();
    }
    const backBtnListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (payModal) {
          dispatch(paymentSlice.actions.setPayModal({payModal: false}));
          return true;
        } else {
          return false;
        }
      },
    );
    return () => {
      backBtnListener.remove();
    };
  }, [payModal]);
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
  const [versions, setVersions] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [completed_count, setCompletedCount] = useState(0);
  const [progress_bar, setProgressBar] = useState(0);
  const [is_last_in_chapter, setIsLastInChapter] = useState(false);
  const [is_last_in_book, setIsLastInBook] = useState(false);
  const [current_location, setCurrentLocation] = useState('');
  const [next_location, setNextLocation] = useState('');
  const [current_bookname, setCurrentBookname] = useState('');
  const [socialType, setSocialType] = useState('');

  const [textArray, setTextArray] = useState<Array<string>>([]);
  const [textArrayING, setTextArrayING] = useState<Array<string>>([]);
  const [textArrayAfter, setTextArrayAfter] = useState<Array<string>>([]);
  const [areaHeightForPaymentModal, setAreaHeightForPaymentModal] = useState(0);
  const [isSatisfyPricing, setIsSatisfyPricing] = useState(false);
  const [completedChapterCount, setCompletedChapterCount] = useState(0);
  const [usedBookCount, setUsedBookCount] = useState(0);
  const getData = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/typing/baseinfo`);
      console.log(response.data);
      setTestament(response.data.T - 1);
      setBook(response.data.B - 1);
      setChapter(response.data.C - 1);
      setVerse(response.data.V - 1);
      setGivenText(response.data.current_verse.content);
      setTextArray(
        Array.from(
          response.data.current_verse.content.slice(
            0,
            response.data.current_verse.content.length,
          ),
        ),
      );
      // setTextArrayING(Array.from(response.data.current_verse.content.slice(0, response.data.current_verse.content.length)));
      // setTextArrayAfter(Array.from(response.data.current_verse.content.slice(0, response.data.current_verse.content.length)));
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
      setBookmarked(response.data.bookmarked);
      setCompletedCount(response.data.completed_count);
      setProgressBar(response.data.progress_bar);
      setCurrentLocation(response.data.current_location);
      setIsLastInBook(response.data.is_last_in_book);
      setIsLastInChapter(response.data.is_last_in_chapter);
      setCurrentBookname(response.data.current_book_name);
      setNextLocation(response.data.next_location);
      setSocialType(response.data.socialType);
      getVersionData();
      setEditable(true);
      console.log('prevVerse', prevVerse);
      ref.current?.focus();
      checkIsSatisfyPricing();
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  const getVersionData = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/index/version`);
      console.log('version', response.data);
      setVersions(response.data.versions);
      setVersion(response.data.current_version);
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  const selectVersion = async (item: string) => {
    if (version == item) {
      setVersionDropdown(false);
      return;
    }
    try {
      const response = await axios.post(
        `${Config.API_URL}/index/changeversion`,
        {
          version: item,
        },
      );
      console.log(response.data);
      setVersionDropdown(false);
      getData();
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

  const checkIsSatisfyPricing = async () => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/payments/issatisfypricing`,
      );
      console.log('checkIsSatisfyPricing', response.data);
      setIsSatisfyPricing(response.data.isSatisfyPricing);
      setCompletedChapterCount(response.data.completedChapterCount);
      setUsedBookCount(response.data.usedBookCount);
    } catch (error) {
      const errorResponse = (
        error as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };

  useEffect(() => {
    if (!needToPay) {
      setAreaHeightForPaymentModal(0);
      ref.current?.focus();
    }
  }, [needToPay]);
  return (
    <View style={styles.entire}>
      <View style={{flex: 1, paddingLeft: 1}}>
        {versionDropdown && (
          <Pressable
            style={[
              styles.versionDropdownBG,
              Platform.OS == 'ios'
                ? {bottom: keyBoardHeight + 50}
                : {bottom: 50},
            ]}
            onPress={() => {
              setVersionDropdown(false);
            }}></Pressable>
        )}
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        {status === 'changing' && <FadingView time={fadingTime} />}
        <ProgressBar
          height={4}
          width={Dimensions.get('window').width - 2}
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
                maxLength={givenText.length + 1}
                caretHidden={true}
                onChangeText={text => {
                  console.log('onchangetext', needToPay, isSatisfyPricing);
                  if (needToPay && isSatisfyPricing) {
                    ref.current?.blur();
                    setAreaHeightForPaymentModal(keyBoardHeight);
                    dispatch(
                      paymentSlice.actions.setPayModal({payModal: true}),
                    );
                    let reason = '';
                    if (usedBookCount >= 4) reason = reason + 'UsedBookCnt';
                    if (usedBookCount >= 4 && completedChapterCount >= 5)
                      reason = reason + ' + ';
                    if (completedChapterCount >= 5)
                      reason = reason + 'CompletedChapCnt';
                    trackEvent('Payment Modal Shown', {
                      reason: reason,
                    });
                    return;
                  }
                  if (editable) handleTextChange(text);
                }}
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
                {completed_count != 0 && (
                  <SvgXml
                    xml={svgList.typing.typingCompleted}
                    width={16}
                    height={16}
                    color={'#5856D6'}
                    style={bookmarked && {marginTop: 2}}
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
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {text.length >= 2 &&
                    textArray.slice(0, text.length - 2).map((char, index) => {
                      return (
                        <Text
                          key={'after' + index}
                          style={{
                            color: '#000000',
                            fontSize: 20,
                            fontWeight: '400',
                            lineHeight: 30,
                            letterSpacing: -0.36,
                            zIndex: 1,
                          }}>
                          {char}
                        </Text>
                      );
                    })}
                  {Array.from(text.slice(text.length - 2, text.length)).map(
                    (char, index) => {
                      return (
                        <Text
                          key={'ing' + index}
                          style={{
                            color: red ? 'red' : '#000000',
                            fontSize: 20,
                            fontWeight: '400',
                            lineHeight: 30,
                            letterSpacing: -0.36,
                            zIndex: 1,
                          }}>
                          {char}
                        </Text>
                      );
                    },
                  )}
                  {/* <Text
                    style={[
                      {
                        fontSize: 20,
                        fontWeight: '600',
                        lineHeight: Platform.OS == 'ios' ? 0 : 30,
                        letterSpacing: Platform.OS == 'ios' ? -10 : -8,
                        zIndex: 1,
                      },
                      cursor ? {color: 'transparent'} : {color: '#5856D6'},
                    ]}>
                    |
                  </Text> */}
                  <Svg height={25} width={2}>
                    <Line
                      x1={0}
                      x2={0}
                      y1={5}
                      y2={21}
                      strokeWidth={4}
                      stroke={cursor ? 'transparent' : '#5856D6'}
                    />
                  </Svg>
                  {textArray.slice(text.length).map((char, index) => {
                    return (
                      <Text
                        key={'before' + index}
                        style={{
                          color: '#9B9EA5',
                          fontSize: 20,
                          fontWeight: '400',
                          lineHeight: 30,
                          letterSpacing: -0.36,
                        }}>
                        {char}
                      </Text>
                    );
                  })}
                </View>
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
                setTimeout(() => {
                  props.navigation.navigate('Indexing');
                }, 100);
              }}>
              <Text>{current_location}</Text>
            </Pressable>
            <View style={{flex: 1}} />
            <Pressable
              onLayout={e => {
                setVersionModalWidth(e.nativeEvent.layout.width);
                setVersionModalLeft(e.nativeEvent.layout.x);
              }}
              style={[
                styles.keyBoradBtn,
                versionDropdown && {
                  backgroundColor: '#5656D6',
                },
              ]}
              onPress={() => setVersionDropdown(!versionDropdown)}>
              <Text style={versionDropdown && {color: 'white'}}>{version}</Text>
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
                  // console.log('pressed', needToPay);
                  // if (needToPay) {
                  //   setAreaHeightForPaymentModal(keyBoardHeight);
                  //   dispatch(
                  //     paymentSlice.actions.setPayModal({payModal: true}),
                  //   );
                  // }
                  ref.current?.blur();
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
              setTimeout(() => {
                // props.navigation.navigate('Favorite');
                props.navigation.navigate('MyPageNav', {page: 'Favorite'});
              }, 500);
            }}>
            <View style={[styles.modalBtnIcon]}>
              <SvgXml
                xml={svgList.tabbar.modal.favorite}
                width={40}
                height={40}
              />
            </View>
            <TextBold style={styles.modalBtnTxt}>
              {lang == 'en' ? 'Bookmark' : '북마크'}
            </TextBold>
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
              props.navigation.navigate('MyPageNav', {page: 'Statistics'});
            }}
            style={styles.modalBtn}>
            <View style={styles.modalBtnIcon}>
              <SvgXml
                xml={svgList.tabbar.modal.statistics}
                width={40}
                height={40}
              />
            </View>
            <TextBold style={styles.modalBtnTxt}>
              {lang == 'en' ? 'Progress' : '나의 통계'}
            </TextBold>
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
      {versionDropdown && (
        <View
          style={[
            styles.modalContainer,
            {left: versionModalLeft - (102 - versionModalWidth) / 2 - 8},
            Platform.OS == 'ios' && {bottom: keyBoardHeight + 60},
          ]}>
          <Shadow
            distance={6}
            style={{borderRadius: 8, width: '100%', height: '100%'}}
            startColor="rgba(0, 0, 0, 0.08)"
            endColor="rgba(0, 0, 0, 0)">
            <FlatList
              style={{width: '100%', height: '100%', maxHeight: 200}}
              keyboardShouldPersistTaps="handled"
              data={versions}
              renderItem={({item, index}) => (
                <Pressable
                  style={styles.item}
                  onPress={e => {
                    e.stopPropagation();
                    trackEvent('Version Changed', {
                      version: item,
                    });
                    selectVersion(item);
                  }}>
                  {item == version ? (
                    <SvgXml
                      xml={svgList.dropDown.checked}
                      width={8}
                      height={8}
                    />
                  ) : (
                    <View style={{width: 8, height: 8}} />
                  )}
                  <Text style={styles.itemTxt}>{item}</Text>
                </Pressable>
              )}
            />
          </Shadow>
        </View>
      )}
      {showToast && (
        <CustomToastScreen
          showModal={showToast}
          setShowModal={setShowToast}
          svgxml={svgList.modal.check}
          text={
            is_last_in_book
              ? lang == 'en'
                ? current_bookname + ' typing completed'
                : current_bookname + ' 필타가 완료됐습니다'
              : lang == 'en'
              ? 'Proceeding to ' + next_location
              : next_location + '으로 이동합니다'
          }
          btnText={lang == 'en' ? 'Confirm' : '확인'}
          onBtnPress={() => {
            if (nextVerse) {
              setPageMove(true);
              setShowToast(false);

              handlePointer(nextVerse?.id);
            }
          }}
          time={2000}
          onTimeEnd={() => {
            if (nextVerse) {
              setPageMove(true);
              setShowToast(false);

              handlePointer(nextVerse?.id);
            }
          }}
        />
      )}
      {pageMove && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
          }}>
          <Animated.View
            style={{
              width: 8,
              height: windowHeight,
              // backgroundColor: 'gray',
              zIndex: 1000,
              transform: [{translateX: pageX}],
            }}>
            <LinearGradient
              // pointerEvents="none"
              colors={['gray', 'rgba(255, 255, 255,0)']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[styles.overlay]}
            />
          </Animated.View>
        </View>
      )}
      {payModal && <View style={{height: areaHeightForPaymentModal}} />}
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
  },
  modalBottomView: {
    position: 'absolute',
    bottom: 100 - 8,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBottomBtn: {
    marginVertical: 8,
  },
  modalBottomBtnTxt: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 21,
    letterSpacing: -0.32,
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
    marginTop: 1,
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
    // flexDirection: 'row',
  },
  currentVerseNum: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    width: 20,
    marginTop: 1,
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
    position: 'relative',
  },
  versionDropdownBG: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    width: 96,
    bottom: 63,
    zIndex: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 12,
    zIndex: 10,
  },
  itemTxt: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: -0.32,
    color: 'black',
    marginVertical: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
