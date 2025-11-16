import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { EnderecoContext } from './parametros/EnderecoContext';

export default function AddEndereco() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { adicionarEndereco } = useContext(EnderecoContext);
  const subtotalValor = params.subtotal ? parseFloat(params.subtotal as string) : 0;

  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [bairro, setBairro] = useState('');
  const [loading, setLoading] = useState(false);

  const cadastrarEndereco = async () => {
    // Validações básicas
    if (!logradouro.trim() || !numero.trim() || !cep.trim() || !cidade.trim() || !estado.trim() || !bairro.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      
      const novoEndereco = await adicionarEndereco({
        logradouro: logradouro.trim(),
        numero: numero.trim(),
        cep: cep.trim(),
        cidade: cidade.trim(),
        estado: estado.trim(),
        bairro: bairro.trim(),
      });
      
      if (!novoEndereco || !novoEndereco.id) {
        throw new Error('Endereço não foi criado corretamente');
      }
      
      setLoading(false);
      
      // Navega de volta para a tela de endereços para que o usuário possa selecionar
      const subtotalString = subtotalValor > 0 ? subtotalValor.toString() : '0';
      router.push({
        pathname: '/entrega',
        params: {
          subtotal: subtotalString,
        },
      });
    } catch (error: any) {
      console.error('Erro ao cadastrar endereço:', error);
      setLoading(false);
      Alert.alert('Erro', error.message || 'Não foi possível cadastrar o endereço. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.mainTitle}>Cadastro e seu endereço</Text>
        <Text style={styles.subtitle}>Complete com os dados para receber seus pedidos.</Text>

        {['Logradouro','Número','CEP','Cidade','Estado','Bairro'].map((label,index) => {
          const setters = [setLogradouro,setNumero,setCep,setCidade,setEstado,setBairro];
          const values = [logradouro,numero,cep,cidade,estado,bairro];
          const placeholders = ['Rua Exemplo','00','00000-00','Cidade','Estado','Bairro'];
          return (
            <View key={index} style={styles.inputContainer}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                placeholder={placeholders[index]}
                value={values[index]}
                onChangeText={setters[index]}
                keyboardType={label === 'Número' || label === 'CEP' ? 'numeric' : 'default'}
              />
            </View>
          );
        })}

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.6 }]} 
          onPress={cadastrarEndereco}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Cadastrando...' : 'Cadastrar Localização'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
    zIndex: 10,
  },

  backIcon: {
    width: 25,
    height: 25,
    tintColor: '#000', // seta preta

  },

  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000ff',
    marginTop: 70,
    marginBottom: 5,
    textAlign: 'left',
  },

  subtitle: {
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

  label: {
    fontSize: 16,
    color: '#000000ff',
    marginBottom: 5,
    fontWeight: '700',
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
