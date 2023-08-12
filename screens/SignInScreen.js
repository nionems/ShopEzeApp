import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView } from "react-native";
import { useEffect, useState, useContext } from 'react'
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";
import { FontAwesome } from "@expo/vector-icons";

export function SignInScreen(props) {

    const [email, setEmail] = useState("")
    const [validEmail, setValidEmail] = useState(false)
    const [password, setPassword] = useState("")
    const [validPassword, setValidPassword] = useState(false)
    const [validForm, setValidForm] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation()

    const authStatus = useContext(AuthContext)

    useEffect(() => {
        if (email.indexOf('@') > 0) {
            setValidEmail(true)
        }
        else {
            setValidEmail(false)
        }
    }, [email])

    useEffect(() => {
        if (password.length >= 8) {
            setValidPassword(true)
        }
        else {
            setValidPassword(false)
        }
    }, [password])

    useEffect(() => {
        if (validEmail && validPassword) {
            setValidForm(true)
        }
        else {
            setValidForm(false)
        }
    })

    useEffect(() => {
        if (authStatus) {
            // navigate adds a back arrow to the header
            // navigation.navigate("Home")
            // reset will make "Home" the root page of the navigation
            navigation.reset({ index: 0, routes: [{ name: "Home" }] })
        }
    }, [authStatus])

    return (
        <KeyboardAvoidingView>
            <ScrollView>
                <View style={styles.page}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Shop Eze</Text>
                    </View>
                    <Image style={styles.logostyle} source={require('../assets/logo.png')} alt="logo" />
                    <Text style={styles.sloganText}> Shop Together, Faster, Cheaper  </Text>
                    <Text style={styles.sloganText}>Hi ! How are you ? going Shopping ? </Text>
                    <Text style={styles.SignIntext}> SIGN IN </Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder=" Please enter your email here!  "
                            value={email}
                            onChangeText={(emailText) => setEmail(emailText)}
                        />
                        <FontAwesome name="envelope" size={20} color="#26ACA7" style={styles.icon} />
                    </View>
                    <View>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Password 8 character minimum"
                                value={password}
                                onChangeText={(pwText) => setPassword(pwText)}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity style={styles.iconContainer} onPress={() => setShowPassword(!showPassword)}>
                                <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#26ACA7" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={(validForm) ? styles.button : styles.buttonDisabled}
                        disabled={(validForm) ? false : true}
                        onPress={() => props.handler(email, password)}
                    >
                        <Text style={styles.buttonText}>SIGN IN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.signInLink}
                        onPress={() => navigation.navigate("Signup")}
                    >
                        <Text style={styles.signInLinkText}>DON'T HAVE AN ACCOUNT SIGN UP</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
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
    SignIntext: {
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
        fontSize:20
    },

    validInput: {
        borderColor: "#00693e",
        borderWidth: 1,
        backgroundColor: "#ffffff",
    },
    
    button: {
		backgroundColor: "#26ACA7",
		width: "90%",
		marginTop: "5%",
		marginBottom: "5%",
		borderRadius: 10,
		padding: 15,
	},
    buttonText: {
        color: "#ffffff",
        textAlign: "center",
		fontSize: 20,
		fontWeight: 700,
    },
    buttonDisabled: {
        backgroundColor: "#666666",
        marginVertical: 5,
        borderRadius: 10,
        padding: 10,
    },
    signInLink: {
        backgroundColor: "#26ACA7",
		width: "90%",
		marginTop: "5%",
		marginBottom: "5%",
		borderRadius: 10,
		padding: 15,
       
    },
    signInLinkText: {
        textAlign: "center",
        color: "white",
        fontSize: 17,
    },
    // inputContainer: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     borderBottomWidth: 1,
    //     borderColor: "#26ACA7",
    //     marginBottom: 10,
    //   },
    //     inputContainer: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     justifyContent: "center", // Center the content horizontally
    //     borderBottomWidth: 1,
    //     borderColor: "#26ACA7",
    //     marginBottom: 10,
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
})