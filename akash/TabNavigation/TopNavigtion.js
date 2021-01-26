import React from 'react';
import Camera from './TopPage/Camera';
import Call from './TopPage/Call';
import Chat from './TopPage/Chat';
import Friends from './TopPage/Friends';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Top = createMaterialTopTabNavigator();

function MyChat(navigation) {
  return (
    <>
  
      <Top.Navigator
        initialRouteName="Chat"
        tabBarOptions={{
          activeTintColor: '#fff',
          showIcon: true,      
          labelStyle: {fontSize: 12},
          style: {backgroundColor: '#FF1493'},
        }}
       
        >
        <Top.Screen
          name="Camera"
          component={Camera}
          options={{
            tabBarLabel:() => {return null},
            tabBarIcon: () => <MaterialCommunityIcons name="camera" color={'white'} size={26} />,
            
          }}
        />
        <Top.Screen
          name="Chat"
          component={Chat}
          options={{tabBarLabel: 'Chat'}}
        />
        <Top.Screen
          name="Call"
          component={Call}
          options={{tabBarLabel: 'Call'}}
        />
        <Top.Screen
          name="Friends"
          component={Friends}
          options={{tabBarLabel: 'Friends'}}
        />
      </Top.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});
export default MyChat;
