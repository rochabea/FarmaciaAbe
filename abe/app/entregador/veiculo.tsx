import React, { useState } from 'react';
import {View,Text,TextInput,StyleSheet,TouchableOpacity,Image,ScrollView,FlatList,Alert,} from 'react-native';
import { useRouter } from 'expo-router';

type Veiculo = {
  id: string;
  tipo: string;
  modelo: string;
  placa: string;
  cor: string;
};

export default function CadastroVeiculo() {
  const router = useRouter();

  const [tipo, setTipo] = useState('');
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [cor, setCor] = useState('');
  const [veiculos, setVeiculos] = useState<Veiculo[]>([
    { id: '1', tipo: 'Moto', modelo: 'Honda CG 160', placa: 'ABC1D23', cor: 'Preto' },
    { id: '2', tipo: 'Carro', modelo: 'Fiat Uno', placa: 'XYZ9F87', cor: 'Branco' },
  ]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<string | null>(null);

  const salvarVeiculo = () => {
    if (!tipo || !modelo || !placa || !cor) {
      Alert.alert('Erro', 'Preencha todos os campos antes de salvar.');
      return;
    }

    const novoVeiculo: Veiculo = {
      id: Date.now().toString(),
      tipo,
      modelo,
      placa,
      cor,
    };

    setVeiculos(prev => [...prev, novoVeiculo]);
    setTipo('');
    setModelo('');
    setPlaca('');
    setCor('');
    Alert.alert('Sucesso', 'Veículo cadastrado com sucesso!');
  };

  const selecionarVeiculo = (id: string) => setVeiculoSelecionado(id);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* TOPO */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image
            source={require('../../assets/images/seta-esquerda.png')}
            style={styles.backIcon}
        />
        </TouchableOpacity>


        <View style={styles.topTitleContainer}>
          <Text style={styles.topLine1}>Cadastro de</Text>
          <Text style={styles.topLine2}>Veículos</Text>
        </View>

        <TouchableOpacity style={styles.notification} onPress={() => router.push('/notificacao')}>
          <Image
            source={require('../../assets/images/notificacao.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image
            source={require('../../assets/images/carro.png')}
            style={styles.carIcon}
          />
        </View>
      </View>

      <View style={{ height: 80 }} />

      <View style={styles.contentContainer}>
        {/* Lista de veículos */}
        <Text style={styles.subtituloLista}>Veículos cadastrados:</Text>
        {veiculos.length === 0 ? (
          <Text style={{ marginBottom: 15, color: '#999' }}>Nenhum veículo cadastrado ainda.</Text>
        ) : (
          <FlatList
            data={veiculos}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.cardVeiculo,
                  veiculoSelecionado === item.id && { borderColor: '#242760', borderWidth: 2 },
                ]}
                onPress={() => selecionarVeiculo(item.id)}
              >
                <Text style={styles.textoVeiculo}>{item.tipo} - {item.modelo}</Text>
                <Text style={styles.textoVeiculo}>Placa: {item.placa}</Text>
                <Text style={styles.textoVeiculo}>Cor: {item.cor}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Formulário */}
        <Text style={styles.subtituloLista}>Cadastre um novo veículo:</Text>

        <Text style={styles.label}>Tipo de Veículo</Text>
        <TextInput
          style={styles.input}
          placeholder="Moto, Carro, Bicicleta..."
          placeholderTextColor="#999"
          value={tipo}
          onChangeText={setTipo}
        />

        <Text style={styles.label}>Modelo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Honda CG 160"
          placeholderTextColor="#999"
          value={modelo}
          onChangeText={setModelo}
        />

        <Text style={styles.label}>Placa</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: ABC1D23"
          placeholderTextColor="#999"
          value={placa}
          onChangeText={setPlaca}
        />

        <Text style={styles.label}>Cor</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Preto"
          placeholderTextColor="#999"
          value={cor}
          onChangeText={setCor}
        />

        <TouchableOpacity style={styles.botaoSalvar} onPress={salvarVeiculo}>
          <Text style={styles.textoBotaoSalvar}>Salvar Veículo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: '#fff',
    paddingBottom: 40,
  },

  // Topo
  topRect: {
    width: '100%',
    height: 250,
    backgroundColor: '#ACC852',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
topTitleContainer: {
  position: 'absolute',
  top: 80,
  left: 0,
  right: 0,
  alignItems: 'center',
},
topLine1: {
  color: '#fff',
  fontSize: 28,
  fontWeight: '700',
  textAlign: 'center',
},
topLine2: {
  color: '#fff',
  fontSize: 28,
  fontWeight: '700',
  textAlign: 'center',
},

  backButton: { position: 'absolute', left: 20, top: 98 },
  backIcon: { width: 34, height: 34, tintColor: '#fff' },
  notification: { position: 'absolute', right: 20, top: 92 },
  notificationIcon: { width: 34, height: 34, tintColor: '#fff' },

  iconCircle: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -72,
    borderWidth: 3,
    borderColor: '#fff',
  },
  carIcon: { width: 80, height: 80, tintColor: '#242760' },

  // Conteúdo
  contentContainer: {
    paddingHorizontal: 20,
  },

  subtituloLista: { fontSize: 18, fontWeight: '700', color: '#242760', marginBottom: 10, marginTop: 20 },

  cardVeiculo: {
    width: '100%',
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textoVeiculo: { fontSize: 15, color: '#000', fontWeight: '600' },

  label: { fontSize: 16, fontWeight: '700', color: '#544C4C', marginTop: 15 },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 5,
    color: '#000',
  },
  botaoSalvar: {
    backgroundColor: '#242760',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 15,
  },
  textoBotaoSalvar: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
