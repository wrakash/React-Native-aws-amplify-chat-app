import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import Input from './Input'

import {
  API,
  graphqlOperation,
  Auth,
} from 'aws-amplify';

import { messagesByChatRoom } from '../graphql/queries';
import { onCreateMessage } from '../graphql/subscriptions';
import ChatMessage from './ChatMessage'

//
const Item = ({message, time, sender}) => (
  <View style={styles.item}>
   {(sender) ?
      <Card style={styles.card_rec}>
        <View style={styles.message}>
          <Text style={styles.text_rec}>{message}</Text>
          <Text style={styles.time_rec}>{time}</Text>
        </View>
      </Card>
      :
      <Card style={styles.card_sender}>
        <View style={styles.message}>
          <Text numberOfLines={2} style={styles.text_rec}>{message}</Text>
          <Text style={styles.time_rec}>{time}</Text>
        </View>
      </Card>
     }
  </View>
);

//

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);

  const route = useRoute();

  const fetchMessages = async () => {
    const messagesData = await API.graphql(
      graphqlOperation(
        messagesByChatRoom, {
          chatRoomID: route.params.id,
          sortDirection: "DESC",
        }
      )
    )

    console.log("FETCH MESSAGES")
    setMessages(messagesData.data.messagesByChatRoom.items);
  }

  useEffect(() => {
    fetchMessages();
  }, [])

  useEffect(() => {
    const getMyId = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setMyId(userInfo.attributes.sub);
    }
    getMyId();
  }, [])

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: (data) => {
        const newMessage = data.value.data.onCreateMessage;

        if (newMessage.chatRoomID !== route.params.id) {
          console.log("Message is in another room!")
          return;
        }

        fetchMessages();
        // setMessages([newMessage, ...messages]);
      }
    });

    return () => subscription.unsubscribe();
  }, [])
  console.log(`messages in state1: ${route.params.name}`)
  
 // console.log(`messages in state: ${messages.length}`)
  return (
    <>
   

      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatMessage myId={myId} message={item} />}
        inverted
        style={{marginTop:5}}
      />   
      <Input chatRoomID={route.params.id}/>
    </>
  );
}
const styles = StyleSheet.create({

 
});

export default ChatRoom;
