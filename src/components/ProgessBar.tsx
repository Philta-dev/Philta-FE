import {Dimensions, StyleSheet, View} from 'react-native';

type ProgressBarProps = {
  width: number;
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
        }}></View>
    </View>
  );
}
