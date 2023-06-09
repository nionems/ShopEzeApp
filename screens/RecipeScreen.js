import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { AddRecipeModal } from "../component/AddRecipeModal";
import { RecipeDetailsModal } from '../component/RecipeDetailModal';
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
  const [selectedItem, setSelectedItem] = useState(null);

  const addRecipeList = async (recipeList) => {
    // Write the list in Firestore
    const ref = await addDoc(collection(FSdb, "recipes"), recipeList);
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
  };
  // const renderRecipeList = ({ item }) => (
  //   <View style={styles.recipeItem}>
  //     <Text style={styles.recipeName}>{item.name}</Text>
  //   </View>
  // );
  const renderRecipeList = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View style={styles.recipeItem}>
        <Text style={styles.recipeNameStyle}>{item?.recipeName}</Text>
        <Text style={styles.ingredientsStyle}>{item?.ingredients}</Text>

      </View>
    </TouchableOpacity>
  );
  

  // const RecipeDetailsModal = () => {
  //   // Use the selectedItem state to display the details in the modal
    
  //   return (
  //     // Modal content goes here
  //   );
  // };
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


  // const fetchBackgroundColor = async () => {
  //   try {
  //     const backgroundColorDocRef = doc(FSdb, 'settings', 'color');
  //     const backgroundColorSnapshot = await getDocs(backgroundColorDocRef);
  
  //     if (backgroundColorSnapshot.exists()) {
  //       const color = backgroundColorSnapshot.data().color;
  //       setBackgroundColor(color);
  //     } else {
  //       console.error('Background color document does not exist');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching background color: ', error);
  //   }
  // };
  // useEffect(() => {
  //   fetchBackgroundColor();
  // }, []);


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
          <ActivityIndicator size="large" color="black" />
   
        ) : recipeList.length > 0 ? (
          <FlatList
          data={recipeList}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={renderRecipeList}
        />
      ) : (
        <Text></Text>
        // Show empty list message
      )}
  
      {/* Render RecipeDetailsModal when a recipe item is selected */}
      {selectedItem && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={true}
          onRequestClose={() => setSelectedItem(null)}
        >
          <RecipeDetailsModal item={selectedItem} closeModal={() => setSelectedItem(null)} />
        </Modal>
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
    ingredientsStyle: {
      color: "black",
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