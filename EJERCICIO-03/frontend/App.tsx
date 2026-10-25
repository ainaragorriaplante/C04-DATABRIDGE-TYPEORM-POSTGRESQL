// App.tsx
// RESPONSABILIDAD: solicitar una mascota concreta y mostrar su ficha.
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Paso 4: el tipo incluye el nuevo campo para que TypeScript lo valide.
type Mascota = {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  ciudad: string;
  nivelEnergia: string;
};

const BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://192.168.1.158:3000';

export default function App() {
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarMascota() {
      try {
        let respuesta;
        try {
          respuesta = await fetch(`${BASE_URL}/mascotas/1`);
        } catch {
          // Fallback a localhost si la IP no responde (entorno web local)
          respuesta = await fetch('http://localhost:3000/mascotas/1');
        }

        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status}: mascota no encontrada`);
        }

        const dato: Mascota = await respuesta.json();
        setMascota(dato);
      } catch (err) {
        console.error(err);
        setError('No se pudo conectar con NestJS. Revisa el backend.');
      } finally {
        setCargando(false);
      }
    }

    cargarMascota();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.contentWrapper}>
        {/* Notch decorativo */}
        <View style={styles.notch} />

        {/* Cabecera */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>PET PROFILE · DESPUÉS DEL RETO</Text>
        </View>

        {/* Estado: cargando */}
        {cargando && (
          <ActivityIndicator size="large" color="#94A3B8" style={styles.center} />
        )}

        {/* Estado: error */}
        {!cargando && error !== '' && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Estado: éxito — Paso 4: nivelEnergia sólo aparece cuando la petición cargó */}
        {!cargando && error === '' && mascota !== null && (
          <>
            <Text style={styles.petName}>{mascota.nombre}</Text>

            {/* Tarjeta de raza/edad/ciudad */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🐶  {mascota.raza}</Text>
              <Text style={styles.cardSubtitle}>
                {mascota.edad} años · {mascota.ciudad}
              </Text>
            </View>

            {/* Tarjeta de nivel de energía */}
            <View style={styles.card}>
              <Text style={styles.energyText}>
                ⚡ Nivel de energía: {mascota.nivelEnergia}
              </Text>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E121B',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  notch: {
    width: 65,
    height: 4,
    backgroundColor: '#2D3748',
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 8,
  },
  eyebrow: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  petName: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#161A23',
    borderWidth: 1,
    borderColor: '#252D3C',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#8A97A8',
    fontSize: 14,
    marginTop: 6,
  },
  energyText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  center: {
    marginTop: 80,
  },
  errorText: {
    color: '#F87171',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});
