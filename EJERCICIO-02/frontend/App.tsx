import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Pelicula = {
  id: number;
  titulo: string;
  genero: string;
  anio: number;
  puntuacion: number;
  favorita: boolean;
};

// En web usa localhost:3000; en móvil físico usa la IP de la máquina
const BASE_URL = Platform.OS === 'web'
  ? 'http://localhost:3000'
  : 'http://172.22.26.116:3000';

export default function App() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [favoritos, setFavoritos] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function cargarPeliculas() {
      setCargando(true);
      setError('');
      try {
        let respuesta;
        try {
          respuesta = await fetch(`${BASE_URL}/peliculas`);
        } catch {
          // Fallback a localhost si la IP falla en local
          respuesta = await fetch('http://localhost:3000/peliculas');
        }

        if (!respuesta.ok) {
          throw new Error('La API no respondió correctamente');
        }

        const datos: Pelicula[] = await respuesta.json();
        setPeliculas(datos);
      } catch (err) {
        console.error(err);
        setError('No se ha podido conectar con NestJS. Revisa que el backend esté encendido.');
      } finally {
        setCargando(false);
      }
    }

    cargarPeliculas();
  }, []);

  const toggleFavorito = (id: number, favoritaInicial: boolean) => {
    setFavoritos((prev) => {
      const estadoActual = prev[id] !== undefined ? prev[id] : favoritaInicial;
      return { ...prev, [id]: !estadoActual };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.contentWrapper}>
        {/* Barra superior estilo móvil */}
        <View style={styles.notch} />

        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>CINEBOX · DESPUÉS DEL RETO</Text>
          <Text style={styles.title}>Cartelera</Text>
        </View>

        {cargando && (
          <ActivityIndicator size="large" color="#38BDF8" style={styles.center} />
        )}

        {error !== '' && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {!cargando && error === '' && (
          <FlatList
            data={peliculas}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const esFavorita =
                favoritos[item.id] !== undefined
                  ? favoritos[item.id]
                  : Boolean(item.favorita);

              return (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.movieTitle}>🎬  {item.titulo}</Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => toggleFavorito(item.id, Boolean(item.favorita))}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={styles.heartIcon}>
                        {esFavorita ? '♥' : '♡'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.movieSubtitle}>
                    {item.genero} · {item.anio}
                  </Text>
                </View>
              );
            }}
          />
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
    marginBottom: 22,
  },
  eyebrow: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#161A23',
    borderWidth: 1,
    borderColor: '#252D3C',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  heartIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  movieSubtitle: {
    color: '#8A97A8',
    fontSize: 14,
    marginTop: 8,
  },
  center: {
    marginTop: 60,
  },
  errorText: {
    color: '#F87171',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
  },
});

