import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Modal, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "./Colors";
import { doc, deleteDoc, arrayRemove, arrayUnion, updateDoc, onSnapshot } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { EditRecipeModal } from "./EditRecipeModal";
import { FontAwesome } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";

//context
import { FSContext } from "../contexts/FSContext";

function lightenColor(colorHex, lightenAmount) {
	const red = parseInt(colorHex.slice(1, 3), 16);
	const green = parseInt(colorHex.slice(3, 5), 16);
	const blue = parseInt(colorHex.slice(5, 7), 16);

	const newRed = Math.min(Math.round(red + lightenAmount * (255 - red)), 255);
	const newGreen = Math.min(Math.round(green + lightenAmount * (255 - green)), 255);
	const newBlue = Math.min(Math.round(blue + lightenAmount * (255 - blue)), 255);
	const newColorHex = "#" + [newRed, newGreen, newBlue].map((color) => color.toString(16).padStart(2, "0")).join("");
	return newColorHex;
}

export const RecipeView = ({ list, closeModal }) => {

	//console.log("list", list);
	const [listItems, setListItems] = useState([]);
	const [listData, setListData] = useState(list);
	const [showModal, setShowModal] = useState(false);
	const [newItem, setNewItem] = useState("");
	const [showRecipeDescription, setShowRecipeDescription] = useState(false);
	const [recipeDescription, setRecipeDescription] = useState("");
	const FSdb = useContext(FSContext);


	const addNewItem = () => {
		if (newItem.trim() !== "") {
			const toAdd = { title: newItem, id: uuidv4(), status: false };
			addListItem(list.id, toAdd);
			setNewItem("");
			Keyboard.dismiss();
		}
	};

	const addListItem = async (listId, newItem) => {
		const listRef = doc(FSdb, "recipes", listId);
		await updateDoc(listRef, {
			ingredients: arrayUnion(newItem),
		});
	};

	const removeListItem = async (listId, item) => {
		console.log("delte", listId, item);
		const listRef = doc(FSdb, "recipes", listId);
		await updateDoc(listRef, {
			ingredients: arrayRemove(item),
		});
	};

	/*Get a reference to the Firestore document
	Update the document with the new status for the item
	If the item's ID matches the provided itemId, update its status
	If the item's ID doesn't match, return it as is*/
	const updateItemStatus = async (listId, itemId, newStatus) => {
		const listRef = doc(FSdb, "recipes", listId);
		await updateDoc(listRef, {
			ingredients: listData.ingredients.map((item) => {
				if (item.id === itemId) {
					return { ...item, status: newStatus };
				}
				return item;
			}),
		});
	};


	//update title and color
	const editList = async (update) => {
		console.log("toeud", list);
		updateTitleAndColor(list.id, update);//call updatetitleandcolor function
	};
	//update title color in Firebase
	const updateTitleAndColor = async (listId, update) => {
		const listRef = doc(FSdb, "recipes", listId);
		await updateDoc(listRef, update);
	};
	const handleItemToggle = async (itemId, newStatus) => {
		console.log("handleitemtoggled", itemId, newStatus);
		await updateItemStatus(list.id, itemId, newStatus);
	};
	const deleteDocById = async () => {
		try {
			// Show a confirmation alert before deleting
			Alert.alert("Delete Recipe", "Are you sure you want to delete this recipe?", [
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						// Assuming you have the correct reference to your Firestore database
						const docRef = doc(FSdb, "recipes", list.id);
						await deleteDoc(docRef);
						console.log("Document deleted successfully.");
						closeModal();
					},
				},
			]);
		} catch (error) {
			console.error("Error deleting document:", error);
		}
	};
	// how the item will render on the flatlist
	const renderItem = ({ item, index }) => (
		<View style={styles.itemContainer}>
			<View style={{ flexDirection: "row", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
				<Checkbox style={{ borderRadius: 10 }} pa color={listData.color} value={item.status} onValueChange={(newValue) => handleItemToggle(item.id, newValue)} />
				<Text style={styles.itemText}>{item.title}</Text>
			</View>
			<TouchableOpacity onPress={() => removeListItem(list.id, item)}>
				<AntDesign name="delete" size={24} color={lightenColor(listData?.color, 0.4)} />
			</TouchableOpacity>
		</View>
	);

	useEffect(() => {
		const documentRef = doc(FSdb, "recipes", list.id);// Get a reference to the specific Firestore document for the recipe list
		const unsubscribe = onSnapshot(documentRef, (snapshot) => {  // Subscribe to changes in the document using onSnapshot
			if (snapshot.exists()) {    // If the document exists...
				setListData(snapshot.data());// Update the local state with the data from the document
			} else {
				setListItems([]);      // If the document doesn't exist, set an empty list
			}
		});

		return () => {// Unsubscribe from the snapshot listener when the component unmounts
			unsubscribe();
		};
	}, [list.id]);// This effect will re-run whenever the list.id changes

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
								deleteDocById();
								closeModal();
							}}
						>
							<AntDesign name="delete" size={24} color={lightenColor(listData?.color, 0.4)} />
						</TouchableOpacity>
					</View>

					<View style={styles.viewRecipeButtonContainer}>
						<TouchableOpacity
							style={styles.viewRecipeButton}
							onPress={() => {
								setShowRecipeDescription(!showRecipeDescription);
								setRecipeDescription(listData?.description || "");
							}}
						>
							<FontAwesome name="book" size={20} color="#26ACA7" />
							<Text style={styles.viewRecipeButtonText}>View Recipe</Text>
						</TouchableOpacity>
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
						<Text style={styles.title}>{listData?.recipeName}</Text>
					</View>
				</View>

				<View style={[styles.section, { flex: 7, marginVertical: 16 }]}>
					{showRecipeDescription ? (
						<View style={styles.recipeDescription}>
							<Text style={styles.recipeDescriptionText}>{recipeDescription}</Text>
						</View>
					) : (
						<FlatList
							data={listData?.ingredients}
							renderItem={renderItem}
							keyExtractor={(item, index) => index.toString()}
							contentContainerStyle={{ paddingHorizontal: 32 }}
							showsVerticalScrollIndicator={false}
						/>
					)}
				</View>

				<KeyboardAvoidingView style={[styles.section, styles.footer]} behavior="padding">
					<TextInput style={[styles.input, { borderColor: list.color }]} placeholder="Add new item..." onChangeText={setNewItem} value={newItem} />

					<TouchableOpacity style={[styles.addButton, { backgroundColor: list.color }]} onPress={addNewItem}>
						<AntDesign name="plus" size={16} color={colors.white} />
					</TouchableOpacity>

					<Modal transparent={false} animationType="slide" visible={showModal} onRequestClose={() => setShowModal(false)}>
						{/* Change addList to addShoppingList */}
						<EditRecipeModal closeModal={() => setShowModal(false)} addList={editList} data={listData} />
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
		fontSize: 22,
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
	viewRecipeButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: colors.green,
		borderRadius: 10,
		padding: 15,
		marginTop: 10,
	},
	viewRecipeButtonContainer: {
		alignItems: "center",
		marginTop: 10, // Adjust the spacing as needed
	},
	recipeDescriptionText: {
		color: colors.black,
		fontSize: 16,
		padding: 3
	},
});

export default RecipeView;
