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
import {
  listChatRooms,
  listChatRoomUsers,
  byUser,
  listUsers,
} from '../../../graphql/queries';

const ContactListItem = ({item}) => {
  const navigation = useNavigation();
  const [chatRooms, setChatRooms] = useState([]);
  useEffect(() => {
    const fetchChat = async () => {
      const roomID = await API.graphql(graphqlOperation(listChatRooms));
      setChatRooms(roomID.data.listChatRooms.items);
    };

    fetchChat();
  }, []);


  const [chatRoomid, setChatRoomid] = useState("akash");
 
  const fetchChatRooms = async (item) => {

    const userInfo = await Auth.currentAuthenticatedUser();

   
    chatRooms.map(async (chatRoom) => {
      const userData1 = await API.graphql(
        graphqlOperation(byUser, {
          userID: item.id,
          chatRoomID: {eq: chatRoom.id},
        }),
      );
   
      const userData2 = await API.graphql(
        graphqlOperation(byUser, {
          userID: userInfo.attributes.sub,
          chatRoomID: {eq: chatRoom.id},
        }),
      );

      check1 = userData1.data.byUser.items[0].chatRoomID
      check2 = userData2.data.byUser.items[0].chatRoomID

    
      if (check1 === check2) {
       setChatRoomid(check1);
      } 

      
    

      //
    });
  };

  const onClick = async () => {
    try {
      fetchChatRooms(item);

      if (false) {
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
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
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
