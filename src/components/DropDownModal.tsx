import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import Text from './Text';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import {Shadow} from 'react-native-shadow-2';

type DropDownModalProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  dropDownItems: string[];
};

export default function DropDownModal(props: DropDownModalProps) {
  return (
    <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      isVisible={props.visible}
      style={{flex: 1, padding: 0, margin: 0}}
      hasBackdrop
      backdropOpacity={0}>
      <Pressable style={styles.modalBG} onPress={() => props.setVisible(false)}>
        <View style={styles.modalContainer}>
          <Shadow
            distance={6}
            style={{borderRadius: 8, width: '100%', height: '100%'}}
            startColor="rgba(0, 0, 0, 0.08)"
            endColor="rgba(0, 0, 0, 0)">
            <FlatList
              style={{width: '100%', height: '100%', maxHeight: 200}}
              data={props.dropDownItems}
              renderItem={({item, index}) => (
                <Pressable
                  style={styles.item}
                  onPress={() => {
                    props.setSelectedIndex(index);
                  }}>
                  {index == props.selectedIndex ? (
                    <SvgXml
                      xml={svgList.dropDown.checked}
                      width={8}
                      height={8}
                    />
                  ) : (
                    <View style={{width: 8, height: 8}} />
                  )}
                  <Text style={styles.itemTxt}>{item}</Text>
                </Pressable>
              )}
            />
          </Shadow>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBG: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    position: 'absolute',
    right: 24,
    top: 64,
    backgroundColor: 'white',
    borderRadius: 8,
    width: 96,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  itemTxt: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: -0.32,
    color: 'black',
    marginVertical: 8,
  },
});
