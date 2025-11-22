import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterEnt() {

  const router = useRouter();

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

        <Text style={styles.mainTitle}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados abaixo</Text>

        {/* Nome */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome completo"
            value={nomeCompleto}
            onChangeText={setNomeCompleto}
            autoCapitalize="words"
          />
        </View>

        {/* CPF */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={styles.input}
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
            maxLength={14}
          />
        </View>

        {/* Telefone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            maxLength={15}
          />
        </View>

        {/* Endereço */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Endereço</Text>
          <TextInput
            style={styles.input}
            placeholder="Rua, número, complemento"
            value={endereco}
            onChangeText={setEndereco}
          />
        </View>

        {/* CEP */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={styles.input}
            placeholder="00000-000"
            value={cep}
            onChangeText={setCep}
            keyboardType="numeric"
            maxLength={9}
          />
        </View>

        {/* Cidade */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua cidade"
            value={cidade}
            onChangeText={setCidade}
          />
        </View>

        {/* Estado */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Estado</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: SP"
            value={estado}
            onChangeText={setEstado}
            maxLength={2}
            autoCapitalize="characters"
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>

        {/* Confirmar Senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a senha novamente"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/entregador/home')}
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => router.push('/entregador/login_ent')}
        >
          <Text style={styles.loginLinkText}>Já tem conta? Entre aqui</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
    fontWeight: '600',
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
    backgroundColor: '#ACC852',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  loginLink: {
    marginTop: 15,
  },
  loginLinkText: {
    color: '#242760',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
