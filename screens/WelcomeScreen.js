import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from "react-native";
import { useState } from 'react'
import { useNavigation } from "@react-navigation/native";

export function WelcomeScreen(props) {

    const navigation = useNavigation()
    const [showModal, setShowModal] = useState(false)

    return (
        <View>
            <View style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Shop Eze</Text>
                </View>
                <Image style={styles.logostyle} source={require('../assets/logo.png')} />

                <Text style={styles.sloganText}>Shop Together, Faster, Cheaper </Text>
            </View>
            <View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Signin")}>
                    <Text style={styles.buttonText}>SIGN IN</Text>

                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Signup")}>
                    <Text style={styles.buttonText}>SIGN UP</Text>

                </TouchableOpacity>
                <TouchableOpacity style={styles.Aboutbutton} onPress={() => setShowModal(true)} >
                    <Text style={styles.buttonText}>ABOUT THE APP</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.screen}>
                <Modal
                    transparent={false}
                    animationType="slide"
                    visible={showModal}
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.headerTitle}>About The App</Text>
                        </View>
                        <Image style={styles.logostyle} source={require('../assets/logo.png')} alt="logo" />
                        <Text style={styles.modalText} >Lionel here ! {'\n'}  The application allow you to create a shopping list shared between friends and family. {'\n'}
                            (When organising events such as pick-nick, birthday, camping with friends, Instead of creating list via what's app, google sheet etc... {'\n'} This App will make your life easier.
                            Everyone can be connected to the same shopping list and add, delete, add comments or update them in a real-time ) {'\n'}
                            Have a try !!  {'\n'} So far the application is FREE  {'\n'}  Thank You
                        </Text>
                        <View style={styles.buttonsRow}>
                            <TouchableOpacity
                                style={styles.modalBackButton}
                                onPress={() => setShowModal(false)}>
                                <Text style={styles.buttonText} >BACK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({

   
    page: {
        justifyContent: "top",
        alignItems: "center",
    },
    header: {
        backgroundColor: "#26ACA7",
        height: 70,
        minWidth: 400,
    },
    modalHeader: {
        backgroundColor: "#26ACA7",
        height: 70,
        minWidth: 400,
        marginTop: 45,
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
        alignItems: "center",
        alignContent: "center",
        borderRadius: 70,
        maxHeight: 200,
        maxWidth: 200,
        minHeight: 20,
        minWidth: 20,
        borderColor: "#26ACA7",

    },
    Aboutbutton: {
        marginTop: 20,
        backgroundColor: "#26ACA7",
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        marginLeft: 10,
        marginVertical: 15,
    },
    button: {
        backgroundColor: "#26ACA7",
        marginTop: 10,
        marginVertical: 15,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 10,
        padding: 10,
    },
    buttonText: {
        color: "#ffffff",
        textAlign: "center",
        fontSize: 20,
    },
    screen: {
        justifyContent: "center",
    },

    modal: {
        justifyContent: "center",
        alignItems: "center",
        padding: 1,
        paddingTop: 1,
        flex: 1,
        justifyContent: "start",
    },
    modalText: {
        textAlign: "center",
        fontSize: 20,
        marginTop: 30,
        marginBottom: 10,
        color: "#26ACA7"
    },
    modalBackButton: {
        backgroundColor: "#26ACA7",
        marginTop: 5,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 50,
        padding: 10,
    },
    // buttonsRow: {
    //     flexDirection: "row",
    //     marginVertical: 10,
    // },
})