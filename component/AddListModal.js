import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from "react-native";
import { AntDesign } from '@expo/vector-icons'
import colors from "../component/Colors";

export default class AddListModal extends React.Component {

    backgroundColor = ["#26ACA7", "#FD8749", "#D85963", "#D88559", "#5CD859", "#595BD9"]

    state = {
        name: "",
        color: this.backgroundColor[0],
    };

    createList = () => {
        const { name, color } = this.state;

        tempData.push({
            name,
            color,
            tobuy: []

        });
        this.setState({ name: "" })
        this.props.closeModal();
    };

    renderColors() {
        return this.backgroundColor.map(color => {
            return (
                <TouchableOpacity
                    key={color}
                    style={[styles.colorSelect, { backgroundColor: color }]}
                    onPress={() => this.setState({ color })} />
            )
        })
    }
    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <TouchableOpacity style={{ position: "absolute", top: 64, right: 32 }} onPress={this.props.closeModal}>
                    <AntDesign name="close" size={24} color="red" />
                </TouchableOpacity>
                <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
                    <Text style={styles.title}>Create a List </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="List name"
                        onChangeText={text => this.setState({ name: text })}
                    />
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>{this.renderColors()}
                    </View>
                    <TouchableOpacity
                        style={[styles.create, { backgroundColor: this.state.color }]}
                        onPress={this.createList}>
                        <Text style={{ color: "white", fontWeight: "600" }}>Create!</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "blue",
        alignSelf: "center",
        marginBottom: 16
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "red",
        borderRadius: 40,
        marginTop: 8,
        paddingHorizontal: 16,
        fontSize: 18,
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
    }
});

