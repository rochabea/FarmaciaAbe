import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Botões do entregador*/}
      <View style={styles.entregadorContainer}>
        <TouchableOpacity 
          style={styles.buttonEntregador} 
          onPress={() => router.push('/entregador/login_ent')}
        >
          <Text style={styles.entregadorText}>Entrar como Entregador</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonEntregador} 
          onPress={() => router.push('/cadastro')}
        >
          <Text style={styles.entregadorText}>Cadastrar como Entregador</Text>
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

      {/* Texto de boas-vindas */}
      <Text style={styles.welcomeText}>Bem-vindo(a)!</Text>

      {/* Botões principais */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/cadastro')}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.buttonloja} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Entrar como lojista</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonloja} onPress={() => router.push('/cadastro')}>
        <Text style={styles.buttonText}>Cadastrar como lojista</Text>
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

  entregadorContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    alignItems: 'flex-end',
  },
  buttonEntregador: {
    backgroundColor: '#ACC852', 
    width: 200, 
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 8, 
  },
  entregadorText: {
    color: '#FFFFFF',
    fontSize: 12, 
    fontWeight: '700',
    textAlign: 'center',
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
  buttonloja: {
    width: '80%',
    height: 50,
    backgroundColor: '#2767B1',
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
