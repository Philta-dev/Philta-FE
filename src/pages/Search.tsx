import {FlatList, Pressable, StyleSheet, TextInput, View} from 'react-native';
import Text from '../components/Text';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavParamList} from '../../AppInner';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import {useEffect, useRef, useState} from 'react';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  NavParamList,
  'Search'
>;
type SearchProps = {
  navigation: SearchScreenNavigationProp;
  route: {params: {page: string}};
};

type searchResult = {
  name: string;
  T: number;
  B: number;
};
type itemProps = {
  item: searchResult;
  index: number;
};
export default function Search(props: SearchProps) {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [searched, setSearched] = useState<searchResult[]>([
    // {name: '창세기', T: 1, B: 1},
    // {name: '출애굽기', T: 1, B: 2},
  ]);
  const ref = useRef<TextInput>(null);
  useEffect(() => {
    ref.current?.setNativeProps({style: {fontFamily: 'Eulyoo1945-Regular'}});
    ref.current?.focus();
  });
  const searchData = async () => {
    if (search == '') {
      setSearched([]);
      return;
    }
    try {
      const response = await axios.get(
        `${Config.API_URL}/index/search?query=${search}`,
      );
      console.log(response.data);
      setSearched(response.data.searchResult);
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  useEffect(() => {
    searchData();
  }, [search]);
  return (
    <View style={styles.entire}>
      <View style={styles.header}>
        <Pressable onPress={() => props.navigation.goBack()}>
          <SvgXml xml={svgList.backBtn} width={24} height={24} />
        </Pressable>
        <View style={styles.searchView}>
          <TextInput
            style={styles.searchArea}
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

        <Pressable onPress={searchData}>
          <SvgXml xml={svgList.searchBtn} width={24} height={24} />
        </Pressable>
      </View>
      <View style={styles.container}>
        {search == '' ? (
          <Text style={styles.searchedTxt}>검색어를 입력해주세요.</Text>
        ) : searched.length == 0 ? (
          <Text style={styles.searchedTxt}>검색 결과가 없습니다.</Text>
        ) : (
          <FlatList
            keyboardShouldPersistTaps="always"
            data={searched}
            renderItem={({item, index}: itemProps) => (
              <Pressable
                style={styles.searchedItem}
                onPress={() => {
                  dispatch(
                    userSlice.actions.setIndex({
                      testament: item.T - 1,
                      book: item.B - 1,
                      chapter: 0,
                      verse: 0,
                    }),
                  );
                  if (props.route.params.page == 'favorite') {
                    props.navigation.navigate('Favorite');
                  } else {
                    props.navigation.navigate('Indexing');
                  }
                }}>
                {/* <Text style={styles.searchedTxt}>{props.route.params.page}</Text> */}
                {/* <Text style={styles.searchedTxt}>{item.name}</Text>
              <Text style={styles.searchedBoldTxt}>{item.name}</Text> */}
                {item.name.split('').map((txt, i) =>
                  txt.toLocaleLowerCase() == search.toLocaleLowerCase() ? (
                    <Text style={styles.searchedBoldTxt} key={`${index}-${i}`}>
                      {txt}
                    </Text>
                  ) : (
                    <Text style={styles.searchedTxt} key={`${index}-${i}`}>
                      {txt}
                    </Text>
                  ),
                )}
              </Pressable>
            )}
            keyExtractor={item => item.name}
          />
        )}
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
  searchArea: {
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
  searchedItem: {
    flexDirection: 'row',
  },
  searchedTxt: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 32,
    letterSpacing: -0.32,
  },
  searchedBoldTxt: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Eulyoo1945-SemiBold',
    lineHeight: 32,
    letterSpacing: -0.32,
  },
});
