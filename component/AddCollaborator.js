import { useContext, useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput,Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "./Colors";
import { AuthContext } from "../contexts/AuthContext";
import { collection, query, where, getDocs, doc, updateDoc, FieldValue, arrayUnion } from "firebase/firestore";
import { FSContext } from "../contexts/FSContext";
import { List, Avatar, Searchbar, Text as TextP, ActivityIndicator } from "react-native-paper";

export function AddCollabModal({ closeModal, data }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);

	const onChangeSearch = (query) => {
		console.log(query);
		setSearchQuery(query);
		findUserByEmail(query);
	};
	console.log("rp", data);

	const ListOwner = useContext(AuthContext);
	const FSdb = useContext(FSContext);
	const findUserByEmail = async (email) => {
		try {
			console.log("em", email);
			// Get a reference to the "userAuth" collection in Firestore
			setLoading(true);
			const userAuthCollectionRef = collection(FSdb, "userAuth");

			// Create a query to find the user by email
			const q = query(userAuthCollectionRef, where("email", "==", email.toLowerCase()));

			// Execute the query and get the result
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				// If no user is found, return null or appropriate value
				console.log("User not found.");
				setLoading(false);

				return null;
			} else {
				// If a user is found, return the user data
				const userData = querySnapshot.docs[0].data();
				console.log("User found:", userData);
				setUser(userData);
				setLoading(false);
			}
		} catch (error) {
			console.error("Error finding user by email:", error);
			throw error;
		}
	};
	const addContributorToList = async () => {
		try {
		  // Get a reference to the list document
		  const listRef = doc(FSdb, "lists", data.id);
	  
		  // Update the "contributors" array by adding the new contributorId
		  await updateDoc(listRef, {
			collaborators: arrayUnion(user.id),
		  });
	  
		  console.log("Contributor added to the list.");
		  closeModal();
	  
		  // Display a confirmation alert
		  Alert.alert(
			"Collaborator Added",
			`${user.email} has been successfully added as a collaborator.`,
			[
			  {
				text: "OK",
				onPress: () => {
				  // You can add any further actions here if needed
				},
			  },
			]
		  );
		} catch (error) {
		  console.error("Error adding contributor to the list:", error);
		  throw error;
		}
	  };
	  
	return (
		<KeyboardAvoidingView style={styles.container} behavior="padding">
			<TouchableOpacity style={{ position: "absolute", top: 64, right: 32 }} onPress={closeModal}>
				<AntDesign name="close" size={24} color={colors.black} />
			</TouchableOpacity>

			<View style={{ flex: 0.8, width: "90%" }}>
				<Text style={styles.title}>Add Collabrator</Text>
				<Searchbar placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
				{user && !loading && (
					<View
						style={{
							flexDirection: "row",
							marginTop: "10%",
							alignItems: "center",
							justifyContent: "space-between",
							marginHorizontal: "1%",
							padding: "5%",
							backgroundColor: "#F1F1F1",
							borderRadius: 10,
						}}
					>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Avatar.Text size={34} label={user.email.substr(0, 2)} />
							<Text style={{ marginHorizontal: "3%", fontWeight: "800", color: colors.black }}>{user.email}</Text>
						</View>
						<TouchableOpacity onPress={addContributorToList}>
							<AntDesign name="adduser" size={24} color={colors.black} />
						</TouchableOpacity>
					</View>
				)}
				{user === null && searchQuery !== "" && !loading && (
					<View style={{ flexDirection: "row", marginTop: "10%", alignItems: "center", justifyContent: "center", marginHorizontal: "1%", padding: "5%", backgroundColor: "#F1F1F1", borderRadius: 10 }}>
						<Text style={{ marginHorizontal: "3%", fontWeight: "800", color: colors.black }}>No User found !</Text>
					</View>
				)}
				{loading && <ActivityIndicator animating={true} color="black" />}
				{/* 
				<TouchableOpacity style={[styles.create, { backgroundColor: "yellow" }]} onPress={() => findUserByEmail(query)}>
					<Text style={{ color: "#78cfcb", fontWeight: "bold", fontSize: 24 }}>Upadate</Text>
				</TouchableOpacity> */}
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
	},
	title: {
		fontSize: 28,
		fontWeight: "800",
		color: colors.black,
		alignSelf: "center",
		marginBottom: 16,
	},
	input: {
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: colors.blue,
		borderRadius: 6,
		height: 50,
		marginTop: 8,
		paddingHorizontal: 16,
		fontSize: 18,
	},
	create: {
		marginTop: 24,
		height: 50,
		borderRadius: 6,
		alignItems: "center",
		justifyContent: "center",
	},
	colorSelect: {
		width: 30,
		height: 30,
		borderRadius: 4,
	},
});
