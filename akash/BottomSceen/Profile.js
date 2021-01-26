import React from 'react'
import {
  View, Text, StyleSheet, TextInput, Button, TouchableOpacity
} from 'react-native'
function Profile() {



    return (


      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity delayLongPress={10} onLongPress={()=>{console.log("pressed")}} activeOpacity={0.6}>
        <Text>Profile!</Text>
        </TouchableOpacity>
      </View>
    );
  }

  export default Profile;