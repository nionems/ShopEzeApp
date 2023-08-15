import { useContext, useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "./Colors";

//context
import { AuthContext } from "../contexts/AuthContext";

export function EditListModal({ addList, closeModal, data }) {
	console.log("rp", data.name);
	const [name, setName] = useState(data?.name);
	const [color, setColor] = useState(data?.color);
	const backgroundColors = ["#1e5a66", "#174573", "#000000", "#2e2869", "#D159D8", "#D85963", "#c5d16d"];
	const ListOwner = useContext(AuthContext);
	const [showListModal, setShowListModal] = useState(false);

	const createList = () => {
		addList({
			name: name,
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
			<TouchableOpacity style={{ position: "absolute", top: 64, right: 32 }} onPress={closeModal}>
				<AntDesign name="close" size={24} color={colors.black} />
			</TouchableOpacity>
			<View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
				<Text style={styles.title}>! Edit Your List !</Text>
				<TextInput style={styles.input} placeholder="List Name?" value={name} onChangeText={(text) => setName(text)} />
				<View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>{Colors}</View>
				<TouchableOpacity style={[styles.create, { backgroundColor: color }]} onPress={() => createList()}>
					<Text style={{ color: "#78cfcb", fontSize: 24 }}>UPDATE</Text>
				</TouchableOpacity>
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

