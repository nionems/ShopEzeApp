import { useContext, useState } from "react";
import {View,Text,StyleSheet,KeyboardAvoidingView,TouchableOpacity,TextInput} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../component/Colors";
import { AuthContext } from "../contexts/AuthContext";

export function AddRecipeModal(props) {

    const [recipeName, setRecipeName] = useState()
    const [color, setColor] = useState()
    const backgroundColors = ["#26ACA7", "#24A6D9", "#757572", "#8022D9", "#D159D8", "#D85963", "#c5d16d"]
    const ListOwner = useContext( AuthContext )
    const [ingredients , setIngredients]= useState("")

    const createRecipe = () => {
     
        props.addRecipeList({
            recipeName: recipeName, 
            color: color, 
            owner: ListOwner.uid,
            collaborators: [ ListOwner.uid ],
            ingredients: ingredients
            
        })
        props.closeModal()
    }
    const Colors = backgroundColors.map( ( color ) => {
        return (
            <TouchableOpacity
                key={color}
                style={[styles.colorSelect, { backgroundColor: color }]}
                onPress={() => setColor(color) }
            />
        )
    })

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <TouchableOpacity style={{ position: "absolute", top: 64, right: 32 }} onPress={props.closeModal}>
                <AntDesign name="close" size={24} color={colors.black} />
            </TouchableOpacity>

            <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
                <Text style={styles.title}>Create A Recipe</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Recipe Name?"
                    onChangeText={text => setRecipeName(text) }
                />
                <TextInput
                    style={styles.inputDetails}
                    placeholder="Recipe Ingredient?"
                    onChangeText={text => setIngredients(text) }
                />


                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
                    {Colors}
                </View>

                <TouchableOpacity
                    style={[styles.create, { backgroundColor: color }]}
                    onPress={() => createRecipe() }
                >
                    <Text style={{ color: "#f0aa86" , fontWeight: "1600",fontSize:24 }}>Create!</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
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
        fontSize: 38,
        fontWeight: "800",
        color: "#26ACA7",
        alignItems:"center",
        alignSelf:"center",
        marginBottom:10,
       // shadowOpacity:10,
     
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FD8749",
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#26ACA7",
        borderRadius: 6, 
        fontSize: 18,
        backgroundColor:"#f0aa86",
        textAlign:"center",
        minHeight:30,
        minWidth:350,
    },
    inputDetails: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#26ACA7",  
        borderRadius:6,
        marginTop:5,
        minHeight:350,
        minWidth:350,
        fontSize: 20,
        backgroundColor: "#f0aa86",
        textAlign:"center",
        alignItems:"center",
        
    },
    create: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },
    colorSelect: {
        width: 30,
        height: 30,
        borderRadius: 4
    },
    
});




// export default class AddListModal extends React.Component {
//     backgroundColors = ["#5CD859", "#24A6D9", "#595BD9", "#8022D9", "#D159D8", "#D85963", "#D88559"];

//     state = {
//         name: "",
//         color: this.backgroundColors[0]
//     };

//     createList = () => {
//         const { name, color } = this.state;

//         const list = { name, color };
//         this.props.addList(list);

//         this.setState({ name: "" });
//         this.props.closeModal();
//     };

//     renderColors() {
//         return this.backgroundColors.map(color => {
//             return (
//                 <TouchableOpacity
//                     key={color}
//                     style={[styles.colorSelect, { backgroundColor: color }]}
//                     onPress={() => this.setState({ color })}
//                 />
//             );
//         });
//     }

//     render() {
//         return (
//             <KeyboardAvoidingView style={styles.container} behavior="padding">
//                 <TouchableOpacity style={{ position: "absolute", top: 64, right: 32 }} onPress={this.props.closeModal}>
//                     <AntDesign name="close" size={24} color={colors.black} />
//                 </TouchableOpacity>

//                 <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
//                     <Text style={styles.title}>Create A List</Text>

//                     <TextInput
//                         style={styles.input}
//                         placeholder="List Name?"
//                         onChangeText={text => this.setState({ name: text })}
//                     />

//                     <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
//                         {this.renderColors()}
//                     </View>

//                     <TouchableOpacity
//                         style={[styles.create, { backgroundColor: this.state.color }]}
//                         onPress={this.createList}
//                     >
//                         <Text style={{ color: colors.white, fontWeight: "600" }}>Create!</Text>
//                     </TouchableOpacity>
//                 </View>
//             </KeyboardAvoidingView>
//         );
//     }
// }



// import React from "react";
// import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from "react-native";
// import { AntDesign } from "@expo/vector-icons";
// import colors from "../component/Colors";

// export default class AddListModal extends React.Component {
//     backgroundColors = ["#5CD859", "#24A6D9", "#595BD9", "#8022D9", "#D159D8", "#D85963", "#D88559"];

//     state = {
//         name: "",
//         color: this.backgroundColors[0]
//     };

//     createList = () => {
//         const { name, color } = this.state;

//         const list = { name, color };
//         this.props.addList(list);

//         this.setState({ name: "" });
//         this.props.closeModal();
//     };

//     renderColors() {
//         return this.backgroundColors.map(color => {
//             return (
//                 <TouchableOpacity
//                     key={color}
//                     style={[styles.colorSelect, { backgroundColor: color }]}
//                     onPress={() => this.setState({ color })}
//                 />
//             );
//         });
//     }

//     render() {
//         return (
//             <KeyboardAvoidingView style={styles.container} behavior="padding">
//                 <TouchableOpacity style={{ position: "absolute", top: 64, right: 32 }} onPress={this.props.closeModal}>
//                     <AntDesign name="close" size={24} color={colors.black} />
//                 </TouchableOpacity>

//                 <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
//                     <Text style={styles.title}>Create A List</Text>

//                     <TextInput
//                         style={styles.input}
//                         placeholder="List Name?"
//                         onChangeText={text => this.setState({ name: text })}
//                     />

//                     <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
//                         {this.renderColors()}
//                     </View>

//                     <TouchableOpacity
//                         style={[styles.create, { backgroundColor: this.state.color }]}
//                         onPress={this.createList}
//                     >
//                         <Text style={{ color: colors.white, fontWeight: "600" }}>Create!</Text>
//                     </TouchableOpacity>
//                 </View>
//             </KeyboardAvoidingView>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor:"lightgrey",
        
//     },
//     title: {
//         fontSize: 28,
//         fontWeight: "800",
//         color: colors.black,
//         alignSelf: "center",
//         marginBottom: 16
//     },
//     input: {
//         borderWidth: StyleSheet.hairlineWidth,
//         borderColor: colors.blue,
//         borderRadius: 6,
//         height: 50,
//         marginTop: 8,
//         paddingHorizontal: 16,
//         fontSize: 18
//     },
//     create: {
//         marginTop: 24,
//         height: 50,
//         borderRadius: 6,
//         alignItems: "center",
//         justifyContent: "center"
//     },
//     colorSelect: {
//         width: 30,
//         height: 30,
//         borderRadius: 4
//     }
// });
