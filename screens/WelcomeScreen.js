import { View, Text, TouchableOpacity, StyleSheet, Image, Modal,Linking } from "react-native";
import { useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import colors from "../component/Colors";


export function WelcomeScreen(props) {

    const navigation = useNavigation()
    const [showModal, setShowModal] = useState(false)
    const linkedinLogo = require('../assets/linkedin.png');
    const profilePicture = require('../assets/lioProfile.JPG');

    const linkedinProfileUrl = 'https://www.linkedin.com/in/lionel-coevoet-961b64275/?originalSubdomain=au';
    const myPortfolioUrl ='https://www.lionelportfolio.com/';
   
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
                <TouchableOpacity style={styles.aboutButton} onPress={() => setShowModal(true)} >
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
                        <Text style={styles.modalText} >Lionel here ! {'\n'}  The application allow you to create a shopping list shared between friends and family. {'\n'}
                            (When organising events such as pick-nik, birthday, camping with friends, Instead of creating list via what's app, google sheet etc... {'\n'} This App will make your life easier.
                            Everyone can be connected to the same shopping list and add, delete, add comments or update them in a real-time ) {'\n'}
                            Have a try !!  {'\n'} So far the application is FREE  {'\n'}  Thank You
                            Click on my face if you want to know more about me !!
                        </Text>
                        {/* <Image style={styles.myPictureStyle} source={require('../assets/lioProfile.JPG')} /> */}
                        
                        <TouchableOpacity onPress={handlePicturePress}>
                            <Image source={profilePicture} style={styles.myPictureStyle} />
                        </TouchableOpacity>
                    
                       
                        <TouchableOpacity onPress={handleLinkedInPress}>
                            <Image source={linkedinLogo} style={styles.linkedinLogo} />
                        </TouchableOpacity>

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
        marginTop: 50,
    },
    modalHeader: {
        backgroundColor: colors.green,
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
        marginTop: 30,
        color: "#FD8749",
        fontStyle: "italic",
        fontWeight: "bold",
        fontSize: 20,
    },

    logostyle: {
        alignItems: "center",
        alignContent: "center",
        borderRadius: 55,
        maxHeight: 200,
        maxWidth: 200,
        minHeight: 150,
        minWidth: 150,
        borderColor: "#26ACA7",
        marginTop: 5,

    },
    myPictureStyle: {
        alignItems: "center",
        alignContent: "center",
        borderRadius: 100,
        maxHeight: 200,
        maxWidth: 200,
        minHeight: 150,
        minWidth: 150,
        borderColor: "#26ACA7",

    },
    aboutButton: {
        backgroundColor: "#FD8749",
        marginTop: 10,
        marginVertical: 15,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 10,
        padding: 10,
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
        marginTop: 10,
        marginBottom: 10,
        color: "#26ACA7"
    },

    modalBackButton: {
        backgroundColor: "#FD8749",
        marginTop: 10,
        marginVertical: 15,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 10,
        padding: 10,
    },
    linkedinLogo: {
        marginTop:10,
        marginBottom:10,
        width: 50,
        height: 50,
        borderRadius:10,
        alignContent:"center",
      },
})