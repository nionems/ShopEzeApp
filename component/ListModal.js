import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import colors from "./Colors";

export const ListModal = ({ name, list, onUpdate, closeModal }) => {
  const [newItem, setNewItem] = useState("");
  const [listItems, setListItems] = useState(list.items);
  

  const addNewItem = () => {
    if (newItem.trim() !== "") {
      setListItems(prevItems => [...prevItems, { title: newItem }]);
      setNewItem("");
      Keyboard.dismiss();
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        // Handle item press
      }}
      onLongPress={() => {
        // Handle item long press
      }}
    >
      <View style={styles.itemContainer}>
        <AntDesign
          name="checkcircle"
          size={24}
          color="green"
        />
        <Text style={styles.itemText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={{ position: "absolute", top: 64, right: 32, zIndex: 10 }}
          onPress={closeModal}
        >
          <AntDesign name="close" size={24} color={colors.black} />
        </TouchableOpacity>

        <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
          <View>
            <Text style={styles.title}>{name}</Text>
          </View>
        </View>

        <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
          <FlatList
            data={listItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <KeyboardAvoidingView style={[styles.section, styles.footer]} behavior="padding">
          <TextInput
            style={[styles.input, { borderColor: list.color }]}
            placeholder="Add new item..."
            onChangeText={setNewItem}
            value={newItem}
          />

          <TouchableOpacity style={[styles.addButton, { backgroundColor: list.color }]} onPress={addNewItem}>
            <AntDesign name="plus" size={16} color={colors.white} />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
  },
  section: {
    flex: 1,
    alignSelf: "stretch",
  },
  header: {
    justifyContent: "flex-end",
    marginLeft: 64,
    borderBottomWidth: 3
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "black",
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addButton: {
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: "center"
  },
  itemContainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    color: colors.black,
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 16,
  },
});

export default ListModal;















// export default class ListModal extends React.Component {
    
//     state = {
//         newTobuy: ""
//     };
//     toggleTobuyCompleted = index => {
//         let list = this.props.list;
//         list.tobuy[index].completed = !list.tobuy[index].completed;
//         this.props.updateList(list);
//     };

//     addTobuy = () => {
//         let list = this.props.list;

//         if (!list.tobuy.some(tobuy => tobuy.title === this.state.newTobuy)) {
//             list.tobuy.push({ title: this.state.newTobuy, completed: false });
//             this.props.updateList(list);
//         }

//         this.setState({ newTobuy: "" });
//         Keyboard.dismiss();
//     };

//     deleteTobuy = index => {
//         const list = this.props.list;
//         const updatedTobuy = [...list.tobuy];
//         updatedTobuy.splice(index, 1);
      
//         const updatedList = { ...list, tobuy: updatedTobuy };
//         this.props.updateList(updatedList);
//       };
      
//       renderTobuy = (tobuy, index) => {
//         return (
//           <Swipeable renderRightActions={(_, dragX) => this.rightActions(dragX, index)} onSwipeableRightOpen={() => this.deleteTobuy(index)}>
//             <View style={styles.tobuyContainer}>
//               <TouchableOpacity onPress={() => this.toggleTobuyCompleted(index)}>
//                 <Ionicons
//                   name={tobuy.completed ? "ios-square" : "ios-square-outline"}
//                   size={24}
//                   color={colors.gray}
//                   style={{ width: 32 }}
//                 />
//               </TouchableOpacity>
      
//               <Text
//                 style={[
//                   styles.tobuy,
//                   {
//                     textDecorationLine: tobuy.completed ? "line-through" : "none",
//                     color: tobuy.completed ? colors.gray : colors.black
//                   }
//                 ]}
//               >
//                 {tobuy.title}
//               </Text>
//             </View>
//           </Swipeable>
//         );
//       };
//     rightActions = (dragX, index) => {
//         const scale = dragX.interpolate({
//             inputRange: [-100, 0],
//             outputRange: [1, 0.9],
//             extrapolate: "clamp"
//         });

