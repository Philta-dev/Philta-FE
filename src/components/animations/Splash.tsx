// Ex.tsx
import React from 'react';
import LottieView from 'lottie-react-native';

export default function Splash(props: {loop?: boolean}) {
  return (
    <LottieView
      source={require('../../assets/jsons/splash.json')}
      autoPlay
      loop={props.loop ?? false}
      style={{width: 510, height: 510}}
    />
  );
}
