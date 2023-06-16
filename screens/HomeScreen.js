import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native"
import { useEffect, useContext, useState, state } from 'react'
import { SignOutButton } from "../component/SignOutButton";
import colors from "../component/Colors";
import { AntDesign } from '@expo/vector-icons';
import { AuthContext } from "../contexts/AuthContext";
//import tempData from "../component/tempData";
import ShoppingList from "../component/ShoppingList";
import AddListModal from "../component/AddListModal";



export function HomeScreen(props) {

    const navigation = useNavigation()
    const [showModal, setShowModal] = useState(false)
    const authStatus = useContext(AuthContext)
   
    const [addTobuyVisible, setAddTobuyVisible] = useState(false);

    const [mylist, setMylist] = useState([]); // Define mylist as a state variable

    
    

    //if SignOut the user will be redirected to welcome screen
    useEffect(() => {
        if (!authStatus) {
            navigation.reset({ index: 0, routes: [{ name: "Welcome" }] })
        }
    }, [authStatus])

    const toggleAddTodoModal = () => {
        setAddTobuyVisible(!addTobuyVisible);
      };

    // state = {
    //     addTobuyVisible: true,
    //     lists: tempData
    // };
    
    
    // renderList = list => {
    //     return <ShoppingList list={list}  />;
    // };
    
    // addList = list =>{
    //     this.setState({ lists:[...this.state.lists,{ ...list, id: this.state.lists.length +1, tobuy:[] }] });
    // };

    const ListsScreen = () => {
        const [lists, setLists] = useState([]);
      
        useEffect(() => {
          // Read the lists from Firebase
          firebase
            .database()
            .ref('lists')
            .on('value', snapshot => {
              const data = snapshot.val();
              const listArray = Object.values(data);
              setLists(listArray);
            });
        }, []);
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
                    <AddListModal closeModal={() => setShowModal(false)}/> 
                    {/* <AddListModal closeModal={() => setShowModal(false)} addList={this.addList} /> */}
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
      data={lists}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Text>{item.name}</Text>
      )}
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
}