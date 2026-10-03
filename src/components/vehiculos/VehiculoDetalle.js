import React from "react";

import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    Pressable,
    View
} from "react-native";


function formatearKilometraje(valor) {
    const numero = Number(valor || 0);

    return `${numero.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    })} km`;
}


function obtenerTextoEstado(estado) {
    if (!estado) return "Sin estado";

    switch (estado) {
        case "ACTIVO":
            return "Al día";
        case "ARCHIVADO":
            return "Archivado";
        default:
            return estado;
    }
}


function obtenerEstiloEstado(estado) {
    switch (estado) {
        case "ACTIVO":
            return {
                fondo: "#ECFDF3",
                borde: "#BBF7D0",
                texto: "#15803D"
            };

        case "ARCHIVADO":
            return {
                fondo: "#FEF2F2",
                borde: "#FECACA",
                texto: "#B91C1C"
            };

        default:
            return {
                fondo: "#EFF6FF",
                borde: "#BFDBFE",
                texto: "#1D4ED8"
            };
    }
}


function obtenerIniciales(nombre) {
    if (!nombre) return "PR";

    const partes = nombre.trim().split(" ").filter(Boolean);

    if (partes.length === 1) {
        return partes[0].substring(0, 2).toUpperCase();
    }

    return (
        (partes[0][0] || "") +
        (partes[1][0] || "")
    ).toUpperCase();
}


function construirNombreVehiculo(vehiculo) {
    return [
        vehiculo?.marca,
        vehiculo?.modelo
    ].filter(Boolean).join(" ");
}


function construirDescripcionVehiculo(vehiculo) {
    const partes = [];

    if (vehiculo?.anio) {
        partes.push(vehiculo.anio);
    }

    if (vehiculo?.color) {
        partes.push(vehiculo.color);
    }

    return partes.length > 0
        ? partes.join(" • ")
        : "Información general del vehículo";
}


function obtenerPropietarioNombre(vehiculo) {
    if (vehiculo?.propietarioNombre) {
        return vehiculo.propietarioNombre;
    }

    if (vehiculo?.nombrePropietario) {
        return vehiculo.nombrePropietario;
    }

    if (vehiculo?.propietarioId) {
        return `Propietario #${vehiculo.propietarioId}`;
    }

    return "Propietario no disponible";
}


function obtenerMantenimientos(vehiculo) {
    if (Array.isArray(vehiculo?.mantenimientos)) {
        return vehiculo.mantenimientos;
    }

    if (Array.isArray(vehiculo?.mantenimientosAsociados)) {
        return vehiculo.mantenimientosAsociados;
    }

    return [];
}


function InfoItem({ label, value, copiable = false }) {
    return (
        <View style={styles.infoItem}>
            <View style={styles.infoTopRow}>
                <Text style={styles.infoLabel}>
                    {label}
                </Text>

                {copiable && (
                    <Text style={styles.copyText}>
                        ⧉
                    </Text>
                )}
            </View>

            <Text style={styles.infoValue}>
                {value || "No disponible"}
            </Text>
        </View>
    );
}


function SectionCard({
    title,
    children
}) {
    return (
        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
                {title}
            </Text>

            {children}
        </View>
    );
}


