import React, { useState, createContext, useContext, useReducer, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

// ==========================================
// 1. VEHICLE CONTEXT
// ==========================================
const initialState = {
  vehicles: [
    { id: 'v1', make: 'Toyota', model: 'Corolla' },
    { id: 'v2', make: 'Honda', model: 'CR-V' },
  ],
  maintenances: [
    {
      id: 'm1',
      vehicleId: 'v1',
      service: 'Cambio de aceite y filtro',
      scheduledDate: '2026-10-15',
      status: 'Pendiente',
      isActive: true,
    },
    {
      id: 'm2',
      vehicleId: 'v2',
      service: 'Revisión del sistema de frenos',
      scheduledDate: '2026-11-01',
      status: 'Completado',
      isActive: true,
    },
  ],
  filters: {
    vehicleId: 'ALL',
    status: 'ALL',
  },
};

function vehicleReducer(state, action) {
  switch (action.type) {
    case 'ADD_MAINTENANCE':
      return {
        ...state,
        maintenances: [
          ...state.maintenances,
          {
            id: Date.now().toString(),
            ...action.payload,
            isActive: true,
          },
        ],
      };

    case 'UPDATE_MAINTENANCE':
      return {
        ...state,
        maintenances: state.maintenances.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload } : m
        ),
      };

    case 'TOGGLE_ACTIVE_STATUS':
      return {
        ...state,
        maintenances: state.maintenances.map((m) =>
          m.id === action.payload ? { ...m, isActive: !m.isActive } : m
        ),
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    default:
      return state;
  }
}

const VehicleContext = createContext();

