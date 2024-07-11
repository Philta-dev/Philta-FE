// Ex.tsx
import React from 'react';
import LottieView from 'lottie-react-native';

export default function Ex() {
  return (
    <LottieView
      source={require('../../assets/jsons/example.json')}
      autoPlay
      loop
      style={{width: 200, height: 200}}
    />
  );
}
