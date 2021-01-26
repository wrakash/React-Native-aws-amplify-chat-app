import React from 'react'

function SelectedListItem() {
    const navigation = useNavigation();
  const dispatch = useDispatch();
 
  const removeGroup = () => {
      dispatch(removeFriend(item))    
  }
  
  return (
    <TouchableWithoutFeedback onPress={removeGroup} >
        <View style={styles.imgcontainer}>
          <Image source={{uri: item.imageUri}} style={styles.person} />
      {/*  <Entypo
            name="circle-with-cross"
            color="black"
            size={26}
            style={styles.check}
      /> */}
        <View style={styles.check}>
              <AntDesign
                name="checkcircle"
                color="green"
                size={26}
                style={styles.check}
              />
            </View>
        </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 2,
      backgroundColor: '#FFC0CB'
    },
    check: {
      marginTop: 12,
      marginLeft: -5,
    },
    heart: {
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: -25,
      color: 'white',
      fontFamily: 'Ubuntu-Light',
      fontSize: 12,
    },
    card: {
      marginBottom: 1,
      height: 80,
      justifyContent: 'center',
      backgroundColor: '#FF69B4',
    },
    imgcontainer: {
      flexDirection: 'row',
      margin: 10,
    },
    person: {
      width: 50,
      height: 50,
      borderRadius: 800,
      justifyContent: 'center',
      alignSelf: 'center',
    },
    user: {
      flex: 3,
      marginLeft: 30,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    name: {
      fontSize: 20,
      fontFamily: 'Ubuntu-Bold',
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    message: {
      fontSize: 17,
      fontFamily: 'Ubuntu-Medium',
    },
    time: {
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    date: {
      fontFamily: 'Ubuntu-Bold',
    },
    count: {
      alignSelf: 'center',
      justifyContent: 'center',
      fontFamily: 'Ubuntu-Bold',
    },
  });
  

export default SelectedListItem
