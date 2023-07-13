import { View, Text, StyleSheet,Modal,ScrollView,TouchableOpacity } from "react-native";
import { useEffect, useContext, useState } from 'react';
import {AddRecipeModal} from"../component/AddRecipeModal";
import { AntDesign } from '@expo/vector-icons';
import colors from "../component/Colors";
import { doc, addDoc, collection, setDoc } from "firebase/firestore"
//context
import { AuthContext } from "../contexts/AuthContext";
import { FSContext } from "../contexts/FSContext";




export function RecipeScreen(props) {

const [recipe, setRecipe] = useState([]);
const [showModal, setShowModal] = useState(false)
const authStatus = useContext(AuthContext);
const FSdb = useContext(FSContext);

const addRecipeList = async (list) => {
    // https://firebase.google.com/docs/firestore/manage-data/add-data?hl=en&authuser=0
    // write the list in Firestore
   const ref = await addDoc( collection( FSdb, "recipes"), list )
}

    
return (
    <ScrollView>
         <View>
         <View style={styles.header}>
             <View style={styles.headerLeft}>
                 {/* <SignOutButton /> */}
             </View>
             <Text style={styles.headerTitle}>My Recipes</Text>
             </View>
             <Modal
                 transparent={false}
                 animationType="slide"
                 visible={showModal}
                 onRequestClose={() => setShowModal(false)}
                 >
                 <AddRecipeModal closeModal={() => setShowModal(false)} addRecipeList={addRecipeList}  />
             </Modal>

            <View style={styles.divider} />
            <Text style={styles.title}></Text>
            <TouchableOpacity style={styles.addRecipeList} onPress={() => setShowModal(true)}>
                <AntDesign name="plus" color={"white"} size={24} />
                <Text style={styles.add}>add recipe</Text>
            </TouchableOpacity>
        </View>

        <View style={{ height: 275, paddingLeft: 32, marginTop: 200 }}>
            
            <FlatList
                data={lists}
                keyExtractor={(item) => item.id.toString()} // Use a unique key for each item
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (<ShoppingList list={item} updateList={updateList} />)}
                keyboardShouldPersistTaps="always"  
            />
        </View>
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
        marginLeft:30,
        marginRight:30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "FD8749",
},
        add: {
            color: "white",
            textAlign: "center",
            fontSize:20,
    }
})