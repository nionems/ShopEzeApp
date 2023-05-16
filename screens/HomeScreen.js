import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"
import { useEffect, useContext } from 'react'
import { SignOutButton } from "../component/SignOutButton";

import { AuthContext } from "../contexts/AuthContext";

export function HomeScreen(props) {

    const navigation = useNavigation()

    const authStatus = useContext(AuthContext)

    //if SignOut the user will be redirected to welcome screen
    useEffect(() => {
        if (!authStatus) {
            navigation.reset({ index: 0, routes: [{ name: "Welcome" }] })
        }
    }, [authStatus])

    return (

        <View style={styles.page}>
            <View style={styles.header}>
                <SignOutButton text="Sign out" />
                <Text style={styles.headerTitle}>My Lists</Text>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    page: {
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        backgroundColor: "#26ACA7",
        marginTop: 50,
        height: 70,
        minWidth: 400,
    },
    headerTitle: {
        fontSize: 40,
        textAlign: 'center',
        color: "#FD8749",
        fontStyle: "italic",
        fontWeight: "bold"
    },
})