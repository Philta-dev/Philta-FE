import {
  DimensionValue,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {CircularProgress} from 'react-native-circular-progress';
import TextBold from './TextBold';

type ProgressCircleProps = {
  size: number;
  width: number;
  progressColor: string;
  nonProgressColor: string;
  progress: number;
  selected: boolean;
  text: string;
  fonstSize: number;
  fontLineHeight: number;
  fontLetterSpacing: number;
  fontSelectedColor: string;
  fontNonSelectedColor: string;
  onPress?: () => void;
};

export default function ProgressCirle(props: ProgressCircleProps) {
  return (
    <Pressable
      onPress={props.onPress}
      style={{
        width: props.size,
        height: props.size,
        position: 'relative',
      }}>
      <CircularProgress
        size={props.size}
        width={props.width}
        fill={props.selected ? props.progress : 0}
        tintColor={props.progressColor}
        backgroundColor={props.nonProgressColor}
        lineCap="round"
        rotation={0}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TextBold
          style={{
            fontSize: props.fonstSize,
            lineHeight: props.fontLineHeight,
            letterSpacing: props.fontLetterSpacing,
            color: props.selected
              ? props.fontSelectedColor
              : props.fontNonSelectedColor,
          }}>
          {props.text}
        </TextBold>
      </View>
    </Pressable>
  );
}
