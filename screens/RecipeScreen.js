import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { AddRecipeModal } from "../component/AddRecipeModal";
import { AntDesign } from '@expo/vector-icons';
import colors from "../component/Colors";
import { doc, addDoc, collection, setDoc, getDocs, error,onSnapshot } from "firebase/firestore"
//context
import { AuthContext } from "../contexts/AuthContext";
import { FSContext } from "../contexts/FSContext";

export function RecipeScreen(props) {
  const [recipe, setRecipe] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const authStatus = useContext(AuthContext);
  const FSdb = useContext(FSContext);
  const [recipeList, setRecipeList] = useState([]);
  const [showListModal, setShowListModal] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const addRecipeList = async (recipeList) => {
    // Write the list in Firestore
    const ref = await addDoc(collection(FSdb, "recipes"), recipeList);
  };

  // const renderRecipeList = ({ item }) => (
  //   <View style={styles.recipeItem}>
  //     <Text style={styles.recipeName}>{item.name}</Text>
  //   </View>
  // );
  const renderRecipeList = ({ item }) => (
    <View style={styles.recipeItem}>
      <Text style={styles.recipeNameStyle}>{item?.recipeName }</Text>
    </View>
  );
  const fetchRecipeList = async () => {
    try {
      const recipeCollectionRef = collection(FSdb, 'recipes');
      const querySnapshot = await getDocs(recipeCollectionRef);
      const fetchedRecipeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipeList(fetchedRecipeList);
      setLoading(false);
      console.log(fetchedRecipeList);

      // Listen for real-time updates
      const unsubscribe = onSnapshot(recipeCollectionRef, (snapshot) => {
        const updatedRecipeList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipeList(updatedRecipeList);
      });

      // Clean up the listener when the component unmounts
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('Error fetching recipe list: ', error);
    }
  };
  

  useEffect(() => {
    fetchRecipeList();
  }, []);

  // const render = (loading) => {
  //   if (loading) {
  //     return (
  //       <View style={styles.container}>
  //         <ActivityIndicator size="large" color={colors.blue} />
  //       </View>
  //     );
  //   }
  //   // Add code to handle the case when loading is false
  //   // You can return a different component or null, depending on your requirements
  //   return null;
  // };

  return (
    <ScrollView>
      <View>
        <View style={styles.header}>
          <View style={styles.headerLeft}></View>
          <Text style={styles.headerTitle}>My Recipes</Text>
        </View>
        <Modal
          transparent={false}
          animationType="slide"
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <AddRecipeModal closeModal={() => setShowModal(false)} addRecipeList={addRecipeList} />
        </Modal>
        <View style={styles.divider} />
        <Text style={styles.title}></Text>
        <TouchableOpacity style={styles.addRecipeList} onPress={() => setShowModal(true)}>
          <AntDesign name="plus" color={"white"} size={24} />
          <Text style={styles.add}>add recipe</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      {loading ? (
        // <View style={styles.container}>
          <ActivityIndicator size="large" color="black" />
        // </View>
   
        ) : recipeList.length > 0 ? (
        <FlatList
          data={recipeList}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={renderRecipeList}
        />
        ) : (
            <View style={styles.container}>
          </View>
      )}
    </ScrollView>
  );
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
    divider: {
        backgroundColor: "black",
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
        backgroundColor: "#26ACA7",
        padding: 20,
        marginHorizontal: 10,
        marginTop:100,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: 100, // Adjust the width as needed
        minWidth:200,
        minHeight:200,
    },
    recipeNameStyle: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    // container: {
    //     flex: 1,
    //     backgroundColor: "green",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     minWidth:150,
    //     minHeight:400,

    // },
})