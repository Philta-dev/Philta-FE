// Ex.tsx
import React from 'react';
import LottieView from 'lottie-react-native';

export default function Splash() {
  return (
    <LottieView
      source={require('../../assets/jsons/splash.json')}
      autoPlay
      loop={false}
      style={{width: 510, height: 510}}
    />
  );
}
