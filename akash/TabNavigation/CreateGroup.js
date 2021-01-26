import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {Avatar, Card} from 'react-native-paper';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import GroupButton from './GroupButton';
import {API, graphqlOperation, Auth, Storage} from 'aws-amplify';
import {TextInput} from 'react-native-paper';
import {getUser} from '../graphql/queries';
import {updateUser} from '../graphql/mutations';
import {onUpdateUser} from '../graphql/subscriptions';


function CreateGroup() {
  const [name, setName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [filePath, setFilePath] = useState('https://thumbs.dreamstime.com/b/update-profile-personal-account-icon-change-avatar-reset-sett-settings-synchronize-user-flat-line-vector-modern-ui-round-127915576.jpg');
  const [user_id, setUser_id] = useState({});


  const fetchUsers = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});
      setUser_id(userInfo.attributes.sub)
    } catch (e) {
      console.log(e);
    }
  };

  fetchUsers();
  
  const selected = useSelector((state) => {
    return state.groupReducer;
  });

  const uploadImage = async (imagePath) => {
    try {
      const response = await fetch(imagePath.uri);
      const blob = await response.blob();
      var fileExt = imagePath.uri.split('.').pop();
      const filename = `${user_id}group.` + fileExt;
      const s3Response = await Storage.put(filename, blob);
      await Storage.get(s3Response.key).then(console.log("successfully uploaded"));
      setFilePath(`https://akash2cb673c429244437acfc1a94ce68fae8200308-aka.s3.ap-south-1.amazonaws.com/public/${user_id}group.jpg`)

    } catch (e) {
      console.error(e);
    }
  };

  const SelectedListItem = ({item}) => {
    return (
      <TouchableWithoutFeedback>
        <View style={styles.view}>
          <Image source={{uri: item.imageUri}} style={styles.person} />

          <Text>{item.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };
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

  const url = (filePath) ? filePath : 'https://thumbs.dreamstime.com/b/update-profile-personal-account-icon-change-avatar-reset-sett-settings-synchronize-user-flat-line-vector-modern-ui-round-127915576.jpg';
 

  return (
    <View style={styles.container}>
      <View style={styles.imgcontainer}>
        <TouchableOpacity activeOpacity={1} onPress={toggleModal}>
          <Avatar.Image
            size={80}
            source={{
              uri: filePath
            }}
          />
        </TouchableOpacity>

        <Modal isVisible={isModalVisible}>
          <View style={styles.ModalCont}>
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

        <View style={styles.inputContainer}>
          <TextInput
            label="Type group subject here.."
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.input}
          />
        </View>

        <View style={styles.icon}>
          <Feather
            name="smile"
            size={28}
            color="white"
            style={styles.iconContainer}
          />
        </View>
      </View>
      <View style={styles.text}>
        <Text>Provide a group subject and optional icon</Text>
      </View>

      <View style={{backgroundColor: '#FF69B4', marginBottom: 1}}>
        <Text
          style={{marginLeft: 10}}>{`Participants: ${selected.length}`}</Text>
        <FlatList
          horizontal={true}
          data={selected}
          renderItem={({item}) => {
            return <SelectedListItem item={item} />;
          }}
          keyExtractor={(item) => item.id}
        />
      </View>
      <GroupButton deta={{img:filePath, name:name}}/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 2,
    backgroundColor: '#FFC0CB',
  },
  imgcontainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 3,
  },
  inputContainer: {
    margin: 10,
    width: 295,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  input: {
    justifyContent: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text: {
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
  view: {
    margin: 10,
  },
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
  ModalCont: {
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

export default CreateGroup;
