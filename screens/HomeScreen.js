import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native"
import { useEffect, useContext, useState } from 'react'
import { SignOutButton } from "../component/SignOutButton";
import colors from "../component/Colors";
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from "../contexts/AuthContext";
import tempData from "../component/tempData";
import ShoppingList from "../component/ShoppingList";
import AddListModal from "../component/AddListModal";
import ListModal from "../component/ListModal";

export function HomeScreen(props) {

    const navigation = useNavigation()
    const [showModal, setShowModal] = useState(false)
    const authStatus = useContext(AuthContext)

    //if SignOut the user will be redirected to welcome screen
    useEffect(() => {
        if (!authStatus) {
            navigation.reset({ index: 0, routes: [{ name: "Welcome" }] })
        }
    }, [authStatus])

    state = {
        addToVisible: true,
        lists: tempData
    };


    renderList = list => {
        return <ShoppingList list={list} />
    }

    return (

        <View style={styles.page}>
            <View style={styles.header}>
                <SignOutButton text="Sign out" />
                <Text style={styles.headerTitle}>My Lists</Text>
                <View style={styles.container} />
                <Modal
                    transparent={false}
                    animationType="slide"
                    visible={showModal}
                    onRequestClose={() => setShowModal(false)}>
                    <AddListModal closeModal={() => setShowModal(false)} />
                </Modal>

                <View style={styles.divider} />
                <Text style={styles.title}>tobuy</Text>
                <TouchableOpacity style={styles.addList} onPress={() => setShowModal(true)}>
                    <AntDesign name="plus" size={16} />
                    <Text style={styles.add}>add list</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 275, paddingLeft: 32, marginTop: 200 }}>
                <FlatList
                    data={tempData}
                    keyExtractor={item => item.name}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => this.renderList(item)}

                />
            </View>
        </View>
    );
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
    container: {
        flex: 1,
        backgroundColor: "#ffff",
        alignItems: "center",
        justifyContent: "center",
    },
    divider: {
        backgroundColor: colors.lightBlue,
        height: 1,
        flex: 1,
        alignSelf: "center",
    },
    title: {
        alignItems: "center",
        alignContent: "center",
        textAlign: 'center',
        fontSize: 30,
    },
    addList: {
        borderWidth: 2,
        borderColor: colors.lightBlue,
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center"


    },
    add: {
        color: colors.blue,
        textAlign: "center",



    }
})