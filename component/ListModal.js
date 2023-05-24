// import React from "react";
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput } from "react-native";
// import { AntDesign, Ionicons } from '@expo/vector-icons';
// import tempData from "../component/tempData";






// export default class ListModal extends React.Component {


//    state = {
//        name: this.props.list.name,
//        color: this.props.list.color,
//        tobuy: this.props.list.tobuy


//    };


//    renderTobuy = tobuy => {
//        return (
//            <View style={styles.tobuyContainer}>
//                <TouchableOpacity>
//                    <Ionicons
//                    name={tobuy.completed ?"ios-square": "ios-square-outline" }
//                    size={24}
//                    color="black"
//                    style={{ width: 32 }} />
             
//                </TouchableOpacity>


//                <Text style ={[
//                    styles.tobuy,
//                    {textDecorationLine: tobuy.completed ? "line-through":"none",
//                    //for this need to create a class color
//                    //color: tobuy.completed ? colors.gray : colors.black
//                }
//                ]}
//                >
//                    {tobuy.title}
//                    </Text>
//            </View>
//        )
//    }


//    render() {


//        const tobuyCount = this.state.tobuy.length
//        const completedCount = this.state.tobuy.filter(tobuy => tobuy.completed).length


//        return (
//            <SafeAreaView style={styles.container}>
//                <TouchableOpacity style={{ position: 'absolute', top: 64, right: 32, zIndex: 10 }}
//                    onPress={this.props.closeModal}>
//                    <AntDesign name="close" size={24} color="red" />


//                </TouchableOpacity>


//                <View style={[styles.section, styles.header, { borderBottomColor: this.state.color }]}>
//                    <View>
//                        <Text style={styles.title}>{this.state.name}</Text>
//                        <Text style={styles.tobuyCount}>
//                            {completedCount} of {tobuyCount} items
//                        </Text>
//                    </View>
//                </View>


//                <View style={[styles.section, { flex: 3 }]}>
//                    <FlatList data={this.state.tobuy}
//                        renderItem={({ item }) => this.renderTobuy(item)}
//                        keyExtractor={item => item.title}
//                        contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
//                        showsVerticalScrollIndicator={false}
//                    />


//                </View>


//                <KeyboardAvoidingView style={[styles.section, styles.footer]} behavior="padding">
//                    <TextInput style={[styles.input, { borderColor: this.state.color }]} />
//                    <TouchableOpacity style={[styles.addTobuy, { backgroundColor: this.state.color }]}>
//                        <AntDesign name="plus" size={16} color="blue" />


//                    </TouchableOpacity>




//                </KeyboardAvoidingView>
//            </SafeAreaView>
//        )
//    }
// }


// const styles = StyleSheet.create({
//    container: {
//        flex: 1,
//        justifyContent: "center",
//        alignItems: "center"
//    },
//    section: {
//        flex: 1,
//        alignSelf: "stretch",
//    },
//    header: {
//        justifyContent: "flex-end",
//        marginLeft: 64,
//        borderBottomWidth: 3
//    },
//    title: {
//        fontSize: 30,
//        fontWeight: "800",
//        color: "black"


//    },
//    tobuyCount: {
//        marginTop: 4,
//        marginBottom: 16,
//        color: "grey",
//        fontWeight: "600",
//    },
//    footer: {
//        paddingHorizontal: 32,
//        flexDirection: "row",
//        alignItems: "center"
//    },
//    input: {
//        flex: 1,
//        height: 48,
//        borderWidth: StyleSheet.hairlineWidth,
//        borderRadius: 6,
//        marginRight: 8,
//        paddingHorizontal: 8,
//    },
//    addTobuy: {
//        borderRadius: 4,
//        padding: 16,
//        alignItems: 'center',
//        justifyContent: "center"
//    },
//    tobuyContainer: {
//        paddingVertical: 16,
//        flexDirection: "row",
//        alignItems: "center",
//    },
//    tobuy:{
//        color:"black",
//        fontWeight: "700",
//        fontSize:16
//    }


// })
