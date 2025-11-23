import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { EnderecoContext } from './parametros/EnderecoContext';
import { Picker } from '@react-native-picker/picker';

// Lista de UFs
const UFS = [
  { label: "Selecione o estado", value: "" },
  { label: "AC - Acre", value: "AC" },
  { label: "AL - Alagoas", value: "AL" },
  { label: "AP - Amapá", value: "AP" },
  { label: "AM - Amazonas", value: "AM" },
  { label: "BA - Bahia", value: "BA" },
  { label: "CE - Ceará", value: "CE" },
  { label: "DF - Distrito Federal", value: "DF" },
  { label: "ES - Espírito Santo", value: "ES" },
  { label: "GO - Goiás", value: "GO" },
  { label: "MA - Maranhão", value: "MA" },
  { label: "MT - Mato Grosso", value: "MT" },
  { label: "MS - Mato Grosso do Sul", value: "MS" },
  { label: "MG - Minas Gerais", value: "MG" },
  { label: "PA - Pará", value: "PA" },
  { label: "PB - Paraíba", value: "PB" },
  { label: "PR - Paraná", value: "PR" },
  { label: "PE - Pernambuco", value: "PE" },
  { label: "PI - Piauí", value: "PI" },
  { label: "RJ - Rio de Janeiro", value: "RJ" },
  { label: "RN - Rio Grande do Norte", value: "RN" },
  { label: "RS - Rio Grande do Sul", value: "RS" },
  { label: "RO - Rondônia", value: "RO" },
  { label: "RR - Roraima", value: "RR" },
  { label: "SC - Santa Catarina", value: "SC" },
  { label: "SP - São Paulo", value: "SP" },
  { label: "SE - Sergipe", value: "SE" },
  { label: "TO - Tocantins", value: "TO" },
];

export default function AddEndereco() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { adicionarEndereco } = useContext(EnderecoContext);

  const subtotalValor = params.subtotal ? parseFloat(params.subtotal as string) : 0;
  const freteValor = params.frete ? parseFloat(params.frete as string) : 0;

  const cepParam = params.cep ? String(params.cep).replace(/\D/g, '') : '';

  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [bairro, setBairro] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  // Controla modal do picker no iOS
  const [ufModal, setUfModal] = useState(false);

  // Preenche CEP inicial
  useEffect(() => {
    if (cepParam && !cep) {
      const formatado = cepParam.replace(/(\d{5})(\d{3})/, '$1-$2');
      setCep(formatado);
      buscarViaCEP(cepParam);
    }
  }, [cepParam]);

  const buscarViaCEP = async (cepLimpo: string) => {
    try {
      setLoadingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        Alert.alert('CEP inválido', 'Não foi possível localizar o CEP informado.');
        return;
      }

      setLogradouro(data.logradouro || '');
      setBairro(data.bairro || '');
      setCidade(data.localidade || '');
      setEstado(data.uf || '');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível consultar o CEP.');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepChange = (text: string) => {
    const cepLimpo = text.replace(/\D/g, '');
    if (cepLimpo.length <= 8) {
      const formatado = cepLimpo.replace(/(\d{5})(\d)/, '$1-$2');
      setCep(formatado);

      if (cepLimpo.length === 8) {
        buscarViaCEP(cepLimpo);
      }
    }
  };

  const cadastrarEndereco = async () => {
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

      router.push({
        pathname: '/entrega',
        params: {
          subtotal: subtotalValor.toString(),
          frete: freteValor.toString(),
          cep: cep.replace(/\D/g, ''),
        },
      });
    } catch (error: any) {
      console.error('Erro ao cadastrar endereço:', error);
      Alert.alert('Erro', error.message || 'Não foi possível cadastrar o endereço.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* VOLTAR */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.mainTitle}>Cadastro de endereço</Text>
        <Text style={styles.subtitle}>Preencha os dados para receber seus pedidos.</Text>

        {/* LOGRADOURO */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Logradouro</Text>
          <TextInput
            style={styles.input}
            placeholder="Rua Exemplo"
            value={logradouro}
            onChangeText={setLogradouro}
          />
        </View>

        {/* NÚMERO */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.input}
            placeholder="00"
            value={numero}
            onChangeText={(t) => setNumero(t.replace(/\D/g, ''))}
            keyboardType="numeric"
          />
        </View>

        {/* CEP */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={styles.input}
            placeholder="00000-000"
            value={cep}
            onChangeText={handleCepChange}
            keyboardType="numeric"
            maxLength={9}
          />
          {loadingCep && <Text style={styles.loadingCepText}>Buscando CEP...</Text>}
        </View>

        {/* BAIRRO */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bairro</Text>
          <TextInput
            style={styles.input}
            placeholder="Bairro"
            value={bairro}
            onChangeText={setBairro}
          />
        </View>

        {/* CIDADE */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            value={cidade}
            onChangeText={setCidade}
          />
        </View>

        {/* ESTADO – Dropdown Android / Modal iOS */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Estado</Text>

          {Platform.OS === "ios" ? (
            <>
              {/* Botão estilizado */}
              <TouchableOpacity
                style={styles.iosPickerButton}
                onPress={() => setUfModal(true)}
              >
                <Text style={styles.iosPickerButtonText}>
                  {estado ? estado : "Selecione o estado"}
                </Text>
              </TouchableOpacity>

              {/* Modal */}
              <Modal
                visible={ufModal}
                transparent
                animationType="slide"
                onRequestClose={() => setUfModal(false)}
              >
                <Pressable
                  style={styles.iosModalOverlay}
                  onPress={() => setUfModal(false)}
                >
                  <Pressable style={styles.iosModalContent}>
                    <View style={styles.iosModalHeader}>
                      <TouchableOpacity onPress={() => setUfModal(false)}>
                        <Text style={styles.iosModalCancel}>Cancelar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setUfModal(false)}>
                        <Text style={styles.iosModalDone}>OK</Text>
                      </TouchableOpacity>
                    </View>

                    <Picker
                      selectedValue={estado}
                      onValueChange={(value) => setEstado(value)}
                      style={{ height: 200 }}
                    >
                      {UFS.map((uf) => (
                        <Picker.Item key={uf.value} label={uf.label} value={uf.value} />
                      ))}
                    </Picker>
                  </Pressable>
                </Pressable>
              </Modal>
            </>
          ) : (
            // ANDROID PICKER NORMAL
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={estado}
                onValueChange={(value) => setEstado(value)}
                style={styles.picker}
                mode="dropdown"
              >
                {UFS.map((uf) => (
                  <Picker.Item key={uf.value} label={uf.label} value={uf.value} />
                ))}
              </Picker>
            </View>
          )}
        </View>

        {/* BOTÃO */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={cadastrarEndereco}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar Localização</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

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

  backIcon: { width: 25, height: 25, tintColor: '#000' },

  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 70,
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
    marginBottom: 20,
  },

  inputContainer: { width: '100%', marginBottom: 15 },

  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
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

  loadingCepText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },

  // ANDROID PICKER
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },

  // iOS POPUP DROPDOWN
  iosPickerButton: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  iosPickerButtonText: {
    fontSize: 16,
    color: "#000",
  },

  iosModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  iosModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 10,
  },

  iosModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  iosModalCancel: {
    fontSize: 16,
    color: "#666",
  },

  iosModalDone: {
    fontSize: 16,
    fontWeight: "700",
    color: "#242760",
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
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
