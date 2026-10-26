// App.tsx
import { useEffect, useState } from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View,} from 'react-native';

type Sneaker = {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  talla: number;
  stock: number;
};

const API_URL = 'http://192.168.1.158:3000';

export default function App() {
  const [items, setItems] = useState<Sneaker[]>([]);
  const [error, setError] = useState('');

  async function request(url: string, options?: RequestInit) {
    const r = await fetch(url, options);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r;
  }

  async function cargar() {
    try {
      const r = await request(API_URL + '/sneakers');
      setItems(await r.json());
      setError('');
    } catch {
      setError('No se pudo conectar con la API.');
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subtitle}>SNEAKER VAULT · DESPUÉS DEL RETO</Text>
      <Text style={styles.title}>Inventario</Text>

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={items}
        keyExtractor={(x) => String(x.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>👟 {item.modelo}</Text>
            <Text style={styles.cardSubtitle}>
              {item.marca} ·{' '}
              {item.stock === 0 ? (
                <Text style={styles.outOfStock}>AGOTADO</Text>
              ) : (
                `Stock ${item.stock}`
              )}
            </Text>
          </View>
        )}
      />
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
    marginBottom: 6,
  },
  cardSubtitle: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '500',
  },
  outOfStock: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 12,
  },
});