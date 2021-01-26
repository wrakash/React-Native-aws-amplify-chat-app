import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet, 
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import {updateUser} from '../graphql/mutations';
import {getUser} from '../graphql/queries';
import {onUpdateUser} from '../graphql/subscriptions';

const Profile = (props) => {
  const [filePath, setFilePath] = useState('https://thumbs.dreamstime.com/b/update-profile-personal-account-icon-change-avatar-reset-sett-settings-synchronize-user-flat-line-vector-modern-ui-round-127915576.jpg')
  const [profileName, setProfileName] = useState('');
  const [user_id, setUser_id] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchUsers = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});
      setProfileName(userInfo.username);
      setUser_id(userInfo.attributes.sub)
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const uploadImage = async (imagePath) => {
    try {
      const response = await fetch(imagePath.uri);
      const blob = await response.blob();
      var fileExt = imagePath.uri.split('.').pop();
      const filename = `${user_id}.` + fileExt;
      const s3Response = await Storage.put(filename, blob);
      await Storage.get(s3Response.key).then(console.log("successfully uploaded"));

      setFilePath(`https://akash2cb673c429244437acfc1a94ce68fae8200308-aka.s3.ap-south-1.amazonaws.com/public/${user_id}.jpg`)

      await API.graphql(
        graphqlOperation(updateUser, {
          input: {
            id: user_id,
            imageUri: `https://akash2cb673c429244437acfc1a94ce68fae8200308-aka.s3.ap-south-1.amazonaws.com/public/${user_id}.jpg`
          },
        }),
      ).then(alert('Successfully updated '));  

    } catch (e) {
      console.error(e);
    }
  };

  const fetchImg = async() =>{
    const profileUrl = await API.graphql(
      graphqlOperation(getUser, {
        id: user_id,
      }),
    ).then(console.log('successfull retrive'));
   
    setFilePath(profileUrl.data.getUser.imageUri);
   
  }
 fetchImg()

// console.log("url ??:" + filePath)
  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onUpdateUser)).subscribe({
      next: (data) => {
           fetchImg()
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          toggleModal();
          //alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        console.log('base64 -> ', response.base64);
        console.log('uri -> ', response.uri);
        console.log('width -> ', response.width);
        console.log('height -> ', response.height);
        console.log('fileSize -> ', response.fileSize);
        console.log('type -> ', response.type);
        console.log('fileName -> ', response.fileName);

        uploadImage(response);
        toggleModal();
      });
    }
  };

  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        toggleModal();
        // alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      console.log('base64 -> ', response.base64);
      console.log('uri -> ', response.uri);
      console.log('width -> ', response.width);
      console.log('height -> ', response.height);
      console.log('fileSize -> ', response.fileSize);
      console.log('type -> ', response.type);
      console.log('fileName -> ', response.fileName);
      uploadImage(response);
      toggleModal();
    });
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableOpacity activeOpacity={1} onPress={toggleModal}>
        <MaterialCommunityIcons
          name="account-edit"
          color="blue"
          size={30}
          style={styles.EditIcon}
        />
      </TouchableOpacity>
      
      <Avatar.Image
        size={100}
        source={{uri:filePath}}
        style={styles.sideMenuProfileIcon}
      />
      <Text style={styles.title} > {profileName} </Text> 
      <Modal isVisible={isModalVisible}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => captureImage('photo')}>
              <Text style={styles.textStyle}>Launch Camera for Image</Text>
            </TouchableOpacity>
            <MaterialCommunityIcons
              name="close"
              color="red"
              size={26}
              style={{justifyContent: 'center', alignSelf: 'center'}}
              onPress={toggleModal}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => chooseFile('photo')}>
            <Text style={styles.textStyle}>Choose Image</Text>
          </TouchableOpacity>
        </View>
      </Modal>
     
      <DrawerContentScrollView {...props} style={styles.drawer}>
        <DrawerItemList {...props} />
       
        
      </DrawerContentScrollView>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'blue',
          marginBottom: 10,
        }}>
        www.GradSpace.com
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    marginLeft: -12,
  },
  drawer: {
    marginTop: -20,
  },
  sideMenuProfileIcon: {
    marginLeft: -11,
    alignSelf: 'center',
    marginTop: -30,
  },
  EditIcon: {
    marginTop: 45,
    marginLeft: 105,
    alignSelf: 'center',
    borderRadius: 800,
    borderColor: 'black',
    borderWidth: 1,
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    height: 100,
    padding: 10,
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
});

export default Profile;
