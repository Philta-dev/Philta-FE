import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  Dimensions,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useCallback, useEffect, useRef, useState} from 'react';
import Svg, {Line, SvgXml} from 'react-native-svg';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootTabParamList} from '../navigations/BaseNav';
import MyModal from '../components/MyModal';
import Text from '../components/Text';
import {svgList} from '../assets/svgList';
import ProgressBar from '../components/ProgessBar';
import {useFocusEffect} from '@react-navigation/native';
import {StatusBarHeight} from '../components/Safe';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavParamList} from '../../AppInner';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';

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

export default function Typing(props: TypingProps) {
  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(false);
  const [keyBoardStatus, setKeyBoardStatus] = useState(false);
  const ref = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [showModal, setShowModal] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const [keyBoardHeight, setKeyBoardHeight] = useState(0);
  const dispatch = useAppDispatch();

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

    return () => {
      KeyboardDismiss.remove();
      KeyboardShow.remove();
    };
  }, []);

  const givenText =
    '그 때에 엘리사가 그 집에 앉았고 장로들이 저와 함께 앉았는데 왕이 자기 처소에서 사람을 보내었더니 그 사자가 이르기 전에 엘리사가 장로들에게 이르되 너희는 이 살인한 자의 자식이 내 머리를 취하려고 사람을 보내는 것을 보느냐 너희는 보다가 사자가 오거든 문을 닫고 문 안에 들이지 말라 그 주인의 발소리가 그 뒤에서 나지 아니하느냐 하고';
  const handleTextChange = (textEntered: string) => {
    if (
      textEntered.slice(0, textEntered.length - 1) ===
      givenText.slice(0, textEntered.length - 1)
    ) {
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
      }
    } else {
      setText(textEntered.slice(0, textEntered.length - 2)) +
        textEntered.slice(-1);
    }
  };
  return (
    <View style={styles.entire}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="white"
        // translucent={true}
        // hidden={true}
      />
      <ProgressBar
        height={4}
        width={Dimensions.get('window').width - 1}
        progressColor={'#5656D6'}
        nonProgressColor={'#EBEBF5'}
        progress={50}
        borderRadius={8}
      />
      <Pressable onPress={() => setShowModal(true)} style={styles.menuBtn}>
        {showModal ? (
          <View style={{height: 24}} />
        ) : (
          <SvgXml xml={svgList.typing.menu} />
        )}
      </Pressable>
      <View style={[{justifyContent: 'center'}, !keyBoardStatus && {flex: 1}]}>
        <View style={styles.typingArea}>
          <Pressable style={styles.anotherVerseArea}>
            <Text style={styles.anotherVerseNum}>1</Text>
            <Text
              style={styles.anotherVerseContent}
              numberOfLines={keyBoardStatus ? 2 : windowHeight >= 680 ? 4 : 2}>
              내가 큰 환난과 애통한 마음이 있어 많은 눈물로 너희에서 썼노니 이는
              너희로 근심하게 하려 한 것이 아니요 오직 내가 너희를 향하여 넘치는
              사랑이 있음을 너희로 알게 하려 함이라
            </Text>
          </Pressable>
          <Pressable
            style={styles.currentVerseArea}
            onPress={() => {
              ref.current?.focus();
              console.log('pressed');
              setKeyBoardStatus(true);
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
              caretHidden={true}
              onChangeText={text => handleTextChange(text)}
              value={text}
              ref={ref}
              blurOnSubmit={false}
              onSubmitEditing={() => handleTextChange(text + ' ')}
            />
            <View style={styles.bookmarked}>
              <SvgXml
                xml={svgList.typing.bookmarkBlue}
                width={16}
                height={16}
                color={'#5856D6'}
              />
            </View>
            <View>
              <Text style={styles.currentVerseNum}>2</Text>
            </View>
            <ScrollView
              style={[
                styles.currentVerseContent,
                keyBoardStatus && {height: 170},
              ]}
              ref={scrollRef}>
              <Text style={{flexWrap: 'wrap'}}>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 18,
                    fontWeight: '400',
                    lineHeight: 30,
                    letterSpacing: -0.36,
                    zIndex: 1,
                  }}>
                  {text}
                </Text>
                <Text
                  style={[
                    {
                      fontSize: 18,
                      fontWeight: '100',
                      lineHeight: 30,
                      letterSpacing: -0.36,
                      zIndex: 1,
                    },
                    cursor ? {color: 'transparent'} : {color: 'red'},
                  ]}>
                  |
                </Text>
                <Text
                  style={{
                    backgroundColor: 'pink',
                    color: '#9B9EA5',
                    fontSize: 18,
                    fontWeight: '400',
                    lineHeight: 30,
                    letterSpacing: -0.36,
                  }}>
                  {givenText.slice(text.length)}
                </Text>
              </Text>
            </ScrollView>
          </Pressable>
          <Pressable style={styles.anotherVerseArea}>
            <Text style={styles.anotherVerseNum}>3</Text>
            <Text
              style={styles.anotherVerseContent}
              numberOfLines={keyBoardStatus ? 2 : windowHeight >= 680 ? 4 : 2}>
              내가 큰 환난과 애통한 마음이 있어 많은 눈물로 너희에서 썼노니 이는
              너희로 근심하게 하려 한 것이 아니요 오직 내가 너희를 향하여 넘치는
              사랑이 있음을 너희로 알게 하려 함이라
            </Text>
          </Pressable>
        </View>
      </View>
      {keyBoardStatus && (
        <View
          style={[
            styles.keyBoardBtnView,
            Platform.OS == 'ios' && {bottom: keyBoardHeight},
          ]}>
          <View style={{flex: 0.8}} />

          <Pressable>
            <SvgXml xml={svgList.typing.bookmarkAdd} width={32} height={32} />
          </Pressable>
          <View style={{flex: 1}} />
          <Pressable style={styles.keyBoradBtn}>
            <Text>SSSS 22:22</Text>
          </Pressable>
          <View style={{flex: 1}} />
          <Pressable style={styles.keyBoradBtn}>
            <Text>KRVD</Text>
          </Pressable>
          <View style={{flex: 1}} />
          <Pressable>
            <SvgXml xml={svgList.typing.clipboard} width={32} height={32} />
          </Pressable>
          <View style={{flex: 2}} />
          <Pressable
            onPress={() => {
              if (keyBoardStatus) {
                ref.current?.blur();
                setKeyBoardStatus(false);
              } else {
                ref.current?.focus();
                setKeyBoardStatus(true);
              }
            }}>
            <SvgXml xml={svgList.typing.keyboardDown} width={32} height={32} />
          </Pressable>
          <View style={{flex: 0.8}} />
        </View>
      )}

      <MyModal showModal={showModal} setShowModal={setShowModal}>
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
            <SvgXml xml={svgList.tabbar.modal.typing} width={20} height={20} />
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
      </MyModal>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: 'white',
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
    backgroundColor: 'yellow',
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
