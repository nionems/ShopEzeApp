import React, { useState, useEffect, useContext } from "react";
import { View, TextInput, Button, Image, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { SignOutButton } from "../component/SignOutButton";
import ImagePicker from "react-native-image-picker";

import { EmailAuthCredential, updatePassword, reauthenticateWithCredential, deleteUser, signOut } from "firebase/auth";
import { doc, deleteDoc, collection, setDoc, onSnapshot, getDocs, query, where } from "firebase/firestore";

//context
import { AuthContext } from "../contexts/AuthContext";
import { FSContext } from "../contexts/FSContext";
import { FBAuthContext } from "../contexts/FBAuthContext";

export function SettingScreen() {
	const FBauth = useContext(FBAuthContext);

	const FSdb = useContext(FSContext);

	const avatar = require("../assets/avatarProfile.png");

	const [name, setName] = useState("");
	const [lastName, setLastName] = useState("");
	const [profilePicture, setProfilePicture] = useState("");
	const [nickname, setNickname] = useState("");
	const [password, setPassword] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const handleLogoPress = async () => {
		try {
			const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (permissionResult.granted === false) {
				throw new Error("Permission to access the camera roll is required.");
			}

			const pickerResult = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1.0,
			});

			if (!pickerResult.cancelled) {
				setProfilePicture(pickerResult.uri);
			}
		} catch (error) {
			Alert.alert("Error", error.message);
		}
	};
	const handleChangePassword = () => {
		const user = FBauth.currentUser; // Obtain the authenticated user instance
		if (user) {
			updatePassword(user, newPassword)
				.then(() => {
					// Update successful.
					Alert.alert("Success", "Password changed successfully.");
				})
				.catch((error) => {
					// An error ocurred
					// ...
					console.log(" Update error.", error);
				});
		}
	};


	const renderProfilePicture = () => {
		if (profilePicture) {
			return <Image source={{ uri: profilePicture }} style={styles.profilePicture} />;
		} else {
			return <Image source={require("../assets/avatarProfile.png")} style={styles.avatar} />;
		}
	};

	
  const handleDeleteProfile = async () => {
    Alert.alert(
      "Delete Profile",
      "Are you sure you want to delete your profile? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const user = FBauth.currentUser;
            if (user) {
              const userAuthCollectionRef = collection(FSdb, "userAuth");
              const q = query(userAuthCollectionRef, where("id", "==", user.uid));
              const querySnapshot = await getDocs(q);
              if (querySnapshot.empty) {
                console.log("User not found.");
              } else {
                const res = querySnapshot.docs.map((doc) => ({
                  did: doc.id,
                  ...doc.data(),
                }));
  
                try {
                  await deleteDoc(doc(FSdb, "userAuth", res[0].did));
                  await deleteUser(user);
                  await signOut(FBauth);
                  console.log("User successfully deleted!");
                } catch (error) {
                  console.error("Error deleting document: ", error);
                }
              }
            }
          },
        },
      ]
    );
  };
  
	return (
		<View style={styles.page}>
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<SignOutButton />
				</View>
				<Text style={styles.headerTitle}>Settings</Text>
			</View>
			<View style={styles.container}>
				<TouchableOpacity onPress={handleLogoPress}>{selectedImage ? <Image source={{ avatar }} style={styles.avatar} /> : renderProfilePicture()}</TouchableOpacity>

				<View style={styles.container}>
					<TextInput style={styles.input} placeholder="Current Password" secureTextEntry={true} value={currentPassword} onChangeText={setCurrentPassword} />
					<TextInput style={styles.input} placeholder="New Password" secureTextEntry={true} value={newPassword} onChangeText={setNewPassword} />

					<TouchableOpacity style={styles.button} onPress={() => handleChangePassword()}>
						<Text style={styles.buttonText}>Change password</Text>
					</TouchableOpacity>
				</View>
			</View>

			<TouchableOpacity style={styles.buttonDelete} onPress={() => handleDeleteProfile()}>
				<Text style={styles.buttonText}>Delete Profile</Text>
			</TouchableOpacity>
		</View>
	);
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
		width: "80%",
		height: 40,
		borderWidth: 1,
		borderColor: "#26ACA7",
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
});
