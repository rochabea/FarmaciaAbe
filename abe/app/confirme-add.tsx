import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ConfirmEd() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Recebe o endereço selecionado
  const endereco = params.endereco ? JSON.parse(params.endereco as string) : null;
  const subtotalValor = params.subtotal ? parseFloat(params.subtotal as string) : 0;


  if (!endereco) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Nenhum endereço selecionado</Text>
      </View>
    );
  }

  const confirmarEndereco = () => {
  router.push(`/opcao-pagamentoE?subtotal=${subtotalValor}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
      </TouchableOpacity>

      {/* Cabeçalho */}
      <View style={styles.headerRow}>
        <Image source={require('../assets/images/local (2).png')} style={styles.locationIcon} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.mainTitle}>Confirme o seu endereço</Text>
          <Text style={styles.subtitle}>Para a certeza de receber o seu pedido</Text>
        </View>
      </View>

      {/* Campos do endereço */}
      <View style={styles.enderecoBox}>
        {[
          { label: 'Logradouro', value: endereco.logradouro },
          { label: 'Número', value: endereco.numero },
          { label: 'CEP', value: endereco.cep },
          { label: 'Cidade', value: endereco.cidade },
          { label: 'Estado', value: endereco.estado },
          { label: 'Bairro', value: endereco.bairro },
        ].map((item, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Botão confirmar */}
      <TouchableOpacity style={styles.button} onPress={confirmarEndereco}>
        <Text style={styles.buttonText}>Confirmar Endereço</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollContainer: {
    flexGrow: 1,
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
    tintColor: '#000',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 20,
    width: '100%',
  },
  locationIcon: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
    marginTop: 5,
  },

  enderecoBox: {
    marginTop: 20,
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000ff',
    marginBottom: 5,
  },
  inputBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#544C4C33',
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'transparent',
  },
  inputText: {
    fontSize: 16,
    color: '#544C4C',
  },

  button: {
    width: '100%',
    backgroundColor: '#242760',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

