import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { EnderecoContext } from './parametros/EnderecoContext';

export default function Localizacoes() {
  const router = useRouter();
  const { enderecos, loading, removerEndereco } = useContext(EnderecoContext);
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  const handleRemover = async (id: string | number) => {
    try {
      setRemovingId(id);
      await removerEndereco(String(id));
      Alert.alert('Sucesso', 'Endereço removido com sucesso!');
    } catch (error: any) {
      console.error('Erro ao remover endereço:', error);
      Alert.alert('Erro', error.message || 'Não foi possível remover o endereço');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image
            source={require('../assets/images/seta-esquerda.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Localizações</Text>
        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image
            source={require('../assets/images/notificacaoB.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
        <View style={styles.iconCircle}>
          <Image
            source={require('../assets/images/local (2).png')}
            style={styles.cartIcon}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading && enderecos.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#242760" />
            <Text style={{ marginTop: 10, color: '#666' }}>Carregando endereços...</Text>
          </View>
        ) : enderecos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Você ainda não possui endereços cadastrados.
            </Text>
            <Text style={styles.emptySubtext}>
              Adicione um endereço para receber seus pedidos.
            </Text>
          </View>
        ) : (
          enderecos.map((e) => (
            <View key={e.id} style={styles.localizacaoBox}>
              <View>
                <Text style={styles.nomeLocalizacao}>
                  {e.logradouro} - {e.numero}
                </Text>
                <Text style={styles.infoLocalizacao}>
                  {e.cep} - {e.cidade}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleRemover(e.id)}
                disabled={removingId === e.id}
                style={removingId === e.id && { opacity: 0.6 }}
              >
                <Text style={styles.removerText}>
                  {removingId === e.id ? 'Removendo...' : 'Remover'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.adicionarBtn}
          onPress={() => router.push('/add-endereco')}
        >
          <Text style={styles.adicionarText}>Adicionar Endereço</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topRect: {
    width: '100%',
    height: 180,
    backgroundColor: '#242760',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingTop: 50,
  },
  topTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  notification: {
    position: 'absolute',
    right: 20,
    top: 50,
  },
  notificationIcon: {
    width: 25,
    height: 25,
  },
  iconCircle: {
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
  cartIcon: {
    width: 81,
    height: 81,
    resizeMode: 'contain',
  },
  scrollContainer: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  localizacaoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E9E9F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  nomeLocalizacao: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
  },
  infoLocalizacao: {
    fontSize: 14,
    fontWeight: '500',
    color: '#242760',
    marginTop: 5,
  },
  removerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  adicionarBtn: {
    backgroundColor: '#242760',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  adicionarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#242760',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
