/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text as RNText, TextProps} from 'react-native';

export interface TextPropsCustom extends TextProps {
  children: React.ReactNode;
}

const Text: React.FC<TextPropsCustom> = ({children, style, ...props}) => {
  return (
    <RNText style={[{color: 'black'}, style]} {...props}>
      {children}
    </RNText>
  );
};

export default Text;
