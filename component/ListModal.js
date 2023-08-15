import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Modal, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "./Colors";
import { doc, deleteDoc, arrayRemove, arrayUnion, updateDoc, onSnapshot } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Checkbox from "expo-checkbox";

import { EditListModal } from "./EditListModal";
import { AddCollabModal } from "./AddCollaborator";

//context
import { AuthContext } from "../contexts/AuthContext";
import { FSContext } from "../contexts/FSContext";

// This function takes a color in hexadecimal format and lightens it by a specified amount.
function lightenColor(colorHex, lightenAmount) {

	// Convert the hexadecimal color code to its red, green, and blue components.
	const red = parseInt(colorHex.slice(1, 3), 16);
	const green = parseInt(colorHex.slice(3, 5), 16);
	const blue = parseInt(colorHex.slice(5, 7), 16);

	// Create a new color hex code by combining the lightened red, green, and blue values.
	const newRed = Math.min(Math.round(red + lightenAmount * (255 - red)), 255);
	const newGreen = Math.min(Math.round(green + lightenAmount * (255 - green)), 255);
	const newBlue = Math.min(Math.round(blue + lightenAmount * (255 - blue)), 255);

	// Create a new color hex code by combining the lightened red, green, and blue values.
	const newColorHex = "#" + [newRed, newGreen, newBlue].map((color) => color.toString(16).padStart(2, "0")).join("");

	return newColorHex;
}

