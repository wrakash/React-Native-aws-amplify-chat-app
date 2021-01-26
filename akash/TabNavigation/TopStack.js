import * as React from 'react';
import {View, Image, StyleSheet, Text, Button} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import ChatNavigation from './TopNavigtion';
import ChatRoom from './ChatRoom';
import Contacts from './Contacts';
import GroupSelect from './GroupSelect'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import CreateGroup from './CreateGroup'

const Stack = createStackNavigator();

function TopNavigation() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name="WeChat"
        component={ChatNavigation}
        options={{
          title: 'WeChat',
          headerStyle: {
            backgroundColor: '#FF1493',
          },

          headerRight: () => (
            <View>
              <MaterialCommunityIcons
                name="menu"
                size={22}
                color={'white'}
                onPress={() => navigation.openDrawer()}
                style={{marginRight: 15}}
              />
            </View>
          ),
          headerTintColor: '#fff',
          headerTitleStyle: {},
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={({route}) => ({
          title: route.params.name,
          headerStyle: {
            backgroundColor: '#FF1493',
          },
          headerTintColor: '#fff',
          headerLeft: () => (
           
            <MaterialIcons name="arrow-back" size={22} color={'white'} style={{marginLeft:10}} onPress={()=>{navigation.navigate('WeChat')}}/>

          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
                width: 100,
                justifyContent: 'space-between',
                marginRight: 10,
              }}>
              <FontAwesome5 name="video" size={22} color={'white'} />
              <MaterialIcons name="call" size={22} color={'white'} />
              <MaterialCommunityIcons
                name="dots-vertical"
                size={22}
                color={'white'}
              />
            </View>
          ),
        })}
        
      />

<Stack.Screen
        name="GroupSelect"
        component={GroupSelect}
        options={({route}) => ({
          title: "New Group",
          headerStyle: {
            backgroundColor: '#FF1493',
          },
          headerTintColor: '#fff',
         
          headerRight: () => (
            <View style={{marginRight:20}}>
              <MaterialIcons name="search" size={22} color={'white'} />
            </View>
          ),
        })}
      />

<Stack.Screen
        name="CreateGroup"
        component={CreateGroup}
        options={({route}) => ({
          title: "New Group",
          headerStyle: {
            backgroundColor: '#FF1493',
          },
          headerTintColor: '#fff',
         
        })}
      />


      <Stack.Screen
        name="Contacts"
        component={Contacts}
        options={({route}) => ({
          headerStyle: {
            backgroundColor: '#FF1493',
          },
          headerTintColor: '#fff',
        })}
      />

      
  
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  fix: {
    flexDirection: 'row',
  },
  person: {
    width: 50,
    height: 50,
    borderRadius: 800,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
});
export default TopNavigation;
