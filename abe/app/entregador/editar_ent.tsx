import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';

export default function EditarPerfil() {
  const router = useRouter();

  const [nome, setNome] = useState('Tom Jerry');
  const [email, setEmail] = useState('TJ@example.com');
  const [novaSenha, setNovaSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('01/01/1990');
  const [telefone, setTelefone] = useState('(00) 00000-0000');

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Botão de voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image 
            source={require('../../assets/images/seta-esquerda.png')} 
            style={styles.backIcon} 
          />
        </TouchableOpacity>

        <Text style={styles.title}>Edite Seu Perfil</Text>

        <View style={styles.centralBox}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/images/perfilfoto.png')} 
              style={styles.avatarImage} 
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Image 
                source={require('../../assets/images/camera.png')} 
                style={styles.cameraIcon} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput 
            style={styles.input} 
            value={nome} 
            onChangeText={setNome} 
          />

          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
          />

          <Text style={styles.label}>Nova Senha (opcional)</Text>
          <TextInput 
            style={styles.input} 
            value={novaSenha} 
            onChangeText={setNovaSenha} 
            secureTextEntry 
          />
          <Text style={styles.hint}>Deixe em branco se não quiser alterar a senha</Text>

          <Text style={styles.label}>Data de Nascimento</Text>
          <TextInput 
            style={styles.input} 
            value={dataNascimento} 
            onChangeText={setDataNascimento} 
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput 
            style={styles.input} 
            value={telefone} 
            onChangeText={setTelefone} 
          />

          {/* Botão Salvar */}
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
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
    alignItems: 'center',
    paddingVertical: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 25,
    height: 25,
    tintColor: '#000',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginTop: 40,
  },
  centralBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  avatarContainer: {
    width: 175.97,
    height: 175.97,
    borderRadius: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#242760', 
  },
  avatarImage: {
    width: 156,
    height: 156,
    resizeMode: 'contain',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cameraIcon: {
    width: 18,
    height: 18,
  },
  formContainer: {
    width: '85%',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#ACC852',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: -10,
    marginBottom: 10,
    fontStyle: 'italic',
  },
});
