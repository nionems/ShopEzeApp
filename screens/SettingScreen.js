import React, { useState, useContext } from "react";
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity, Alert, ScrollView, Dimensions } from "react-native";
import { SignOutButton } from "../component/SignOutButton";
import { FontAwesome } from "@expo/vector-icons"; // Import the icon component
import colors from "../component/Colors";
import { updatePassword, deleteUser, signOut } from "firebase/auth";
import { doc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";

//context
import { FSContext } from "../contexts/FSContext";
import { FBAuthContext } from "../contexts/FBAuthContext";

const { width } = Dimensions.get('window');

export function SettingScreen() {

	const FBauth = useContext(FBAuthContext);
	const FSdb = useContext(FSContext);

	const logo = require("../assets/logo.png");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

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
				<Image source={logo} style={styles.logo} />

				{/* Security message for changing password */}
				<Text style={styles.securityMessage}>
					Changing your password regularly helps maintain the security of your account.
				</Text>
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
					<Text style={styles.buttonText}>CHANGE PASSWORD</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.buttonDelete} onPress={() => handleDeleteProfile()}>
					<Text style={styles.buttonText}>DELETE ACCOUNT</Text>
				</TouchableOpacity>
				{/* Deletion message */}
				<Text style={styles.deleteMessage}>
					Deleting your account is a permanent action and cannot be undone.
				</Text>
			</View>
		</ScrollView>
	);
}
const styles = StyleSheet.create({

	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: colors.green,
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
		color: colors.orange,
		fontStyle: "italic",
		fontWeight: "bold",
		marginTop: 10,
		shadowOpacity: 10,
	},
	headerRight: {
		flex: 1,
	},
	buttonText: {
		color: colors.white,
		textAlign: "center",
		fontSize: 20,
	},
	button: {
		backgroundColor: colors.green,
		width: "80%",
		marginTop: "10%",
		marginBottom: "5%",
		borderRadius: 10,
		padding: 15,
	},
	buttonDelete: {
		backgroundColor: colors.red,
		width: "80%",
		marginTop: "5%",
		marginBottom: "5%",
		borderRadius: 10,
		padding: 15,
	},
	input: {
		alignContent: "center",
		alignItems: "center",
		width: "80%",
		height: 40,
		borderWidth: 1,
		borderColor: colors.green,
		paddingHorizontal: 10,
		borderRadius: 10,
		fontSize: 20,
		textAlign: "center"
	},
	logo: {
		alignItems: "center",
		alignContent: "center",
		borderRadius: 50,
		maxHeight: 200,
		maxWidth: 200,
		marginBottom: 5,
		marginTop: 5,
	},
	container: {
		alignContent: "center",
		alignItems: "center",
	},
	passwordContainer: {
		padding: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	securityMessage: {
		color: colors.grey,
		textAlign: 'center',
		marginTop: 10,
		fontSize: 10,
		fontStyle: 'italic',
	},
	deleteMessage: {
		color: colors.red,
		textAlign: 'center',
		marginTop: 10,
		fontStyle: 'italic',
		fontSize: 10,
	},
});
