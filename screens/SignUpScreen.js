import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView,Alert } from "react-native";
import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { doc, addDoc, collection, setDoc, onSnapshot, getDocs } from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";

//context
import { AuthContext } from "../contexts/AuthContext";
import { FBAuthContext } from "../contexts/FBAuthContext";
import { FSContext } from "../contexts/FSContext";
import colors from "../component/Colors";

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
	const [showModal, setShowModal] = useState(false);

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
		if (FBauth && FBauth.emailVerified) {
		  navigation.reset({ index: 0, routes: [{ name: "Home" }] });
		}
	  }, [FBauth]);


	  

	const signupHandler = async (useremail, userpassword) => {
		try {
		  // Create user account using Firebase Authentication
		  const res = await createUserWithEmailAndPassword(FBauth, useremail, userpassword);
		  const user = res.user;
		  console.log("User created:", user.uid);
	  
		  // Send email verification to the user
		  await sendEmailVerification(user);
	  
		  console.log("Email verification sent to the user.");
	  
		  // Add user details to the userAuth collection in Firestore
		  const userDetails = {
			email: user.email,
			id: user.uid,
		  };
	  
		  // Replace 'userAuth' with your desired collection name in Firestore
		  const ref = await addDoc(collection(FSdb, "userAuth"), userDetails);
	  
		  console.log("User details added to Firestore.");

		  // Show a message to the user
		  Alert.alert(
			"Email Verification",
			"An email verification link has been sent to your email address. Please check your inbox and follow the instructions to verify your email.",
			[{ text: "OK", onPress: () => setShowModal(false) }]
		  );
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

					<Text style={styles.SignUptext}>SIGN UP</Text>
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
						<Text style={styles.buttonText}>SIGN UP</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.signInLink} onPress={() => navigation.navigate("Signin")}>
						<Text style={styles.signInLinkText}>ALREADY HAVE AN ACCOUNT SIGN IN</Text>
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
		backgroundColor: colors.green,
		height: 70,
		minWidth: 1500,
		marginTop: 50,
	},
	headerTitle: {
		fontSize: 40,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        color: colors.orange,
        fontStyle: "italic",
        fontWeight: "bold",
		shadowOpacity: 10,
	},
	sloganText: {
		fontSize: 15,
        textAlign: 'center',
        marginTop: 5,
        color: colors.orange,
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
        marginBottom: 10,
	},
	SignUptext: {
		textAlign: 'center',
        color: colors.green,
        marginTop: 2,
        marginBottom: 10,
        fontSize: 20,
  	
	},
	inputGroup: {
        padding: 1,
        textAlign: "center",
    },
	input: {
        paddingVertical: 10,
        backgroundColor: colors.white,
        padding: 4,
        borderWidth: 1,
        borderColor: colors.green,
        borderRadius: 10,
        marginBottom: 10,
        fontSize: 20
    },

	validInput: {
		borderColor: colors.green,
		borderWidth: 1,
		backgroundColor: colors.white,
		padding: 5,
		borderRadius:10,
		fontSize:20
	
	},
	buttonDisabled: {
		backgroundColor: colors.grey,
		marginVertical: 5,
		borderRadius: 10,
		padding: 10,
	},
	button: {
		backgroundColor: colors.green,
		width: "90%",
		marginTop: "5%",
		marginBottom: "5%",
		borderRadius: 10,
		padding: 15,
	},
    buttonText: {
        color: colors.white,
        textAlign: "center",
		fontSize: 20,
		fontWeight: 300,
    },
	signInLink: {
		backgroundColor: colors.green,
		width: "90%",
		marginTop: "5%",
		marginBottom: "5%",
		borderRadius: 10,
		padding: 15,
		
	},
	signInLinkText: {
		textAlign: "center",
		color: colors.white,
		fontSize: 17,
	},
	
	
	inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // Center the content horizontally
        borderColor: colors.green,
        marginBottom: 10,
		fontSize: 20,
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