//         const opacity = dragX.interpolate({
//             inputRange: [-100, -20, 0],
//             outputRange: [1, 0.9, 0],
//             extrapolate: "clamp"
//         });

//         return (
//             <TouchableOpacity onPress={() => this.deleteTobuy(index)}>
//                 <Animated.View style={[styles.deleteButton, { opacity: opacity }]}>
//                     <Animated.Text style={{ color: colors.white, fontWeight: "800", transform: [{ scale }] }}>
//                         Delete
//                     </Animated.Text>
//                 </Animated.View>
//             </TouchableOpacity>
//         );
//     };





//     render() {

//         const list = this.props.list

//         const tobuyCount = list.tobuy.length
//         const completedCount = list.tobuy.filter(tobuy => tobuy.completed).length;

//         return (
//             <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
//             <SafeAreaView style={styles.container}>
//                 <TouchableOpacity 
//                     style={{ position: 'absolute', top: 64, right: 32, zIndex: 10 }}
//                     onPress={this.props.closeModal}
//                 >
//                     <AntDesign name="close" size={24} color={colors.black} />
//                 </TouchableOpacity>
//                 <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
//                     <View>
//                         <Text style={styles.title}>{list.name}</Text>
//                         <Text style={styles.tobuyCount}>
//                             {completedCount} of {tobuyCount} items
//                         </Text>
//                     </View>
//                 </View>
//                 <View style={[styles.section, { flex: 3, marginVertical:16 }]}>
//                     <FlatList
//                         data={list.tobuy}
//                         renderItem={({ item, index }) => this.renderTobuy(item, index)}
//                         keyExtractor={(item, index) => index.toString()}
//                         contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
//                         showsVerticalScrollIndicator={false}
//                     />
//                 </View>
//                 <KeyboardAvoidingView style={[styles.section, styles.footer]} behavior="padding">
//                     <TextInput
//                         style={[styles.input, { borderColor: list.color }]}
//                         onChangeText={text => this.setState({ newTobuy: text })}
//                         value={this.state.newTobuy} />

//                     <TouchableOpacity
//                         style={[styles.addTobuy, { backgroundColor: list.color }]}
//                         onPress={() => this.addTobuy()}>
//                         <AntDesign name="plus" size={16} color={colors.white} />
//                     </TouchableOpacity>
//                 </KeyboardAvoidingView>
//             </SafeAreaView>
//             </KeyboardAvoidingView>
//         )
//     }
// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor:"lightgrey",
   
//     },
//     section: {
//         flex: 1,
//         alignSelf: "stretch",
//     },
//     header: {
//         justifyContent: "flex-end",
//         marginLeft: 64,
//         borderBottomWidth: 3
//     },
//     title: {
//         fontSize: 30,
//         fontWeight: "800",
//         color: "black"


//     },
//     tobuyCount: {
//         marginTop: 4,
//         marginBottom: 16,
//         color: "grey",
//         fontWeight: "600",
//     },
//     footer: {
//         paddingHorizontal: 32,
//         flexDirection: "row",
//         alignItems: "center"
//     },
//     input: {
//         flex: 1,
//         height: 48,
//         borderWidth: StyleSheet.hairlineWidth,
//         borderRadius: 6,
//         marginRight: 8,
//         paddingHorizontal: 8,
//     },
//     addTobuy: {
//         borderRadius: 4,
//         padding: 16,
//         alignItems: 'center',
//         justifyContent: "center"
//     },
//     tobuyContainer: {
//         paddingVertical: 16,
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     tobuy: {
//         color: colors.black,
//         fontWeight: "700",
//         fontSize: 16
//     },
//     deleteButton: {
//         flex: 1,
//         backgroundColor: "red",
//         justifyContent: "center",
//         alignItems: "center",
//         width: 80,
//         borderRadius:10
//     }


// })
