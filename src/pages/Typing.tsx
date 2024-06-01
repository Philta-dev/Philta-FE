import {Pressable, StyleSheet, TextInput, View, Keyboard} from 'react-native';
import {useCallback, useEffect, useRef, useState} from 'react';
import Svg, {Line} from 'react-native-svg';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootTabParamList} from '../../AppInner';
import MyModal from '../components/MyModal';
import Text from '../components/Text';

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

  const ref = useRef<TextInput>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursor(prevValue => !prevValue);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const KeyboardDismiss = Keyboard.addListener('keyboardWillHide', () => {
      ref.current?.blur();
    });

    return () => {
      KeyboardDismiss.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      ref.current?.focus();
    }, []),
  );

  const [showModal, setShowModal] = useState(false);
  return (
    <View style={{flex: 1}}>
      <Pressable onPress={() => setShowModal(true)}>
        <Text>menu</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          ref.current?.focus();
        }}
        style={{
          position: 'relative',
          margin: 10,
          height: 40,
          backgroundColor: 'yellow',
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
            // paddingTop: 1,
          }}
          caretHidden={true}
          onChangeText={text => setText(text)}
          value={text}
          ref={ref}
        />
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'black'}}>{text}</Text>
          <Svg height={21} width={1}>
            <Line
              x1={0}
              y1={4}
              x2={0}
              y2={17}
              stroke={cursor ? 'green' : 'transparent'}
              strokeWidth={2}
            />
          </Svg>
          <Text>{'im writing the sentence.'.slice(text.length)}</Text>
        </View>
      </Pressable>
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

const styles = StyleSheet.create({});
