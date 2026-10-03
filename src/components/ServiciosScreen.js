import React from "react";

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


export default function ServiciosScreen({

    onInicio,

    onVehiculos,

    onMantenimientos,

    onRecordatorios,

    onKilometrajes,

    onGastos,

    onLogout

}) {

    return (
        <View style={styles.screen}>

            <ScreenContainer>

                <AppHeader
                    subtitle="Servicios del vehículo"
                    onLogout={onLogout}
                />


                <View style={styles.intro}>

                    <Text style={styles.label}>
                        SERVICIOS
                    </Text>

                    <Text style={styles.title}>
                        Gestión del vehículo
                    </Text>

                    <Text style={styles.description}>
                        Controla mantenimientos,
                        recordatorios, kilometraje
                        y gastos desde un solo lugar.
                    </Text>

                </View>


                <ModuleCard
                    icon="MT"
                    title="Mantenimientos"
                    description={
                        "Programa y controla los servicios realizados y pendientes."
                    }
                    statistic="Historial y programación"
                    actionText="Gestionar mantenimientos"
                    onPress={onMantenimientos}
                />


                <ModuleCard
                    icon="RM"
                    title="Recordatorios"
                    description={
                        "Administra alertas por fecha y kilometraje."
                    }
                    statistic="Alertas de mantenimiento"
                    actionText="Gestionar recordatorios"
                    onPress={onRecordatorios}
                />


                <ModuleCard
                    icon="KM"
                    title="Kilometraje"
                    description={
                        "Consulta y registra el historial de kilometraje."
                    }
                    statistic="Lecturas del vehículo"
                    actionText="Gestionar kilometraje"
                    onPress={onKilometrajes}
                />


                <ModuleCard
                    icon="$"
                    title="Gastos"
                    description={
                        "Registra y consulta los costos asociados a los vehículos."
                    }
                    statistic="Control financiero"
                    actionText="Gestionar gastos"
                    onPress={onGastos}
                />

            </ScreenContainer>


            <BottomNav
                activo="servicios"
                onInicio={onInicio}
                onVehiculos={onVehiculos}
                onServicios={() => {}}
            />

        </View>
    );
}


const styles = StyleSheet.create({

    screen: {
        flex: 1
    },

    intro: {
        paddingVertical: 22
    },

    label: {
        color: "#2563EB",
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 1
    },

    title: {
        color: "#172033",
        marginTop: 5,
        fontSize: 22,
        fontWeight: "900"
    },

    description: {
        color: "#64748B",
        marginTop: 6,
        fontSize: 11,
        lineHeight: 17
    }
});