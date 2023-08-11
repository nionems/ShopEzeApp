import { useContext, useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../component/Colors";
import { AuthContext } from "../contexts/AuthContext";

export function AddRecipeModal(props) {
	const [recipeName, setRecipeName] = useState("");
	const [description, setDescription] = useState("");

	const [color, setColor] = useState("");
	const backgroundColors = ["#26ACA7", "#24A6D9", "#757572", "#8022D9", "#D159D8", "#D85963", "#c5d16d"];
	const ListOwner = useContext(AuthContext);

	const createRecipe = () => {
		props.addRecipeList({
			recipeName: recipeName,
			color: color,
			owner: ListOwner.uid,
			description: description,
		});
		props.closeModal();
	};
	const Colors = backgroundColors.map((color) => {
		return <TouchableOpacity key={color} style={[styles.colorSelect, { backgroundColor: color }]} onPress={() => setColor(color)} />;
	});

	return (
		<KeyboardAvoidingView style={styles.container} behavior="padding">
			<TouchableOpacity style={{ position: "absolute", top: 64, right: 32 }} onPress={props.closeModal}>
				<AntDesign name="close" size={24} color={colors.black} />
			</TouchableOpacity>

			<View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
				<Text style={styles.title}>! Add Your Recipe !</Text>

				<TextInput style={styles.input} placeholder="Recipe Name" onChangeText={(text) => setRecipeName(text)} />
				<TextInput style={styles.input2} multiline placeholder="Recipe Description" onChangeText={(text) => setDescription(text)} />

				<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>{Colors}</View>

				{recipeName !== "" && description !== "" && color !== "" && (
					<TouchableOpacity style={[styles.create, { backgroundColor: color }]} onPress={() => createRecipe()}>
						<Text style={{ color: "#f0aa86", fontWeight: "1600", fontSize: 24 }}>Create!</Text>
					</TouchableOpacity>
				)}
			</View>
		</KeyboardAvoidingView>
	);
}
const styles = StyleSheet.create({
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
		fontSize: 28,
		fontWeight: "800",
		color: colors.black,
		alignSelf: "center",
		marginBottom: 16,
	},

	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
	},
	input: {
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: colors.green,
		borderRadius: 6,
		height: 50,
		marginTop: 8,
		paddingHorizontal: 16,
		fontSize: 18,
	},
	input2: {
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: colors.green,
		borderRadius: 6,
		height: 300, // Adjust the height as needed
		marginTop: 8,
		paddingHorizontal: 16,
		paddingVertical: 16, // Adjust the padding vertically
		fontSize: 18,
		
	  },
	inputDetails: {
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "#26ACA7",
		borderRadius: 6,
		marginTop: 5,
		minHeight: 350,
		minWidth: 350,
		fontSize: 20,
		backgroundColor: "#f0aa86",
		textAlign: "center",
		alignItems: "center",
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