export default function VehiculoDetalle({
    visible,
    vehiculo,
    onCerrar,
    onEditar,
    onDesactivar,
    onReactivar,
    onRegistrarKilometraje
}) {
    if (!vehiculo) {
        return null;
    }

    const estadoUi = obtenerEstiloEstado(
        vehiculo.estado
    );

    const textoEstado = obtenerTextoEstado(
        vehiculo.estado
    );

    const nombreVehiculo =
        construirNombreVehiculo(vehiculo);

    const descripcionVehiculo =
        construirDescripcionVehiculo(vehiculo);

    const nombrePropietario =
        obtenerPropietarioNombre(vehiculo);

    const correoPropietario =
        vehiculo?.propietarioCorreo ||
        vehiculo?.correoPropietario ||
        "Sin correo registrado";

    const telefonoPropietario =
        vehiculo?.propietarioTelefono ||
        vehiculo?.telefonoPropietario ||
        "Sin teléfono registrado";

    const mantenimientos =
        obtenerMantenimientos(vehiculo);

    const estaArchivado =
        vehiculo?.estado === "ARCHIVADO";

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onCerrar}
        >
            <View style={styles.screen}>

                <View style={styles.topBar}>
                    <Pressable
                        style={styles.backButton}
                        onPress={onCerrar}
                    >
                        <Text style={styles.backButtonText}>
                            ← Ver vehículos
                        </Text>
                    </Pressable>
                </View>


                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.heroCard}>

                        <View style={styles.heroTop}>
                            <View style={styles.plateBadge}>
                                <Text style={styles.plateText}>
                                    {vehiculo?.placa || "SIN-PLACA"}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.statusBadge,
                                    {
                                        backgroundColor: estadoUi.fondo,
                                        borderColor: estadoUi.borde
                                    }
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.statusText,
                                        { color: estadoUi.texto }
                                    ]}
                                >
                                    {textoEstado}
                                </Text>
                            </View>
                        </View>


                        <View style={styles.heroBody}>

                            <View style={styles.vehiclePlaceholder}>
                                <Text style={styles.vehiclePlaceholderText}>
                                    SIN IMAGEN
                                </Text>
                            </View>


                            <Text style={styles.vehicleTitle}>
                                {nombreVehiculo || "Vehículo"}
                            </Text>

                            <Text style={styles.vehicleSubtitle}>
                                {descripcionVehiculo}
                            </Text>


<View style={styles.kmPanel}>

    <Text style={styles.kmLabel}>
        Kilometraje actual
    </Text>

    <Text style={styles.kmValue}>
        {formatearKilometraje(
            vehiculo?.kilometrajeActual
        )}
    </Text>

</View>


