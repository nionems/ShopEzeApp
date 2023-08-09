import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Modal } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "./Colors";
import { doc, addDoc, deleteDoc, arrayRemove, arrayUnion, updateDoc, onSnapshot } from "firebase/firestore";
import { FSContext } from "../contexts/FSContext";
import { v4 as uuidv4 } from "uuid";
import { useNavigation } from "@react-navigation/native";
import { EditRecipeModal } from "./EditRecipeModal";

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
	console.log("list", list);
	const [listItems, setListItems] = useState([]);
	const [listData, setListData] = useState(list);
	const [showModal, setShowModal] = useState(false);
	const [newItem, setNewItem] = useState("");

	const FSdb = useContext(FSContext);

	const addNewItem = () => {
		if (newItem.trim() !== "") {
			const toAdd = { title: newItem, id: uuidv4() };
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

	const updateItemStatus = async (listId, itemId, newStatus) => {
		const listRef = doc(FSdb, "lists", listId);
		await updateDoc(listRef, {
			listItems: listData.listItems.map((item) => {
				if (item.id === itemId) {
					return { ...item, status: newStatus };
				}
				return item;
			}),
		});
	};

	const editList = async (update) => {
		console.log("toeud", list);
		updateTitleAndColor(list.id, update);
	};
	const updateTitleAndColor = async (listId, update) => {
		const listRef = doc(FSdb, "recipes", listId);
		await updateDoc(listRef, update);
	};

	const deleteDocById = async () => {
		try {
			// Assuming you have the correct reference to your Firestore database
			const docRef = doc(FSdb, "recipes", list.id);
			await deleteDoc(docRef);
			console.log("Document deleted successfully.");
		} catch (error) {
			console.error("Error deleting document:", error);
		}
	};
	const renderItem = ({ item, index }) => (
		<View style={styles.itemContainer}>
			<View style={{ flexDirection: "row", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
				<View style={{ width: 15, height: 15, borderRadius: 10, backgroundColor: lightenColor(listData?.color, 0.1) }}></View>
				<Text style={styles.itemText}>{item.title}</Text>
			</View>
			<TouchableOpacity onPress={() => removeListItem(list.id, item)}>
				<AntDesign name="delete" size={24} color={lightenColor(listData?.color, 0.4)} />
			</TouchableOpacity>
		</View>
	);

	useEffect(() => {
		const documentRef = doc(FSdb, "recipes", list.id);
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
								deleteDocById();
								closeModal();
							}}
						>
							<AntDesign name="delete" size={24} color={lightenColor(listData?.color, 0.4)} />
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
					<FlatList
						data={listData?.ingredients}
						renderItem={renderItem}
						keyExtractor={(item, index) => index.toString()}
						contentContainerStyle={{ paddingHorizontal: 32 }}
						showsVerticalScrollIndicator={false}
					/>
				</View>
             
                
                <KeyboardAvoidingView
				 style={[styles.section, styles.footer]} behavior="padding">
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
		// backgroundColor: "pink",
	},
	header: {
		justifyContent: "flex-end",
		marginLeft: 64,
		borderBottomWidth: 3,
	},
	title: {
		fontSize: 30,
		fontWeight: "800",
		color: "black",
		// backgroundColor: "yellow",
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
		fontWeight: "700",
		fontSize: 16,
		marginLeft: 16,
	},
});

export default RecipeView;
