// Ex.tsx
import React from 'react';
import LottieView from 'lottie-react-native';

export default function Ex() {
  return (
    <LottieView
      source={require('../../assets/jsons/ex.json')}
      autoPlay
      loop={true}
      style={{width: 200, height: 200}}
      speed={2}
    />
  );
}
