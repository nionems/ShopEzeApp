import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import colors from "./Colors";
import ListModal from "./ListModal";
//import TobuyList from "./TobuyList";

export function ShoppingList ( props){
  
  const [showListVisible, setShowListVisible] = useState(true);

  const toggleListModal = () => {
    setShowListVisible(!showListVisible);
  };

  const TobuyList = ({ list }) => {
    return (
      <View>
        <Text>{list.name}</Text>
        {/* Render the items within the list */}
        {list.tobuy.map((item) => (
          <Text key={item.id}>{item.name}</Text>
        ))}
      </View>
    );
  };

  const completedCount = list.tobuy.filter((tobuy) => tobuy.completed).length;
  const remainingCount = list.tobuy.length - completedCount;

  return (
    <View>
      <Modal
        animationType="slide"
        visible={showListVisible}
        onRequestClose={toggleListModal}
      >
        <ListModal
          list={list}
          closeModal={toggleListModal}
          updateList={updateList}
        />
      </Modal>

      <TouchableOpacity
        style={[styles.listContainer, { backgroundColor: list.color }]}
        onPress={toggleListModal}
      >
        <Text style={styles.listTitle} numberOfLines={1}>
          {list.name}
        </Text>

        <View>
          <View style={styles.countContainer}>
            <Text style={styles.count}>{completedCount}</Text>
            <Text style={styles.subtitle}>Remaining</Text>
          </View>
          <View style={styles.countContainer}>
            <Text style={styles.count}>{remainingCount}</Text>
            <Text style={styles.subtitle}>Completed</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Render the items within the list using the TobuyList component */}
      {list.tobuy.map((item) => (
        <TobuyList key={item.id} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginHorizontal: 12,
    alignItems: "center",
    width: 200,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 18,
  },
  countContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  count: {
    fontSize: 20,
    fontWeight: "200",
    color: colors.white,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "200",
    color: colors.white,
  },
});




// import React from "react";
// import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
// import colors from "./Colors";
// import ListModal from "./ListModal";

// const TobuyList = ({ list }) => {
//     return (
//       <View>
//         <Text>{list.name}</Text>
//         {/* Render the items within the list */}
//         {list.tobuy.map((item) => (
//           <Text key={item.id}>{item.name}</Text>
//         ))}
//       </View>
//     );
//   };

// export default class ShoppingList extends React.Component {
//   state = {
//     showListVisible: true,
//   };

//   toggleListModal = () => {
//     this.setState((prevState) => ({
//       showListVisible: !prevState.showListVisible,
//     }));
//   };

//   render() {
//     const { list } = this.props;
//     const completedCount = list.tobuy.filter((tobuy) => tobuy.completed).length;
//     const remainingCount = list.tobuy.length - completedCount;

//     return (
//       <View>
//         <Modal
//           animationType="slide"
//           visible={this.state.showListVisible}
//           onRequestClose={this.toggleListModal}
//         >
//           <ListModal
//             list={list}
//             closeModal={this.toggleListModal}
//             updateList={this.props.updateList}
//           />
//         </Modal>

//         <TouchableOpacity
//           style={[styles.listContainer, { backgroundColor: list.color }]}
//           onPress={this.toggleListModal}
//         >
//           <Text style={styles.listTitle} numberOfLines={1}>
//             {list.name}
//           </Text>

//           <View>
//             <View style={styles.countContainer}>
//               <Text style={styles.count}>{completedCount}</Text>
//               <Text style={styles.subtitle}>Remaining</Text>
//             </View>
//             <View style={styles.countContainer}>
//               <Text style={styles.count}>{remainingCount}</Text>
//               <Text style={styles.subtitle}>Completed</Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   listContainer: {
//     paddingVertical: 32,
//     paddingHorizontal: 16,
//     borderRadius: 15,
//     marginHorizontal: 12,
//     alignItems: "center",
//     width: 200,
//   },
//   listTitle: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: colors.white,
//     marginBottom: 18,
//   },
//   countContainer: {
//     alignItems: "center",
//     marginTop: 10,
//   },
//   count: {
//     fontSize: 20,
//     fontWeight: "200",
//     color: colors.white,
//   },
//   subtitle: {
//     fontSize: 20,
//     fontWeight: "200",
//     color: colors.white,
//   },
// });