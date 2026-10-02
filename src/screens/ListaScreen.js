import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { mantenimientoService } from '../services/mantenimientoService';

export default function ListaScreen({ navigation }) {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarMantenimientos = async () => {
    try {
      const data = await mantenimientoService.obtenerTodos();
      setMantenimientos(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los mantenimientos');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarMantenimientos();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    cargarMantenimientos();
  };

  const handleEliminar = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este mantenimiento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await mantenimientoService.eliminar(id);
              Alert.alert('Éxito', 'Mantenimiento eliminado');
              cargarMantenimientos();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el registro');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.vehiculoText}>🚗 Vehículo ID: {item.vehiculoId}</Text>
        <Text style={styles.estadoText}>{item.estado}</Text>
      </View>
      <Text style={styles.servicioText}>{item.servicio}</Text>
      <Text style={styles.fechaText}>📅 Fecha Objetivo: {item.fechaObjetivo}</Text>
      {item.kilometrajeObjetivo ? (
        <Text style={styles.costoText}>
          🛣️ Kilometraje: {item.kilometrajeObjetivo.toLocaleString()} km
        </Text>
      ) : null}

      <View style={styles.accionesContainer}>
        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEditar]}
          onPress={() => navigation?.navigate('FormularioScreen', { item })}
        >
          <Text style={styles.textoBotonAccion}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEliminar]}
          onPress={() => handleEliminar(item.id)}
        >
          <Text style={styles.textoBotonAccion}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 10 }}>Cargando mantenimientos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botonNuevo}
        onPress={() => navigation?.navigate('FormularioScreen')}
      >
        <Text style={styles.textoBotonNuevo}>+ Nuevo Mantenimiento</Text>
      </TouchableOpacity>

      <FlatList
        data={mantenimientos}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No hay mantenimientos registrados.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  botonNuevo: {
    backgroundColor: '#0066cc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  textoBotonNuevo: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  vehiculoText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  estadoText: { fontSize: 13, color: '#2e7d32', fontWeight: '700' },
  servicioText: { fontSize: 15, color: '#555', marginBottom: 6 },
  fechaText: { fontSize: 13, color: '#666', marginBottom: 2 },
  costoText: { fontSize: 13, fontWeight: '600', color: '#444' },
  accionesContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  botonAccion: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginLeft: 8 },
  botonEditar: { backgroundColor: '#ff9800' },
  botonEliminar: { backgroundColor: '#d32f2f' },
  textoBotonAccion: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  emptyText: { fontSize: 16, color: '#777', textAlign: 'center' },
});