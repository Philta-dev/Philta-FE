import {useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const buttonWidth = 60;
export default function Favorite() {
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);
  const [testamentFocusedIndex, setTestamentFocusedIndex] = useState(2);
  const [bookFocusedIndex, setBookFocusedIndex] = useState(2);
  const [chapFocusedIndex, setChapFocusedIndex] = useState(2);
  const [verseFocusedIndex, setVerseFocusedIndex] = useState(2);
  const testament = ['구약', '신약'];
  const bookOld = ['창세기', '출애굽기', '레위기', '민수기', '신명기'];
  const bookNew = ['마태복음', '마가복음', '누가복음', '요한복음', '사도행전'];
  const chap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const verse = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const padWithEmpty = (arr: any[]) => {
    return ['', '', ...arr, '', ''];
  };
  const getCenterPosition = (offset: number) => {
    const center = Math.round(offset / buttonWidth) * buttonWidth;
    return center;
  };
  const getCenterInddex = (offset: number) => {
    const index = Math.round(offset / buttonWidth) + 2;
    return index;
  };
  const Button = ({
    title,
    index,
    focusIndex,
  }: {
    title: string;
    index: number;
    focusIndex: number;
  }) => {
    return (
      <Pressable style={styles.button}>
        <Text
          style={[
            styles.buttonTxt,
            index === focusIndex ? {color: 'black'} : {color: 'gray'},
          ]}>
          {title}
        </Text>
      </Pressable>
    );
  };

  const OverlayView = () => {
    return (
      <View pointerEvents="none" style={styles.overlay}>
        <View style={styles.overlayVisible}></View>
      </View>
    );
  };
  return (
    <View style={{backgroundColor: 'skyblue'}}>
      <ScrollView
        ref={scrollRef1}
        horizontal={true}
        style={styles.scrollView}
        onScrollEndDrag={e => {
          const correctOffset = getCenterPosition(
            e.nativeEvent.contentOffset.x,
          );

          setTestamentFocusedIndex(
            getCenterInddex(e.nativeEvent.contentOffset.x),
          );

          if (scrollRef1.current)
            scrollRef1.current.scrollTo({x: correctOffset, animated: true});
        }}>
        {padWithEmpty(testament).map((item, index) => (
          <Button
            title={item}
            index={index}
            focusIndex={testamentFocusedIndex}
          />
        ))}
      </ScrollView>
      <ScrollView
        ref={scrollRef2}
        horizontal={true}
        style={styles.scrollView}
        onScrollEndDrag={e => {
          const correctOffset = getCenterPosition(
            e.nativeEvent.contentOffset.x,
          );

          setBookFocusedIndex(getCenterInddex(e.nativeEvent.contentOffset.x));

          if (scrollRef2.current)
            scrollRef2.current.scrollTo({x: correctOffset, animated: true});
        }}>
        {padWithEmpty(testamentFocusedIndex == 2 ? bookOld : bookNew).map(
          (item, index) => (
            <Button title={item} index={index} focusIndex={bookFocusedIndex} />
          ),
        )}
      </ScrollView>

      <ScrollView
        ref={scrollRef3}
        horizontal={true}
        style={styles.scrollView}
        onScrollEndDrag={e => {
          const correctOffset = getCenterPosition(
            e.nativeEvent.contentOffset.x,
          );

          setChapFocusedIndex(getCenterInddex(e.nativeEvent.contentOffset.x));

          if (scrollRef3.current)
            scrollRef3.current.scrollTo({x: correctOffset, animated: true});
        }}>
        {padWithEmpty(chap).map((item, index) => (
          <Button title={item} index={index} focusIndex={chapFocusedIndex} />
        ))}
      </ScrollView>
      <ScrollView
        ref={scrollRef4}
        horizontal={true}
        style={styles.scrollView}
        onScrollEndDrag={e => {
          const correctOffset = getCenterPosition(
            e.nativeEvent.contentOffset.x,
          );

          setVerseFocusedIndex(getCenterInddex(e.nativeEvent.contentOffset.x));

          if (scrollRef4.current)
            scrollRef4.current.scrollTo({x: correctOffset, animated: true});
        }}>
        {padWithEmpty(verse).map((item, index) => (
          <Button title={item} index={index} focusIndex={verseFocusedIndex} />
        ))}
      </ScrollView>
      <OverlayView />
      <Text>
        {testament[testamentFocusedIndex - 2] +
          ' ' +
          (testamentFocusedIndex == 2 ? bookOld : bookNew)[
            bookFocusedIndex - 2
          ] +
          ' ' +
          chap[chapFocusedIndex - 2] +
          '장 ' +
          verse[verseFocusedIndex - 2] +
          '절'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {margin: 10, width: 5 * buttonWidth},
  button: {
    width: buttonWidth,
    height: 60,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTxt: {},

  overlay: {
    width: 5 * buttonWidth,
    height: 240 + 10 * 8,
    position: 'absolute',
    top: 0,
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayVisible: {
    height: 240 + 10 * 8,
    width: buttonWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
});
