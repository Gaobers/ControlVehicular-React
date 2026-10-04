import React from "react";

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View
} from "react-native";


export default function ScreenContainer({
    children,
    scroll = true
}) {

    if (!scroll) {

        return (
            <SafeAreaView style={styles.screen}>

                <View style={styles.container}>
                    {children}
                </View>

            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView style={styles.screen}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={
                    styles.scrollContent
                }
            >

                <View style={styles.container}>
                    {children}
                </View>

            </ScrollView>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: "#F5F7FB"
    },

    scrollContent: {
        paddingBottom: 95
    },

    container: {
        width: "100%",
        maxWidth: 700,
        alignSelf: "center",
        paddingHorizontal: 16,
        paddingTop: 12
    }
});