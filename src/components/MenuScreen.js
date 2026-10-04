import React, {
    useEffect,
    useState
} from "react";

import {
    StyleSheet,
    Text,
    View
} from "react-native";

import ScreenContainer
    from "./common/ScreenContainer";

import AppHeader
    from "./common/AppHeader";

import ModuleCard
    from "./common/ModuleCard";

import BottomNav
    from "./common/BottomNav";

import {
    vehiculoService
} from "../services/vehiculoService";


export default function MenuScreen({

    onVehiculos,

    onServicios,

    onLogout

}) {

    const [
        totalVehiculos,
        setTotalVehiculos
    ] = useState(0);


    const [
        sincronizado,
        setSincronizado
    ] = useState(true);


    useEffect(() => {

        cargarResumen();

    }, []);


    const cargarResumen = async () => {

        try {

            const vehiculos =
                await vehiculoService
                    .obtenerTodos();


            setTotalVehiculos(
                Array.isArray(vehiculos)
                    ? vehiculos.length
                    : 0
            );


            setSincronizado(true);

        } catch (error) {

            console.error(
                "Error cargando panel:",
                error
            );


            setSincronizado(false);
        }
    };


    return (
        <View style={styles.screen}>

            <ScreenContainer>

                <AppHeader
                    subtitle="Panel principal"
                    sincronizado={
                        sincronizado
                    }
                    onLogout={
                        onLogout
                    }
                />


                <View style={styles.intro}>

                    <Text style={styles.roleLabel}>
                        PANEL DE ADMINISTRACIÓN
                    </Text>

                    <Text style={styles.title}>
                        Panel de Administración
                    </Text>

                    <Text style={styles.description}>
                        Gestiona los vehículos y
                        servicios registrados en el sistema.
                    </Text>

                </View>


                <Text style={styles.section}>
                    GESTIÓN VEHICULAR
                </Text>


                <ModuleCard
                    icon="VH"
                    title="Gestión de Vehículos"
                    description={
                        "Consulta vehículos, propietarios y la información principal de cada unidad."
                    }
                    statistic={
                        `${totalVehiculos} vehículo(s) registrado(s)`
                    }
                    actionText="Gestionar vehículos"
                    onPress={
                        onVehiculos
                    }
                />


                <Text style={styles.section}>
                    SERVICIOS
                </Text>


                <ModuleCard
                    icon="SV"
                    title="Servicios del Vehículo"
                    description={
                        "Accede a mantenimientos, recordatorios, kilometraje y gastos."
                    }
                    statistic="4 módulos disponibles"
                    actionText="Gestionar servicios"
                    onPress={
                        onServicios
                    }
                />


                <View style={styles.infoCard}>

                    <Text style={styles.infoTitle}>
                        Sistema Control Vehicular
                    </Text>

                    <Text style={styles.infoText}>
                        Los módulos están organizados
                        por área para facilitar su uso
                        desde dispositivos móviles.
                    </Text>

                </View>

            </ScreenContainer>


            <BottomNav
                activo="inicio"
                onInicio={() => {}}
                onVehiculos={
                    onVehiculos
                }
                onServicios={
                    onServicios
                }
            />

        </View>
    );
}


const styles = StyleSheet.create({

    screen: {
        flex: 1
    },

    intro: {
        paddingTop: 20,
        paddingBottom: 18
    },

    roleLabel: {
        color: "#2563EB",
        fontSize: 8,
        fontWeight: "900",
        letterSpacing: 1
    },

    title: {
        color: "#172033",
        marginTop: 4,
        fontSize: 22,
        fontWeight: "900"
    },

    description: {
        color: "#64748B",
        marginTop: 5,
        fontSize: 10,
        lineHeight: 16
    },

    section: {
        color: "#94A3B8",
        marginTop: 6,
        marginBottom: 8,
        fontSize: 8,
        fontWeight: "900",
        letterSpacing: 1
    },

    infoCard: {
        backgroundColor: "#FFFFFF",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E9EDF3",
        marginTop: 3
    },

    infoTitle: {
        color: "#334155",
        fontSize: 11,
        fontWeight: "800"
    },

    infoText: {
        marginTop: 4,
        color: "#7C8798",
        fontSize: 9,
        lineHeight: 15
    }
});