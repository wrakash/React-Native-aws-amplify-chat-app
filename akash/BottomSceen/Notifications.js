import React from 'react'
import {
  View, Text, StyleSheet, TextInput, Button
} from 'react-native'


function Notifications(props) {
  var arr1 = ["akash", 'vikash', 'rishu']
  var arr2 = ["akash", 'sonu', 'aryan']
  
  console.log("find: " + arr1.find(val=>arr2.includes(val)))
 // console.log("find: " + arr1.filter(arr1)
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Notifications!</Text>
       
      </View>
    );
  }

  export default Notifications;