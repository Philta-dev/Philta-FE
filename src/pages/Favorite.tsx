import {useState} from 'react';
import {FlatList, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import Text from '../components/Text';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavParamList} from '../../AppInner';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import axios from 'axios';
import Config from 'react-native-config';

type FavScreenNavigationProp = NativeStackNavigationProp<
  NavParamList,
  'Favorite'
>;
type FavProps = {
  navigation: FavScreenNavigationProp;
};

export default function Favorite(props: FavProps) {
  const dispatch = useAppDispatch();
  const [bookname, setBookname] = useState(-1);
  const [testament, setTestament] = useState('old');
  const logout = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/auth/logout`);
      await EncryptedStorage.removeItem('refreshToken');
      dispatch(
        userSlice.actions.setToken({
          accessToken: '',
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };
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
      <Pressable onPress={() => logout()}>
        <Text>logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});
