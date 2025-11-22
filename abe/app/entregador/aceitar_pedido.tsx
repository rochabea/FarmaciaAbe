import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function AceitarPedido() {
  const router = useRouter();

  const handleAceitar = () => {
    router.push('/entregador/rota_entrega');
  };

  const handleRecusar = () => {
    router.back();
  };

  return (
    <ScrollView style={estilos.container} contentContainerStyle={{ alignItems: 'center' }}>
      
      {/* TOPO */}
      <View style={estilos.topo}>
        <TouchableOpacity style={estilos.botaoVoltar} onPress={() => router.back()}>
          <Image
            source={require('../../assets/images/seta-esquerda.png')}
            style={estilos.iconeVoltar}
          />
        </TouchableOpacity>

        <Text style={estilos.tituloTopo}>Novo Pedido</Text>

        <View style={estilos.circuloIcone}>
          <Image
            source={require('../../assets/images/aceitar.png')}
            style={estilos.iconeCentral}
          />
        </View>
      </View>

      {/* INFORMAÇÕES DO PEDIDO */}
      <View style={estilos.cardPedido}>
        <Text style={estilos.tituloCard}>Informações do Pedido</Text>

        <Text style={estilos.item}>• Cliente: <Text style={estilos.destaque}>Maria Silva</Text></Text>
        <Text style={estilos.item}>• Retirada: <Text style={estilos.destaque}>Rua A, nº 120</Text></Text>
        <Text style={estilos.item}>• Entrega: <Text style={estilos.destaque}>Av. Central, nº 450</Text></Text>
        <Text style={estilos.item}>• Pagamento: <Text style={estilos.destaque}>Cartão</Text></Text>
        <Text style={estilos.item}>• Valor: <Text style={estilos.destaque}>R$ 12,00</Text></Text>
        <Text style={estilos.item}>• Distância: <Text style={estilos.destaque}>4,2 km</Text></Text>
        <Text style={estilos.item}>• Tempo estimado: <Text style={estilos.destaque}>12 minutos</Text></Text>
      </View>

      {/* BOTÕES */}
      <View style={estilos.botoesLinha}>
        <TouchableOpacity style={estilos.botaoRecusar} onPress={handleRecusar}>
          <Text style={estilos.textoBotao}>Recusar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botaoAceitar} onPress={handleAceitar}>
          <Text style={estilos.textoBotao}>Aceitar Pedido</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  topo: {
    width: '100%',
    height: 200,
    backgroundColor: '#ACC852',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    position: 'relative',
  },
  tituloTopo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 35,
  },

  botaoVoltar: {
    position: 'absolute',
    left: 20,
    top: 70,
  },
  iconeVoltar: {
    width: 34,
    height: 34,
    tintColor: '#fff',
  },

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
  iconeCentral: {
    width: 81,
    height: 81,
    resizeMode: 'contain',
    tintColor: '#242760',
  },

  cardPedido: {
    width: '85%',
    backgroundColor: '#F6F6F9',
    borderRadius: 12,
    padding: 20,
    marginTop: 80,
  },
  tituloCard: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#242760',
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
    fontWeight: '500',
  },
  destaque: {
    fontWeight: '700',
    color: '#333',
  },

  botoesLinha: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 30,
  },

  botaoRecusar: {
    width: 130,
    height: 45,
    backgroundColor: '#B84C4C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoAceitar: {
    width: 160,
    height: 45,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
});
