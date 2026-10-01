import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import {
  VehicleProvider,
  AddMaintenanceForm,
  VehicleList,
} from './Components/VehicleComponents.js';

export default function App() {
  const [editingMaintenance, setEditingMaintenance] = useState(null);

  return (
    <VehicleProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Gestión de Mantenimientos</Text>

        <AddMaintenanceForm
          editingMaintenance={editingMaintenance}
          onFinishEdit={() => setEditingMaintenance(null)}
        />

        <VehicleList onSelectEdit={(item) => setEditingMaintenance(item)} />
      </SafeAreaView>
    </VehicleProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 45,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#1a1a1a',
  },
});