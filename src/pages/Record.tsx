import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MyPageNavStackParamList} from '../navigations/MyPageNav';
import {BackHandler, Pressable, StyleSheet, View} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {Svg, SvgXml} from 'react-native-svg';
import {svgList} from '../assets/svgList';
import Text from '../components/Text';
import TextBold from '../components/TextBold';

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
};

export default function Record(props: RecordProps) {
  const [page, setPage] = useState(0);
  const [bookName, setBookName] = useState('');
  const [chapter, setChapter] = useState(0);
  const [verseData, setVerseData] = useState<verseItem[]>([]);
  useEffect(() => {
    getData();
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

  const getData = async () => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/mypage/versestat?chapterId=${props.route.params.chapId}&page=${page}`,
      );
      console.log(response.data);
      setBookName(response.data.book_name);
      setChapter(response.data.chapter_number);
      setVerseData(response.data.verses);
    } catch (e) {
      const errorResponse = (
        e as AxiosError<{message: string; statusCode: number}>
      ).response;
      console.log(errorResponse?.data);
    }
  };
  return (
    <View style={styles.entire}>
      <Text>{props.route.params.chapId}</Text>
      <Text>{bookName}</Text>
      <Text>{chapter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {},
});
