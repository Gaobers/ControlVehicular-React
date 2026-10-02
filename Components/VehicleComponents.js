import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  Alert, ActivityIndicator, StyleSheet, ScrollView
} from 'react-native';

export const API_URL = 'http://192.168.1.11:8080/api/mantenimientos';

// Catálogo extendido de vehículos
const VEHICULOS = [
  { id: 1, info: 'Toyota Corolla' },
  { id: 2, info: 'Honda CR-V' },
  { id: 3, info: 'Nissan Sentra' },
  { id: 4, info: 'Ford Mustang' },
  { id: 5, info: 'Chevrolet Hilux' },
  { id: 6, info: 'Hyundai Tucson' },
];

// Opciones de estado disponibles para la aplicación
const ESTADOS = [
  { label: 'Pendiente', value: 'PENDIENTE', color: '#f59e0b', bg: '#fef3c7' },
  { label: 'Realizado', value: 'REALIZADO', color: '#10b981', bg: '#d1fae5' },
  { label: 'Vencido', value: 'VENCIDO', color: '#ef4444', bg: '#fee2e2' },
  { label: 'Próximo', value: 'PROXIMO', color: '#3b82f6', bg: '#dbeafe' },
];

const VehicleContext = createContext(null);

export const VehicleProvider = ({ children }) => {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMaintenances = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/lista`);
      
      if (response.status === 404) {
        setMaintenances([]);
        return;
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setMaintenances(data);
    } catch (error) {
      Alert.alert('Error de conexión', 'No se pudieron obtener los registros del servidor.');
      console.error('Error al obtener mantenimientos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaintenances();
  }, [fetchMaintenances]);

  const saveMaintenance = async (data, isEditing = false) => {
    try {
      const response = await fetch(API_URL, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Alert.alert('Éxito', isEditing ? 'Mantenimiento actualizado' : 'Mantenimiento registrado');
        fetchMaintenances();
        return true;
      }

      const err = await response.text();
      console.error('Error del servidor:', err);
      Alert.alert('Error', 'No se pudo guardar la información en el servidor.');
      return false;
    } catch (error) {
      Alert.alert('Error de red', 'Verifica tu conexión con el servidor backend.');
      console.error('Error de red:', error);
      return false;
    }
  };

  const deleteMaintenance = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        Alert.alert('Éxito', 'El estado del registro fue actualizado');
        fetchMaintenances();
      } else {
        Alert.alert('Error', 'No se pudo actualizar el registro.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <VehicleContext.Provider
      value={{ maintenances, loading, saveMaintenance, deleteMaintenance, refresh: fetchMaintenances }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error('useVehicle debe usarse dentro de <VehicleProvider>');
  return ctx;
};

export const AddMaintenanceForm = ({ editingMaintenance, onFinishEdit }) => {
  const { saveMaintenance } = useVehicle();
  const [vehiculo, setVehiculo] = useState(VEHICULOS[0]);
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [estado, setEstado] = useState('PENDIENTE');

  useEffect(() => {
    if (editingMaintenance) {
      const v = VEHICULOS.find((x) => x.id === editingMaintenance.vehiculoId) || VEHICULOS[0];
      setVehiculo(v);
      setService(editingMaintenance.servicio || '');
      setDate(editingMaintenance.fechaObjetivo ? editingMaintenance.fechaObjetivo.slice(0, 10) : '');
      setEstado(editingMaintenance.estado || 'PENDIENTE');
    } else {
      setEstado('PENDIENTE');
    }
  }, [editingMaintenance]);

  const handleSubmit = async () => {
    if (!service.trim() || !date.trim()) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      Alert.alert('Fecha inválida', 'Usa el formato AAAA-MM-DD.');
      return;
    }

    const item = {
      ...(editingMaintenance && { id: editingMaintenance.id }),
      vehiculoId: vehiculo.id,
      servicio: service.trim(),
      estado: estado,
      fechaObjetivo: date.trim(),
      kilometrajeObjetivo: editingMaintenance?.kilometrajeObjetivo || 0,
    };

    const ok = await saveMaintenance(item, !!editingMaintenance);
    if (ok) {
      setService('');
      setDate('');
      setEstado('PENDIENTE');
      if (onFinishEdit) onFinishEdit();
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {editingMaintenance ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
      </Text>

      {/* Selección de Vehículo */}
      <Text style={styles.labelGroup}>Seleccionar Vehículo:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
        {VEHICULOS.map((v) => (
          <TouchableOpacity
            key={v.id}
            style={[styles.chip, vehiculo.id === v.id && styles.chipActive]}
            onPress={() => setVehiculo(v)}
          >
            <Text style={vehiculo.id === v.id ? styles.chipTextActive : styles.chipText}>
              {v.info}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Selección de Estado */}
      <Text style={styles.labelGroup}>Estado del Mantenimiento:</Text>
      <View style={styles.rowWrap}>
        {ESTADOS.map((est) => {
          const isSelected = estado === est.value;
          return (
            <TouchableOpacity
              key={est.value}
              style={[
                styles.stateChip,
                { borderColor: est.color },
                isSelected && { backgroundColor: est.color }
              ]}
              onPress={() => setEstado(est.value)}
            >
              <Text style={[styles.stateChipText, { color: isSelected ? '#fff' : est.color }]}>
                {est.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Tipo de servicio (ej: Cambio de Aceite)"
        value={service}
        onChangeText={setService}
      />
      <TextInput
        style={styles.input}
        placeholder="Programación (AAAA-MM-DD)"
        value={date}
        onChangeText={setDate}
        keyboardType="numbers-and-punctuation"
      />

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {editingMaintenance ? 'Guardar Cambios' : 'Registrar Servicio'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const VehicleList = ({ onSelectEdit }) => {
  const { maintenances, loading, deleteMaintenance, refresh } = useVehicle();

  if (loading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 8 }}>Cargando datos del servidor...</Text>
      </View>
    );
  }

  const getStatusBadge = (status) => {
    const matched = ESTADOS.find((e) => e.value === status) || ESTADOS[0];
    return (
      <View style={[styles.badgeContainer, { backgroundColor: matched.bg }]}>
        <Text style={[styles.badgeText, { color: matched.color }]}>{matched.label}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={maintenances}
      keyExtractor={(item) => String(item.id)}
      refreshing={loading}
      onRefresh={refresh}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.vehicleText}>
              Vehículo ID #{item.vehiculoId}
            </Text>
            {getStatusBadge(item.estado)}
          </View>
          
          <Text style={styles.serviceText}>{item.servicio}</Text>
          <Text style={styles.dateText}>
            📅 Fecha: {item.fechaObjetivo ? item.fechaObjetivo.slice(0, 10) : 'Sin fecha'}
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.buttonSecondary} onPress={() => onSelectEdit(item)}>
              <Text style={styles.buttonSecondaryText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonDanger} onPress={() => deleteMaintenance(item.id)}>
              <Text style={styles.buttonDangerText}>Desactivar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No hay mantenimientos registrados en la API.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelGroup: { fontSize: 13, color: '#666', fontWeight: '600', marginBottom: 6, marginTop: 4 },
  scrollRow: { flexDirection: 'row', marginBottom: 12 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#eee', marginRight: 8 },
  chipActive: { backgroundColor: '#0066cc' },
  chipText: { color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  stateChip: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  stateChipText: { fontSize: 12, fontWeight: 'bold' },
  badgeContainer: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  buttonPrimary: { backgroundColor: '#0066cc', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  vehicleText: { fontSize: 16, fontWeight: 'bold', color: '#0066cc' },
  serviceText: { fontSize: 14, color: '#333', marginVertical: 4 },
  dateText: { fontSize: 12, color: '#666', marginBottom: 8 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  buttonSecondary: { backgroundColor: '#e2e8f0', padding: 8, borderRadius: 4 },
  buttonSecondaryText: { color: '#1e293b' },
  buttonDanger: { backgroundColor: '#fee2e2', padding: 8, borderRadius: 4 },
  buttonDangerText: { color: '#991b1b' },
  centerLoading: { padding: 20, alignItems: 'center' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
});