export const ListModal = ({ list, closeModal }) => {
	const [listItems, setListItems] = useState([]);
	const [listData, setListData] = useState(list);
	const [showModal, setShowModal] = useState(false);
	const [newItem, setNewItem] = useState("");
	const [showCollabModal, setCollabModal] = useState(false);
	console.log(list);
	const FSdb = useContext(FSContext);
	const ListOwner = useContext(AuthContext);

	const addNewItem = () => {
		// Check if the trimmed value of 'newItem' is not empty
		if (newItem.trim() !== "") {
			// Create an object containing the title, a unique id, and a default status (false)
			const toAdd = { title: newItem, id: uuidv4(), status: false };
			// Call the 'addListItem' function to add the new item to the list
			addListItem(list.id, toAdd);
			// Clear the 'newItem' input field
			setNewItem("");
			// Dismiss the keyboard (if it's open)
			Keyboard.dismiss();
		}
	};

	const addListItem = async (listId, newItem) => {
		// Get the reference to the specific list document
		const listRef = doc(FSdb, "lists", listId);

		// Update the list document to add the new item to the listItems array
		await updateDoc(listRef, {
			listItems: arrayUnion(newItem),
		});
	};

	const removeListItem = async (listId, item) => {
		console.log("delte", listId, item);
		// Get a reference to the document of the list in Firestore
		const listRef = doc(FSdb, "lists", listId);

		// Use the 'updateDoc' function to remove the specified item from the 'listItems' array
		await updateDoc(listRef, {
			listItems: arrayRemove(item),
		});
	};

	const updateItemStatus = async (listId, itemId, newStatus) => {

		// Get a reference to the document of the list in Firestore
		const listRef = doc(FSdb, "lists", listId);

		// Use the 'updateDoc' function to update the 'listItems' array
		await updateDoc(listRef, {
			listItems: listData.listItems.map((item) => {
				if (item.id === itemId) {
					// If the item ID matches, update its 'status' property
					return { ...item, status: newStatus };
				}
				// If the item ID doesn't match, keep the item unchanged
				return item;
			}),
		});
	};

	const handleItemToggle = async (itemId, newStatus) => {
		console.log("handleitemtoggled", itemId, newStatus);
		await updateItemStatus(list.id, itemId, newStatus);
	};

	const editList = async (update) => {
		console.log("listEdited", list);
		updateTitleAndColor(list.id, update);
	};
	const updateTitleAndColor = async (listId, update) => {
		const listRef = doc(FSdb, "lists", listId);
		await updateDoc(listRef, update);
	};

	const deleteDocById = () => {
		Alert.alert(
			"Delete List",
			"Are you sure you want to delete this list? This action cannot be undone.",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							// Assuming you have the correct reference to your Firestore database
							const docRef = doc(FSdb, "lists", list.id);

							// Delete the document
							await deleteDoc(docRef);
							console.log("Document deleted successfully.");
							closeModal(); // Close the modal after deleting the list
						} catch (error) {
							console.error("Error deleting document:", error);
						}
					},
				},
			]
		);
	};

	const renderItem = ({ item }) => (
		<View style={styles.itemContainer}>
			<View style={{ flexDirection: "row", alignContent: "center", justifyContent: "center" }}>
				<Checkbox style={{ borderRadius: 10 }} pa color={listData.color} value={item.status} onValueChange={(newValue) => handleItemToggle(item.id, newValue)} />
				<Text style={styles.itemText}>{item.title}</Text>
			</View>
			<TouchableOpacity onPress={() => removeListItem(list.id, item)}>
				<AntDesign name="delete" size={24} color={lightenColor(listData?.color, 0.4)} />
			</TouchableOpacity>
		</View>
	);

	useEffect(() => {
		const documentRef = doc(FSdb, "lists", list.id);

		const unsubscribe = onSnapshot(documentRef, (snapshot) => {
			if (snapshot.exists()) {
				setListData(snapshot.data());
			} else {
				setListItems([]);
			}
		});

		return () => {
			unsubscribe();
		};
	}, [list.id]);
	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
			<SafeAreaView style={[styles.container, { backgroundColor: lightenColor(listData?.color, 0.9) }]}>
				<View style={{ flexDirection: "row", justifyContent: "space-between", width: "90%" }}>
					<View style={{ flexDirection: "row" }}>
						<TouchableOpacity
							style={{}}
							onPress={() => {
								console.log("called");
								setShowModal(true);
							}}
						>
							<AntDesign name="edit" size={24} color={lightenColor(listData?.color, 0.4)} />
						</TouchableOpacity>
						<TouchableOpacity
							style={{ marginHorizontal: "15%" }}
							onPress={() => {
								console.log("called");
								setCollabModal(true);
							}}
						>
							<AntDesign name="adduser" size={24} color={lightenColor(listData?.color, 0.4)} />
						</TouchableOpacity>
						{list.owner == ListOwner?.uid && (
							<TouchableOpacity
								onPress={() => {
									console.log("called");
									deleteDocById();
									closeModal();
								}}
							>
								<AntDesign name="delete" size={24} color={lightenColor(listData?.color, 0.4)} />
							</TouchableOpacity>
						)}
					</View>
					<TouchableOpacity
						style={{}}
						onPress={() => {
							console.log("called");
							closeModal();
						}}
					>
						<AntDesign name="close" size={24} color={lightenColor(listData?.color, 0.4)} />
					</TouchableOpacity>
				</View>

				<View style={[styles.section, styles.header, { borderBottomColor: listData?.color }]}>
					<View>
						<Text style={styles.title}>{listData?.name}</Text>
					</View>
				</View>
				<View style={[styles.section, { flex: 7, marginVertical: 16 }]}>
					<FlatList
						data={listData?.listItems}
						renderItem={renderItem}
						keyExtractor={(item, index) => index.toString()}
						contentContainerStyle={{ paddingHorizontal: 32 }}
						showsVerticalScrollIndicator={false}
					/>
				</View>

				<KeyboardAvoidingView style={[styles.section, styles.footer]} behavior="padding">
					<TextInput style={[styles.input, { borderColor: list.color }]} placeholder="Add new item..." onChangeText={setNewItem} value={newItem} />

					<TouchableOpacity style={[styles.addButton, { backgroundColor: list.color }]} onPress={addNewItem}>
						<AntDesign name="plus" size={16} color={colors.white} />
					</TouchableOpacity>
					<Modal transparent={false} animationType="slide" visible={showModal} onRequestClose={() => setShowModal(false)}>
						{/* Change addList to addShoppingList */}
						<EditListModal closeModal={() => setShowModal(false)} addList={editList} data={listData} />
					</Modal>
					<Modal transparent={false} animationType="slide" visible={showCollabModal} onRequestClose={() => setCollabModal(false)}>
						{/* Change addList to addShoppingList */}
						<AddCollabModal closeModal={() => setCollabModal(false)} addList={editList} data={list} />
					</Modal>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	section: {
		flex: 1,
		alignSelf: "stretch",
	},
	header: {
		justifyContent: "flex-end",
		marginLeft: 64,
		borderBottomWidth: 3,
	},
	title: {
		fontSize: 30,
		fontWeight: "600",
		color: colors.black,
	},
	footer: {
		paddingHorizontal: 32,
		flexDirection: "row",
		alignItems: "center",
	},
	input: {
		flex: 1,
		height: 48,
		borderWidth: StyleSheet.hairlineWidth,
		borderRadius: 6,
		marginRight: 8,
		paddingHorizontal: 8,
	},
	addButton: {
		borderRadius: 4,
		padding: 16,
		alignItems: "center",
		justifyContent: "center",
	},
	itemContainer: {
		paddingVertical: 16,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	itemText: {
		color: colors.black,
		fontWeight: "600",
		fontSize: 16,
		marginLeft: 16,
	},
});

export default ListModal;
