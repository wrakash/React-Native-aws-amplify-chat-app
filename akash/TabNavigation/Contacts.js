import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import {listUsers} from '../graphql/queries';
import {useNavigation} from '@react-navigation/native';
import ContactListItem from './TopPage/ListItems/ContactsList';


import {onCreateUser, onUpdateUser} from '../graphql/subscriptions';

function Contact() {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [user_id, setUser_id] = useState();

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

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onCreateUser)).subscribe({
      next: (data) => {
        // const newMessage = data.value.data.onCreateMessage
        fetchUsers();
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onUpdateUser)).subscribe({
      next: (data) => {
        // const newMessage = data.value.data.onCreateMessage
        // console.log('success uploading');
        fetchUsers();
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  const addGroup = () => {
       navigation.navigate('GroupSelect')
    }

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} onPress={addGroup}>
        <Card style={styles.card}>
          <View style={styles.imgcontainer}>
            <View style={styles.img}>
              <MaterialCommunityIcons
                name="group"
                color="white"
                size={30}
                style={styles.count}
              />
            </View>

            <View style={styles.user}>
              <Text style={styles.name}>New Group</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
      <FlatList
        data={users}
        renderItem={({item}) => {
          if (user_id !== item.id) {
            return <ContactListItem item={item} />;
          }
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 2,
    backgroundColor: '#FFC0CB',
  },
  card: {
    marginBottom: 1,
    height: 80,
    justifyContent: 'center',
    backgroundColor: '#FF69B4',
  },
  imgcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
  img: {
    height: 50,
    width: 50,
    backgroundColor: 'green',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default Contact;
