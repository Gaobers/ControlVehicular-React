import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";


export default function AppHeader({
    subtitle = "Panel de administración",
    sincronizado = true,
    onLogout
}) {

    return (
        <View style={styles.header}>

            <View style={styles.topRow}>

                <View style={styles.brand}>

                    <View style={styles.logo}>
                        <Text style={styles.logoText}>
                            CV
                        </Text>
                    </View>


                    <View>

                        <Text style={styles.title}>
                            Control Vehicular
                        </Text>

                        <Text style={styles.subtitle}>
                            {subtitle}
                        </Text>

                    </View>

                </View>


                <Pressable
                    style={styles.profileButton}
                    onPress={onLogout}
                >
                    <Text style={styles.profileText}>
                        ↪
                    </Text>
                </Pressable>

            </View>


            <View style={styles.statusRow}>

                <Text style={styles.role}>
                    Administrador general
                </Text>


                <View style={styles.syncContainer}>

                    <View
                        style={[
                            styles.syncDot,
                            !sincronizado &&
                            styles.syncDotOff
                        ]}
                    />

                    <Text style={styles.syncText}>
                        {sincronizado
                            ? "Sincronizado"
                            : "Sin conexión"}
                    </Text>

                </View>

            </View>

        </View>
    );
}


const styles = StyleSheet.create({

    header: {
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E7EAF0",
        paddingVertical: 10
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    brand: {
        flexDirection: "row",
        alignItems: "center"
    },

    logo: {
        width: 34,
        height: 34,
        borderRadius: 8,
        backgroundColor: "#0D3559",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 9
    },

    logoText: {
        color: "#FFFFFF",
        fontWeight: "900",
        fontSize: 11
    },

    title: {
        color: "#172033",
        fontSize: 13,
        fontWeight: "900"
    },

    subtitle: {
        color: "#7C8798",
        marginTop: 2,
        fontSize: 9
    },

    profileButton: {
        width: 34,
        height: 34,
        borderRadius: 9,
        backgroundColor: "#0D3559",
        alignItems: "center",
        justifyContent: "center"
    },

    profileText: {
        color: "#FFFFFF",
        fontWeight: "900"
    },

    statusRow: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    role: {
        color: "#64748B",
        fontSize: 9
    },

    syncContainer: {
        flexDirection: "row",
        alignItems: "center"
    },

    syncDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#22C55E",
        marginRight: 5
    },

    syncDotOff: {
        backgroundColor: "#EF4444"
    },

    syncText: {
        color: "#64748B",
        fontSize: 9
    }
});