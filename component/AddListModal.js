import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput,Button } from "react-native";
import { AntDesign } from '@expo/vector-icons'
import colors from "../component/Colors";
//import tempData from "./tempData";

export default class AddListModal extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            listName: '',
          };
        }
      
        createList = () => {
          const { listName } = this.state;
          const { navigation } = this.props;
      
          // Create a new list in Firebase
          firebase
            .database()
            .ref('lists')
            .push({
              name: listName,
            })
            .then(() => {
              // Navigate to the screen where you want to display the lists
              navigation.navigate('ListsScreen');
            })
            .catch(error => {
              console.log('Error creating list:', error);
            });
        }
      
        render() {
          return (
            <>
              <TextInput
                placeholder="Enter List Name"
                onChangeText={text => this.setState({ listName: text })}
              />
              <Button title="Create List" onPress={this.createList} />
            </>
          );
        }
      }
    
    // backgroundColor = ["#26ACA7", "#FD8749", "#D85963", "#D88559", "#5CD859", "#595BD9"]
    
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //       name: '',
    //       color: '',
    //     };
    //   }
    // state = {
    //     name: "",
    //     color: this.backgroundColor[0],
    // };
    // const App = () => {
    //     const [listData, setListData] = useState([]);
      
    //     useEffect(() => {
    //       const fetchData = async () => {
    //         const db = firebase.firestore();
    //         const data = await db.collection("lists").get();
    //         setListData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //       };
    //       fetchData();
    //     }, []);
      
    // createList = () => {
    //      const { name, color } = useState([]);
    //     // useEffect(() => {
    //     //           const fetchData = async () => {
    //     //             const db = firebase.firestore();
    //     //             const data = await db.collection("lists").get();
    //     //             setListData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //     //           };
    //     //           fetchData();
    //     //         }, []);

    //     mylist.push({
    //         name,
    //         color,
    //         tobuy: []

    //     });
    //     this.setState({ name: "" })
    //     this.props.closeModal();
    // };
//     createList = () => {
//         const newList = {
//           name: 'My List',
//           items: ['Item 1', 'Item 2', 'Item 3'],
//         };
    
//         // Add the new list to the state
//         this.setState(prevState => ({
//           myLists: [...prevState.myLists, newList],
//         }));
//       }

//     renderColors() {

//         const { myLists } = this.state;

//         return this.backgroundColor.map(color => {
//             return (
//                 <TouchableOpacity
//                     key={color}
//                     style={[styles.colorSelect, { backgroundColor: color }]}
//                     onPress={() => this.setState({ color })} />
//             )
//         })
//     }
//     render() {
//         return (
//             <KeyboardAvoidingView style={styles.container} behavior="padding">
//                 <TouchableOpacity style={{ position: "absolute", top: 64, right: 32 }} onPress={this.props.closeModal}>
//                     <AntDesign name="close" size={24} color="red" />
//                 </TouchableOpacity>
//                 <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
//                     <Text style={styles.title}>Create a List </Text>
                    
//                     <TextInput
//                         style={styles.input}
//                         placeholder="List name"
//                         onChangeText={text => this.setState({ name: text })}
//                     />

//                     <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
//                         {this.renderColors()}
//                     </View>
//                     <TouchableOpacity
//                         style={[styles.create, { backgroundColor: this.state.color }]}
//                         onPress={this.createList}>
//                         <Text style={{ color: colors.white, fontWeight: "600" }}>Create!</Text>
//                     </TouchableOpacity>
//                 </View>
//             </KeyboardAvoidingView>
//         )
//     }
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center"
//     },
//     title: {
//         fontSize: 28,
//         fontWeight: "800",
//         color: "blue",
//         alignSelf: "center",
//         marginBottom: 16
//     },
//     input: {
//         borderWidth: StyleSheet.hairlineWidth,
//         borderColor: "red",
//         borderRadius: 40,
//         marginTop: 8,
//         paddingHorizontal: 16,
//         fontSize: 18,
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
 ////    }
 //});

