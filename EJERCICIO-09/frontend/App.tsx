// App.tsx
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Evento = {
  id: number;
  nombre: string;
  ciudad: string;
  categoria: string;
  fecha: string;
};

const API_URL = 'http://172.17.21.53:3000';

export default function App() {
  const [eventos, setEventos] = useState<Evento[]>([]);

  async function filtrar(ciudad?: string, categoria?: string) {
    const params = new URLSearchParams();
    if (ciudad) params.append('ciudad', ciudad);
    if (categoria) params.append('categoria', categoria);

    const queryString = params.toString();
    const url = `${API_URL}/eventos${queryString ? `?${queryString}` : ''}`;

    const r = await fetch(url);
    const data = await r.json();
    setEventos(data);
  }

  useEffect(() => {
    filtrar('Zaragoza', 'Tecnologia');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subtitle}>EVENT RADAR · DESPUÉS DEL RETO</Text>
      <Text style={styles.title}>Eventos filtrados</Text>

      {/* Tarjeta con los criterios de filtro aplicados */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Zaragoza</Text>
        <Text style={styles.cardSubtitle}>Categoría: Tecnología</Text>
      </View>

      {/* Lista de eventos devueltos por la API */}
      <FlatList
        data={eventos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎟️ {item.nombre}</Text>
            <Text style={styles.cardSubtitle}>
              {item.ciudad} · {item.categoria === 'Tecnologia' ? 'Tecnología' : item.categoria}
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
    marginBottom: 8,
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
});