export function VehicleProvider({ children }) {
  const [state, dispatch] = useReducer(vehicleReducer, initialState);

  return (
    <VehicleContext.Provider value={{ state, dispatch }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  return useContext(VehicleContext);
}

// ==========================================
// 2. ADD MAINTENANCE FORM
// ==========================================
export function AddMaintenanceForm({ editingMaintenance, onFinishEdit }) {
  const { state, dispatch } = useVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState(state.vehicles[0]?.id || '');
  const [service, setService] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [status, setStatus] = useState('Pendiente');

  useEffect(() => {
    if (editingMaintenance) {
      setSelectedVehicle(editingMaintenance.vehicleId);
      setService(editingMaintenance.service);
      setScheduledDate(editingMaintenance.scheduledDate);
      setStatus(editingMaintenance.status);
    }
  }, [editingMaintenance]);

  const handleSubmit = () => {
    if (!service.trim() || !scheduledDate.trim()) {
      Alert.alert('Error', 'Completa la descripción del servicio y la fecha');
      return;
    }

    if (editingMaintenance) {
      dispatch({
        type: 'UPDATE_MAINTENANCE',
        payload: {
          id: editingMaintenance.id,
          vehicleId: selectedVehicle,
          service,
          scheduledDate,
          status,
        },
      });
      Alert.alert('Éxito', 'Mantenimiento actualizado');
      onFinishEdit();
    } else {
      dispatch({
        type: 'ADD_MAINTENANCE',
        payload: {
          vehicleId: selectedVehicle,
          service,
          scheduledDate,
          status,
        },
      });
      Alert.alert('Éxito', 'Mantenimiento registrado');
    }

    setService('');
    setScheduledDate('');
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {editingMaintenance ? 'Modificar Mantenimiento' : 'Programar Mantenimiento'}
      </Text>

      <Text style={styles.label}>Seleccionar Vehículo:</Text>
      <View style={styles.row}>
        {state.vehicles.map((v) => (
          <TouchableOpacity
            key={v.id}
            style={[styles.chip, selectedVehicle === v.id && styles.chipActive]}
            onPress={() => setSelectedVehicle(v.id)}
          >
            <Text style={selectedVehicle === v.id ? styles.chipTextActive : styles.chipText}>
              {v.make} {v.model}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Servicio (ej. Cambio de Aceite)"
        value={service}
        onChangeText={setService}
      />

      <TextInput
        style={styles.input}
        placeholder="Programación (AAAA-MM-DD)"
        value={scheduledDate}
        onChangeText={setScheduledDate}
      />

      <Button
        title={editingMaintenance ? 'Guardar Cambios' : 'Registrar Servicio'}
        onPress={handleSubmit}
      />

      {editingMaintenance && (
        <View style={{ marginTop: 8 }}>
          <Button title="Cancelar Edición" color="gray" onPress={onFinishEdit} />
        </View>
      )}
    </View>
  );
}

// ==========================================
// 3. VEHICLE LIST
// ==========================================
export function VehicleList({ onSelectEdit }) {
  const { state, dispatch } = useVehicles();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState('ALL');

  const filteredMaintenances = state.maintenances.filter((m) => {
    const matchesVehicle = selectedVehicleFilter === 'ALL' || m.vehicleId === selectedVehicleFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || m.status === selectedStatusFilter;
    return matchesVehicle && matchesStatus;
  });

  const getVehicleName = (vehicleId) => {
    const v = state.vehicles.find((item) => item.id === vehicleId);
    return v ? `${v.make} ${v.model}` : 'Desconocido';
  };

  const toggleStatus = (id, currentIsActive) => {
    const actionText = currentIsActive ? 'desactivar' : 'activar';
    Alert.alert('Confirmación', `¿Deseas ${actionText} este mantenimiento?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () => dispatch({ type: 'TOGGLE_ACTIVE_STATUS', payload: id }),
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filterBox}>
        <Text style={styles.filterTitle}>Filtrar por Vehículo:</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.filterChip, selectedVehicleFilter === 'ALL' && styles.filterChipActive]}
            onPress={() => setSelectedVehicleFilter('ALL')}
          >
            <Text style={selectedVehicleFilter === 'ALL' ? styles.whiteText : styles.blackText}>Todos</Text>
          </TouchableOpacity>
          {state.vehicles.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[styles.filterChip, selectedVehicleFilter === v.id && styles.filterChipActive]}
              onPress={() => setSelectedVehicleFilter(v.id)}
            >
              <Text style={selectedVehicleFilter === v.id ? styles.whiteText : styles.blackText}>
                {v.make}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.filterTitle}>Filtrar por Estado:</Text>
        <View style={styles.row}>
          {['ALL', 'Pendiente', 'Completado'].map((st) => (
            <TouchableOpacity
              key={st}
              style={[styles.filterChip, selectedStatusFilter === st && styles.filterChipActive]}
              onPress={() => setSelectedStatusFilter(st)}
            >
              <Text style={selectedStatusFilter === st ? styles.whiteText : styles.blackText}>
                {st === 'ALL' ? 'Todos' : st}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredMaintenances}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.isActive && styles.cardInactive]}>
            <View style={styles.cardHeader}>
              <Text style={styles.vehicleTitle}>{getVehicleName(item.vehicleId)}</Text>
              <Text style={[styles.statusBadge, item.isActive ? styles.badgeActive : styles.badgeInactive]}>
                {item.isActive ? item.status : 'INACTIVO'}
              </Text>
            </View>

            <Text style={styles.serviceText}>🔧 {item.service}</Text>
            <Text style={styles.dateText}>📅 Programación: {item.scheduledDate}</Text>

            <View style={styles.actionRow}>
              {item.isActive && (
                <TouchableOpacity style={styles.btnEdit} onPress={() => onSelectEdit(item)}>
                  <Text style={styles.btnText}>Modificar</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.btnToggle, item.isActive ? styles.btnDisable : styles.btnEnable]}
                onPress={() => toggleStatus(item.id, item.isActive)}
              >
                <Text style={styles.btnText}>{item.isActive ? 'Desactivar' : 'Activar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 6,
    marginBottom: 4,
  },
  chipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 12,
    color: '#333',
  },
  chipTextActive: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  filterBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 4,
    marginBottom: 4,
  },
  filterChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginRight: 6,
    marginBottom: 4,
  },
  filterChipActive: {
    backgroundColor: '#333',
  },
  whiteText: { color: '#fff', fontSize: 11 },
  blackText: { color: '#333', fontSize: 11 },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  cardInactive: {
    backgroundColor: '#f0f0f0',
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  badgeActive: { backgroundColor: '#e3f2fd', color: '#1976d2' },
  badgeInactive: { backgroundColor: '#ffebee', color: '#c62828' },
  serviceText: { fontSize: 14, color: '#333', marginBottom: 2 },
  dateText: { fontSize: 12, color: '#666', marginBottom: 8 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btnEdit: {
    backgroundColor: '#ff9800',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 8,
  },
  btnToggle: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  btnDisable: { backgroundColor: '#e53935' },
  btnEnable: { backgroundColor: '#4caf50' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});