import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Card} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import {useSelector, useDispatch} from 'react-redux';
import allActions from '../../../src/ReduxStore/action';
import {deleteChatRoom, deleteGroupRoom, deleteGroupRoomUser, deleteChatRoomUser, deleteMessage } from './mutations';
import {messagesByChatRoom, roomByChatRoom, roomByGroupRoom} from './queries ';

import {
  onCreateChatRoomUser,
  onCreateMessage,
  onUpdateUser,
} from '../../../graphql/subscriptions';

const ChatListItem = ({chatRoom}) => {
  const dispatch = useDispatch();

  const [otherUser, setOtherUser] = useState(null);
  const [msgId, setMsgId] = useState([]);
  const [roomId, setRoomId] = useState([]);
  const [groupId, setGroupId] = useState([]);
  const navigation = useNavigation();

  const msg = useSelector((state) => {
    return state.msgReducer;
  });

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage),
    ).subscribe({
      next: (data) => {},
    });

    return () => subscription.unsubscribe();
  }, []);

  const getOtherUser = async () => {
    const userInfo = await Auth.currentAuthenticatedUser();
    if (chatRoom.chatRoomUsers.items[0].user.id === userInfo.attributes.sub) {
      setOtherUser(chatRoom.chatRoomUsers.items[1].user);
    } else {
      setOtherUser(chatRoom.chatRoomUsers.items[0].user);
    }
  };

  useEffect(() => {
    getOtherUser();
  }, []);

  const onDelete = async () => {
    alert('Do you want to delete ?');
    

    if (chatRoom['groupName'] !== undefined) {
      //delete GroupRoom
      const id = await API.graphql(
        graphqlOperation(deleteGroupRoom, {
          id: chatRoom.id,
        }),
      ).then(console.log('successfully Group deleted'));

      console.log('groupRoom:  ' + id.data.deleteGroupRoom);

      //delete GroupRoomUser
      const group = await API.graphql(
        graphqlOperation(roomByGroupRoom, {
          id: chatRoom.id,
        }),
      ).then(console.log('successfully Group deleted'));
      setGroupId(group.data.roomByGroupRoom.items);

      const deleteMsg = async (room) => {
        await API.graphql(
          graphqlOperation(deleteGroupRoomUser, {
            id: room,
          }),
        ).then(console.log('successfully Group deleted'));
      };

      groupId.map((x) => {
        deleteMsg(x);
      });
    } else {
      console.log('chatRoom:  ' + chatRoom.id);
      // delete chatRoom
      await API.graphql(
        graphqlOperation(deleteChatRoom, {
          id: chatRoom.id,
        }),
      ).then(console.log('successfully Chat deleted'));

      // delete chatRoomUser
      const room = await API.graphql(
        graphqlOperation(roomByChatRoom, {
          id: chatRoom.id,
        }),
      ).then(console.log('successfully Group deleted'));
      setRoomId(room.data.roomByChatRoom.items);

      const deleteMsg = async (room) => {
        await API.graphql(
          graphqlOperation(deleteChatRoomUser, {
            id: room,
          }),
        ).then(console.log('successfully Group deleted'));
      };

      roomId.map((x) => {
        deleteMsg(x);
      });
    }

    //delete all message
    const msg = await API.graphql(
      graphqlOperation(messagesByChatRoom, {
        id: chatRoom.id,
      }),
    ).then(console.log('successfully Group deleted'));
    setMsgId(msg.data.messagesByChatRoom.items);

    const deleteMsg = async (msg) => {
      await API.graphql(
        graphqlOperation(deleteMessage, {
          id: msg,
        }),
      ).then(console.log('successfully Group deleted'));
    };

    msgId.map((x) => {
      deleteMsg(x);
    });
  };

  if (chatRoom['groupName'] === undefined) {
    if (!otherUser) {
      return null;
    }
  }

  const roomname =
    chatRoom['groupName'] !== undefined ? chatRoom.groupName : otherUser.name;
  const onClick = () => {
    navigation.navigate('ChatRoom', {
      id: chatRoom.id,
      name: roomname,
    });
  };

  const img =
    chatRoom['groupImg'] !== undefined ? chatRoom.groupImg : otherUser.imageUri;

  return (
    <TouchableWithoutFeedback onPress={onClick} onLongPress={onDelete}>
      <Card style={styles.card}>
        <View style={styles.imgcontainer}>
          <Image source={{uri: img}} style={styles.person} />

          <View style={styles.user}>
            <Text style={styles.name}>{roomname}</Text>
            <Text numberOfLines={1} style={styles.message}>
              {chatRoom.lastMessage
                ? `${chatRoom.lastMessage.user.name}: ${chatRoom.lastMessage.content}`
                : ''}
            </Text>
          </View>

          <View style={styles.time}>
            <Text style={styles.date}>
              {chatRoom.lastMessage &&
                moment(chatRoom.lastMessage.createdAt).format('DD/MM/YY')}
            </Text>

            {msg.msg !== 0 ? (
              <View>
                <MaterialCommunityIcons
                  name="heart"
                  color="#0000FF"
                  size={40}
                  style={styles.count}
                />
                <Text style={styles.heart}>{msg}</Text>
              </View>
            ) : (
              <View></View>
            )}
          </View>
        </View>
      </Card>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  heart: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: -32,
    color: 'white',
    fontFamily: 'Ubuntu-Light',
    fontSize: 14,
  },
  card: {
    marginBottom: 1,
    height: 80,
    justifyContent: 'center',
    backgroundColor: '#FF69B4',
  },
  imgcontainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 6,
  },
  person: {
    width: 70,
    height: 70,
    borderRadius: 800,
  },
  user: {
    flex: 3,
    marginLeft: 30,
    marginTop: 7,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold',
    color: 'white',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  message: {
    fontSize: 15,
    fontFamily: 'Ubuntu-Medium',
    color: 'white',
  },
  time: {
    flex: 1,
    marginTop: 7,
  },
  date: {
    fontFamily: 'Ubuntu-Bold',
    color: 'white',
  },
  count: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: 'Ubuntu-Bold',
  },
});

export default ChatListItem;
