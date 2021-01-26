import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import {createGroupRoom, createGroupRoomUser} from '../graphql/mutations';
import {
    listChatRooms,
    listChatRoomUsers,
    byUser,
    listUsers,
  } from '../graphql/queries';

function GroupButton({deta}) {
  const navigation = useNavigation();
  const selected = useSelector((state) => {
    return state.groupReducer;
  });

  const create = async () => {
    //  1. Create a new Chat Room
   
    const newChatRoomData = await API.graphql(
      graphqlOperation(createGroupRoom, {
        input: {
          lastMessageID: 'zz753fca-e8c3-473b-8e85-b14196e84e16',
          groupName: deta.name,
          groupImg: deta.img,
        },
      }),
    );

    
   
    if (!newChatRoomData.data) {
      console.log(' Failed to create a chat room');
      return;
    }

    const newChatRoom = newChatRoomData.data.createGroupRoom;

    // 2. Add `user` to the Chat Room

    selected.map( async friend => {
      await API.graphql(
        graphqlOperation(createGroupRoomUser, {
          input: {
            userID: friend.id,
            chatRoomID: newChatRoom.id,
            
          },
        }),
      );
    });

    
    //  3. Add authenticated user to the Chat Room
    const userInfo = await Auth.currentAuthenticatedUser();
    await API.graphql(
      graphqlOperation(createGroupRoomUser, {
        input: {
          userID: userInfo.attributes.sub,
          chatRoomID: newChatRoom.id,
         
        },
      }),
    );

    navigation.navigate('ChatRoom', {
      id: newChatRoom.id,
      name: deta.name,
    });
  };

  const onPress = () => {
    if (!deta.name) {
      alert('select name for create a group');
    } else {
      create();
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onPress()}>
        <MaterialCommunityIcons name="arrow-right" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff1a75',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});
export default GroupButton;
