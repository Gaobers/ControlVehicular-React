import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F5F7FB"
    },

    moduleHeader: {
        paddingTop: 18,
        paddingBottom: 14
    },

    moduleHeaderTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
    },

    backButton: {
        paddingVertical: 7,
        paddingRight: 10
    },

    backButtonText: {
        color: "#64748B",
        fontSize: 10,
        fontWeight: "700"
    },

    registerButton: {
        minHeight: 37,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: "#0D3559",
        alignItems: "center",
        justifyContent: "center"
    },

    registerButtonText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "800"
    },

    title: {
        color: "#172033",
        fontSize: 23,
        fontWeight: "900"
    },

    subtitle: {
        marginTop: 4,
        color: "#7C8798",
        fontSize: 10
    },

    messageBox: {
        marginBottom: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 9,
        borderWidth: 1
    },

    messageSuccess: {
        backgroundColor: "#F0FDF4",
        borderColor: "#BBF7D0"
    },

    messageError: {
        backgroundColor: "#FEF2F2",
        borderColor: "#FECACA"
    },

    messageText: {
        fontSize: 10,
        fontWeight: "600"
    },

    messageSuccessText: {
        color: "#15803D"
    },

    messageErrorText: {
        color: "#B91C1C"
    },

    listHeader: {
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    listTitle: {
        color: "#172033",
        fontSize: 15,
        fontWeight: "900"
    },

    listSubtitle: {
        color: "#94A3B8",
        fontSize: 9,
        marginTop: 2
    },

    refreshButton: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 7,
        backgroundColor: "#E8F1FF"
    },

    refreshText: {
        color: "#2563EB",
        fontSize: 8,
        fontWeight: "800"
    },

    loadingBox: {
        paddingVertical: 45,
        alignItems: "center"
    },

    loadingText: {
        marginTop: 10,
        color: "#64748B",
        fontSize: 10
    },

    emptyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 13,
        borderWidth: 1,
        borderColor: "#E8ECF2",
        padding: 30,
        alignItems: "center"
    },

    emptyTitle: {
        color: "#334155",
        fontSize: 14,
        fontWeight: "800"
    },

    emptyText: {
        marginTop: 5,
        color: "#94A3B8",
        fontSize: 10,
        textAlign: "center"
    },

    emptyButton: {
        marginTop: 15,
        paddingHorizontal: 15,
        paddingVertical: 11,
        borderRadius: 8,
        backgroundColor: "#0D3559"
    },

    emptyButtonText: {
        color: "#FFFFFF",
        fontSize: 9,
        fontWeight: "800"
    }
});