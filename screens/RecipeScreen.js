import { View, Text, StyleSheet,Modal } from "react-native";
//import { useEffect, useContext, useState } from 'react'








export function RecipeScreen(props) {



   

    
    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Recipes</Text>
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
        marginTop: 10,
        textAlign: 'center',
        color: "#FD8749",
        fontStyle: "italic",
        fontWeight: "bold"
    },
})