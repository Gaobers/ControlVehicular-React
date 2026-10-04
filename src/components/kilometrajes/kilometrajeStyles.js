import {
    StyleSheet
} from "react-native";


export const styles =
    StyleSheet.create({

        screen: {
            flex: 1,

            backgroundColor: "#F5F7FB"
        },


        header: {
            paddingTop: 16,

            paddingBottom: 13
        },


        headerTop: {
            flexDirection: "row",

            justifyContent: "space-between",

            alignItems: "center",

            marginBottom: 12
        },


        back: {
            color: "#64748B",

            fontSize: 9,

            fontWeight: "700"
        },


        registerButton: {
            minHeight: 36,

            paddingHorizontal: 13,

            borderRadius: 8,

            backgroundColor: "#073B61",

            alignItems: "center",

            justifyContent: "center"
        },


        registerText: {
            color: "#FFFFFF",

            fontSize: 9,

            fontWeight: "900"
        },


        title: {
            color: "#172033",

            fontSize: 21,

            fontWeight: "900"
        },


        subtitle: {
            color: "#64748B",

            marginTop: 4,

            fontSize: 10
        },


        message: {
            marginBottom: 11,

            padding: 10,

            borderRadius: 8
        },


        messageSuccess: {
            backgroundColor: "#DCFCE7"
        },


        messageError: {
            backgroundColor: "#FEE2E2"
        },


        messageText: {
            fontSize: 9,

            fontWeight: "700"
        },


        successText: {
            color: "#15803D"
        },


        errorText: {
            color: "#B91C1C"
        },


        totalCard: {
            backgroundColor: "#073B61",

            borderRadius: 12,

            padding: 14,

            marginBottom: 10
        },


        totalLabel: {
            color: "#A9C5DA",

            fontSize: 8,

            fontWeight: "800"
        },


        totalValue: {
            marginTop: 5,

            color: "#FFFFFF",

            fontSize: 24,

            fontWeight: "900"
        },


        totalMeta: {
            marginTop: 5,

            color: "#C3D8E7",

            fontSize: 9
        },


        listHeader: {
            marginTop: 4,

            marginBottom: 9,

            flexDirection: "row",

            alignItems: "center",

            justifyContent: "space-between"
        },


        listTitle: {
            color: "#172033",

            fontSize: 12,

            fontWeight: "900",

            textTransform: "uppercase"
        },


        listSubtitle: {
            marginTop: 2,

            color: "#94A3B8",

            fontSize: 8
        },


        refresh: {
            paddingHorizontal: 9,

            paddingVertical: 6,

            borderRadius: 6,

            backgroundColor: "#EEF3FF"
        },


        refreshText: {
            color: "#2563EB",

            fontSize: 8,

            fontWeight: "800"
        },


        loading: {
            paddingVertical: 40,

            alignItems: "center"
        },


        loadingText: {
            marginTop: 8,

            color: "#64748B",

            fontSize: 9
        },


        empty: {
            backgroundColor: "#FFFFFF",

            borderRadius: 12,

            borderWidth: 1,

            borderColor: "#E7EBF1",

            padding: 28,

            alignItems: "center"
        },


        emptyTitle: {
            color: "#334155",

            fontSize: 13,

            fontWeight: "800"
        },


        emptyText: {
            marginTop: 4,

            color: "#94A3B8",

            fontSize: 9,

            textAlign: "center"
        },


        modalScreen: {
            flex: 1,

            backgroundColor: "#F5F7FB"
        },


        modalHeader: {
            minHeight: 62,

            paddingHorizontal: 16,

            backgroundColor: "#FFFFFF",

            borderBottomWidth: 1,

            borderBottomColor: "#E8ECF2",

            flexDirection: "row",

            alignItems: "center",

            justifyContent: "space-between"
        },


        modalBack: {
            color: "#2563EB",

            fontSize: 9,

            fontWeight: "700"
        },


        modalTitle: {
            color: "#172033",

            fontSize: 13,

            fontWeight: "900"
        },


        modalContent: {
            padding: 16,

            paddingBottom: 35
        }
    });