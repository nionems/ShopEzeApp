import React, { useState, useEffect } from 'react'
import { View, TextInput, Button, Image, StyleSheet, Text,TouchableOpacity } from 'react-native';
import { SignOutButton } from '../component/SignOutButton'
import ImagePicker from 'react-native-image-picker';

export function SettingScreen() {


    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);


    const handleLogoPress = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
          console.log('Permission to access camera roll is required.');
          return;
        }
    
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1.0,
        });
    
        if (!pickerResult.cancelled) {
          setSelectedImage(pickerResult.uri);
        }
      };
    
    const handleCreateProfile = () => {
        // Implement your logic to create a profile
        // For example, you can save the profile data and password to a database or make an API call
        console.log('Creating profile:', { name, lastName, profilePicture, nickname, password });

        // Clear the input fields after creating the profile
        setName('');
        setLastName('');
        setProfilePicture('');
        setNickname('');
        setPassword('');
    };
    const renderProfilePicture = () => {
        if (profilePicture) {
          return <Image source={{ uri: profilePicture }} style={styles.profilePicture} />;
        } else {
          return <Image source={require('../assets/logo.png')} style={styles.avatar} />;
          //<Image style={styles.logostyle} source={require('../assets/logo.png')} />
        }
      };
    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <SignOutButton text="Sign out" />
                <Text style={styles.headerTitle}>Setting</Text>
            </View>
            <View style={styles.container}>
            <TouchableOpacity onPress={handleLogoPress}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.logo} />
        ) : (
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        )}
      </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your last name"
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your nickname"
                    value={nickname}
                    onChangeText={setNickname}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
                <Button title="Create Profile" onPress={handleCreateProfile} />
            </View>
        </View>


    )
}
const styles = StyleSheet.create({
    page: {
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        backgroundColor: "#26ACA7",
        marginTop: 50,
        height: 70,
        minWidth: 400,
    },
    headerTitle: {
        fontSize: 40,
        textAlign: 'center',
        color: "#FD8749",
        fontStyle: "italic",
        fontWeight: "bold"
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
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
        borderRadius: 70,
        maxHeight: 200,
        maxWidth: 200,
        minHeight: 20,
        minWidth: 20,
        borderColor: "#26ACA7",

    },
})