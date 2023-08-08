import React, { useState, useEffect, useContext } from 'react'
import { View, TextInput, Button, Image, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { SignOutButton } from '../component/SignOutButton'
import * as firebase from 'firebase/app';
import 'firebase/auth';




import 'firebase/database'; // Add this line for the database functionality

//context
import { AuthContext } from "../contexts/AuthContext";
import { FSContext } from "../contexts/FSContext";


import { doc, addDoc,deleteDoc, collection, setDoc, onSnapshot, getDocs } from "firebase/firestore";

import { ScrollView } from 'react-native-gesture-handler';

export function SettingScreen() {

  //const route = useRoute();
  //const { userId } = route.params;

  //const authStatus = useContext(AuthContext);
  const FSdb = useContext(FSContext);


  const currentUser = useContext(AuthContext);
  const authStatus = useContext(AuthContext);

  const avatar = require('../assets/avatarProfile.png');
  const [profilePicture, setProfilePicture] = useState('');
  const [password, setPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');


  const handleChangePassword = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      // Reauthenticate the user with their current password
      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          // Password reauthentication successful, proceed to change the password
          user
            .updatePassword(newPassword)
            .then(() => {
              Alert.alert('Success', 'Password changed successfully.');
              setCurrentPassword('');
              setNewPassword('');
            })
            .catch((error) => {
              Alert.alert('Error', error.message);
            });
        })
        .catch((error) => {
          Alert.alert('Error', error.message);
        });
    }
  };

  const renderProfilePicture = () => {
    if (profilePicture) {
      return <Image source={{ uri: profilePicture }} style={styles.profilePicture} />;
    } else {
      return <Image source={require('../assets/avatarProfile.png')} style={styles.avatar} />;
    }
  };

  
  const handleDeleteUser = async () => {
    try {
      console.log("Deleting user...");
      if (!user) {
        Alert.alert('Error', 'Please provide a user ID');
        return;
      }
  
      console.log("Deleting user document:", user);
  
      // Get a reference to the user document using doc() function

      const userDocRef = doc(FSdb, 'userAuth', authStatus.user);

      // Delete user document from the "userAuth" collection in Firestore
      await deleteDoc(userDocRef);
  
      console.log("User deleted successfully");
      Alert.alert('Success', 'User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'An error occurred while deleting the user');
    }
  };

  
  return (
    <ScrollView>
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <SignOutButton />
          </View>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity>
            {selectedImage ? (
             <Image source={avatar} style={styles.avatar} />
            ) : (
              renderProfilePicture()
            )}
          </TouchableOpacity>
      

          <View style={styles.container}><View>
         
          </View>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry={true}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={setNewPassword}
            />

             <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Change password</Text>
            </TouchableOpacity>
          </View>

        </View> 
        <TouchableOpacity
          style={styles.buttonDelete}
          onPress={handleDeleteUser}>
          <Text style={styles.buttonText}>Delete Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  page: {
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#26ACA7",
    marginTop: 83,
    height: 70,
    minWidth: 400,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 40,
    textAlign: "center",
    color: "#FD8749",
    fontStyle: "italic",
    fontWeight: "bold",
    shadowOpacity: 10,
    flex: 2,
    marginRight: 100,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 20,
  },
  button: {
    backgroundColor: "#26ACA7",
    marginTop: 5,
    marginVertical: 15,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 10,
    padding: 10,
  },
  buttonDelete: {
    backgroundColor: "#FD8749",
    marginTop: 5,
    marginVertical: 15,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 10,
    padding: 10,
  },
  input: {
    alignContent: "center",
    alignItems: "center",
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#26ACA7',
    marginBottom: 2,
    marginTop: 2,
    marginLeft: 30,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  avatar: {
    alignItems: "center",
    alignContent: "center",
    borderRadius: 10,
    maxHeight: 300,
    maxWidth: 300,
    minHeight: 200,
    minWidth: 200,
    marginBottom: 10,
    marginTop: 1,
    borderColor: "#26ACA7",

  },
})