import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import {createChatRoom, createChatRoomUser} from '../../../graphql/mutations';
import {Card} from 'react-native-paper';
import {getUser} from '../queries';

const ContactListItem = ({item}) => {
  const navigation = useNavigation();
 
 

  const newChat = async () => {
    //  1. Create a new Chat Room
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, {
        input: {
          lastMessageID: 'zz753fca-e8c3-473b-8e85-b14196e84e16',
        },
      }),
    );

    if (!newChatRoomData.data) {
      console.log(' Failed to create a chat room');
      return;
    }

    const newChatRoom = newChatRoomData.data.createChatRoom;

    // 2. Add `user` to the Chat Room

    await API.graphql(
      graphqlOperation(createChatRoomUser, {
        input: {
          userID: item.id,
          chatRoomID: newChatRoom.id,
        },
      }),
    );

    //  3. Add authenticated user to the Chat Room
    const userInfo = await Auth.currentAuthenticatedUser();
    await API.graphql(
      graphqlOperation(createChatRoomUser, {
        input: {
          userID: userInfo.attributes.sub,
          chatRoomID: newChatRoom.id,
        },
      }),
    );

    navigation.navigate('ChatRoom', {
      id: newChatRoom.id,
      name: item.name,
    });
  };

  const onClick = async (item) => {
    
    const userInfo = await Auth.currentAuthenticatedUser();
    const userData1 = await API.graphql(
      graphqlOperation(getUser, {
        id: userInfo.attributes.sub,
      }),
    );

   
    const userOwner = userData1.data.getUser.chatRoomUser.items.map((x) => {
        return x.chatRoom.id; 
    });
   // alert("hello")
    console.log('user1: ' + userOwner);

    const userData2 = await API.graphql(
      graphqlOperation(getUser, {
        id: item.id,
      }),
    );
    const user = userData2.data.getUser.chatRoomUser.items.map((x) => {
        return x.chatRoom.id;
    });

    console.log('user2: ' + user);

    const find = user.find((val) => userOwner.includes(val));
    console.log('user3: ' + typeof(find));

    if(find !== undefined){
      console.log("hgjhj")
      navigation.navigate('ChatRoom', {
        id: find,
        name: item.name,
      });
    }else if (find === undefined){
      newChat()
    }
   
  };

  return (
    <TouchableWithoutFeedback onPress={() => onClick(item)}>
      <Card style={styles.card}>
        <View style={styles.imgcontainer}>
          <Image source={{uri: item.imageUri}} style={styles.person} />

          <View style={styles.user}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.message}>{item.status}</Text>
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

export default ContactListItem;
