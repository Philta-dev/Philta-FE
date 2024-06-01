import HorizontalPicker from '@vseslav/react-native-horizontal-picker';
import {useRef, useState} from 'react';
import {Animated, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Text from '../components/Text';

const buttonWidth = 60;
export default function Favorite() {
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const scrollRef3 = useRef(null);
  const scrollRef4 = useRef(null);
  const [testamentFocusedIndex, setTestamentFocusedIndex] = useState(0);
  const [bookFocusedIndex, setBookFocusedIndex] = useState(0);
  const [chapFocusedIndex, setChapFocusedIndex] = useState(0);
  const [verseFocusedIndex, setVerseFocusedIndex] = useState(0);
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
    <View style={{backgroundColor: 'white'}}>
      <View>
        <HorizontalPicker
          style={{marginHorizontal: 10}}
          data={testament}
          itemWidth={60}
          defaultIndex={0}
          onChange={index => setTestamentFocusedIndex(index)}
          renderItem={(item, index) => (
            <View style={styles.button}>
              <Text style={styles.buttonTxt}>{item}</Text>
            </View>
          )}
        />
        <HorizontalPicker
          data={testamentFocusedIndex == 0 ? bookOld : bookNew}
          itemWidth={60}
          defaultIndex={0}
          onChange={index => setBookFocusedIndex(index)}
          renderItem={(item, index) => (
            <View style={styles.button}>
              <Text style={styles.buttonTxt}>{item}</Text>
            </View>
          )}
        />
        <HorizontalPicker
          data={chap}
          itemWidth={60}
          defaultIndex={0}
          onChange={index => setChapFocusedIndex(index)}
          renderItem={(item, index) => (
            <View style={styles.button}>
              <Text style={styles.buttonTxt}>{item}</Text>
            </View>
          )}
        />
        <HorizontalPicker
          data={verse}
          itemWidth={60}
          defaultIndex={0}
          onChange={index => setVerseFocusedIndex(index)}
          renderItem={(item, index) => (
            <View style={styles.button}>
              <Text style={styles.buttonTxt}>{item}</Text>
            </View>
          )}
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
      <Text style={styles.buttonTxt}>{`
        ${testament[testamentFocusedIndex]} 
        ${
          testamentFocusedIndex == 0
            ? bookOld[bookFocusedIndex]
            : bookNew[bookFocusedIndex]
        } 
        ${chap[chapFocusedIndex]}장 
        ${verse[verseFocusedIndex]}절
      `}</Text>
      {/* <ScrollView
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
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {margin: 10, width: 5 * buttonWidth},
  button: {
    width: buttonWidth,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTxt: {color: 'black'},

  overlayFocus: {
    height: 240,
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
    height: 240,
    width: buttonWidth,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
  },
});
