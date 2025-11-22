import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function BuscarEntregador() {
  const router = useRouter();
  const [busca, setBusca] = useState('');

type StatusPedido =
  | 'Pendente'
  | 'Finalizado'
  | 'Cancelado'
  | 'Não Aceito'
  | 'Em Rota'
  | 'Aguardando Retirada';

const corStatus: Record<StatusPedido, string> = {
  Pendente: '#E1A100',
  Finalizado: '#2B9E41',
  Cancelado: '#D63131',
  'Não Aceito': '#8A0000',
  'Em Rota': '#0066CC',
  'Aguardando Retirada': '#7B52C8',
};

const resultados: { id: string; nome: string; descricao: string; status: StatusPedido }[] = [
  { id: '1', nome: 'Pedido #123', descricao: 'Rua Almeida, 200 - Centro', status: 'Pendente' },
  { id: '2', nome: 'Pedido #456', descricao: 'Av. Brasil, 1450 - Zona Sul', status: 'Finalizado' },
  { id: '3', nome: 'Pedido #789', descricao: 'Rua Vitória, 89 - Norte', status: 'Cancelado' },
  { id: '4', nome: 'Pedido #910', descricao: 'Rua das Flores', status: 'Não Aceito' },
  { id: '5', nome: 'Pedido #245', descricao: 'Av. Santos, 2000 - Oeste', status: 'Em Rota' },
  { id: '6', nome: 'Pedido #332', descricao: 'Rua Verde, 350 - Centro', status: 'Aguardando Retirada' },
  { id: '7', nome: 'Pedido #652', descricao: 'Av. Industrial, 72 - Norte', status: 'Pendente' },
  { id: '8', nome: 'Pedido #888', descricao: 'Rua Azul, 600 - Sul', status: 'Finalizado' },
];


  return (
    <View style={estilos.container}>
      
      {/* TOPO */}
      <View style={estilos.topo}>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => router.push('/(tabs)/home_ent')}
        >
          <Image
            source={require('../../../assets/images/seta-esquerda.png')}
            style={estilos.iconeVoltar}
          />
        </TouchableOpacity>

        <Text style={estilos.titulo}>Buscar</Text>

        <View style={estilos.areaBusca}>
          <Image
            source={require('../../../assets/images/lupa.png')}
            style={estilos.iconeBusca}
          />
          <TextInput
            placeholder="Digite algo para buscar..."
            placeholderTextColor="#555"
            value={busca}
            onChangeText={setBusca}
            style={estilos.input}
          />
        </View>
      </View>

      {/* RESULTADOS */}
      <ScrollView contentContainerStyle={estilos.lista}>
        {resultados.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={estilos.card}
            onPress={() => router.push('/entregador/aceitar_pedido')}
          >
            <View style={estilos.cardLinha}>
              <Text style={estilos.cardTitulo}>{item.nome}</Text>

              <View style={[estilos.status, { backgroundColor: corStatus[item.status] }]}>
                <Text style={estilos.statusTexto}>{item.status}</Text>
              </View>
            </View>

            <Text style={estilos.cardDesc}>{item.descricao}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  topo: {
    width: '100%',
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: '#ACC852',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
  },

  botaoVoltar: {
    position: 'absolute',
    left: 20,
    top: 55,
  },
  iconeVoltar: {
    width: 32,
    height: 32,
    tintColor: '#fff',
  },

  titulo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  areaBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
  },

  iconeBusca: {
    width: 24,
    height: 24,
    tintColor: '#242760',
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },

  lista: {
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#F3F3F8',
    width: '90%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },

  cardLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#242760',
  },

  cardDesc: {
    fontSize: 16,
    color: '#444',
    marginTop: 5,
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  statusTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});