{!estaArchivado && (

    <Pressable
        style={styles.kilometrajeButton}
        onPress={() =>
            onRegistrarKilometraje?.(
                vehiculo
            )
        }
    >

        <Text
            style={
                styles.kilometrajeButtonText
            }
        >
            + Registrar kilometraje
        </Text>

    </Pressable>
)}

                        </View>

                    </View>


                    <SectionCard title="Propietario">
                        <View style={styles.ownerCard}>

                            <View style={styles.ownerAvatar}>
                                <Text style={styles.ownerAvatarText}>
                                    {obtenerIniciales(
                                        nombrePropietario
                                    )}
                                </Text>
                            </View>

                            <View style={styles.ownerInfo}>
                                <Text style={styles.ownerName}>
                                    {nombrePropietario}
                                </Text>

                                <Text style={styles.ownerMeta}>
                                    Cliente
                                </Text>

                                <Text style={styles.ownerContact}>
                                    ✉ {correoPropietario}
                                </Text>

                                <Text style={styles.ownerContact}>
                                    ☎ {telefonoPropietario}
                                </Text>
                            </View>

                        </View>
                    </SectionCard>


                    <SectionCard title="Información técnica y documentación">
                        <InfoItem
                            label="Número de chasis / VIN"
                            value={vehiculo?.vin}
                            copiable
                        />

                        <InfoItem
                            label="Motor"
                            value={vehiculo?.motor}
                        />

                        <InfoItem
                            label="Color"
                            value={vehiculo?.color}
                        />

                        <InfoItem
                            label="Año"
                            value={
                                vehiculo?.anio
                                    ? String(vehiculo.anio)
                                    : null
                            }
                        />

                        <InfoItem
                            label="ID del propietario"
                            value={
                                vehiculo?.propietarioId
                                    ? `#${vehiculo.propietarioId}`
                                    : null
                            }
                        />
                    </SectionCard>


                    <SectionCard title="Mantenimientos asociados">
                        {mantenimientos.length > 0 ? (
                            mantenimientos.map(
                                (mantenimiento, index) => {
                                    const estadoItem =
                                        obtenerEstiloEstado(
                                            mantenimiento?.estado
                                        );

                                    return (
                                        <View
                                            key={
                                                mantenimiento?.id ||
                                                index
                                            }
                                            style={
                                                styles.maintenanceCard
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.maintenanceTop
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.maintenanceTitle
                                                    }
                                                >
                                                    {mantenimiento?.servicio ||
                                                        "Mantenimiento"}
                                                </Text>

                                                <View
                                                    style={[
                                                        styles.maintenanceBadge,
                                                        {
                                                            backgroundColor:
                                                                estadoItem.fondo,
                                                            borderColor:
                                                                estadoItem.borde
                                                        }
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.maintenanceBadgeText,
                                                            {
                                                                color:
                                                                    estadoItem.texto
                                                            }
                                                        ]}
                                                    >
                                                        {mantenimiento?.estado ||
                                                            "Sin estado"}
                                                    </Text>
                                                </View>
                                            </View>

                                            <Text
                                                style={
                                                    styles.maintenanceMeta
                                                }
                                            >
                                                {mantenimiento?.fechaObjetivo
                                                    ? `Fecha objetivo: ${mantenimiento.fechaObjetivo}`
                                                    : "Sin fecha objetivo"}
                                            </Text>

                                            <Text
                                                style={
                                                    styles.maintenanceMeta
                                                }
                                            >
                                                {mantenimiento?.kilometrajeObjetivo
                                                    ? `Objetivo: ${mantenimiento.kilometrajeObjetivo} km`
                                                    : "Sin kilometraje objetivo"}
                                            </Text>
                                        </View>
                                    );
                                }
                            )
                        ) : (
                            <View style={styles.emptyMaintenance}>
                                <Text style={styles.emptyMaintenanceTitle}>
                                    Sin mantenimientos asociados
                                </Text>

                                <Text style={styles.emptyMaintenanceText}>
                                    Cuando conectes este módulo con
                                    mantenimientos, aquí se podrán mostrar
                                    los servicios programados del vehículo.
                                </Text>
                            </View>
                        )}
                    </SectionCard>


                    <View style={styles.actionsSection}>
                        <Pressable
                            style={styles.primaryButton}
                            onPress={() =>
                                onEditar?.(vehiculo)
                            }
                        >
                            <Text style={styles.primaryButtonText}>
                                Editar vehículo
                            </Text>
                        </Pressable>

                        {estaArchivado ? (
                            <Pressable
                                style={styles.secondaryButton}
                                onPress={() =>
                                    onReactivar?.(vehiculo)
                                }
                            >
                                <Text style={styles.secondaryButtonText}>
                                    Reactivar vehículo
                                </Text>
                            </Pressable>
                        ) : (
                            <Pressable
                                style={styles.dangerButton}
                                onPress={() =>
                                    onDesactivar?.(vehiculo)
                                }
                            >
                                <Text style={styles.dangerButtonText}>
                                    Archivar vehículo
                                </Text>
                            </Pressable>
                        )}
                    </View>

                </ScrollView>
            </View>
        </Modal>
    );
}




