import {Animated, Platform, StyleSheet, View} from 'react-native';
import {useState, useEffect, ReactNode} from 'react';

type props = {
  time: number;
};

export default function FadingView({time}: props) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: time,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const styles = StyleSheet.create({
    fadingContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: 'white',
    },
  });
  return (
    <Animated.View
      style={{
        ...styles.fadingContainer,
        opacity: fadeAnim,
      }}></Animated.View>
  );
}
