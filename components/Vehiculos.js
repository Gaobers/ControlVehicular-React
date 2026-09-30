import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

export default function VehiculosScreen() {
  const [vehiculos, setVehiculos] = useState([]);
  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [color, setColor] = useState("");
  const [editando, setEditando] = useState(null);

  const limpiarFormulario = () => {
    setPlaca("");
    setMarca("");
    setModelo("");
    setAnio("");
    setColor("");
    setEditando(null);
  };

  const guardarVehiculo = () => {
    if (
      !placa.trim() ||
      !marca.trim() ||
      !modelo.trim() ||
      !anio.trim() ||
      !color.trim()
    ) {
      Alert.alert(
        "Campos obligatorios",
        "Completa todos los campos para continuar."
      );
      return;
    }

    const anioNumero = Number(anio);
    const anioActual = new Date().getFullYear();

    if (
      !Number.isInteger(anioNumero) ||
      anioNumero < 1900 ||
      anioNumero > anioActual + 1
    ) {
      Alert.alert("Año inválido", "Ingresa un año válido.");
      return;
    }

    const placaNormalizada = placa.trim().toUpperCase();

    const placaExiste = vehiculos.some(
      (v) =>
        v.placa === placaNormalizada &&
        v.id !== editando
    );

    if (placaExiste) {
      Alert.alert(
        "Placa duplicada",
        "Ya existe un vehículo registrado con esa placa."
      );
      return;
    }

    const datos = {
      id: editando || Date.now().toString(),
      placa: placaNormalizada,
      marca: marca.trim(),
      modelo: modelo.trim(),
      anio: anioNumero,
      color: color.trim(),
    };

    if (editando) {
      setVehiculos((actuales) =>
        actuales.map((v) =>
          v.id === editando ? datos : v
        )
      );

      Alert.alert(
        "Actualización exitosa",
        "Los datos del vehículo fueron actualizados."
      );
    } else {
      setVehiculos((actuales) => [...actuales, datos]);

      Alert.alert(
        "Registro exitoso",
        "El vehículo se agregó correctamente."
      );
    }

    limpiarFormulario();
  };

  const editarVehiculo = (vehiculo) => {
    setPlaca(vehiculo.placa);
    setMarca(vehiculo.marca);
    setModelo(vehiculo.modelo);
    setAnio(String(vehiculo.anio));
    setColor(vehiculo.color);
    setEditando(vehiculo.id);
  };

  const eliminarVehiculo = (id) => {
    Alert.alert(
      "Eliminar vehículo",
      "¿Estás seguro de que deseas eliminar este vehículo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setVehiculos((actuales) =>
              actuales.filter((v) => v.id !== id)
            );

            if (editando === id) {
              limpiarFormulario();
            }

            Alert.alert(
              "Eliminado",
              "El vehículo fue eliminado correctamente."
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          CONTROL VEHICULAR
        </Text>

        <Text style={styles.headerSubtitle}>
          Administración de vehículos
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>
          {editando ? "Editar vehículo" : "Registrar vehículo"}
        </Text>

        <Text style={styles.label}>Número de placa</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. P123456"
          placeholderTextColor="#94A3B8"
          value={placa}
          onChangeText={setPlaca}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Marca</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Toyota"
          placeholderTextColor="#94A3B8"
          value={marca}
          onChangeText={setMarca}
        />

        <Text style={styles.label}>Modelo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Corolla"
          placeholderTextColor="#94A3B8"
          value={modelo}
          onChangeText={setModelo}
        />

        <Text style={styles.label}>Año</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 2022"
          placeholderTextColor="#94A3B8"
          value={anio}
          onChangeText={setAnio}
          keyboardType="numeric"
          maxLength={4}
        />

        <Text style={styles.label}>Color</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Gris"
          placeholderTextColor="#94A3B8"
          value={color}
          onChangeText={setColor}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={guardarVehiculo}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {editando ? "ACTUALIZAR VEHÍCULO" : "REGISTRAR VEHÍCULO"}
          </Text>
        </TouchableOpacity>

        {editando && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={limpiarFormulario}
          >
            <Text style={styles.cancelText}>
              CANCELAR EDICIÓN
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          Vehículos registrados
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {vehiculos.length}
          </Text>
        </View>
      </View>

      {vehiculos.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>
            No hay vehículos registrados
          </Text>

          <Text style={styles.emptyText}>
            Los vehículos que registres aparecerán aquí.
          </Text>
        </View>
      ) : (
        vehiculos.map((vehiculo) => (
          <View key={vehiculo.id} style={styles.vehicleCard}>
            <View style={styles.vehicleHeader}>
              <Text style={styles.vehiclePlate}>
                {vehiculo.placa}
              </Text>

              <Text style={styles.vehicleYear}>
                {vehiculo.anio}
              </Text>
            </View>

            <Text style={styles.vehicleName}>
              {vehiculo.marca} {vehiculo.modelo}
            </Text>

            <Text style={styles.vehicleDetail}>
              Color: {vehiculo.color}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editarVehiculo(vehiculo)}
              >
                <Text style={styles.actionText}>
                  EDITAR
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => eliminarVehiculo(vehiculo.id)}
              >
                <Text style={styles.actionText}>
                  ELIMINAR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#0B1F3A",
    padding: 25,
    borderRadius: 18,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#B8C7D9",
    textAlign: "center",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    elevation: 4,
    marginBottom: 25,
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#0B1F3A",
    marginBottom: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 17,
  },
  saveButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  cancelButton: {
    padding: 14,
    alignItems: "center",
    marginTop: 10,
  },
  cancelText: {
    color: "#64748B",
    fontWeight: "bold",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#0B1F3A",
  },
  badge: {
    backgroundColor: "#2563EB",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: 10,
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#334155",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 10,
  },
  vehicleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  vehiclePlate: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B1F3A",
  },
  vehicleYear: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563EB",
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 7,
  },
  vehicleDetail: {
    fontSize: 14,
    color: "#64748B",
  },
  actions: {
    flexDirection: "row",
    marginTop: 18,
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 9,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#DC2626",
    padding: 12,
    borderRadius: 9,
    alignItems: "center",
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
});