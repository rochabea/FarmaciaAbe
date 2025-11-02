import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';

export default function EditarPerfil() {
  const router = useRouter();

  const [nome, setNome] = useState('Ana Beatriz');
  const [email, setEmail] = useState('anabeatriz@gmail.com');
  const [senha, setSenha] = useState('********');
  const [dataNascimento, setDataNascimento] = useState('23/05/1995');
  const [telefone, setTelefone] = useState('(61) 900000-0000');

  const handleSalvar = () => {
    router.back(); 
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image 
            source={require('../assets/images/seta-esquerda.png')} 
            style={styles.backIcon} 
          />
        </TouchableOpacity>
        <Text style={styles.title}>Edite Seu Perfil</Text>
        <View style={styles.centralBox}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../assets/images/perfilfoto.png')} 
              style={styles.avatarImage} 
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Image 
                source={require('../assets/images/camera.png')} 
                style={styles.cameraIcon} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

          <Text style={styles.label}>Senha</Text>
          <TextInput 
            style={styles.input} 
            value={senha} 
            onChangeText={setSenha} 
            secureTextEntry 
          />

          <Text style={styles.label}>Data de Nascimento</Text>
          <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} />

          <Text style={styles.label}>Telefone</Text>
          <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

          <TouchableOpacity style={styles.button} onPress={handleSalvar}>
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
    backgroundColor: '#ffffffff',
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
    backgroundColor: '#242760',
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
});
