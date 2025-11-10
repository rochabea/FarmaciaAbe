import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';

export default function Splash() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Aguarda o carregamento da autenticação
    if (loading) return;

    // Navega após 2 segundos
    const timer = setTimeout(() => {
      if (user) {
        // Se o usuário estiver autenticado, vai para home
        router.replace('/(tabs)/home');
      } else {
        // Se não estiver autenticado, vai para tela de boas-vindas
        router.replace('/bemvindo');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, user]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../assets/images/logo.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />

      {/* Indicador de carregamento */}
      <ActivityIndicator 
        size="large" 
        color="#242760" 
        style={styles.loading} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 400,
    height: 400,
  },
  loading: {
    marginTop: 20,
  },
});
