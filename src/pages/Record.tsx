import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MyPageNavStackParamList} from '../navigations/MyPageNav';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {Svg, SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import Text from '../components/Text';
import TextBold from '../components/TextBold';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

type RecordNavigationProp = NativeStackNavigationProp<
  MyPageNavStackParamList,
  'Record'
>;

type RecordProps = {
  navigation: RecordNavigationProp;
  route: {params: {chapId: number}};
};

type verseItem = {
  verse_number: number;
  text: string;
  completed: boolean;
  verse_id: number;
};

export default function Record(props: RecordProps) {
  const [page, setPage] = useState(0);
  const [bookName, setBookName] = useState('');
  const [chapter, setChapter] = useState(0);
  const [verseData, setVerseData] = useState<verseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const version = useSelector((state: RootState) => state.user.version);
  useEffect(() => {
    const focusListener = props.navigation.addListener('focus', () => {
      setIsLast(false);
      getData();
    });
    return () => {
      focusListener();
    };
  }, []);
  useEffect(() => {
    const backHanlder = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        props.navigation.goBack();
        return true;
      },
    );
    return () => {
      backHanlder.remove();
    };
  }, [props.navigation]);
  useEffect(() => {
    getData();
  }, [version]);

  const getData = async () => {
    if (!isLast) {
      setLoading(true);
      console.log('getData');
      try {
        const response = await axios.get(
          `${Config.API_URL}/mypage/versestat?chapterId=${
            props.route.params.chapId
          }&offset=${page * 15}`,
        );
        console.log(response.data);
        setBookName(response.data.book_name);
        setChapter(response.data.chapter_number);
        setVerseData([...verseData, ...response.data.verses]);
        setPage(page + 1);
        setLoading(false);
        if (!response.data.pagination.has_more) {
          setIsLast(true);
        }
      } catch (e) {
        const errorResponse = (
          e as AxiosError<{message: string; statusCode: number}>
        ).response;
        console.log(errorResponse?.data);
      }
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
  const onEndReached = () => {
    console.log('onEndReached');
    if (!loading) {
      getData();
    }
  };
  return (
    <View style={styles.entire}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#5656D6"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />
      )}
      <TextBold style={styles.titleText}>{bookName}</TextBold>
      <FlatList
        data={verseData}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        renderItem={({item}) => (
          <Pressable
            style={styles.verseItemView}
            onPress={() => {
              handlePointer(item.verse_id);
              setTimeout(() => {
                props.navigation.navigate('Typing');
              }, 500);
            }}>
            {item.completed ? (
              <SvgXml
                xml={svgList.myPage.typingCompleted}
                width={16}
                height={16}
                style={{marginTop: 1}}
              />
            ) : (
              <View style={{width: 16}} />
            )}
            <Text style={styles.verseItemNumberText}>{item.verse_number}</Text>
            <Text style={styles.verseItemText}>{item.text}</Text>
          </Pressable>
        )}
        keyExtractor={item => item.verse_number.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 30,
  },
  titleText: {
    color: '#5656D6',
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: -0.32,
    marginBottom: 24,
  },
  verseItemView: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#70737C29',
  },
  verseItemNumberText: {
    color: '#000',
    fontSize: 12,
    lineHeight: 20.4,
    letterSpacing: -0.12,
    width: 20,
    marginLeft: 2,
  },
  verseItemText: {
    color: '#000',
    fontSize: 14,
    lineHeight: 23.8,
    letterSpacing: -0.28,
    flex: 1,
  },
});
