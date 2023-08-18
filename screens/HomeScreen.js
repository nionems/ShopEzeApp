import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useContext, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { addDoc, collection, onSnapshot, getDocs } from "firebase/firestore";
import colors from "../component/Colors";

//component
import { SignOutButton } from "../component/SignOutButton";
import { ListModal } from "../component/ListModal";
import { AddListModal } from "../component/AddListModal";

//context
import { AuthContext } from "../contexts/AuthContext";
import { FSContext } from "../contexts/FSContext";


export function HomeScreen(props) {

	const navigation = useNavigation();
	const ListOwner = useContext(AuthContext);
	const authStatus = useContext(AuthContext);
	const FSdb = useContext(FSContext);
	const [showModal, setShowModal] = useState(false);
	const [addTobuyVisible, setAddTobuyVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [shoppingList, setShoppingList] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [showListCreatedMessage, setShowListCreatedMessage] = useState(false);

	console.log("current user", ListOwner?.uid);
	const handleItemPress = (item) => {
		setSelectedItem(item);
	};

	const addList = async (list) => {
		// https://firebase.google.com/docs/firestore/manage-data/add-data?hl=en&authuser=0
		// write the list in Firestore
		const ref = await addDoc(collection(FSdb, "lists"), list);
	};

	const fetchShoppingList = async () => {
		try {
			const listCollectionRef = collection(FSdb, "lists");
			const querySnapshot = await getDocs(listCollectionRef);

			const fetchedShoppingList = querySnapshot.docs
				.map((doc) => {
					const data = doc.data();
					const collaborators = data.collaborators || []; // Handle the case where collaborators is undefined
					const isYourIdInCollaborators = collaborators.includes(ListOwner?.uid);

					// Return null if your ID is not in the collaborators array, otherwise return the data
					return isYourIdInCollaborators ? { id: doc.id, ...data } : null;
				})
				.filter(Boolean); // Remove null values from the array

			setShoppingList(fetchedShoppingList);
			setLoading(false);
			console.log(fetchedShoppingList);

			// Listen for real-time updates
			const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
				const updatedShoppingList = snapshot.docs
					.map((doc) => {
						const data = doc.data();
						const collaborators = data.collaborators || []; // Handle the case where collaborators is undefined
						const isYourIdInCollaborators = collaborators.includes(ListOwner?.uid);

						return isYourIdInCollaborators ? { id: doc.id, ...data } : null;
					})
					.filter(Boolean); // Remove null values from the array

				setShoppingList(updatedShoppingList);
			});

			// Clean up the listener when the component unmounts
			return () => {
				unsubscribe();
			};
		} catch (error) {
			console.error("Error fetching shopping list: ", error);
		}
	};

	useEffect(() => {
		fetchShoppingList();
	}, []);

	const renderShoppingList = ({ item }) => {
		const totalCount = item.listItems?.length;
	  
		// Count items where the status is true
		const trueStatusCount = item.listItems?.reduce((count, item) => count + (item.status ? 1 : 0), 0);
	  
		return (
		  <TouchableOpacity onPress={() => handleItemPress(item)}>
			<View style={styles.centeredListItem}>
			  <View style={[styles.listItem, { backgroundColor: item.color }]}>
				<Text style={styles.nameStyle}>{item?.name}</Text>
				{totalCount > 0 && (
				  <Text style={styles.stats}>
					{trueStatusCount} / {totalCount}
				  </Text>
				)}
			  </View>
			</View>
		  </TouchableOpacity>
		);
	  };
	  

	useEffect(() => {
		if (!authStatus) {
			navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
		}
	}, [authStatus]);

	const toggleAddTodoModal = () => {
		setAddTobuyVisible(!addTobuyVisible);
	};

	return (
		// <ScrollView>
		<View>
			<View>
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						<SignOutButton />
					</View>
					<View style={styles.headerTitleContainer}>
						<Text style={styles.headerTitle}>My List</Text>
					</View>
					<View style={styles.headerRight}></View>
				</View>
				<Modal transparent={false} animationType="slide" visible={showModal} onRequestClose={() => setShowModal(false)}>
					{/* Change addList to addShoppingList */}
					<AddListModal closeModal={() => setShowModal(false)} addList={addList} />
				</Modal>

				<View style={styles.divider} />
				<TouchableOpacity style={styles.addList} onPress={() => setShowModal(true)}>
					<AntDesign name="plus" color={"white"} size={24} />
					<Text style={styles.add}>add list</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.divider} />
			{loading ? (
				<ActivityIndicator size="large" color="black" />
			) :

				shoppingList.length > 0 ? (
					<FlatList
						data={shoppingList}
						keyExtractor={(item) => item.id.toString()}
						horizontal={false}
						showsHorizontalScrollIndicator={false}
						renderItem={renderShoppingList} />
				) : (
					<Text style={styles.emptyMessageText}> You don't have any lists yet. {"\n"}
						Tap the "Add List" button above to get started! </Text>
					// Show empty list message
				)}

			{/* Render RecipeDetailsModal when a recipe item is selected */}
			{selectedItem && (
				<Modal
					transparent={true}
					animationType="slide"
					horizontal={true}
					visible={true}
					onRequestClose={() => setSelectedItem(null)}>
					<ListModal
						list={selectedItem}
						closeModal={() => {
							console.log("rec");
							setSelectedItem(null);
						}}
					/>
				</Modal>
			)}
		{/* </ScrollView> */}
		</View>
	);
}
const styles = StyleSheet.create({

	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: colors.green,
		marginTop: 60,
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
	divider: {
		backgroundColor: colors.black,
		height: 1,
		flex: 1,
		alignSelf: "center",
	},
	addList: {
		borderRadius: 10,
		marginLeft: 30,
		marginRight: 30,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.green,
		shadowOpacity: 10,
		marginTop: "5%",
		marginBottom: "5%",
	},
	add: {
		color: colors.white,
		textAlign: "center",
		fontSize: 20,
		shadowOpacity: 10,
	},
	listItem: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
		marginHorizontal: 5,
		marginTop: 10,
		shadowOpacity: 0.5,
		width: 100, // Adjust the width as needed
		minWidth: 380,
		minHeight: 70,
	  },
	  centeredListItem: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	  },
	  

	nameStyle: {
		color: colors.white,
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
		shadowOpacity: 10,
	},
	stats: {
		marginTop: '1%',
		color: colors.white,
		fontSize: 15,
		fontWeight: "bold",
		textAlign: "center",
		shadowOpacity: 10,
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
