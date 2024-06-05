import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  Dimensions,
} from 'react-native';
import {useCallback, useEffect, useRef, useState} from 'react';
import Svg, {Line, SvgXml} from 'react-native-svg';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootTabParamList} from '../../AppInner';
import MyModal from '../components/MyModal';
import Text from '../components/Text';
import {svgList} from '../assets/svgList';

type TypingScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'Typing'
>;
type TypingProps = {
  navigation: TypingScreenNavigationProp;
};

export default function Typing(props: TypingProps) {
  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(false);
  const [keyBoardStatus, setKeyBoardStatus] = useState(false);

  const ref = useRef<TextInput>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursor(prevValue => !prevValue);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const KeyboardDismiss = Keyboard.addListener('keyboardDidHide', () => {
      console.log('keyboard dismiss');
      ref.current?.blur();
      setKeyBoardStatus(false);
    });
    const KeyboardShow = Keyboard.addListener('keyboardDidShow', () => {
      ref.current?.focus();
      setKeyBoardStatus(true);
    });
    const focusListener = props.navigation.addListener('focus', () => {
      ref.current?.focus();
      setKeyBoardStatus(true);
    });

    return () => {
      KeyboardDismiss.remove();
      KeyboardShow.remove();
      focusListener();
    };
  }, []);

  const givenText =
    '내가 이같이 쓴 것은 내가 갈 때에 마땅히 나를 기쁘게 할 자로부터 도리어 근심을 얻을까 염려함이요 또 너희 무리를 대하여 나의 기쁨이 너희 무리의 기쁨인줄 확신함이로라';
  const handleTextChange = (textEntered: string) => {
    if (
      textEntered.slice(0, textEntered.length - 1) ===
      givenText.slice(0, textEntered.length - 1)
    ) {
      setText(textEntered);
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
      <Text>status bar</Text>
      <Pressable onPress={() => setShowModal(true)} style={styles.menuBtn}>
        <SvgXml xml={svgList.typing.menu} />
      </Pressable>
      <View style={[{justifyContent: 'center'}, !keyBoardStatus && {flex: 1}]}>
        <View style={styles.typingArea}>
          <Pressable style={styles.anotherVerseArea}>
            <Text style={styles.anotherVerseNum}>1</Text>
            <Text style={styles.anotherVerseContent} numberOfLines={2}>
              내가 너희를 근심하게 하면 나의 근심하게 한 자 밖에 나를 기쁘게
              하는 자가 누구냐
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
              <Text>북</Text>
            </View>
            <Text style={styles.currentVerseNum}>2</Text>
            <View style={styles.currentVerseContent}>
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
                    color: '#9B9EA5',
                    fontSize: 18,
                    fontWeight: '400',
                    lineHeight: 30,
                    letterSpacing: -0.36,
                  }}>
                  {givenText.slice(text.length)}
                </Text>
              </Text>
            </View>
          </Pressable>
          <Pressable style={styles.anotherVerseArea}>
            <Text style={styles.anotherVerseNum}>3</Text>
            <Text style={styles.anotherVerseContent} numberOfLines={2}>
              내가 큰 환난과 애통한 마음이 있어 많은 눈물로 너희에서 썼노니 이는
              너희로 근심하게 하려 한 것이 아니요 오직 내가 너희를 향하여 넘치는
              사랑이 있음을 너희로 알게 하려 함이라
            </Text>
          </Pressable>
        </View>
      </View>
      {keyBoardStatus && (
        <View style={styles.keyBoardBtnView}>
          <Pressable>
            <Text>book</Text>
          </Pressable>
          <View style={{flex: 1}} />
          <Pressable>
            <Text>index</Text>
          </Pressable>
          <View style={{flex: 1}} />
          <Pressable>
            <Text>ver</Text>
          </Pressable>
          <View style={{flex: 1}} />
          <Pressable>
            <Text>clip</Text>
          </Pressable>
          <View style={{flex: 2}} />
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <Text>key</Text>
          </Pressable>
        </View>
      )}

      <MyModal showModal={showModal} setShowModal={setShowModal}>
        <Pressable onPress={() => props.navigation.navigate('Favorite')}>
          <Text>Fav</Text>
        </Pressable>
        <Pressable onPress={() => props.navigation.navigate('Indexing')}>
          <Text>Indexing</Text>
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
    flexDirection: 'row',
    backgroundColor: 'yellow',
    marginVertical: 24,
    flexWrap: 'wrap',
  },
  bookmarked: {
    position: 'absolute',
    top: 3,
    left: -18,
    width: 16,
    height: 16,
    backgroundColor: 'red',
  },
  currentVerseNum: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    width: 20,
  },
  currentVerseContent: {
    flexDirection: 'row',
  },
  keyBoardBtnView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'red',
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  keyBoradBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
  },
});
