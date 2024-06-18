import React, {Children, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Platform} from 'react-native';
import Modal from 'react-native-modal';
import {Shadow} from 'react-native-shadow-2';
import {SvgXml} from 'react-native-svg';
// import Text from './Text';

type ModalProps = {
  showModal: boolean;
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>;
  //   children: React.ReactNode;
  onBackdropPress?: () => void;
  keyBoardHeight?: number;
  svgxml: string;
  text: string;
  btnText: string;
  onBtnPress?: () => void;
};

export default function ToastModal(props: ModalProps) {
  const showModal = props.showModal;
  const setshowModal = props.setShowModal;

  return (
    <Modal
      isVisible={showModal}
      hasBackdrop={true}
      backdropOpacity={0}
      onBackdropPress={() => {
        props.onBackdropPress && props.onBackdropPress();
      }}
      onBackButtonPress={() => {
        props.onBackdropPress && props.onBackdropPress();
      }}>
      <View
        style={[
          styles.modalView,
          props.keyBoardHeight && Platform.OS === 'ios'
            ? {marginBottom: props.keyBoardHeight + 16}
            : {marginBottom: 16},
        ]}>
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: -4,
    right: -4,
    borderRadius: 8,
    // padding: 16,
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
