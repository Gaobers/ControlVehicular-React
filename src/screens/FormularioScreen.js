import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { mantenimientoService } from '../services/mantenimientoService';

export default function FormularioScreen({ route, navigation }) {
  const itemEditar = route?.params?.item;

  const [vehiculoId, setVehiculoId] = useState('');
  const [servicio, setServicio] = useState('');
  const [fechaObjetivo, setFechaObjetivo] = useState('');
  const [kilometrajeObjetivo, setKilometrajeObjetivo] = useState('');
  const [estado, setEstado] = useState('PENDIENTE'); // Valor por defecto
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (itemEditar) {
      setVehiculoId(itemEditar.vehiculoId ? itemEditar.vehiculoId.toString() : '');
      setServicio(itemEditar.servicio || '');
      setFechaObjetivo(itemEditar.fechaObjetivo || '');
      setKilometrajeObjetivo(
        itemEditar.kilometrajeObjetivo ? itemEditar.kilometrajeObjetivo.toString() : ''
      );
      setEstado(itemEditar.estado || 'PENDIENTE');
    }
  }, [itemEditar]);

  const handleGuardar = async () => {
    if (!vehiculoId.trim() || !servicio.trim() || !fechaObjetivo.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa el ID del vehículo, el servicio y la fecha objetivo.');
      return;
    }

    setGuardando(true);

    const mantenimientoData = {
      ...(itemEditar && { id: itemEditar.id }), // Incluye el ID sólo si es edición
      vehiculoId: parseInt(vehiculoId, 10),
      servicio: servicio.trim(),
      estado: estado.toUpperCase(), // Asegura mayúsculas para el Enum
      fechaObjetivo: fechaObjetivo.trim(),
      kilometrajeObjetivo: kilometrajeObjetivo ? parseInt(kilometrajeObjetivo, 10) : 0,
    };

    try {
      if (itemEditar) {
        await mantenimientoService.actualizar(mantenimientoData);
        Alert.alert('Éxito', 'Mantenimiento actualizado correctamente');
      } else {
        await mantenimientoService.crear(mantenimientoData);
        Alert.alert('Éxito', 'Mantenimiento creado correctamente');
      }
      if (navigation?.goBack) {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo guardar la información. Verifica los datos o la conexión.'
      );
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>
        {itemEditar ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
      </Text>

      <Text style={styles.label}>ID del Vehículo *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 4"
        keyboardType="numeric"
        value={vehiculoId}
        onChangeText={setVehiculoId}
      />

      <Text style={styles.label}>Servicio / Descripción *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Cambio de capo, motor y pintura general"
        value={servicio}
        onChangeText={setServicio}
      />

      <Text style={styles.label}>Fecha Objetivo (AAAA-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        placeholder="2026-10-20"
        value={fechaObjetivo}
        onChangeText={setFechaObjetivo}
      />

      <Text style={styles.label}>Kilometraje Objetivo (km)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 65000"
        keyboardType="numeric"
        value={kilometrajeObjetivo}
        onChangeText={setKilometrajeObjetivo}
      />

      <Text style={styles.label}>Estado (PENDIENTE, REALIZADO, PROXIMO, VENCIDO)</Text>
      <TextInput
        style={styles.input}
        placeholder="PENDIENTE"
        autoCapitalize="characters"
        value={estado}
        onChangeText={setEstado}
      />

      <TouchableOpacity
        style={[styles.botonGuardar, guardando && styles.botonDeshabilitado]}
        onPress={handleGuardar}
        disabled={guardando}
      >
        {guardando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotonGuardar}>
            {itemEditar ? 'Actualizar' : 'Guardar'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  label: { fontSize: 14, color: '#555', marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  botonGuardar: {
    backgroundColor: '#2e7d32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  botonDeshabilitado: { backgroundColor: '#a5d6a7' },
  textoBotonGuardar: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
