import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
} from 'react-native';

import {API, graphqlOperation, Auth} from 'aws-amplify';
import {listUsers} from '../graphql/queries';
import {useNavigation} from '@react-navigation/native';
import FloatingButton from './FloatingButton';
import {useSelector, useDispatch} from 'react-redux';
import {Card} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import allActions from '../src/ReduxStore/action';

const SelectedListItem = ({item}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const removeGroup = () => {
    dispatch(allActions.groupAction.removeFriend(item));
  };

  return (
    <TouchableWithoutFeedback onPress={removeGroup}>
      <View style={styles.imgcontainer}>
        <Image source={{uri: item.imageUri}} style={styles.person} />
        {/*  <Entypo
            name="circle-with-cross"
            color="black"
            size={26}
            style={styles.check}
      /> */}
        <View style={styles.check}>
          <AntDesign
            name="checkcircle"
            color="green"
            size={26}
            style={styles.check}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const GroupListItem = ({item}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const selected = useSelector((state) => {
    return state.groupReducer;
  });

  const addGroup = () => {
    if (!selected.includes(item)) {
      dispatch(allActions.groupAction.addFriend(item));
    } else if (selected.includes(item)) {
      dispatch(allActions.groupAction.removeFriend(item));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={addGroup}>
      <Card style={styles.card}>
        <View style={styles.imgcontainer}>
          <Image source={{uri: item.imageUri}} style={styles.person} />
          {selected.includes(item) ? (
            <View style={styles.check}>
              <AntDesign
                name="checkcircle"
                color="green"
                size={26}
                style={styles.check}
              />
            </View>
          ) : (
            <View></View>
          )}
          <View style={styles.user}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.message}>{item.status}</Text>
          </View>
        </View>
      </Card>
    </TouchableWithoutFeedback>
  );
};

function GroupSelect() {
  const [users, setUsers] = useState([]);
  const [user_id, setUser_id] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allActions.groupAction.removeAll());
  }, []);
 
  const fetchUsers = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});

      setUser_id(userInfo.attributes.sub);

      const usersData = await API.graphql(graphqlOperation(listUsers));

      setUsers(usersData.data.listUsers.items);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const selected = useSelector((state) => {
    return state.groupReducer;
  });

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: '#FF69B4', marginBottom: 1}}>
        <FlatList
          horizontal={true}
          data={selected}
          renderItem={({item}) => {
            if (user_id !== item.id) {
              return <SelectedListItem item={item} />;
            }
          }}
          keyExtractor={(item) => item.id}
        />
      </View>

      <FlatList
        data={users}
        renderItem={({item}) => {
          if (user_id !== item.id) {
            return <GroupListItem item={item} />;
          }
        }}
        keyExtractor={(item) => item.id}
      />
      <FloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 2,
    backgroundColor: '#FFC0CB',
  },
  check: {
    marginTop: 12,
    marginLeft: -5,
  },
  heart: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: -25,
    color: 'white',
    fontFamily: 'Ubuntu-Light',
    fontSize: 12,
  },
  card: {
    marginBottom: 1,
    height: 80,
    justifyContent: 'center',
    backgroundColor: '#FF69B4',
  },
  imgcontainer: {
    flexDirection: 'row',
    margin: 10,
  },
  person: {
    width: 50,
    height: 50,
    borderRadius: 800,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  user: {
    flex: 3,
    marginLeft: 30,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  message: {
    fontSize: 17,
    fontFamily: 'Ubuntu-Medium',
  },
  time: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  date: {
    fontFamily: 'Ubuntu-Bold',
  },
  count: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: 'Ubuntu-Bold',
  },
});

export default GroupSelect;
