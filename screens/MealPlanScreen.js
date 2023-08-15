import React, { useState, useEffect, useContext } from "react";
import { Text, View, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableOpacity, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import colors from "../component/Colors";
import { SelectList } from "react-native-dropdown-select-list";
import { FSContext } from "../contexts/FSContext";
import { doc, updateDoc, arrayUnion, collection, getDocs, onSnapshot, query, where, arrayRemove } from "firebase/firestore";
import { AuthContext } from "../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

const { width } = Dimensions.get("window");

export function MealPlanScreen(props) {
	const ListOwner = useContext(AuthContext);
	const FSdb = useContext(FSContext);
	const [user, setUser] = useState(null);

	const [meal, setMeal] = useState("");
	const [ingredient, setIngredient] = useState("");
	const [selectedDate, setSelectedDate] = useState("");
	const [ingredientsByDate, setIngredientsByDate] = useState({});
	const [recipeList, setRecipeList] = useState([]);
	const [loading, setLoading] = useState(true); // Add loading state

	const [selectedType, setSelectedType] = useState("");
	const [selectedRecipe, setSelectedRecipe] = useState("");

	const types = [
		{ key: "1", value: "BreakFast" },
		{ key: "2", value: "Lunch" },
		{ key: "3", value: "Dinner" },
	];
	useEffect(() => {
		setMeal("");
		setIngredient("");
	}, [selectedDate]);

	const handleAddIngredient = () => {
		const updatedIngredients = { ...ingredientsByDate };

		if (updatedIngredients[selectedDate]) {
			updatedIngredients[selectedDate].push({ meal, ingredient });
		} else {
			updatedIngredients[selectedDate] = [{ meal, ingredient }];
		}

		setIngredientsByDate(updatedIngredients);
		console.log("Adding ingredient:", { meal, ingredient, selectedDate });
		setMeal("");
		setIngredient("");
	};

	const handleDateSelect = (day) => {
		setSelectedDate(day.dateString);
	};

	// const handleUpdateEvent = (index) => {
	//   const selectedEvent = ingredientsByDate[selectedDate][index];
	//   setMeal(selectedEvent.meal);
	//   setIngredient(selectedEvent.ingredient);

	// };

	const handleDeleteEvent = (index) => {
		// Implement logic to handle event deletion
		const updatedIngredients = { ...ingredientsByDate };
		updatedIngredients[selectedDate].splice(index, 1);
		setIngredientsByDate(updatedIngredients);
		console.log("Deleting event:", ingredientsByDate[selectedDate][index]);
	};

	const renderIngredientsForDate = () => {
		if (!selectedDate || user == null) {
			return null;
		}

		return user[0].mealPlans
			.filter((item) => item.date === selectedDate)
			.map((item, index) => (
				<View key={index} style={styles.ingredientContainer}>
					<Text style={styles.mealText}>Meal: {item.recipe.recipeName}</Text>
					<Text style={styles.mealText}>Type: {item.mealType}</Text>
					<Text style={styles.mealText}>ingredients</Text>
					{item?.recipe?.ingredients?.map((ing, index) => (
						<Text style={styles.ingredientText}>{ing.title}</Text>
					))}
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.buttonDelete} onPress={() => removeMeal(item)}>
							<Text style={styles.buttonText}>DELETE</Text>
						</TouchableOpacity>
					</View>
				</View>
			));
	};
	const findUserByID = async () => {
		try {
			setLoading(true);
			const userAuthCollectionRef = collection(FSdb, "userAuth");
			const q = query(userAuthCollectionRef, where("id", "==", ListOwner.uid));

			// Subscribe to real-time updates using onSnapshot
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				if (querySnapshot.empty) {
					console.log("User not found.");
					setUser(null); // Clear user data if user is not found
				} else {
					const userData = querySnapshot.docs.map((doc) => {
						const data = doc.data();
						return { did: doc.id, ...data };
					});
					console.log("userData", userData);
					setUser(userData);
				}

				setLoading(false);
			});

			// Return the unsubscribe function to stop listening when needed
			return unsubscribe;
		} catch (error) {
			console.error("Error finding user by id:", error);
			throw error;
		}
	};

	const fetchRecipeList = async () => {
		try {
			const recipeCollectionRef = collection(FSdb, "recipes");
			const unsubscribe = onSnapshot(recipeCollectionRef, (snapshot) => {
				const updatedShoppingList = snapshot.docs
					.map((doc) => {
						const data = doc.data();
						const myRecipes = data.owner == ListOwner?.uid;
						return myRecipes ? { key: doc.id, value: data.recipeName, data: data } : null;
					})
					.filter(Boolean); // Remove null values from the array
				console.log(updatedShoppingList);
				setRecipeList(updatedShoppingList);
			});

			return () => {
				unsubscribe();
			};
		} catch (error) {
			console.error("Error fetching recipe list: ", error);
		}
	};

	const addMeal = async () => {
		const newItem = {
			id: uuidv4(),
			recipe: recipeList.filter((item) => item.key === selectedRecipe)[0].data,
			mealType: selectedType,
			date: selectedDate,
		};
		console.log(newItem);
		const userRef = doc(FSdb, "userAuth", user[0].did);

		// Update the list document to add the new item to the listItems array
		await updateDoc(userRef, {
			mealPlans: arrayUnion(newItem),
		});
	};

	const removeMeal = async (item) => {
		console.log("delte", item);
		// Get a reference to the document of the list in Firestore
		const listRef = doc(FSdb, "userAuth", user[0].did);

		// Use the 'updateDoc' function to remove the specified item from the 'listItems' array
		await updateDoc(listRef, {
			mealPlans: arrayRemove(item),
		});
	};

	useEffect(() => {
		findUserByID();
		fetchRecipeList();
	}, []);
	return (
		<KeyboardAvoidingView style={styles.container} behavior="padding">
			<ScrollView contentContainerStyle={styles.scrollViewContent}>
				<View style={styles.innerContainer}>
					<View style={styles.page}>
						<View style={styles.header}>
							<Text style={styles.headerTitle}>Meal Plan</Text>
						</View>
						<Text style={styles.instruction}>Select a date, then enter a meal and ingredient</Text>
					</View>

					<Calendar style={styles.calendar} onDayPress={handleDateSelect} markedDates={{ [selectedDate]: { selected: true } }} />
					<View style={{ backgroundColor: "white", width: "100%", padding: "5%" }}>
						<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
							<Text style={styles.lableText}>Date</Text>
							<Text style={styles.selectedDate}>{selectedDate ? new Date(selectedDate).toDateString() : ""}</Text>
						</View>
						<View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: "5%", alignItems: "center" }}>
							<Text style={styles.lableText}>Recipe</Text>
							<SelectList boxStyles={{ width: 200 }} dropdownStyles={{ width: 200 }} setSelected={(val) => setSelectedType(val)} data={types} save="value" />
						</View>
						<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
							<Text style={styles.lableText}>Meal Type</Text>
							<SelectList boxStyles={{ width: 200, marginTop: 20 }} dropdownStyles={{ width: 200 }} setSelected={(val) => setSelectedRecipe(val)} data={recipeList} save="key" />
						</View>

						<TouchableOpacity style={styles.button} onPress={addMeal}>
							<Text style={styles.buttonText}>Add Meal</Text>
						</TouchableOpacity>
					</View>
					{!loading && <View>{renderIngredientsForDate()}</View>}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	innerContainer: {
		width: width * 0.9, // Adjust the width to your preference
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	selectedDate: {
		fontSize: 18,
		color: colors.green,
	},
	lableText: {
		fontSize: 14,
		fontWeight: 600,
	},
	ingredientContainer: {
		width: "100%",
		marginVertical: 10,
		backgroundColor: "white",
	},
	ingredientText: {
		fontSize: 20,
		marginBottom: 0,
		color: colors.orange,
		textAlign: "center",
	},
	mealText: {
		fontSize: 20,
		marginBottom: 0,
		color: colors.green,
		textAlign: "center",
	},
	header: {
		backgroundColor: colors.green,
		height: 70,
		minWidth: 1400,
	},
	headerTitle: {
		fontSize: 40,
		marginTop: 10,
		textAlign: "center",
		color: colors.orange,
		shadowOpacity: 10,
		fontStyle: "italic",
		fontWeight: "bold",
	},
	calendar: {
		marginBottom: 10,
		backgroundColor: colors.white,
		width: width * 0.9, // Adjust the width as needed
		aspectRatio: 1, // This will maintain a square aspect ratio for the calendar
		height: 350, // Adjust the height as needed
	},
	page: {
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 60,
	},
	input: {
		width: "80%",
		height: 40,
		borderWidth: 1,
		borderColor: colors.green,
		marginTop: 3,
		marginBottom: 3,
		paddingHorizontal: 10,
		borderRadius: 10,
		fontSize: 20,
		textAlign: "center",
	},
	buttonText: {
		color: colors.white,
		textAlign: "center",
		fontSize: 20,
	},
	button: {
		backgroundColor: colors.green,
		width: "100%",
		marginTop: "5%",
		marginBottom: "5%",
		borderRadius: 10,
		padding: 15,
	},
	buttonDelete: {
		backgroundColor: colors.orange,
		width: "80%",
		marginTop: "5%",
		marginBottom: "5%",
		borderRadius: 10,
		padding: 15,
		alignContent: "center",
		alignItems: "center",
		marginLeft: 30,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 0,
	},
	instruction: {
		fontSize: 20,
		textAlign: "center",
		color: colors.black,
		padding: "1%",
	},
});
