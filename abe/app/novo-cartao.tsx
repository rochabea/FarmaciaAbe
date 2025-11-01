import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { CartaoContext } from './parametros/CartaoContext';

export default function NovoCartao() {
  const router = useRouter();
  const { adicionarCartao } = useContext(CartaoContext);

  const [nome, setNome] = useState('');
  const [numero, setNumero] = useState('');
  const [codigo, setCodigo] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [bandeira, setBandeira] = useState('');

  const handleAdicionar = () => {
    adicionarCartao({ nome, numero, codigo, vencimento, bandeira });
    router.back();
  };


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

        {/* Topo */}
        <View style={styles.topRect}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Novo Cartão</Text>
          <View style={styles.iconCircle}>
            <Image source={require('../assets/images/cartao-de-credito.png')} style={styles.cartIcon} />
          </View>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          <Text style={styles.mainTitle}>Complete com os dados do cartão</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.labelBlack}>Nome do titular</Text>
            <TextInput style={styles.input} placeholder="Digite o nome" value={nome} onChangeText={setNome} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelBlack}>Número do cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelBlack}>Código de segurança</Text>
            <TextInput
              style={styles.input}
              placeholder="000"
              value={codigo}
              onChangeText={setCodigo}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelBlack}>Vencimento</Text>
            <TextInput style={styles.input} placeholder="MM/AA" value={vencimento} onChangeText={setVencimento} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelBlack}>Bandeira</Text>
            <TextInput style={styles.input} placeholder="Digite a bandeira" value={bandeira} onChangeText={setBandeira} />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleAdicionar}>
            <Text style={styles.buttonText}>Adicionar Cartão</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },

  topRect: {
    width: '100%',
    height: 180,
    backgroundColor: '#242760',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingTop: 50,
  },

  topTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },

  backIcon: {
    width: 25,
    height: 25,
  },

  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -60,
    borderWidth: 3,
    borderColor: '#fff',
  },

  cartIcon: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },

  formContainer: {
    marginTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  mainTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
    marginBottom: 20,
    textAlign: 'left',
  },

  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },

  labelBlack: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 5,
  },

  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#242760',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
