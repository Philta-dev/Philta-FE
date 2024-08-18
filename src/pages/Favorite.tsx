import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../components/Text';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavParamList} from '../../AppInner';
import EncryptedStorage from 'react-native-encrypted-storage';
import {RootState, useAppDispatch} from '../store';
import userSlice from '../slices/user';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import {useSelector} from 'react-redux';
import {trackEvent} from '../services/trackEvent.service';
import TextBold from '../components/TextBold';

type FavScreenNavigationProp = NativeStackNavigationProp<
  NavParamList,
  'Favorite'
>;
type FavProps = {
  navigation: FavScreenNavigationProp;
};
type favItem = {
  id: number;
  reference: string;
  text: string;
};
export default function Favorite(props: FavProps) {
  const dispatch = useAppDispatch();
  const lang = useSelector((state: RootState) => state.user.lang);
  const [testament, setTestament] = useState(0);
  const [bookname, setBookname] = useState(0);
  const [testamentList, setTestamentList] = useState<string[]>([]);
  const [bookList, setBookList] = useState<string[]>(Array(39).fill(''));
  const [favData, setFavData] = useState<favItem[]>([
    // {
    //   id: 13,
    //   reference: '창세기 1:13',
    //   text: '그리하여 저녁이 되고 아침이 되니 이는 세 번째 날이라.그리하여 저녁이 되고 아침이 되니 이는 세 번째 날이라.그리하여 저녁이 되고 아침이 되니 이는 세 번째 날이라.',
    // },
  ]);
  const [deleteBookmark, setDeleteBookmark] = useState(-1);
  const [none, setNone] = useState(-1);
  const bookRef = useRef<FlatList>(null);

  const reduxTestament = useSelector(
    (state: RootState) => state.user.testament,
  );
  const reduxBook = useSelector((state: RootState) => state.user.book);
  const version = useSelector((state: RootState) => state.user.version);

  useEffect(() => {
    getData();
  }, [version]);

  useEffect(() => {
    console.log('redux', reduxTestament, reduxBook);
    if (reduxTestament == -1) {
      setTestament(0);
      setBookname(0);
    } else {
      if (reduxTestament + 1 !== testament) {
        setTestament(reduxTestament + 1);
      }
      if (reduxBook + 1 !== bookname) {
        setBookname(reduxBook + 1);
      }
    }
  }, [reduxTestament, reduxBook]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     bookRef.current?.scrollToIndex({index: bookname, animated: true});
  //   }, 0);
  // }, [bookRef, testament, bookname]);

  useEffect(() => {
    const blurListener = props.navigation.addListener('blur', () => {
      setBookname(0);
      setTestament(0);
    });
    return blurListener;
  }, []);
  useEffect(() => {
    const focusListener = props.navigation.addListener('focus', () => {
      trackEvent('Sreen Viewed - Favorite');
      getData();
    });
    return focusListener;
  }, []);
  useEffect(() => {
    getData();
  }, [testament, bookname]);
  const getData = async () => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/favorite/baseinfo?T=${testament}&B=${bookname}`,
      );
      console.log(response.data);
      setTestamentList([
        response.data.total,
        response.data.old_testament_name,
        response.data.new_testament_name,
      ]);
      if (testament == 0) {
        setBookList(Array(39).fill(''));
      }
      setBookList(['전체', ...response.data.books]);
      setNone(-1);
      setFavData(response.data.favorites);
      setTimeout(() => {
        bookRef.current?.scrollToIndex({index: bookname, animated: true});
      }, 0);
    } catch (error) {
      const errorResponse = (
        error as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  const handlePointer = async (id: number) => {
    try {
      const response = await axios.post(`${Config.API_URL}/index/current`, {
        verseId: id,
      });
      console.log(response.data);
    } catch (error) {
      const errorResponse = (
        error as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  const unbookmark = async (id: number) => {
    try {
      const response = await axios.delete(`${Config.API_URL}/favorite/delete`, {
        data: {verseId: id},
      });
      console.log(response.data);

      getData();
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  return (
    <View style={styles.entire}>
      <View style={styles.topTabbarView}>
        <Pressable
          style={styles.topTabbarButton}
          onPress={() => {
            setTestament(0);
            setBookname(0);
            bookRef.current?.scrollToIndex({index: 0});
          }}>
          <Text
            style={[
              styles.topTabbarButtonTxt,
              testament == 0 && {
                fontFamily: 'KoPubWorldBatangPB',
                color: '#000000',
              },
            ]}>
            {testamentList[0]}
          </Text>
          {testament == 0 && <View style={styles.topTabbarButtonSelected} />}
        </Pressable>
        <Pressable
          style={styles.topTabbarButton}
          onPress={() => {
            setTestament(1);
            setBookname(0);
            bookRef.current?.scrollToIndex({index: 0});
          }}>
          <Text
            style={[
              styles.topTabbarButtonTxt,
              testament == 1 && {
                fontFamily: 'KoPubWorldBatangPB',
                color: '#000000',
              },
            ]}>
            {testamentList[1]}
          </Text>
          {testament == 1 && <View style={styles.topTabbarButtonSelected} />}
        </Pressable>
        <Pressable
          style={styles.topTabbarButton}
          onPress={() => {
            setTestament(2);
            setBookname(0);
            bookRef.current?.scrollToIndex({index: 0});
          }}>
          <Text
            style={[
              styles.topTabbarButtonTxt,
              testament == 2 && {
                fontFamily: 'KoPubWorldBatangPB',
                color: '#000000',
              },
            ]}>
            {testamentList[2]}
          </Text>
          {testament == 2 && <View style={styles.topTabbarButtonSelected} />}
        </Pressable>
      </View>
      <View>
        {testament != 0 ? (
          <FlatList
            ref={bookRef}
            showsHorizontalScrollIndicator={false}
            style={styles.topTabbarHorizontal}
            horizontal={true}
            data={bookList}
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                bookRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              });
            }}
            renderItem={({item, index}) => (
              <Pressable
                style={[
                  styles.topTabbarHorizontalItem,
                  index == bookname && {backgroundColor: '#5856D6'},
                ]}
                onPress={() => setBookname(index)}>
                <Text
                  style={[
                    styles.topTabbarHorizontalItemTxt,
                    index == bookname && {
                      color: '#FCFCFE',
                      fontFamily: 'KoPubWorldBatangPB',
                    },
                  ]}>
                  {item}
                </Text>
              </Pressable>
            )}
          />
        ) : (
          <View style={{height: 32}} />
        )}
      </View>
      <View>
        {favData.length == 0 ? (
          <Text style={styles.noFavTxt}>저장된 북마크가 없습니다.</Text>
        ) : (
          <FlatList
            data={favData}
            renderItem={({item, index}) =>
              none == index ? null : (
                <Pressable
                  style={styles.favItem}
                  onPress={() => {
                    trackEvent('Favorite - Clicked', {
                      verseId: item.id,
                      reference: item.reference,
                    });
                    handlePointer(item.id);
                    props.navigation.navigate('Typing');
                  }}>
                  <Pressable
                    style={styles.bookmarkIcon}
                    onPress={() => {
                      setDeleteBookmark(index);
                      setTimeout(() => {
                        unbookmark(item.id);
                        setNone(index);
                        setDeleteBookmark(-1);
                      }, 1500);
                    }}>
                    <SvgXml
                      xml={
                        deleteBookmark == index
                          ? svgList.typing.bookmarkEmpty
                          : svgList.typing.bookmarkBlue
                      }
                      width={16}
                      height={16}
                      style={{marginTop: 3}}
                    />
                  </Pressable>
                  <View style={styles.favContent}>
                    <TextBold style={styles.favReference}>
                      {item.reference}
                    </TextBold>
                    <View style={styles.favText}>
                      {item.text.split('').map((txt, i) => (
                        <Text key={`${index}-${i}`}>{txt}</Text>
                      ))}
                    </View>
                  </View>
                </Pressable>
              )
            }
            keyExtractor={item => `${item.id}`}
          />
        )}
      </View>
      {/* <Text style={{color: 'black'}}>{bookname}</Text>
      <Pressable
        onPress={() => {
          props.navigation.navigate('Search', {page: 'favorite'});
        }}>
        <Text>search</Text>
      </Pressable>
      <Pressable onPress={() => logout()}>
        <Text>logout</Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingBottom: 88,
  },
  topTabbarView: {
    flexDirection: 'row',
    height: 40,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#3C3C432E',
    marginTop: 32,
  },
  topTabbarButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'relative',
  },
  topTabbarButtonSelected: {
    position: 'absolute',
    bottom: -2.5,
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#5856D6',
  },
  topTabbarButtonTxt: {
    fontSize: 18,
    // lineHeight: 21,
    letterSpacing: -0.32,
    color: '#3C3C4399',
  },
  topTabbarHorizontal: {
    marginTop: 10,
    marginBottom: 24,
  },
  topTabbarHorizontalItem: {
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 4,
  },
  topTabbarHorizontalItemTxt: {
    fontSize: 16,
    // lineHeight: 22,
    letterSpacing: -0.32,
    color: '#000000',
  },
  favItem: {
    flexDirection: 'row',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#70737C29',
  },
  bookmarkIcon: {marginRight: 10},
  favContent: {
    flex: 1,
    width: '100%',
  },
  favReference: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.28,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 10,
  },
  favText: {
    fontSize: 13,
    lineHeight: 22,
    letterSpacing: -0.26,
    color: '#000000',
    fontWeight: '400',
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
  },
  noFavTxt: {
    fontSize: 16,
    lineHeight: 32,
    letterSpacing: -0.32,
    color: '#898A8D',
    fontWeight: '400',
    marginTop: 120,
  },
});
