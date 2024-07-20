import React, {useState, useEffect, useRef} from 'react';
import {Text, View, Animated, StyleSheet, Pressable} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {SvgXml} from 'react-native-svg';

type CustomToastScreenProps = {
  showModal: boolean;
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>;
  svgxml: string;
  text: string;
  btnText: string;
  onBtnPress?: () => void;
  time?: number;
  onTimeEnd?: () => void;
};

export default function CustomToastScreen(props: CustomToastScreenProps) {
  const [isToastVisible, setIsToastVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 500ms동안 나타나고 time(default 2초) 후에 사라짐
  useEffect(() => {
    const timer = setTimeout(() => {
      if (props.time) {
        setIsToastVisible(false);
        props.onTimeEnd && props.onTimeEnd();
        props.setShowModal && props.setShowModal(false);
      }
    }, props.time || 2000);
    Animated.timing(fadeAnim, {
      toValue: isToastVisible ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsToastVisible(true);
    });
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isToastVisible && (
        <Animated.View style={[styles.modalView, {opacity: fadeAnim}]}>
          <Shadow distance={4} style={{borderRadius: 8, width: '100%'}}>
            <View
              style={{
                width: '100%',
                height: '100%',
                padding: 16,
              }}>
              <View style={styles.textView}>
                <SvgXml
                  xml={props.svgxml}
                  width={24}
                  height={24}
                  style={
                    {
                      //   marginBottom: 8,
                    }
                  }
                />
                <Text style={styles.modalTxt}>{props.text}</Text>
              </View>
              <Pressable
                style={styles.modalBtn}
                onPress={() => {
                  props.onBtnPress && props.onBtnPress();
                }}>
                <Text style={styles.modalBtnTxt}>{props.btnText}</Text>
              </Pressable>
            </View>
          </Shadow>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    borderRadius: 8,
  },
  textView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  modalTxt: {
    marginLeft: 8,
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 26,
  },
  modalBtn: {
    marginBottom: 2,
    width: '100%',
  },
  modalBtnTxt: {
    color: '#5856D6',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 31,
    textAlign: 'right',
  },
});
