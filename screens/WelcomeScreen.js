import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, ScrollView, Linking, ImageBackground } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import colors from "../component/Colors";

export function WelcomeScreen(props) {
	
	const navigation = useNavigation();

	const [showModal, setShowModal] = useState(false);
	// added ScrollView to enable access to lower buttons

	//assets
	const linkedinLogo = require("../assets/linkedin.png");
	const profilePicture = require("../assets/lioProfileSmall.png");
	const bg = require("../assets/bg3.jpg");

	// link to my website/Linkedin
	const linkedinProfileUrl = "https://www.linkedin.com/in/lionel-coevoet-961b64275/?originalSubdomain=au";
	const myPortfolioUrl = "https://www.lionelportfolio.com/";

	
	const handleLinkedInPress = async () => {
		const supported = await Linking.canOpenURL(linkedinProfileUrl);
		if (supported) {
			await Linking.openURL(linkedinProfileUrl);
		}
	};

	const handlePicturePress = async () => {
		const supported = await Linking.canOpenURL(myPortfolioUrl);
		if (supported) {
			await Linking.openURL(myPortfolioUrl);
		}
	};

	return (
		
		<View style={styles.container}>
			{/* Full-screen background image */}
			<ImageBackground
				source={bg} // Replace with actual background image source
				style={styles.backgroundImage}
			>
				{/* Gardeniet text on top */}
				<View style={styles.overlay}>
					<Image style={styles.logo} resizeMode="contain" source={require("../assets/log.png")} />
					<TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Signin")}>
						<Text style={styles.buttonText}>SIGN IN</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Signup")}>
						<Text style={styles.buttonText}>SIGN UP</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.buttonAbout} onPress={() => setShowModal(true)}>
						<Text style={[styles.buttonText, { color: "white" }]}>ABOUT THE APP</Text>
					</TouchableOpacity>
				</View>
			
				<Modal
				 transparent={false} animationType="slide" visible={showModal} onRequestClose={() => setShowModal(false)}>
					<ScrollView>
					<View style={styles.modal}>
						<View style={styles.modalHeader}>
							<Text style={styles.headerTitle}>About The App</Text>
						</View>

						<Text style={styles.modalText}>
							Lionel here ! {"\n"} The application allow you to create a shopping list shared between friends and family. {"\n"}
							(When organising events such as pick-nik, birthday, camping with friends, Instead of creating list via what's app, google sheet etc... {"\n"} This App will make your life easier. //
							Everyone can be connected to the same shopping list and add, delete, add comments or update them in a real-time ) {"\n"}
							Have a try !! {"\n"} So far the application is FREE {"\n"} Thank You Click on my face if you want to know more about me !!
						</Text>
						<TouchableOpacity onPress={handlePicturePress}>
							<Image source={profilePicture} style={styles.myPictureStyle} />
						</TouchableOpacity>
						<TouchableOpacity onPress={handleLinkedInPress}>
							<Image source={linkedinLogo} style={styles.linkedinLogo} />
						</TouchableOpacity>
						<View style={styles.buttonsRow}>
							<TouchableOpacity style={styles.modalBackButton} onPress={() => setShowModal(false)}>
								<Text style={styles.modalButtonText}>BACK</Text>
							</TouchableOpacity>
						</View>
					</View>
					</ScrollView>
				</Modal>
			</ImageBackground>
		</View>
	);
}
const styles = StyleSheet.create({
	
	container: {
		flex: 1,
	},
	backgroundImage: {
		flex: 1,
		resizeMode: "cover", // You can choose 'cover', 'contain', or 'stretch'
		justifyContent: "center", // If you want to align the gardeniet text vertically, use 'center'
		alignItems: "center", // If you want to align the gardeniet text horizontally, use 'center'
	},
	overlay: {
		backgroundColor: "#00000080",
		flex: 1,
		width: "100%",
		resizeMode: "cover", // You can choose 'cover', 'contain', or 'stretch'
		justifyContent: "center", // If you want to align the gardeniet text vertically, use 'center'
		alignItems: "center", // If you want to align the gardeniet text horizontally, use 'center'
	},
	logo: {
		marginTop: "20%",
		width: "90%",
	},
	button: {
		backgroundColor: colors.white,
		width: "90%",
		marginTop: "5%",
		marginBottom: "5%",
		borderRadius: 10,
		padding: 15,
	},
	buttonAbout: {
		width: "90%",
		marginTop: "5%",
		borderRadius: 10,
		padding: 15,
		borderWidth: 1,
		borderColor: colors.white,
	},

	buttonText: {
		color: colors.black,
		textAlign: "center",
		fontSize: 15,
		fontWeight: 700,
	},
//modal styling
modalButtonText:{
	color: colors.white,
	textAlign: "center",
	fontSize: 15,
	fontWeight: 700,
},
	modal: {
		justifyContent: "center",
		alignItems: "center",
		padding: 1,
		paddingTop: 1,
		flex: 1,
		justifyContent: "start",
	},
	modalHeader: {
		backgroundColor: colors.green,
		height: 70,
		minWidth: 1600,
		marginTop: 45,
	},
	headerTitle: {
		fontSize: 40,
		marginTop: 10,
		marginBottom: 10,
		textAlign: "center",
		color: colors.orange,
		fontStyle: "italic",
		fontWeight: "bold",
		shadowOpacity: 10,
	},
	modalText: {
		textAlign: "center",
		fontSize: 20,
		marginTop: 10,
		marginBottom: 10,
		color: colors.green,
		padding:3
	},
	myPictureStyle: {
		alignItems: "center",
		alignContent: "center",
		borderRadius: 100,
		maxHeight: 200,
		maxWidth: 200,
		minHeight: 150,
		minWidth: 150,
	},
	modalBackButton: {
		backgroundColor: colors.green,
		borderRadius: 10,
		width: "90%",
		marginTop: "5%",
		marginBottom: "5%",
		padding: 15,	
	},
	linkedinLogo: {
		marginTop: 10,
		marginBottom: 10,
		width: 50,
		height: 50,
		borderRadius: 10,
		alignContent: "center",
	},
});
