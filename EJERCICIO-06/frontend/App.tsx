// App.tsx
import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Libro = {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  leido: boolean;
};

const API_URL = 'http://192.168.1.158:3000';

export default function App() {
  const [libros, setLibros] = useState<Libro[]>([]);

  async function cargar() {
    try {
      const r = await fetch(API_URL + '/libros');
      setLibros(await r.json());
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function marcarComoLeido(id: number, estadoActual: boolean) {
    try {
      const r = await fetch(API_URL + '/libros/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leido: !estadoActual }),
      });

      if (r.ok) {
        // Volvemos a cargar para garantizar que PostgreSQL y la UI coincidan
        cargar();
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subtitle}>MY LIBRARY · DESPUÉS DEL RETO</Text>
      <Text style={styles.title}>Biblioteca</Text>

      <FlatList
        data={libros}
        keyExtractor={(x) => String(x.id)}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            {/* Tarjeta del libro */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📚 {item.titulo}</Text>
              <Text style={styles.cardSubtitle}>
                {item.autor} · {item.leido ? 'Leído ✓' : 'Pendiente'}
              </Text>
            </View>

            {/* Botón de acción PATCH */}
            <Pressable
              style={styles.button}
              onPress={() => marcarComoLeido(item.id, item.leido)}
            >
              <Text style={styles.buttonText}>
                {item.leido ? 'Marcar como no leído' : 'Marcar como leído'}
              </Text>
            </Pressable>
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
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
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
});