import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView } from "react-native";
import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, addDoc, collection, setDoc, onSnapshot, getDocs } from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";

//context
import { AuthContext } from "../contexts/AuthContext";
import { FBAuthContext } from "../contexts/FBAuthContext";
import { FSContext } from "../contexts/FSContext";

export function SignUpScreen(props) {
	// create constant to create user
	const [email, setEmail] = useState("");
	const [validEmail, setValidEmail] = useState(false);
	const [password, setPassword] = useState("");
	const [validPassword, setValidPassword] = useState(false);
	const [validForm, setValidForm] = useState(false);
	const [error, setError] = useState("");
	const FSdb = useContext(FSContext);
	const navigation = useNavigation();
	const [showPassword, setShowPassword] = useState(false);

	//declare context
	const authStatus = useContext(AuthContext);
	const FBauth = useContext(FBAuthContext);

	//validation for email
	useEffect(() => {
		if (email.indexOf("@") > 0) {
			setValidEmail(true);
		} else {
			setValidEmail(false);
		}
	}, [email]);

	//validation for lenght of password if less than 8 letter or number it won't be accepted
	useEffect(() => {
		if (password.length >= 8) {
			setValidPassword(true);
		} else {
			setValidPassword(false);
		}
	}, [password]);

	// if both email and password meet requirement then the button to sign up will be enabled
	useEffect(() => {
		if (validEmail && validPassword) {
			setValidForm(true);
		} else {
			setValidForm(false);
		}
	}, [validEmail, validPassword]);

	// if a user is authentificate the user will be redirected to home
	useEffect(() => {
		if (authStatus) {
			// navigate adds a back arrow to the header
			// navigation.navigate("Home")
			// reset will make "Home" the root page of the navigation
			navigation.reset({ index: 0, routes: [{ name: "Home" }] });
		}
	}, [authStatus]);

	// MOVED SIGN UP HANDLER HERE
	// const signupHandler = (useremail, userpassword) => {
	// 	console.log(FBauth);
	// 	// create user account
	// 	createUserWithEmailAndPassword(FBauth, email, password)
	// 		.then((res) => {
	// 			console.log(res.user);
	// 			const user = res.user;
	// 			console.log("User created:", user.uid);

	// 			// Add user details to the userAuth collection in Firestore
	// 			const userDetails = {
	// 				email: user.email,
	// 				id: user.uid,
	// 			};
	// 			console.log(userDetails);
	// 				const ref = await addDoc(collection(FSdb, "userAuth"), userDetails);
	// 			// Replace 'userAuth' with your desired collection name in Firestore
	// 			// await firestore.collection("userAuth").doc(user.uid).set(userDetails);
	// 		})
	// 		.catch((error) => setError(error.message));
	// };

	const signupHandler = async (useremail, userpassword) => {
		try {
			// Create user account using Firebase Authentication
			const res = await createUserWithEmailAndPassword(FBauth, email, password);
			const user = res.user;
			console.log("User created:", user.uid);

			// Add user details to the userAuth collection in Firestore
			const userDetails = {
				email: user.email,
				id: user.uid,
			};

			console.log(userDetails);

			// Replace 'userAuth' with your desired collection name in Firestore
			const ref = await addDoc(collection(FSdb, "userAuth"), userDetails);

			console.log("User details added to Firestore.");
		} catch (error) {
			console.error("Error creating user or adding user details:", error);
		}
	};

	return (
		<KeyboardAvoidingView>
			<ScrollView>
				<View style={styles.page}>
					<View style={styles.header}>
						<Text style={styles.headerTitle}>Shop Eze</Text>
					</View>
					<Image style={styles.logostyle} source={require("../assets/logo.png")} alt="logo" />

					<Text style={styles.sloganText}> Shop Together, Faster, Cheaper </Text>
					{error !== "" && <Text style={styles.errorText}>{error}</Text>}
					<Text style={styles.sloganText}> Try Us For FREE !! </Text>

					<Text style={styles.SignUptext}>Sign Up</Text>
					<View style={styles.inputContainer}>
						<TextInput
							style={validEmail ? styles.validInput : styles.input}
							placeholder="Please enter your email here!"
							value={email}
							onChangeText={(emailText) => setEmail(emailText)}
						/>
						<FontAwesome name="envelope" size={20} color="#26ACA7" style={styles.icon} />
					</View>
					<View style={styles.passwordContainer}>
						<TextInput
							style={validPassword ? styles.validInput : styles.input}
							placeholder="Password 8 character minimum"
							value={password}
							onChangeText={(pwText) => setPassword(pwText)}
							secureTextEntry={!showPassword}
						/>
						<TouchableOpacity style={styles.iconContainer} onPress={() => setShowPassword(!showPassword)}>
							<FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#26ACA7" />
						</TouchableOpacity>
					</View>


					<TouchableOpacity
						style={validForm ? styles.button : styles.buttonDisabled}
						disabled={!validForm}
						//onPress={() => props.handler(email, password)}
						onPress={() => signupHandler(email, password)}
					>
						<Text style={styles.buttonText}>Sign up</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.signInLink} onPress={() => navigation.navigate("Signin")}>
						<Text style={styles.signInLinkText}>Already have an account? Sign in</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	page: {
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		backgroundColor: "#26ACA7",
		height: 70,
		minWidth: 1500,
		marginTop: 50,
	},
	headerTitle: {
		fontSize: 40,
		marginTop: 10,
		marginBottom: 10,
		textAlign: 'center',
		color: "#FD8749",
		fontStyle: "italic",
		fontWeight: "bold"
	},
	sloganText: {
		fontSize: 15,
		textAlign: 'center',
		marginTop: 5,
		color: "#FD8749",
		fontStyle: "italic",
		fontWeight: "bold",
		fontSize: 20,
	},
	logostyle: {
		marginTop: 10,
		alignItems: "center",
		alignContent: "center",
		borderRadius: 70,
		maxHeight: 200,
		maxWidth: 200,
		minHeight: 200,
		minWidth: 200,
		borderColor: "#26ACA7",
		marginBottom: 10,
	},
	SignUptext: {
		textAlign: 'center',
		color: "#26ACA7",
		marginTop: 2,
		marginBottom: 10,
		fontSize: 20,
		fontWeight: "bold",
	},
	inputGroup: {
		padding: 1,
		textAlign: "center",
	},
	input: {
		paddingVertical: 10,
		backgroundColor: "#ffffff",
		padding: 4,
		borderWidth: 1,
		borderColor: "#cccccc",
		borderRadius: 10,
		marginBottom: 10,
	},

	validInput: {
		borderColor: "#00693e",
		borderWidth: 1,
		backgroundColor: "#ffffff",
		padding: 5,
	},
	buttonDisabled: {
		backgroundColor: "#666666",
		marginVertical: 5,
		borderRadius: 50,
		padding: 10,
	},
	button: {
		backgroundColor: "#26ACA7",
		marginVertical: 10,
		marginLeft: 1,
		borderRadius: 50,
		padding: 10,
	},
	buttonText: {
		color: "#ffffff",
		textAlign: "center",
	},
	signInLink: {
		backgroundColor: "#26ACA7",
		marginTop: 10,
		marginVertical: 15,
		marginRight: 10,
		marginLeft: 10,
		borderRadius: 50,
		padding: 10,
	},
	signInLinkText: {
		textAlign: "center",
		color: "white",
	},
	errorText: {
		color: "red",
		textAlign: "center",
		//marginBottom: 100,
	},
	// inputContainer: {
	// 	flexDirection: "row",
	// 	alignItems: "center",
	// 	borderBottomWidth: 1,
	// 	borderColor: "#26ACA7",
	// 	marginBottom: 10,
	// },
	validInput: {
		// Apply your styles for valid password input
	},
	// iconContainer: {
	// 	marginLeft: 10,
	// 	alignItems: "center"
	// },
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center", // Center the content horizontally
		borderColor: "#26ACA7",
		marginBottom: 10,
	},
	icon: {
		marginLeft: 10, // Adjust this value as needed for proper spacing
	},
	passwordContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",

	},
	iconContainer: {
		marginLeft: 10, // Adjust this value as needed for proper spacing
	},

});

