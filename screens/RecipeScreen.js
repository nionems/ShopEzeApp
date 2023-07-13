import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, FlatList } from "react-native";

import { useEffect, useContext, useState } from 'react';
import { AddRecipeModal } from "../component/AddRecipeModal";
import { AntDesign } from '@expo/vector-icons';
import colors from "../component/Colors";
import { doc, addDoc, collection, setDoc, getDocs, error } from "firebase/firestore"
//context
import { AuthContext } from "../contexts/AuthContext";
import { FSContext } from "../contexts/FSContext";


export function RecipeScreen(props) {

    const [recipe, setRecipe] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const authStatus = useContext(AuthContext);
    const FSdb = useContext(FSContext);
    const [recipeList, setRecipeList] = useState([]);
    const [showListModal, setShowListModal] = useState(false);



    const addRecipeList = async (recipeList) => {
        // https://firebase.google.com/docs/firestore/manage-data/add-data?hl=en&authuser=0
        // write the list in Firestore
        const ref = await addDoc(collection(FSdb, "recipes"), recipeList)
    }

    // const addRecipeToList = (newRecipe) => {
    //     setRecipeList((prevList) => [...prevList, newRecipe]);
    //   };

    // const renderList = ({ item }) => (
    //     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    //         {/* <View style={styles.recipeItem}> */}
    //             <Text style={styles.recipeName}>{item.name}</Text>
    //             {/* <Text style={styles.recipeDescription}>{item.description}</Text> */}
    //         {/* </View> */}
    //     </ScrollView>
    // );

    const renderRecipeList = ({ item }) => (
        <View style={styles.recipeItem}>
            <Text style={styles.recipeName}>{item.name}</Text>
            {/* <Text style={styles.recipeDescription}>{item.description}</Text> */}
        </View>
    );




    const fetchRecipeList = async () => {
        try {
            const querySnapshot = await getDocs(collection(FSdb, 'recipes'));
            const fetchedRecipeList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRecipeList(fetchedRecipeList);
            console.log(fetchedRecipeList);
        } catch (error) {
            console.error('Error fetching recipe list: ', error);
        }
    };

    useEffect(() => {
        fetchRecipeList();
    }, []);



    return (
        <ScrollView>
            <View>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                    </View>
                    <Text style={styles.headerTitle}>My Recipes</Text>
                </View>
                <Modal
                    transparent={false}
                    animationType="slide"
                    visible={showModal}
                    onRequestClose={() => setShowModal(false)}
                >
                    <AddRecipeModal
                        closeModal={() => setShowModal(false)}
                        addRecipeList={addRecipeList} />
                </Modal>

                <View style={styles.divider} />
                <Text style={styles.title}></Text>
                <TouchableOpacity style={styles.addRecipeList} onPress={() => setShowModal(true)}>
                    <AntDesign name="plus" color={"white"} size={24} />
                    <Text style={styles.add}>add recipe</Text>
                </TouchableOpacity>
            </View>

            {/* <View style={{ height: 200, paddingHorizontal: 32, marginTop: 32 }}> */}
            <View style={styles.divider} />
                <FlatList
                    data={recipeList}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderRecipeList}
                />
            {/* </View> */}
        </ScrollView>
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
        marginTop: 10,
        textAlign: 'center',
        color: "#FD8749",
        fontStyle: "italic",
        fontWeight: "bold"
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
    addRecipeList: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        marginLeft: 30,
        marginRight: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FD8749",
    },
    add: {
        color: "white",
        textAlign: "center",
        fontSize: 20,
    },
    recipeItem: {
        backgroundColor: colors.lightBlue,
        padding: 20,
        marginHorizontal: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: 200, // Adjust the width as needed
    },
    recipeName: {
        color: colors.black,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
})