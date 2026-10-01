import React from "react";

import {
    SafeAreaView,
    StyleSheet
} from "react-native";

import { StatusBar } from "expo-status-bar";

import VehiculosScreen
    from "./components/VehiculosScreen";


export default function App() {

    return (

        <SafeAreaView style={styles.container}>

            <StatusBar style="light" />

            <VehiculosScreen />

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#eef2f7"
    }

});