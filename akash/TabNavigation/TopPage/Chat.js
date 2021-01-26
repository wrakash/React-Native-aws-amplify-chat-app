import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import FloatingButton from './FloatingButton';
import ChatListItem from './ListItems/ChatsList';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import {getUser} from './queries';
import {
  onCreateChatRoomUser,
  onCreateGroupRoomUser,
  onCreateMessage,
  onUpdateUser,
} from '../../graphql/subscriptions';

const App = () => {
  const [allRooms, setAllRooms] = useState([]);

  const fetchChatRooms = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();

      const userData1 = await API.graphql(
        graphqlOperation(getUser, {
          id: userInfo.attributes.sub,
        }),
      );

      const userData2 = await API.graphql(
        graphqlOperation(getUser, {
          id: userInfo.attributes.sub,
        }),
      );

      setAllRooms(
        userData1.data.getUser.chatRoomUser.items.concat(
          userData2.data.getUser.groupRoomUser.items,
        ),
      );
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
      graphqlOperation(onCreateGroupRoomUser),
    ).subscribe({
      next: (data) => {
        fetchGroupRooms();
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
        data={allRooms}
        renderItem={({item}) => {
          if (item.chatRoom) {
            return <ChatListItem chatRoom={item.chatRoom} />;
          } else {
            return <ChatListItem chatRoom={item.groupRoom} />;
          }
        }}
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
    backgroundColor: '#FFC0CB',
  },
});
export default App;
