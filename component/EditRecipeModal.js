import { useContext, useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "./Colors";
import { AuthContext } from "../contexts/AuthContext";
import { ScrollView } from "react-native-gesture-handler";

export function EditRecipeModal({ addList, closeModal, data }) {
	console.log("rp", data);
	const [recipeName, setRecipeName] = useState(data?.recipeName);
	const [description, setDescription] = useState(data?.description);
	const [color, setColor] = useState(data?.color);
	const backgroundColors = ["#26ACA7", "#24A6D9", "#757572", "#8022D9", "#D159D8", "#D85963", "#c5d16d"];
	const ListOwner = useContext(AuthContext);
	const [showListModal, setShowListModal] = useState(false);

	const createList = () => {
		addList({
			recipeName: recipeName,
			description: description,
			color: color,
		});
		closeModal();
		setShowListModal(true);
	};

	const Colors = backgroundColors.map((color) => {
		return <TouchableOpacity key={color} style={[styles.colorSelect, { backgroundColor: color }]} onPress={() => setColor(color)} />;
	});

	return (

		<KeyboardAvoidingView style={styles.container} behavior="padding">
			<TouchableOpacity style={{ position: "absolute", top: 64, right: 32 }}
				onPress={closeModal}>
				<AntDesign name="close" size={24} color={colors.black} />
			</TouchableOpacity>

			<View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
				<Text style={styles.title}>! Edit Your Recipe !</Text>
				<TextInput style={styles.input}
					placeholder="Recipe Name?"
					value={recipeName}
					onChangeText={(text) => setRecipeName(text)}
				/>
				<TextInput style={styles.input2}
					multiline placeholder="Recipe Ingredient?"
					value={description}
					onChangeText={(text) => setDescription(text)}
				/>
				<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>{Colors}</View>

				{recipeName !== "" && description !== "" && color !== "" && (
					<TouchableOpacity style={[styles.create, { backgroundColor: color }]} onPress={() => createList()}>
						<Text style={{ color: "#f0aa86", fontSize: 24 }}>UPDATE</Text>
					</TouchableOpacity>
				)}
			</View>
		</KeyboardAvoidingView>

	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.turquoise,
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
		textAlign: "center"
	},
	input2: {
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: colors.green,
		borderRadius: 6,
		height: 300, // Adjust the height as needed
		marginTop: 8,
		paddingHorizontal: 16,
		paddingVertical: 16, // Adjust the padding vertically
		fontSize: 15,
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

