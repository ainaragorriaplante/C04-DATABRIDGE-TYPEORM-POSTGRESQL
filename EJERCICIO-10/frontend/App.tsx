import { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Destino = {
  id: number;
  ciudad: string;
  pais: string;
  descripcion: string;
  visitado: boolean;
  prioridad: string;
};

const API_URL = 'http://172.17.21.53:3000';

export default function App() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [error, setError] = useState('');

  async function request(url: string, options?: RequestInit) {
    const r = await fetch(url, options);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r;
  }

  async function cargar() {
    try {
      const r = await request(API_URL + '/destinos');
      const data = await r.json();
      setDestinos(data);
      setError('');
    } catch {
      setError('No se pudieron cargar los destinos.');
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function toggleVisitado(id: number, estadoActual: boolean) {
    try {
      await request(`${API_URL}/destinos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitado: !estadoActual }),
      });
      await cargar();
    } catch {
      setError('No se pudo actualizar el estado.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>WANDER · DESPUÉS DEL RETO</Text>
      <Text style={styles.mainTitle}>Tu mejora</Text>

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={destinos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => toggleVisitado(item.id, item.visitado)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardTitle}>
              🌍 {item.ciudad}
            </Text>
            <Text style={styles.cardSubtitle}>
              {item.pais} · Prioridad {item.prioridad}
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <View style={styles.card}>
            <Text style={styles.cardTitle}>✔ Visitado</Text>
            <Text style={styles.cardSubtitle}>
              Ejemplo de mejora coherente
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121316',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardSubtitle: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF6B6B',
    marginBottom: 10,
  },
});