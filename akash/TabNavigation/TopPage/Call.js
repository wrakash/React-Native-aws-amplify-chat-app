import React from 'react'
import {
  View, Text, StyleSheet, TextInput, Button
} from 'react-native'

function Call() {
    return (
      <View style={styles.container}>
        <Text>Call!</Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFC0CB',
      justifyContent: 'center', 
      alignItems: 'center' 
    },
  });
  
  export default Call;
