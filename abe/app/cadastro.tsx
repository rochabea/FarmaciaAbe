import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';

export default function Register() {
  const router = useRouter();
  const { signUp, signIn } = useAuth();

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async () => {
    // Validações
    if (!nomeCompleto.trim()) {
      Alert.alert('Atenção', 'Por favor, informe seu nome completo');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, informe seu e-mail');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Atenção', 'Por favor, insira um e-mail válido');
      return;
    }

    if (!senha.trim()) {
      Alert.alert('Atenção', 'Por favor, informe sua senha');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem. Por favor, verifique e tente novamente.');
      return;
    }

    // Verifica se o signUp está disponível
    if (!signUp) {
      console.error('signUp não está disponível no contexto');
      Alert.alert('Erro', 'Serviço de autenticação não disponível. Tente novamente mais tarde.');
      return;
    }

    try {
      setLoading(true);
      console.log('=== INICIANDO CADASTRO ===');
      console.log('Email:', email.trim());
      console.log('Nome:', nomeCompleto.trim());
      
      // Salva o nome completo no user_metadata com múltiplas chaves para compatibilidade
      const result = await signUp(email.trim(), senha, {
        full_name: nomeCompleto.trim(),
        name: nomeCompleto.trim(),
        nome: nomeCompleto.trim(),
      });
      
      console.log('=== RESULTADO DO CADASTRO ===');
      console.log('Result:', JSON.stringify(result, null, 2));
      console.log('Session:', result?.session ? 'SIM' : 'NÃO');
      console.log('User:', result?.user ? 'SIM' : 'NÃO');
      
      // Se o usuário foi criado, tenta fazer login automaticamente
      if (result?.user) {
        // Se já houver sessão, redireciona direto
        if (result?.session) {
          console.log('✅ Sessão criada - redirecionando para home');
          setLoading(false);
          // Pequeno delay para garantir que o estado foi atualizado
          setTimeout(() => {
            router.replace('/(tabs)/home');
          }, 500);
        } else {
          // Se não houver sessão, tenta fazer login automaticamente após um pequeno delay
          // (para dar tempo do trigger SQL confirmar o email)
          console.log('⚠️ Usuário criado mas sem sessão - aguardando e tentando login automático');
          setLoading(false);
          
          // Aguarda 1 segundo para dar tempo do trigger SQL confirmar o email
          setTimeout(async () => {
            try {
              console.log('Tentando login automático...');
              await signIn(email.trim(), senha);
              console.log('✅ Login automático realizado - redirecionando para home');
              router.replace('/(tabs)/home');
            } catch (loginError: any) {
              console.log('❌ Erro no login automático:', loginError);
              console.log('Mensagem do erro:', loginError?.message);
              
              // Se o erro for sobre email não confirmado, informa o usuário
              if (loginError?.message?.includes('email') || 
                  loginError?.message?.includes('confirm') ||
                  loginError?.message?.includes('not confirmed')) {
                Alert.alert(
                  'Conta criada!',
                  'Sua conta foi criada com sucesso! Verifique seu e-mail para confirmar a conta antes de fazer login.',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        router.replace('/login');
                      },
                    },
                  ]
                );
              } else {
                // Outro tipo de erro - informa que pode fazer login
                Alert.alert(
                  'Conta criada!',
                  'Sua conta foi criada! Você pode fazer login agora.',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        router.replace('/login');
                      },
                    },
                  ]
                );
              }
            }
          }, 1000);
        }
      } else {
        console.log('❌ Nenhum usuário retornado');
        setLoading(false);
        Alert.alert(
          'Atenção',
          'Não foi possível verificar o resultado do cadastro. Tente fazer login.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/login'),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('=== ERRO NO CADASTRO ===');
      console.error('Error:', error);
      console.error('Error message:', error?.message);
      console.error('Error code:', error?.code);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      setLoading(false);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = 'Não foi possível criar a conta. Tente novamente.';
      
      if (error?.message) {
        if (error.message.includes('already registered') || 
            error.message.includes('already exists') ||
            error.message.includes('User already registered')) {
          errorMessage = 'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.';
        } else if (error.message.includes('email')) {
          errorMessage = 'Erro ao enviar e-mail de confirmação. Verifique se o e-mail está correto.';
        } else if (error.message.includes('password')) {
          errorMessage = 'A senha não atende aos requisitos. Tente uma senha mais forte.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Erro ao cadastrar', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

        {/* Títulos */}
        <Text style={styles.mainTitle}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados abaixo para se cadastrar</Text>

        {/* Nome Completo */}
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
            autoCorrect={false}
          />
        </View>

        {/* Senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha (mínimo 6 caracteres)"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Confirmação de Senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a senha novamente"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Botão Cadastrar */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        {/* Link para login */}
        <TouchableOpacity 
          style={styles.loginLink} 
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginLinkText}>Já tem conta? Faça login aqui</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000ff', 
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
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#242760',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#000000ff',
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
  buttonDisabled: {
    opacity: 0.6,
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
