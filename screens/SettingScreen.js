import React, { useState, useEffect, useContext } from "react";
import { View, TextInput, Button, Image, StyleSheet, Text, TouchableOpacity, Alert, ScrollView, Dimensions } from "react-native";
import { SignOutButton } from "../component/SignOutButton";
import ImagePicker from "react-native-image-picker";
import { FontAwesome } from "@expo/vector-icons"; // Import the icon component

import { EmailAuthCredential, updatePassword, reauthenticateWithCredential, deleteUser, signOut } from "firebase/auth";
import { doc, deleteDoc, collection, setDoc, onSnapshot, getDocs, query, where } from "firebase/firestore";

//context
//import { AuthContext } from "../contexts/AuthContext";
import { FSContext } from "../contexts/FSContext";
import { FBAuthContext } from "../contexts/FBAuthContext";

const { width } = Dimensions.get('window');


export function SettingScreen() {
	const FBauth = useContext(FBAuthContext);

	const FSdb = useContext(FSContext);

	const avatar = require("../assets/avatarProfile.png");

	//const [name, setName] = useState("");
	//const [lastName, setLastName] = useState("");
	const [profilePicture, setProfilePicture] = useState("");
	//const [nickname, setNickname] = useState("");
	const [password, setPassword] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

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
		<ScrollView contentContainerStyle={styles.page}>

			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<SignOutButton />
				</View>
				<View style={styles.headerTitleContainer}>
					<Text style={styles.headerTitle}>Settings</Text>
				</View>
				<View style={styles.headerRight}></View>
			</View>
			<View style={styles.container}>
				<TouchableOpacity onPress={handleLogoPress}>{selectedImage ? <Image source={{ avatar }} style={styles.avatar} /> : renderProfilePicture()}</TouchableOpacity>

				<View style={styles.passwordContainer}>
					<TextInput
						style={styles.input}
						placeholder="Current Password"
						secureTextEntry={!showCurrentPassword}
						value={currentPassword}
						onChangeText={setCurrentPassword}
					/>
					<TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
						<FontAwesome name={showCurrentPassword ? "eye-slash" : "eye"} size={20} color="#26ACA7" />
					</TouchableOpacity>
				</View>

				<View style={styles.passwordContainer}>
					<TextInput
						style={styles.input}
						placeholder="New Password"
						secureTextEntry={!showNewPassword}
						value={newPassword}
						onChangeText={setNewPassword}
					/>
					<TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
						<FontAwesome name={showNewPassword ? "eye-slash" : "eye"} size={20} color="#26ACA7" />
					</TouchableOpacity>


				</View>
				<TouchableOpacity style={styles.button} onPress={() => handleChangePassword()}>
					<Text style={styles.buttonText}>Change password</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.buttonDelete} onPress={() => handleDeleteProfile()}>
					<Text style={styles.buttonText}>Delete Profile</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}
const styles = StyleSheet.create({
	//   page: {
	//     justifyContent: "center",
	//     alignItems: "center",
	//     paddingVertical: 0,
	//   },
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#26ACA7",
		marginTop: 50,
		height: 70,
		paddingHorizontal: 16,


	},
	headerLeft: {
		flex: 1,
	},
	headerTitleContainer: {
		flex: 2,
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 40,
		color: "#FD8749",
		fontStyle: "italic",
		fontWeight: "bold",
		marginTop: 10,
		shadowOpacity: 10,
	},
	headerRight: {
		flex: 1,
	},
	buttonText: {
		color: "#ffffff",
		textAlign: "center",
		fontSize: 20,
	},
	button: {
		backgroundColor: "#26ACA7",
		marginTop: 10,
		marginVertical: 15,
		marginRight: 10,
		marginLeft: 10,
		borderRadius: 10,
		padding: 10,
		alignContent: "center",
	},
	buttonDelete: {
		backgroundColor: "red",
		marginTop: 10,
		marginVertical: 15,
		marginRight: 10,
		marginLeft: 10,
		borderRadius: 10,
		padding: 10,
		alignContent: "center",
	},
	input: {
		alignContent: "center",
		alignItems: "center",
		width: "80%",
		height: 40,
		borderWidth: 1,
		borderColor: "#26ACA7",
		marginBottom: 2,
		marginTop: 5,

		paddingHorizontal: 10,
		borderRadius: 10,
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
		marginTop: 40,
		borderColor: "#26ACA7",
	},
	container: {
		alignContent: "center",
		alignItems: "center",
	},
	passwordContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});
