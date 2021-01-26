import {withAuthenticator} from 'aws-amplify-react-native';
import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import Notifications from '../BottomSceen/Notifications';
import Profile from '../BottomSceen/Profile';
import Feed from '../BottomSceen/Feed';

import Services from '../DrawerScreen/Services';
import About from '../DrawerScreen/About';
import Contact from '../DrawerScreen/Contact';
import ProfilePage from '../DrawerScreen/Profile';

import {createDrawerNavigator} from '@react-navigation/drawer';

import {AppearanceProvider, useColorScheme} from 'react-native-appearance';
//import {AmplifyTheme, Localei18n} from './components';
import navigation from '../TabNavigation/TopStack';
import {Amplify, Auth, API, graphqlOperation} from 'aws-amplify';
import {getUser} from '../graphql/queries';
import {createUser} from '../graphql/mutations';

const Drawer = createDrawerNavigator();
const Bottom = createMaterialBottomTabNavigator();

function signOut() {
  Auth.signOut()
    .then(() => {
      props.onStateChange('signedOut', null);
    })
    .catch((err) => {
      console.log('err: ', err);
    });
  return signOut;
}

function MyTabs() {
  return (
    <Bottom.Navigator
      initialRouteName="Feed"
      activeColor="#e91e63"
      style={{backgroundColor: 'tomato'}}>
      <Bottom.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Bottom.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      />
      <Bottom.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Bottom.Navigator>
  );
}

function MyDrawer() {
 
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: '#FFC0CB',
        width: 240,
      }}
      drawerContent={(props) => <ProfilePage {...props} />}>
      <Drawer.Screen name="Chat" component={navigation} />
      <Drawer.Screen name="Home" component={MyTabs} />
      <Drawer.Screen name="About" component={About} />
      <Drawer.Screen name="Contact" component={Contact} />
      <Drawer.Screen name="Services" component={Services} />
      <Drawer.Screen name="Logout" component={signOut} />
    </Drawer.Navigator>
  );
}

const App = () => {
  const scheme = useColorScheme();
  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});

      if (userInfo) {
        const userData = await API.graphql(
          graphqlOperation(getUser, {id: userInfo.attributes.sub}),
        );

        if (userData.data.getUser) {
          console.log('User is already registered in database');
          return;
        }

        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username,
          imageUri:'https://thumbs.dreamstime.com/b/update-profile-personal-account-icon-change-avatar-reset-sett-settings-synchronize-user-flat-line-vector-modern-ui-round-127915576.jpg', 
          status: 'Hey, I am using WhatsApp',
        };
        
       
        await API.graphql(graphqlOperation(createUser, {input: newUser}));
      }
    };

    fetchUser();
  }, []);

  return (
   
      <AppearanceProvider>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor="#000000"
          translucent={true}
        />
        <NavigationContainer>
          <MyDrawer />
        </NavigationContainer>
      </AppearanceProvider>
   
  );
};

const styles = StyleSheet.create({});

const signUpConfig = {
  hideAllDefaults: true,

  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string',
    },
    {
      label: 'Username',
      key: 'username',
      required: true,
      displayOrder: 1,
      type: 'string',
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password',
    },
  ],
};

export default withAuthenticator(App);