const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F4F7FB"
    },

    topBar: {
        paddingTop: 18,
        paddingHorizontal: 18,
        paddingBottom: 6
    },

    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 6
    },

    backButtonText: {
        color: "#3B82F6",
        fontSize: 13,
        fontWeight: "700"
    },

    content: {
        paddingHorizontal: 18,
        paddingBottom: 28
    },

    heroCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E6EBF2",
        marginBottom: 16
    },

    heroTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14
    },

    plateBadge: {
        backgroundColor: "#E9EEF8",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10
    },

    plateText: {
        color: "#17325C",
        fontSize: 14,
        fontWeight: "800"
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 999,
        borderWidth: 1
    },

    statusText: {
        fontSize: 11,
        fontWeight: "800"
    },

    heroBody: {
        gap: 10
    },

    vehiclePlaceholder: {
        height: 90,
        borderRadius: 14,
        backgroundColor: "#EEF2F8",
        borderWidth: 1,
        borderColor: "#DCE5F2",
        justifyContent: "center",
        alignItems: "center"
    },

    vehiclePlaceholderText: {
        color: "#94A3B8",
        fontSize: 12,
        fontWeight: "700"
    },

    vehicleTitle: {
        color: "#1E293B",
        fontSize: 24,
        fontWeight: "900",
        lineHeight: 28
    },

    vehicleSubtitle: {
        color: "#64748B",
        fontSize: 13
    },

    kmPanel: {
        marginTop: 4,
        backgroundColor: "#F2F5FB",
        borderRadius: 12,
        padding: 14
    },

    kmLabel: {
        color: "#64748B",
        fontSize: 12,
        marginBottom: 4
    },

    kmValue: {
        color: "#17325C",
        fontSize: 24,
        fontWeight: "900"
    },

    kilometrajeButton: {
    minHeight: 43,

    marginTop: 2,

    borderRadius: 10,

    backgroundColor: "#EAF3FF",

    borderWidth: 1,

    borderColor: "#D5E6FF",

    alignItems: "center",

    justifyContent: "center"
},


kilometrajeButtonText: {
    color: "#1D4ED8",

    fontSize: 11,

    fontWeight: "800"
},

    sectionCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E6EBF2",
        marginBottom: 16
    },

    sectionTitle: {
        color: "#1E293B",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 14
    },

    ownerCard: {
        flexDirection: "row",
        alignItems: "flex-start"
    },

    ownerAvatar: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: "#0F2D53",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },

    ownerAvatarText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "800"
    },

    ownerInfo: {
        flex: 1
    },

    ownerName: {
        color: "#1E293B",
        fontSize: 16,
        fontWeight: "800"
    },

    ownerMeta: {
        color: "#64748B",
        fontSize: 12,
        marginTop: 2,
        marginBottom: 8
    },

    ownerContact: {
        color: "#334155",
        fontSize: 13,
        marginBottom: 4
    },

    infoItem: {
        backgroundColor: "#F7F9FC",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10
    },

    infoTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5
    },

    infoLabel: {
        color: "#64748B",
        fontSize: 11,
        fontWeight: "700"
    },

    copyText: {
        color: "#3B82F6",
        fontSize: 12,
        fontWeight: "700"
    },

    infoValue: {
        color: "#1E293B",
        fontSize: 14,
        fontWeight: "700"
    },

    maintenanceCard: {
        backgroundColor: "#F8FAFD",
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E8EDF4"
    },

    maintenanceTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 8
    },

    maintenanceTitle: {
        flex: 1,
        color: "#1E293B",
        fontSize: 14,
        fontWeight: "800"
    },

    maintenanceBadge: {
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 9,
        paddingVertical: 5
    },

    maintenanceBadgeText: {
        fontSize: 10,
        fontWeight: "800"
    },

    maintenanceMeta: {
        color: "#64748B",
        fontSize: 12,
        marginBottom: 4
    },

    emptyMaintenance: {
        backgroundColor: "#F8FAFD",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E8EDF4"
    },

    emptyMaintenanceTitle: {
        color: "#334155",
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 5
    },

    emptyMaintenanceText: {
        color: "#64748B",
        fontSize: 12,
        lineHeight: 18
    },

    actionsSection: {
        gap: 10,
        marginTop: 4
    },

    primaryButton: {
        backgroundColor: "#0F2D53",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center"
    },

    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "800"
    },

    secondaryButton: {
        backgroundColor: "#EAF3FF",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center"
    },

    secondaryButtonText: {
        color: "#1D4ED8",
        fontSize: 14,
        fontWeight: "800"
    },

    dangerButton: {
        backgroundColor: "#FEF2F2",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#FECACA"
    },

    dangerButtonText: {
        color: "#DC2626",
        fontSize: 14,
        fontWeight: "800"
    }
});