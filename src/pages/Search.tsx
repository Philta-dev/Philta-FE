import {Pressable, View} from 'react-native';
import Text from '../components/Text';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavParamList} from '../../AppInner';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';

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
  return (
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
      <Text>{props.route.params.page}</Text>
    </Pressable>
  );
}
