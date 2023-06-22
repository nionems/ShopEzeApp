import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard } from "react-native";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import colors from "./Colors";


export default class ListModal extends React.Component {

    state = {
        newTobuy: ""
    };
    toggleTobuyCompleted = index => {
        let list = this.props.list;
        list.tobuy[index].completed = !list.tobuy[index].completed;
        this.props.updateList(list);
    };

    addTobuy = () => {
        let list = this.props.list;

        if (!list.tobuy.some(tobuy => tobuy.title === this.state.newTobuy)) {
            list.tobuy.push({ title: this.state.newTobuy, completed: false });
            this.props.updateList(list);
        }

        this.setState({ newTobuy: "" });
        Keyboard.dismiss();
    };


    renderTobuy = (tobuy, index) => {
        return (
            <View style={styles.tobuyContainer}>
                <TouchableOpacity onPress={() => this.toggleTobuyCompleted(index)}>
                    <Ionicons
                        name={tobuy.completed ? "ios-square" : "ios-square-outline"}
                        size={24}
                        color={colors.green}
                        style={{ width: 32 }} />
                </TouchableOpacity>
                <Text style={[
                    styles.tobuy,
                    {
                        textDecorationLine: tobuy.completed ? "line-through" : "none",
                        color: tobuy.completed ? colors.grey : colors.black
                    }
                ]}
                >
                    {tobuy.title}
                </Text>
            </View>
        )
    }

    render() {

        const list = this.props.list
        const tobuyCount = list.tobuy.length
        const completedCount = list.tobuy.filter(tobuy => tobuy.completed).length;

        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={{ position: 'absolute', top: 64, right: 32, zIndex: 10 }}
                    onPress={this.props.closeModal}>

                    <AntDesign name="close" size={24} color={colors.black} />
                </TouchableOpacity>
                <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
                    <View>
                        <Text style={styles.title}>{list.name}</Text>
                        <Text style={styles.tobuyCount}>
                            {completedCount} of {tobuyCount} items
                        </Text>
                    </View>
                </View>
                <View style={[styles.section, { flex: 3 }]}>
                    <FlatList
                        data={list.tobuy}
                        renderItem={({ item, index }) => this.renderTobuy(item, index)}
                        keyExtractor={item => item.title}
                        contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <KeyboardAvoidingView style={[styles.section, styles.footer]} behavior="padding">
                    <TextInput
                        style={[styles.input, { borderColor: list.color }]}
                        onChangeText={text => this.setState({ newTobuy: text })}
                        value={this.state.newTobuy} />

                    <TouchableOpacity
                        style={[styles.addTobuy, { backgroundColor: list.color }]}
                        onPress={() => this.addTobuy()} // Invoke the function with parentheses
                    >
                        <AntDesign name="plus" size={16} color={colors.white} />
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
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
        color: "black"


    },
    tobuyCount: {
        marginTop: 4,
        marginBottom: 16,
        color: "grey",
        fontWeight: "600",
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
    addTobuy: {
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: "center"
    },
    tobuyContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    tobuy: {
        color: colors.black,
        fontWeight: "700",
        fontSize: 16
    }


})
