import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain"  />

      {/* Texto de boas-vindas */}
      <Text style={styles.welcomeText}>Bem-vindo(a)!</Text>

      {/* Botões */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/cadastro')}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 60,
    paddingHorizontal: 20,

  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: -80,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#242760', 
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#242760',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
