import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { EnderecoContext } from './parametros/EnderecoContext';

export default function Entregas() {
  const params = useLocalSearchParams();
  const subtotalValor = params.subtotal ? parseFloat(params.subtotal as string) : 0;
  const router = useRouter();
  const { enderecos, loading } = useContext(EnderecoContext);
  const [localSelecionado, setLocalSelecionado] = useState<string | number | null>(null);


  return (
    <View style={styles.container}>
      {/* Topo azul */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Entregas</Text>
        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image source={require('../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>
        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/carA.png')} style={styles.cartIcon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Cabeçalho com ícone e texto */}
        <View style={styles.headerRow}>
          <Image source={require('../assets/images/entrega.png')} style={styles.entregaIcon} />
          <View style={{flex: 1}}>
            <Text style={styles.headerText}>Em qual local deseja receber seu</Text>
            <Text style={styles.headerText}>pedido?</Text>
          </View>
        </View>

        {/* Lista de endereços */}
        {loading ? (
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
            <View
              key={e.id}
              style={[
                styles.localizacaoBox,
                localSelecionado === e.id && styles.localSelecionado,
              ]}
            >
              <View>
                <Text style={styles.nomeLocalizacao}>
                  {e.logradouro} - {e.numero}
                </Text>
                <Text style={styles.infoLocalizacao}>
                  {e.cep} - {e.cidade}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setLocalSelecionado(e.id);
                  router.push({
                    pathname: '/confirme-add',
                    params: {
                      endereco: JSON.stringify(e),
                      subtotal: subtotalValor.toString(),
                    },
                  });
                }}
              >
                <Text style={styles.selecionarText}>Selecionar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}


        {/* Botões inferiores */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity 
            style={styles.accentBtn} 
            onPress={() => router.push({
              pathname: '/add-endereco',
              params: {
                subtotal: subtotalValor.toString(),
              },
            })}
          >
            <Text style={styles.accentBtnText}>Adicionar Endereço</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accentBtn} onPress={() => router.push('/home')}>
            <Text style={styles.accentBtnText}>Voltar à tela Inicial</Text>
          </TouchableOpacity>
        </View>
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
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    zIndex: 100, 

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
    width: 34,
    height: 34,
  },

  topTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    top: 50,
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
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },

  scrollContainer: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  entregaIcon: {
    width: 71,
    height: 71,
    marginRight: 10,
  },

  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
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

  localSelecionado: {
    borderWidth: 2,
    borderColor: '#242760',
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

  selecionarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },

  bottomButtons: {
    marginTop: 20,
    paddingBottom: 20,
  },

  accentBtn: {
    backgroundColor: '#242760',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },

  accentBtnText: {
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
