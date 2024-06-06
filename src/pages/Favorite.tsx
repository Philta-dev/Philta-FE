import {useState} from 'react';
import {FlatList, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import Text from '../components/Text';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavParamList} from '../../AppInner';

type FavScreenNavigationProp = NativeStackNavigationProp<
  NavParamList,
  'Favorite'
>;
type FavProps = {
  navigation: FavScreenNavigationProp;
};

export default function Favorite(props: FavProps) {
  const [bookname, setBookname] = useState(-1);
  const [testament, setTestament] = useState('old');
  return (
    <View>
      <Text>Fav</Text>
      <Pressable
        onPress={() => {
          if (testament == 'old') setTestament('new');
          else setTestament('old');
        }}>
        <Text style={{color: 'black'}}>{testament}</Text>
      </Pressable>
      <View style={{backgroundColor: 'red', height: 100, width: '100%'}}>
        <FlatList
          horizontal={true}
          data={
            testament == 'old'
              ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              : [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10]
          }
          renderItem={({item, index}) => (
            <Pressable
              style={{padding: 10, margin: 10, backgroundColor: 'white'}}
              onPress={() => setBookname(item)}>
              <Text style={{color: 'black'}}>{item}</Text>
            </Pressable>
          )}
        />
      </View>
      <Text style={{color: 'black'}}>{bookname}</Text>
      <Pressable
        onPress={() => {
          props.navigation.navigate('Search', {page: 'favorite'});
        }}>
        <Text>search</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});
