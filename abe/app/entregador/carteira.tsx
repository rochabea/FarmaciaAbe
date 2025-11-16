import React, { useState } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Image,ScrollView,Modal,TextInput,Alert,} from 'react-native';
import { useRouter } from 'expo-router';

export default function Carteira() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [pixChave, setPixChave] = useState('');

  const saldoAtual = 245.75;
  const totalDoDia = 120.50;
  const totalRecebido = 1020.25;
  const transacoes = [
    { id: 1, descricao: 'Entrega 12345', valor: 25.0, tipo: 'entrada' },
    { id: 2, descricao: 'Entrega 12346', valor: 30.5, tipo: 'entrada' },
    { id: 3, descricao: 'Saque realizado', valor: 50.0, tipo: 'saida' },
    { id: 4, descricao: 'Entrega 12347', valor: 15.0, tipo: 'entrada' },
  ];

  const confirmarSaque = () => {
    if (!pixChave) {
      Alert.alert('Erro', 'Digite a chave PIX para continuar.');
      return;
    }
    setModalVisible(false);
    setPixChave('');
    Alert.alert('Sucesso', 'Transação realizada com sucesso!');
  };

  return (
    <View style={styles.container}>
      {/* TOPO */}
      <View style={styles.topo}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
          <Image
            source={require('../../assets/images/seta-esquerda.png')}
            style={styles.iconeVoltar}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoNotificacao} onPress={() => router.push('/notificacao')}>
          <Image
            source={require('../../assets/images/notificacao.png')}
            style={styles.iconeNotificacao}
          />
        </TouchableOpacity>

        <Text style={styles.tituloTopo}>Carteira</Text>

        <View style={styles.circuloIcone}>
          <Image
            source={require('../../assets/images/cartaoA.png')}
            style={styles.iconeCentral}
          />
        </View>
      </View>

      {/* CONTEÚDO */}
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.cardSaldo}>
          <Text style={styles.labelCard}>Saldo Atual</Text>
          <Text style={styles.valorCard}>R$ {saldoAtual.toFixed(2)}</Text>
          <TouchableOpacity style={styles.botaoSaque} onPress={() => setModalVisible(true)}>
            <Text style={styles.textoBotaoSaque}>Sacar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardDetalhes}>
          <Text style={styles.labelDetalhe}>Total arrecadado hoje:</Text>
          <Text style={styles.valorDetalhe}>R$ {totalDoDia.toFixed(2)}</Text>

          <Text style={styles.labelDetalhe}>Total Recebido:</Text>
          <Text style={styles.valorDetalhe}>R$ {totalRecebido.toFixed(2)}</Text>
        </View>

        <View style={styles.cardTransacoes}>
          <Text style={styles.tituloTransacoes}>Últimas Transações</Text>
          {transacoes.map((t) => (
            <View key={t.id} style={styles.linhaTransacao}>
              <Text style={styles.descricaoTransacao}>{t.descricao}</Text>
              <Text
                style={[
                  styles.valorTransacao,
                  { color: t.tipo === 'entrada' ? '#6BCB77' : '#FF6B6B' },
                ]}
              >
                {t.tipo === 'entrada' ? '+' : '-'} R$ {t.valor.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.rodape}>
          Você pode acompanhar seu saldo atualizado após cada entrega. Lembre-se de realizar saques regularmente.
        </Text>
      </ScrollView>

      {/* MODAL DE SAQUE */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Saque</Text>
            <Text style={styles.modalLabel}>Digite sua chave PIX:</Text>
            <TextInput
              style={styles.modalInput}
              value={pixChave}
              onChangeText={setPixChave}
              placeholder="Ex: CPF, e-mail ou celular"
              placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.modalBotao} onPress={confirmarSaque}>
              <Text style={styles.modalBotaoTexto}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBotao, { backgroundColor: '#ccc', marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalBotaoTexto, { color: '#000' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topo: {
    width: '100%',
    height: 220,
    backgroundColor: '#ACC852',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingTop: 40,
  },
  tituloTopo: { color: '#fff', fontSize: 30, fontWeight: '700', marginTop: 30 },
  botaoVoltar: { position: 'absolute', left: 20, top: 70 },
  iconeVoltar: { width: 30, height: 30, tintColor: '#fff' }, 
  botaoNotificacao: { position: 'absolute', right: 20, top: 70 },
  iconeNotificacao: { width: 30, height: 30, tintColor: '#fff' },

  circuloIcone: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  iconeCentral: { width: 81, height: 81, resizeMode: 'contain', tintColor: '#242760' },

  conteudo: { paddingTop: 80, paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center' },

  cardSaldo: {
    width: '100%',
    backgroundColor: '#F4F4F4',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  labelCard: { fontSize: 16, fontWeight: '700', color: '#544C4C', marginBottom: 5 },
  valorCard: { fontSize: 28, fontWeight: '700', color: '#242760', marginBottom: 10 },
  botaoSaque: {
    backgroundColor: '#242760',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  textoBotaoSaque: { color: '#fff', fontSize: 16, fontWeight: '700' },

  cardDetalhes: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  labelDetalhe: { fontSize: 15, fontWeight: '700', color: '#544C4C', marginTop: 10 },
  valorDetalhe: { fontSize: 18, fontWeight: '700', color: '#242760', marginTop: 2 },

  cardTransacoes: {
    width: '100%',
    backgroundColor: '#F4F4F4',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  tituloTransacoes: { fontSize: 18, fontWeight: '700', color: '#242760', marginBottom: 10 },
  linhaTransacao: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  descricaoTransacao: { fontSize: 15, color: '#544C4C', fontWeight: '600' },
  valorTransacao: { fontSize: 15, fontWeight: '700' },

  rodape: { fontSize: 13, color: '#544C4C', fontStyle: 'italic', textAlign: 'left', marginTop: 10 },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitulo: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#242760', textAlign: 'center' },
  modalLabel: { fontSize: 14, fontWeight: '700', color: '#544C4C', marginBottom: 5 },
  modalInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#000',
  },
  modalBotao: { backgroundColor: '#ACC852', padding: 12, borderRadius: 10, alignItems: 'center' },
  modalBotaoTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
