import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const modos = [
  { label: 'Entregador', value: 'entregador', color: '#ACC852' },
  { label: 'Lojista', value: 'lojista', color: '#2767B1' },
  { label: 'Cliente', value: 'cliente', color: '#242760' },
];

export default function Index() {
  const router = useRouter();
  const [modo, setModo] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = () => {
    if (!modo) return alert('Selecione um modo');
    switch (modo) {
      case 'entregador': router.push('/entregador/login_ent'); break;
      case 'lojista': router.push('/login'); break;
      case 'cliente': router.push('/login'); break;
    }
  };

  const handleCadastro = () => {
    if (!modo) return alert('Selecione um modo');
    switch (modo) {
      case 'entregador': router.push('/cadastro'); break;
      case 'lojista': router.push('/cadastro'); break;
      case 'cliente': router.push('/cadastro'); break;
    }
  };

  const selectedColor = modos.find(m => m.value === modo)?.color || '#ccc';

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.welcomeText}>Bem-vindo(a)!</Text>

      {/* Botão para abrir modal */}
      <TouchableOpacity
        style={[styles.selectButton, { backgroundColor: selectedColor }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectButtonText}>
          {modo ? modos.find(m => m.value === modo)?.label : 'Selecione o modo'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Qual perfil deseja logar/cadastrar:</Text>
            <FlatList
              data={modos}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, { backgroundColor: item.color }]}
                  onPress={() => {
                    setModo(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Botões de ação */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
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
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#242760',
    marginBottom: 30,
    textAlign: 'center',
  },
  selectButton: {
    width: '80%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  selectButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
  },
  modalItem: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  modalItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
