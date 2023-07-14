import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard } from "react-native";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import colors from "./Colors";
import { Swipeable } from "react-native-gesture-handler";
import { Animated } from "react-native";


    export const RecipeDetailsModal = ({ item, onUpdate, onDelete ,closeModal }) => {
        const [newRecipeName, setNewRecipeName] = useState(item.recipeName);
        const [newRecipeIngredients, setNewRecipeIngredients] = useState(item.recipeIngredients);
        const backgroundColors = ["#26ACA7", "#24A6D9", "#757572", "#8022D9", "#D159D8", "#D85963", "#c5d16d"]
        const [color, setColor] = useState()


        const Colors = backgroundColors.map( ( color ) => {
            return (
                <TouchableOpacity
                    key={color}
                    style={[styles.colorSelect, { backgroundColor: color }]}
                    onPress={() => setColor(color) }
                />
            )
        })

        const handleUpdate = () => {
          // Call the onUpdate function with the updated recipe name
          onUpdate(item.id, newRecipeName);
        };
      
        const handleDelete = () => {
          // Call the onDelete function with the recipe ID
          onDelete(item.id);
        };
      
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
          {/* <View style={styles.container}> */}
               <TouchableOpacity style={{ position: "absolute", top: 64, right: 32 }} onPress={closeModal}>
                <AntDesign name="close" size={24} color={colors.black} />
            </TouchableOpacity>
            <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>   
            <Text style={styles.title}>Recipe Details</Text>
            <TextInput
              style={styles.input}
              value={newRecipeName}
              onChangeText={setNewRecipeName}
            />
             <TextInput
              style={styles.input}
              value={newRecipeIngredients}
              onChangeText={setNewRecipeIngredients}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
                    {Colors}
                </View>
            <TouchableOpacity 
             style={[styles.create, { backgroundColor: color }]}
             onPress={handleUpdate}>
            <Text style={{ color: "#f0aa86" , fontWeight: "1600",fontSize:24 }}>Update Recipe</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalDeleteButton} 
             onPress={handleDelete}>
            <Text style={{ color: "#f0aa86" , fontWeight: "1600",fontSize:24 }}>Delete Recipe</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => {}}>
            <Text style={{ color: "#f0aa86" , fontWeight: "1600",fontSize:24 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
        );
      };
      

const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "lightgrey",
//   },
  section: {
    flex: 1,
    alignSelf: "stretch",
  },
  header: {
    justifyContent: "flex-end",
    marginLeft: 64,
    borderBottomWidth: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "black",
  },
  
  footer: {
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
  },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"#f0aa86",
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.black,
        alignSelf: "center",
        marginBottom: 16
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.blue,
        borderRadius: 6,
        height: 50,
        marginTop: 8,
        paddingHorizontal: 16,
        fontSize: 18
    },
    create: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },
    modalButton: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"#FD8749",
    },
    modalDeleteButton: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"red",
    },
    colorSelect: {
        width: 30,
        height: 30,
        borderRadius: 4,
    },
    modalButtonText:{
        color:"#78cfcb",
    }
});







