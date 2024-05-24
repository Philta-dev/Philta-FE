import React, {ReactNode} from 'react';
import {SafeAreaView, ViewStyle} from 'react-native';
import {getStatusBarHeight} from 'react-native-safearea-height';

export const StatusBarHeight = getStatusBarHeight(true);

interface SafeProps {
  children: ReactNode;
  color?: string;
}

export const Safe: React.FC<SafeProps> = ({
  children,
  color = 'transparent',
}) => {
  const safeAreaViewStyle: ViewStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: color,
  };

  return <SafeAreaView style={safeAreaViewStyle}>{children}</SafeAreaView>;
};
