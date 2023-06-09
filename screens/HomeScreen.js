import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList ,ActivityIndicator} from "react-native";
import { useNavigation } from "@react-navigation/native"
import { useEffect, useContext, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import { doc, addDoc, collection, setDoc,onSnapshot,getDocs  } from "firebase/firestore"

//component
import { SignOutButton } from "../component/SignOutButton";
import colors from "../component/Colors";
import ShoppingList from "../component/ShoppingList";
import {AddListModal} from "../component/AddListModal";
import {ListModal} from "../component/ListModal";

//context
import { AuthContext } from "../contexts/AuthContext";
import { FSContext } from "../contexts/FSContext";


export function HomeScreen(props) {

    const navigation = useNavigation()

    const authStatus = useContext(AuthContext);
    const FSdb = useContext(FSContext);

    const [lists, setLists] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [addTobuyVisible, setAddTobuyVisible] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [shoppingList, setShoppingList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    

    const handleItemPress = (item) => {
        setSelectedItem(item);
      };

    const addShoppingList = async (list) => {
        // https://firebase.google.com/docs/firestore/manage-data/add-data?hl=en&authuser=0
        // write the list in Firestore
       const ref = await addDoc( collection( FSdb, "lists"), list )
    }
    const fetchShoppingList = async () => {
        try {
          const listCollectionRef = collection(FSdb, 'lists');
          const querySnapshot = await getDocs(listCollectionRef);
          const fetchedShoppingList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setShoppingList(fetchedShoppingList);
          setLoading(false);
          console.log(fetchedShoppingList);
    
          // Listen for real-time updates
          const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
            const updatedShoppingList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setShoppingList(updatedShoppingList);
          });
    
          // Clean up the listener when the component unmounts
          return () => {
            unsubscribe();
          };
        } catch (error) {
          console.error('Error fetching shopping list: ', error);
        }
      };
      
    
      useEffect(() => {
        fetchShoppingList();
      }, []);
    
    


    // const updateList = (list) => {
    //     setLists((prevLists) =>
    //         prevLists.map((item) => (item.id === list.id ? list : item))
    //     );
    // };

    const renderShoppingList = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemPress(item)}>
        <View style={styles.listItem}>
          <Text style={styles.nameStyle}>{item?.name }</Text>
        </View>
        </TouchableOpacity>
      );
     

    // const renderList = ({ item }) => (
    //     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    //       <ShoppingList list={item} updateList={updateList} />
    //     </ScrollView>
    //   );
    // {
    //     lists.map((list) => (
    //         <Text key={list.id}>{list.name}</Text>
    //     ))
    // }
    //if SignOut the user will be redirected to welcome screen


    useEffect(() => {
        if (!authStatus) {
            navigation.reset({ index: 0, routes: [{ name: "Welcome" }] })
        }
    }, [authStatus])

    const toggleAddTodoModal = () => {
        setAddTobuyVisible(!addTobuyVisible);
    };

    return (
        <ScrollView>
             <View>
             <View style={styles.header}>
                 <View style={styles.headerLeft}>
                     <SignOutButton />
                 </View>
                 <Text style={styles.headerTitle}>My Lists</Text>
                 </View>
                 <Modal
                     transparent={false}
                     animationType="slide"
                     visible={showModal}
                     onRequestClose={() => setShowModal(false)}
                     >
                     <AddListModal closeModal={() => setShowModal(false)} addShoppingList={addShoppingList}  />
                 </Modal>

                <View style={styles.divider} />
                <TouchableOpacity style={styles.addList} onPress={() => setShowModal(true)}>
                    <AntDesign name="plus" color={"white"} size={24} />
                    <Text style={styles.add}>add list</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />
      {loading ? (
        // <View style={styles.container}>
          <ActivityIndicator size="large" color="black" />
        // </View>
   
        ) : shoppingList.length > 0 ? (
        <FlatList
          data={shoppingList}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={renderShoppingList}
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
              <ListModal item={selectedItem} closeModal={() => setSelectedItem(null)} />
            </Modal>
          )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({

  
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#26ACA7",
        marginTop: 50,
        height: 70,
        minWidth: 400,
        paddingHorizontal: 16,
      },
      headerLeft: {
        flex: 1,
      },
      headerTitle: {
        fontSize: 40,
        textAlign: "center",
        color: "#FD8749",
        fontStyle: "italic",
        fontWeight: "bold",
        flex: 2,
        marginRight: 100,
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
   
        addList: {
            marginTop: 24,
            height: 50,
            borderRadius: 6,
            marginLeft:30,
            marginRight:30,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#26ACA7",
    },
        add: {
            color: "white",
            textAlign: "center",
            fontSize:20,
    },
    listItem: {
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
    nameStyle: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
})


// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
// import { useNavigation } from "@react-navigation/native"
// import { useEffect, useContext, useState } from 'react'
// import { AntDesign } from '@expo/vector-icons';
// import { ScrollView } from "react-native-gesture-handler";

// //component
// import { SignOutButton } from "../component/SignOutButton";
// import colors from "../component/Colors";
// import ShoppingList from "../component/ShoppingList";
// import AddListModal from "../component/AddListModal";
// //import ListModal from "../component/ListModal";

// //context
// import { AuthContext } from "../contexts/AuthContext";
// import { FSContext } from "../contexts/FSContext";
// //import { FBAuthContext } from "../contexts/FBAuthContext";

// export function HomeScreen(props) {

//     const navigation = useNavigation()

//     const authStatus = useContext(AuthContext);
//     const db = useContext(FSContext);

//     const [lists, setLists] = useState([]);
//     const [showModal, setShowModal] = useState(false)
//     const [addTobuyVisible, setAddTobuyVisible] = useState(false);
//     const [user, setUser] = useState({});
//     const [loading, setLoading] = useState(true);

//     const addList = (list) => {
//         setLists((prevLists) => [
//             ...prevLists,
//             { ...list, id: prevLists.length + 1, tobuy: [] },
//         ]);
//     };
   

//     const updateList = (list) => {
//         setLists((prevLists) =>
//             prevLists.map((item) => (item.id === list.id ? list : item))
//         );
//     };

  

//     const renderList = ({ item }) => (
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             <ShoppingList list={item} updateList={updateList} />
//         </ScrollView>
//     );

 

//     {
//         lists.map((list) => (
//             <Text key={list.id}>{list.name}</Text>
//         ))
//     }
//     //if SignOut the user will be redirected to welcome screen
//     useEffect(() => {
//         if (!authStatus) {
//             navigation.reset({ index: 0, routes: [{ name: "Welcome" }] })
//         }
//     }, [authStatus])

//     const toggleAddTodoModal = () => {
//         setAddTobuyVisible(!addTobuyVisible);
//     };

//     return (

//         <View style={styles.page}>
//             <View>
//             <View style={styles.header}>
//                 <View style={styles.headerLeft}>
//                     <SignOutButton text="Sign out" />
//                 </View>
//                 <Text style={styles.headerTitle}>My Lists</Text>
//                 </View>
//                 <Modal
//                     transparent={false}
//                     animationType="slide"
//                     visible={showModal}
//                     onRequestClose={() => setShowModal(false)}>
//                     <AddListModal closeModal={() => setShowModal(false)} addList={addList}  />

//                 </Modal>

//                 <View style={styles.divider} />
//                 <Text style={styles.title}>tobuy</Text>
//                 <TouchableOpacity style={styles.addList} onPress={() => setShowModal(true)}>
//                     <AntDesign name="plus" color={"white"} size={24} />
//                     <Text style={styles.add}>add list</Text>
//                 </TouchableOpacity>
//             </View>

//             <View style={{ height: 275, paddingLeft: 32, marginTop: 200 }}>

//                 <FlatList
//                     data={lists}
//                     keyExtractor={(item) => item.id.toString()} // Use a unique key for each item
//                     horizontal={true}
//                     showsHorizontalScrollIndicator={false}
//                     renderItem={({ item }) => (<ShoppingList list={item} updateList={updateList} />)}
//                     keyboardShouldPersistTaps="always"
//                 />
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({

//     page: {
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     // header: {
//     //     backgroundColor: "#26ACA7",
//     //     marginTop: 50,
//     //     height: 70,
//     //     minWidth: 400,
//     // },
//     // headerTitle: {
//     //     fontSize: 40,
//     //     textAlign: 'center',
//     //     color: "#FD8749",
//     //     fontStyle: "italic",
//     //     fontWeight: "bold"
//     // },
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         backgroundColor: "#26ACA7",
//         marginTop: 50,
//         height: 70,
//         minWidth: 400,
//         paddingHorizontal: 16,
//       },
//       headerLeft: {
//         flex: 1,
//       },
//       headerTitle: {
//         fontSize: 40,
//         textAlign: "center",
//         color: "#FD8749",
//         fontStyle: "italic",
//         fontWeight: "bold",
//         flex: 2,
//         marginRight:100,
//       },
//     container: {
//         flex: 1,
//         backgroundColor: "#ffff",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     divider: {
//         backgroundColor: colors.lightBlue,
//         height: 1,
//         flex: 1,
//         alignSelf: "center",
//     },
//     title: {
//         alignItems: "center",
//         alignContent: "center",
//         textAlign: 'center',
//         fontSize: 30,
//         color: "#26ACA7",
//     },

//     addList: {
//         marginTop: 24,
//         height: 50,
//         borderRadius: 6,
//         marginLeft: 30,
//         marginRight: 30,
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "#26ACA7",
//     },
//     add: {
//         color: "white",
//         textAlign: "center",
//         fontSize: 20,
//     }
// })