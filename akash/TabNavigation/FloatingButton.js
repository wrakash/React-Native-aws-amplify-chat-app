import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

function FloatingButton() {
  const navigation = useNavigation();
  const selected = useSelector((state) => {
    return state;
  });

  const onPress = () => {
    if(selected.length === 0){
      alert('select minimum one friend to create a group')
    }else{
      navigation.navigate('CreateGroup')
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onPress()}>
        <MaterialCommunityIcons
          name="arrow-right"
          size={28}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff1a75',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});
export default FloatingButton;
