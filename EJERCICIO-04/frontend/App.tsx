// App.tsx — formulario POST con precioMedio y tarjeta
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
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [precioMedio, setPrecioMedio] = useState('');
  const [mensaje, setMensaje] = useState('');

  async function guardar() {
    try {
      const respuesta = await fetch(API_URL + '/restaurantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          tipo,
          ciudad,
          puntuacion: 9,
          precioMedio: parseFloat(precioMedio) || 0,
        }),
      });

      setMensaje(
        respuesta.ok ? 'Restaurante guardado ✓' : 'Error al guardar ✗',
      );

      if (respuesta.ok) {
        setNombre('');
        setTipo('');
        setCiudad('');
        setPrecioMedio('');
      }
    } catch (error) {
      setMensaje('Error de conexión');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subtitle}>FOOD SPOTS · DESPUÉS DEL RETO</Text>
      <Text style={styles.title}>Nuevo restaurante</Text>

      {/* Inputs de entrada */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#6B7280"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo"
        placeholderTextColor="#6B7280"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={styles.input}
        placeholder="Ciudad"
        placeholderTextColor="#6B7280"
        value={ciudad}
        onChangeText={setCiudad}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio medio (€)"
        placeholderTextColor="#6B7280"
        keyboardType="numeric"
        value={precioMedio}
        onChangeText={setPrecioMedio}
      />

      {/* Tarjeta de previsualización */}
      {(nombre !== '' || tipo !== '' || ciudad !== '') && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🍜 {nombre || 'Nombre'}</Text>
          <Text style={styles.cardSubtitle}>
            {tipo || 'Tipo'} · {ciudad || 'Ciudad'}
          </Text>
        </View>
      )}

      {/* Tarjeta del precio medio */}
      <View style={styles.priceCard}>
        <Text style={styles.priceText}>
          Precio medio: {precioMedio ? `${precioMedio} €` : '0 €'}
        </Text>
      </View>

      {/* Botón Guardar */}
      <Pressable style={styles.button} onPress={guardar}>
        <Text style={styles.buttonText}>Guardar restaurante</Text>
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
  input: {
    backgroundColor: '#1E1F24',
    color: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    fontSize: 15,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 18,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  priceCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
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