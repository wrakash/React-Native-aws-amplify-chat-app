import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import FloatingButton from './FloatingButton';
import ChatListItem from './ListItems/ChatsList';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import {getUser} from './queries';
import {
  onCreateChatRoomUser,
  onCreateMessage,
  onUpdateUser
} from '../../graphql/subscriptions';

const App = () => {
  const [chatRooms, setChatRooms] = useState([]);
   const fetchChatRooms = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();

      const userData = await API.graphql(
        graphqlOperation(getUser, {
          id: userInfo.attributes.sub,
        }),
      );

      setChatRooms(userData.data.getUser.chatRoomUser.items);
    } catch (e) {
      console.log(e);
    }
  };
 
  
  useEffect(() => {
    fetchChatRooms();
  }, []);


  useEffect(() => {

    const subscription = API.graphql(
      graphqlOperation(onCreateChatRoomUser),
    ).subscribe({
      next: (data) => {
        fetchChatRooms();
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage),
    ).subscribe({
      next: (data) => {
        fetchChatRooms();
      },
    });

    return () => subscription.unsubscribe();
  }, []);


  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={({item}) => <ChatListItem chatRoom={item.chatRoom} />}
        keyExtractor={(item) => item.id}
      />
      <FloatingButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 2,
    backgroundColor: '#FFC0CB'
  },
});
export default App;
