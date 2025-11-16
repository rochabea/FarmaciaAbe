import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { supabase } from '../lib/supabase';

export default function EditarPerfil() {
  const router = useRouter();
  const { user, loading: authLoading, refreshSession } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carrega os dados do usuário
  useEffect(() => {
    if (user && !authLoading) {
      // Nome dos metadados
      const fullName = user.user_metadata?.full_name || 
                       user.user_metadata?.name || 
                       user.user_metadata?.nome || 
                       '';
      
      // Email do usuário
      const userEmail = user.email || '';
      
      // Telefone dos metadados
      const userPhone = user.user_metadata?.phone || 
                        user.user_metadata?.telefone || 
                        '';
      
      // Data de nascimento dos metadados
      const userBirthDate = user.user_metadata?.birth_date || 
                            user.user_metadata?.data_nascimento || 
                            '';

      setNome(fullName);
      setEmail(userEmail);
      setTelefone(userPhone);
      setDataNascimento(userBirthDate);
      setLoading(false);
    } else if (!authLoading && !user) {
      // Se não houver usuário autenticado, redireciona
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const handleSalvar = async () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    // Validações básicas
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Por favor, informe seu nome');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, informe seu email');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Atenção', 'Por favor, informe um email válido');
      return;
    }

    // Se o usuário preencheu uma nova senha, valida
    if (novaSenha.trim() && novaSenha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setSaving(true);

      // Atualiza os metadados do usuário
      const updates: any = {
        full_name: nome.trim(),
        name: nome.trim(),
        nome: nome.trim(),
      };

      if (telefone.trim()) {
        updates.phone = telefone.trim();
        updates.telefone = telefone.trim();
      }

      if (dataNascimento.trim()) {
        updates.birth_date = dataNascimento.trim();
        updates.data_nascimento = dataNascimento.trim();
      }

      // Atualiza os metadados
      const { error: metadataError } = await supabase.auth.updateUser({
        data: updates,
      });

      if (metadataError) throw metadataError;

      // Se o email mudou, atualiza o email
      if (email.trim() !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email.trim(),
        });

        if (emailError) {
          // Se o email já está em uso, mostra erro específico
          if (emailError.message.includes('already registered')) {
            Alert.alert('Erro', 'Este email já está em uso por outra conta');
            setSaving(false);
            return;
          }
          throw emailError;
        }
      }

      // Se o usuário preencheu uma nova senha, atualiza
      if (novaSenha.trim()) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: novaSenha.trim(),
        });

        if (passwordError) throw passwordError;
      }

      // Atualiza a sessão para refletir as mudanças
      await refreshSession();

      Alert.alert(
        'Sucesso',
        'Perfil atualizado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert(
        'Erro',
        error.message || 'Não foi possível atualizar o perfil. Tente novamente.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <View style={[styles.scrollContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#242760" />
        <Text style={{ marginTop: 12, color: '#666' }}>Carregando dados...</Text>
      </View>
    );
  }

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
          <TextInput 
            style={styles.input} 
            value={nome} 
            onChangeText={setNome} 
            placeholder="Digite seu nome completo"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Digite seu email"
          />

          <Text style={styles.label}>Nova Senha (opcional)</Text>
          <TextInput 
            style={styles.input} 
            value={novaSenha} 
            onChangeText={setNovaSenha} 
            secureTextEntry 
            placeholder="Deixe em branco para manter a senha atual"
          />
          <Text style={styles.hint}>Deixe em branco se não quiser alterar a senha</Text>

          <Text style={styles.label}>Data de Nascimento</Text>
          <TextInput 
            style={styles.input} 
            value={dataNascimento} 
            onChangeText={setDataNascimento} 
            placeholder="DD/MM/AAAA"
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput 
            style={styles.input} 
            value={telefone} 
            onChangeText={setTelefone} 
            keyboardType="phone-pad"
            placeholder="(00) 00000-0000"
          />

          <TouchableOpacity 
            style={[styles.button, saving && styles.buttonDisabled]} 
            onPress={handleSalvar}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            )}
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
  buttonDisabled: {
    opacity: 0.6,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: -10,
    marginBottom: 10,
    fontStyle: 'italic',
  },
});
