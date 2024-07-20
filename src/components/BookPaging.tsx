import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import {useState, useEffect} from 'react';
import {Shadow} from 'react-native-shadow-2';

type props = {
  time: number;
};

export default function BookPaging({time}: props) {
  const [xPos] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(xPos, {
      toValue: Dimensions.get('window').width,
      duration: time,
      useNativeDriver: true,
    }).start();
  }, [xPos]);

  const styles = StyleSheet.create({
    pageContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: 'white',
    },
    shadowContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: xPos,
      width: 2,
    },
    shadow: {},
    shadowContent: {},
  });
  return (
    <Animated.View style={styles.pageContainer}>
      <View style={styles.shadowContainer}>
        <Shadow style={styles.shadow}>
          <View style={styles.shadowContent} />
        </Shadow>
      </View>
    </Animated.View>
  );
}
