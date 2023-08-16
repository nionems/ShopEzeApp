import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { AddRecipeModal } from "../component/AddRecipeModal";
import { AntDesign } from "@expo/vector-icons";
import { addDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import RecipeView from "../component/RecipeView";
import colors from "../component/Colors";

//context
import { AuthContext } from "../contexts/AuthContext";
import { FSContext } from "../contexts/FSContext";

export function RecipeScreen(props) {
	const [recipe, setRecipe] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const ListOwner = useContext(AuthContext);

	const FSdb = useContext(FSContext);
	const [recipeList, setRecipeList] = useState([]);
	const [showListModal, setShowListModal] = useState(false);
	const [loading, setLoading] = useState(true); // Add loading state
	const [selectedItem, setSelectedItem] = useState(null);

	const addRecipeList = async (recipeList) => {
		// Write the list in Firestore
		const ref = await addDoc(collection(FSdb, "recipes"), recipeList);
	};

	const handleItemPress = (item) => {
		setSelectedItem(item);
	};

	const renderRecipeList = ({ item }) => (
		<TouchableOpacity onPress={() => handleItemPress(item)}>
			<View style={[styles.recipeItem, { backgroundColor: item.color }]}>
				<Text style={styles.recipeNameStyle}>{item?.recipeName}</Text>
				{/* <Text style={styles.ingredientsStyle}>{item?.description}</Text> */}
			</View>
		</TouchableOpacity>
	);

	const fetchRecipeList = async () => {
		try {
			const recipeCollectionRef = collection(FSdb, "recipes");
			const querySnapshot = await getDocs(recipeCollectionRef);
			const fetchedRecipeList = querySnapshot.docs
				.map((doc) => {
					const data = doc.data();
					const myRecipes = data.owner == ListOwner?.uid;
					return myRecipes ? { id: doc.id, ...data } : null;
				})
				.filter(Boolean); // Remove null values from the array

			setRecipeList(fetchedRecipeList);
			setLoading(false);
			console.log(fetchedRecipeList);

			const unsubscribe = onSnapshot(recipeCollectionRef, (snapshot) => {
				const updatedShoppingList = snapshot.docs
					.map((doc) => {
						const data = doc.data();
						const myRecipes = data.owner == ListOwner?.uid;
						return myRecipes ? { id: doc.id, ...data } : null;
					})
					.filter(Boolean); // Remove null values from the array

				setRecipeList(updatedShoppingList);
			});

			// Clean up the listener when the component unmounts
			return () => {
				unsubscribe();
			};
		} catch (error) {
			console.error("Error fetching recipe list: ", error);
		}
	};

	useEffect(() => {
		fetchRecipeList();
	}, []);

	return (
		<ScrollView>
			<View>
				<View style={styles.header}>
					<View style={styles.headerLeft}></View>
					<Text style={styles.headerTitle}>My Recipes</Text>
				</View>
				<Modal transparent={false} animationType="slide" visible={showModal} onRequestClose={() => setShowModal(false)}>
					<AddRecipeModal closeModal={() => setShowModal(false)} addRecipeList={addRecipeList} />
				</Modal>
				<View style={styles.divider} />
				<Text style={styles.title}></Text>
				<TouchableOpacity style={styles.addRecipeList} onPress={() => setShowModal(true)}>
					<AntDesign name="plus" color={"white"} size={24} />
					<Text style={styles.add}>add Recipe</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.divider} />
			{loading ? (
				<ActivityIndicator size="large" color="black" />
			) : recipeList.length > 0 ? (
				<FlatList data={recipeList}
					keyExtractor={(item) => item.id.toString()}
					horizontal={false}
					showsHorizontalScrollIndicator={false}
					renderItem={renderRecipeList} />
			) : (
				<Text style={styles.emptyMessageText}> You don't have any recipes yet. {"\n"}
					Tap the "Add Recipe" button above to get started! </Text>
				// Show empty list message
			)}
			{/* Render RecipeDetailsModal when a recipe item is selected */}
			{selectedItem && (
				<Modal transparent={true} animationType="slide" visible={true} onRequestClose={() => setSelectedItem(null)}>
					<RecipeView list={selectedItem} closeModal={() => setSelectedItem(null)} />
				</Modal>
			)}
		</ScrollView>
	);
}
const styles = StyleSheet.create({
	page: {
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		backgroundColor: colors.green,
		marginTop: 60,
		height: 70,
		minWidth: 400,
	},
	headerTitle: {
		fontSize: 40,
		marginTop: 10,
		textAlign: "center",
		color: colors.orange,
		fontStyle: "italic",
		fontWeight: "bold",
		shadowOpacity: 10,
	},
	divider: {
		backgroundColor: colors.black,
		height: 1,
		flex: 1,
		alignSelf: "center",
	},
	title: {
		alignItems: "center",
		alignContent: "center",
		textAlign: "center",
		fontSize: 30,
	},
	addRecipeList: {
		borderRadius: 10,
		marginLeft: 30,
		marginRight: 30,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.green,
		shadowOpacity: 10,
		marginTop: "2%",
		marginBottom: "5%",
	},
	add: {
		color: "white",
		textAlign: "center",
		fontSize: 20,
		shadowOpacity: 10,
	},
	recipeItem: {
		padding: 10,
		marginHorizontal: 5,
		marginTop: 10,
		justifyContent: "center",
		alignItems: "center",
		shadowOpacity: 10,
		width: 100, // Adjust the width as needed
		minWidth: 380,
		minHeight: 50,
	},
	recipeNameStyle: {
		color: colors.white,
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
		shadowOpacity: 10,
	},
	ingredientsStyle: {
		color: colors.white,
		fontSize: 15,
	},
	emptyMessageContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 100, // Adjust the marginTop as needed
	},
	emptyMessageText: {
		fontSize: 20,
		textAlign: 'center',
		color: colors.black,
		padding: "5%"
	},
});
