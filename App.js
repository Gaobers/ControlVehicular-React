import React, { useState } from 'react';
import { StyleSheet, Text, StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { VehicleProvider, AddMaintenanceForm, VehicleList } from './Components/VehicleComponents';

export default function App() {
  const [editing, setEditing] = useState(null);

  return (
    <SafeAreaProvider>
      <VehicleProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <Text style={styles.title}>Control Vehicular</Text>
          
          <View style={styles.content}>
            <AddMaintenanceForm 
              editingMaintenance={editing} 
              onFinishEdit={() => setEditing(null)} 
            />
            <VehicleList onSelectEdit={setEditing} />
          </View>
        </SafeAreaView>
      </VehicleProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, backgroundColor: '#f1f5f9' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, paddingHorizontal: 16 },
  content: { flex: 1, paddingHorizontal: 16 },
});