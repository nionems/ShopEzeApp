import React from "react";
import { StyleSheet, Text, View ,Modal,TouchableOpacity } from "react-native";
import colors from "./Colors";
import ListModal from "./ListModal";

export default class ShoppingList extends React.Component {

    state = {
        showListVisible: false
    }
    toggleListModal() {
        this.setState({ showListVisible: !this.state.showListVisible })
    }

    render() {

        const list = this.props.list

        const completedCount = list.tobuy.filter(tobuy => tobuy.completed).length;
        const remainingCount = list.tobuy.length - completedCount

    return (
        <View>
        <Modal
            animationType="slide"
            visible={this.state.showListVisible}
            onRequestClose={() => this.toggleListModal()}
        >
            <ListModal 
            list={list} 
            closeModal={() => this.toggleListModal()}
            updateList = {this.props.updateList} 
            />
        </Modal>

        <TouchableOpacity
            style={[styles.listContainer, { backgroundColor: list.color }]}
            onPress={() => this.toggleListModal()}
        >
            <Text style={styles.listTitle} numberOfLines={1}>
                {list.name}
            </Text>

            <View>
                <View style={{ alignItems: "center" }}>
                    <Text style={styles.count}>{completedCount}</Text>
                    <Text style={styles.subtitle}>Remaining</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text style={styles.count}>{remainingCount}</Text>
                    <Text style={styles.subtitle}>Completed</Text>
                </View>
            </View>
        </TouchableOpacity>
    </View>

    )
}
}
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
        marginBottom: 18
    },
    count: {
        fontSize: 20,
        fontWeight: "200",
        color: colors.white,

    },
    subtitle: {
        fontSize: 20,
        fontWeight: "200",

    },
});

