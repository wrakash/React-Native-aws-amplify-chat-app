import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import moment from 'moment';
import {Card} from 'react-native-paper';

const ChatMessage = ({message, myId}) => {
  const isMyMessage = () => {
    return message.user.id === myId;
    //return true
  };

  return (
    <View style={styles.container}>
      <Card
        style={[
          styles.messageBox,
          {
            backgroundColor: isMyMessage() ? '#FFFF66' : 'white',
            marginLeft: isMyMessage() ? 50 : 0,
            marginRight: isMyMessage() ? 0 : 50,
          },
        ]}>
        {!isMyMessage() ? (
          <Text style={styles.name}>{message.user.name}</Text>
        ) : (
          <Text> </Text>
        )}

        <Text style={styles.message}>{message.content}</Text>

        <Text style={styles.time}>{moment(message.createdAt).fromNow()}</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  messageBox: {
    borderRadius: 10,
    padding: 10,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {
    fontFamily: 'Ubuntu-Bold',
  },
  time: {
    alignSelf: 'flex-end',
    color: 'black',
    marginTop: -12,
  },
});

export default ChatMessage;
