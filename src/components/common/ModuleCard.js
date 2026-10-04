import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";


export default function ModuleCard({
    icon,
    title,
    description,
    statistic,
    actionText,
    secondaryText,
    onPress,
    onSecondaryPress
}) {

    return (
        <View style={styles.card}>

            <View style={styles.iconBox}>
                <Text style={styles.iconText}>
                    {icon}
                </Text>
            </View>


            <Text style={styles.title}>
                {title}
            </Text>


            <Text style={styles.description}>
                {description}
            </Text>


            {statistic ? (

                <View style={styles.statBox}>

                    <Text style={styles.statText}>
                        {statistic}
                    </Text>

                </View>

            ) : null}


            <Pressable
                style={({ pressed }) => [
                    styles.mainButton,
                    pressed && styles.pressed
                ]}
                onPress={onPress}
            >

                <Text style={styles.mainButtonText}>
                    {actionText}
                </Text>

            </Pressable>


            {secondaryText && onSecondaryPress ? (

                <Pressable
                    style={({ pressed }) => [
                        styles.secondaryButton,
                        pressed && styles.pressed
                    ]}
                    onPress={onSecondaryPress}
                >

                    <Text
                        style={styles.secondaryButtonText}
                    >
                        {secondaryText}
                    </Text>

                </Pressable>

            ) : null}

        </View>
    );
}


const styles = StyleSheet.create({

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,

        borderWidth: 1,
        borderColor: "#EEF1F5",

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.04,
        shadowRadius: 6,

        elevation: 2
    },

    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 9,
        backgroundColor: "#EAF0FF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },

    iconText: {
        color: "#173B72",
        fontWeight: "900",
        fontSize: 11
    },

    title: {
        color: "#172033",
        fontSize: 15,
        fontWeight: "800"
    },

    description: {
        marginTop: 5,
        color: "#677386",
        fontSize: 10,
        lineHeight: 15
    },

    statBox: {
        marginTop: 10,
        borderRadius: 7,
        paddingHorizontal: 9,
        paddingVertical: 7,
        backgroundColor: "#F1F4FF"
    },

    statText: {
        color: "#334155",
        fontSize: 9,
        fontWeight: "700"
    },

    mainButton: {
        minHeight: 39,
        marginTop: 11,
        borderRadius: 7,
        backgroundColor: "#0D3559",
        alignItems: "center",
        justifyContent: "center"
    },

    mainButtonText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "800"
    },

    secondaryButton: {
        minHeight: 35,
        marginTop: 7,
        borderRadius: 7,
        backgroundColor: "#EEF1FF",
        alignItems: "center",
        justifyContent: "center"
    },

    secondaryButtonText: {
        color: "#455675",
        fontSize: 9,
        fontWeight: "700"
    },

    pressed: {
        opacity: 0.75
    }
});