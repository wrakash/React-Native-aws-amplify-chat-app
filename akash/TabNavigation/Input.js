import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,

} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import allActions from '../src/ReduxStore/action';
import {useSelector, useDispatch} from 'react-redux';

import {
  API,
  Auth,
  graphqlOperation,
} from 'aws-amplify';

import {
  createMessage,
  updateChatRoom,
  updateGroupRoom
} from '../graphql/mutations';

function Input({chatRoomID}) {
  const navigation = useNavigation();
 
  const [message, setMessage] = useState('');

  const [myUserId, setMyUserId] = useState(null);
 
  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setMyUserId(userInfo.attributes.sub);
    }
    fetchUser();
  }, [])


  const updateGroupRoomLastMessage = async (messageId) => {
    try {
      await API.graphql(
        graphqlOperation(
          updateGroupRoom, {
            input: {
              id: chatRoomID,
              lastMessageID: messageId,
            }
          }
        )
      );
    } catch (e) {
      console.log(e);
    }
  }

  const updateChatRoomLastMessage = async (messageId) => {
    try {
      await API.graphql(
        graphqlOperation(
          updateChatRoom, {
            input: {
              id: chatRoomID,
              lastMessageID: messageId,
            }
          }
        )
      );
    } catch (e) {
      console.log(e);
    }
  }

  const onSendPress = async () => {
    try {
      const newMessageData = await API.graphql(
        graphqlOperation(
          createMessage, {
            input: {
              content: message,
              userID: myUserId,
              chatRoomID
            }
          }
        )
      )
      await updateChatRoomLastMessage(newMessageData.data.createMessage.id)
      await updateGroupRoomLastMessage(newMessageData.data.createMessage.id)
     // dispatch(allActions.msgAction.findChatId(chatRoomID))
    } catch (e) {
      console.log(e);
    }

    setMessage('');
  }

  const onMicrophonePress = () => {
    console.warn('Microphone')
  }

  const onPress = () => {
    if (!message) {
      onMicrophonePress();
    } else {
      onSendPress();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.elements}>
        <View style={styles.item}>
          <Feather name="smile" size={28} style={styles.smile} />
          <TextInput
            placeholder="Type a message"
            textAlignVertical="center"
            multiline
            value={message}
            onChangeText={setMessage}
            style={styles.input}
          />

          <Feather name="folder" size={28} style={styles.smile} />
          {!message && <Feather name="camera" size={28} style={styles.smile} />}
        </View>
      </View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.item_2}>
          {!message ? (
            <MaterialCommunityIcons
              name="microphone"
              size={28}
              color="black"
              style={styles.microphone}
            />
          ) : (
            <MaterialIcons
              name="send"
              size={28}
              color="black"
              style={styles.microphone}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  elements: {
    height: 50,
    flex: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 8,
    flexDirection: 'row',
  },
  smile: {
    color: 'black',
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  item: {
    flex: 4,
    marginLeft: 12,
    flexDirection: 'row',
  },
  title: {
    color: 'white',
    fontFamily: 'Ubuntu-Regular',
    fontSize: 15,
    justifyContent: 'center',
  },
  item_2: {
    flex: 1,
    width: 50,
    height: 50,
    marginRight: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 200,
  },
  microphone: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 2,
    fontFamily: 'Ubuntu-Bold',
    color: 'black',
    fontSize: 17,
    marginRight: 3,
  },
});
export default Input;
