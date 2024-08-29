import {DimensionValue, Dimensions, StyleSheet, View} from 'react-native';

type ProgressBarProps = {
  width: number | DimensionValue;
  height: number;
  progressColor: string;
  nonProgressColor: string;
  progress: number;
  borderRadius: number;
};

export default function ProgressBar(props: ProgressBarProps) {
  return (
    <View
      style={{
        width: props.width,
        height: props.height,
        backgroundColor: props.nonProgressColor,
        borderRadius: props.borderRadius,
      }}>
      <View
        style={{
          width: `${props.progress}%`,
          height: props.height,
          backgroundColor: props.progressColor,
          borderRadius: props.borderRadius,
          minWidth: props.height / 2,
        }}></View>
    </View>
  );
}
