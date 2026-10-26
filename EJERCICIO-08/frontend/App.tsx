// App.tsx
import { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Cancion = {
  id: number;
  titulo: string;
  artista: string;
};

type Playlist = {
  id: number;
  nombre: string;
  canciones: Cancion[];
};

const API_URL = 'http://192.168.1.158:3000';

export default function App() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [error, setError] = useState('');

  async function request(url: string, options?: RequestInit) {
    const r = await fetch(url, options);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r;
  }

  async function cargar() {
    try {
      const r = await request(API_URL + '/playlists/1');
      const data = await r.json();
      setPlaylist(data);
      setError('');
    } catch {
      setError('No se pudo conectar con la API.');
    }
  }

  async function agregarCancion() {
    try {
      await request(API_URL + '/playlists/1/canciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: 'Midnight City',
          artista: 'M83',
        }),
      });
      cargar();
    } catch {
      setError('Error al añadir la canción.');
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subtitle}>MY PLAYLISTS · DESPUÉS DEL RETO</Text>
      <Text style={styles.title}>{playlist?.nombre || 'Cargando...'}</Text>

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={playlist?.canciones || []}
        keyExtractor={(x) => String(x.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎵 {item.titulo}</Text>
            <Text style={styles.cardSubtitle}>
              {item.artista}
              {item.titulo === 'Midnight City' ? ' · NUEVA' : ''}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={agregarCancion}>
        <Text style={styles.buttonText}>+ Añadir canción</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 12,
  },
});