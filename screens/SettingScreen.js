import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { SignOutButton } from '../component/SignOutButton'

export function SettingScreen() {

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <SignOutButton text="Sign out" />
                <Text style={styles.headerTitle}>Setting</Text>
            </View>
        </View>

    )
}
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