import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

// ⚠️ IMPORTANT :
// - Si tu es sur un émulateur Android : garde 10.0.2.2
// - Si un jour tu es sur la même machine (RN Windows, etc.) : tu peux essayer localhost
const BACKEND_URL = 'http://10.0.2.2:3000/';
// const BACKEND_URL = 'http://localhost:3000/';

const App = () => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFromBackend = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(BACKEND_URL);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        // Ton backend renvoie juste du texte "API Natty en ligne 🚀"
        const text = await response.text();
        setData(text);
      } catch (err: any) {
        console.error('Erreur fetch backend:', err);
        setError(err.message ?? 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchFromBackend();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Natty - Frontend</Text>

      {loading && (
        <ActivityIndicator size="large" />
      )}

      {error && (
        <Text style={styles.error}>
          Erreur lors de l&apos;appel API : {error}
        </Text>
      )}

      {data && !loading && !error && (
        <Text style={styles.text}>
          Réponse du backend : {'\n'}
          {data}
        </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});

export default App;
