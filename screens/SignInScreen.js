import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView } from "react-native";
import { useEffect, useState, useContext } from 'react'
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../contexts/AuthContext";

export function SignInScreen(props) {

    const [email, setEmail] = useState("")
    const [validEmail, setValidEmail] = useState(false)
    const [password, setPassword] = useState("")
    const [validPassword, setValidPassword] = useState(false)
    const [validForm, setValidForm] = useState(false)

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
                <Text style={styles.SignIntext}> Sign In </Text>

                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="enter your email here "
                        value={email}
                        onChangeText={(emailText) => setEmail(emailText)}
                    />
                </View>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="password 8 character minimum"
                        value={password}
                        onChangeText={(pwText) => setPassword(pwText)}
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity
                    style={(validForm) ? styles.button : styles.buttonDisabled}
                    disabled={(validForm) ? false : true}
                    onPress={() => props.handler(email, password)}
                >
                    <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.signInLink}
                    onPress={() => navigation.navigate("Signup")}
                >
                    <Text style={styles.signInLinkText}>Don't have an account? Sign up</Text>
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
        marginTop:50,
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
        marginTop: 20,
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
        marginTop: 20,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: "bold",
    },
    inputGroup: {
        padding: 1,
        textAlign: "center",
    },
    input: {
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
    buttonDisabled: {
        backgroundColor: "#666666",
        marginVertical: 5,
        borderRadius: 50,
        padding: 10,
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
})