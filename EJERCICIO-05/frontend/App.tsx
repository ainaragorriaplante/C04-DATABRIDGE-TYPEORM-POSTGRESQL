// App.tsx — Edición parcial con PATCH
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_URL = 'http://192.168.1.158:3000';

export default function App() {
  const [estado, setEstado] = useState('RESERVADO');
  const [fecha, setFecha] = useState('10/04/2027');
  const [mensaje, setMensaje] = useState('');

  async function actualizar() {
    try {
      const r = await fetch(API_URL + '/viajes/1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado,
          fecha,
        }),
      });

      setMensaje(r.ok ? 'Viaje actualizado ✓' : 'No se pudo actualizar');
    } catch (error) {
      setMensaje('Error de conexión');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subtitle}>TRAVEL BOOK · DESPUÉS DEL RETO</Text>
      <Text style={styles.title}>Editar viaje</Text>

      {/* Tarjeta de información principal del viaje */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>✈️ Tokio</Text>
        <Text style={styles.cardSubtitle}>Japón · {estado}</Text>
      </View>

      {/* Tarjeta de edición de fecha */}
      <View style={styles.dateCard}>
        <Text style={styles.dateLabel}>📅 Fecha: </Text>
        <TextInput
          style={styles.dateInput}
          value={fecha}
          onChangeText={setFecha}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#6B7280"
        />
      </View>

      {/* Input de estado opcional */}
      <TextInput
        style={styles.input}
        value={estado}
        onChangeText={setEstado}
        placeholder="Estado (ej. RESERVADO)"
        placeholderTextColor="#6B7280"
      />

      {/* Botón Guardar cambios */}
      <Pressable style={styles.button} onPress={actualizar}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </Pressable>

      {mensaje ? <Text style={styles.statusText}>{mensaje}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#121316',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  dateLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  dateInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    padding: 0,
  },
  input: {
    backgroundColor: '#1E1F24',
    color: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statusText: {
    color: '#10B981',
    textAlign: 'center',
    marginTop: 14,
    fontSize: 15,
  },
});