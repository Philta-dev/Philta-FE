import React, {Children, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Modal from 'react-native-modal';

type ModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

export default function MyModal(props: ModalProps) {
  const showModal = props.showModal;
  const setshowModal = props.setShowModal;

  return (
    <Modal
      style={styles.entire}
      isVisible={showModal}
      hasBackdrop={true}
      onBackdropPress={() => setshowModal(false)}
      onBackButtonPress={() => setshowModal(false)}>
      <Pressable
        style={styles.modalBGView}
        onPress={() => {
          setshowModal(false);
        }}>
        {props.children}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    margin: 0,
  },
  modalBGView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    // paddingVertical: 12,
  },
  modalView: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    flex: 1,
    padding: 16,
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {},
  modalHeaderTxt: {
    color: '#002B5D',
    fontWeight: '400',
    fontSize: 25,
  },
  modalBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
