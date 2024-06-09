import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import Text from '../components/Text';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavParamList} from '../../AppInner';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import {useEffect, useRef, useState} from 'react';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  NavParamList,
  'Search'
>;
type SearchProps = {
  navigation: SearchScreenNavigationProp;
  route: {params: {page: string}};
};
export default function Search(props: SearchProps) {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const ref = useRef<TextInput>(null);
  useEffect(() => {
    ref.current?.setNativeProps({style: {fontFamily: 'Eulyoo1945-Regular'}});
    ref.current?.focus();
  });
  return (
    <View style={styles.entire}>
      <View style={styles.header}>
        <Pressable onPress={() => props.navigation.goBack()}>
          <SvgXml xml={svgList.backBtn} width={24} height={24} />
        </Pressable>
        <View style={styles.searchView}>
          <TextInput
            style={styles.serachArea}
            placeholder="책 검색..."
            placeholderTextColor={'#3C3C4399'}
            value={search}
            onChangeText={setSearch}
            ref={ref}
          />
          <Pressable
            style={styles.xBtn}
            onPress={() => {
              setSearch('');
            }}>
            <SvgXml xml={svgList.xBtn} width={24} height={24} />
          </Pressable>
        </View>

        <Pressable>
          <SvgXml xml={svgList.searchBtn} width={24} height={24} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            if (props.route.params.page == 'favorite') {
              props.navigation.navigate('Favorite');
            } else {
              dispatch(
                userSlice.actions.setIndex({
                  testament: 1,
                  book: 2,
                  chapter: 3,
                  verse: 4,
                }),
              );
              props.navigation.navigate('Indexing');
            }
          }}>
          <Text style={styles.searchedTxt}>{props.route.params.page}</Text>
          <Text style={styles.searchedBoldTxt}>{props.route.params.page}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#3C3C432E',
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: 'center',
  },
  searchView: {
    flex: 1,
    flexDirection: 'row',

    marginLeft: 14,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serachArea: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 48,
    backgroundColor: '#F7F7F8',
    borderRadius: 8,
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: -0.512,
  },
  xBtn: {
    position: 'absolute',
    right: 0,
    padding: 8,
  },
  container: {
    flex: 1,
    paddingHorizontal: 70,
  },
  searchedTxt: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 32,
    letterSpacing: -0.32,
  },
  searchedBoldTxt: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Eulyoo1945-SemiBold',
    lineHeight: 32,
    letterSpacing: -0.32,
  },
});
