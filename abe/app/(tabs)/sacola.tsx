import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Orders() {
  const router = useRouter();

  const pedidos = [
    {
      id: '001',
      data: '14/09/2025',
      itens: [
        { nome: 'Aspirina', preco: 10.99, imagem: require('../../assets/images/remedio.png') },
        { nome: 'Paracetamol', preco: 15.50, imagem: require('../../assets/images/remedio.png') },
      ],
    },
    {
      id: '002',
      data: '12/09/2025',
      itens: [
        { nome: 'Ibuprofeno', preco: 8.99, imagem: require('../../assets/images/remedio.png') },
      ],
    },
  ];

  // Função para calcular o total do pedido
  const calcularTotal = (itens: { preco: number }[]) => {
    return itens.reduce((total, item) => total + item.preco, 0).toFixed(2);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Meus Pedidos</Text>

        <TouchableOpacity style={styles.notification}>
          <Image source={require('../../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../../assets/images/sacolaA.png')} style={styles.sacolaIcon} />
        </View>
      </View>

      {/* Espaço para que as caixas não fiquem sobre o círculo */}
      <View style={{ height: 80 }} />

      {/* Lista de pedidos */}
      {pedidos.map((pedido) => (
        <View key={pedido.id} style={styles.pedidoBox}>
          <Text style={styles.retiradoText}>Retirado em {pedido.data}</Text>
          <View style={styles.itensBox}>
            {pedido.itens.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Image source={item.imagem} style={styles.itemImage} />
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalValor}>R$ {calcularTotal(pedido.itens)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 40,
  },

  topRect: {
    width: '100%',
    height: 250, 
    backgroundColor: '#242760',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },

  topTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 90,
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: 98,
  },

  backIcon: {
    width: 25,
    height: 25,
  },

  notification: {
    position: 'absolute',
    right: 20,
    top: 92,
  },

  notificationIcon: {
    width: 25,
    height: 25,
  },

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
    borderColor: '#ffffffff',
  },

  sacolaIcon: {
    width: 80,
    height: 80,
  },

  pedidoBox: {
    width: '90%',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
  },

  retiradoText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#242760',
  },

  itensBox: {
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    paddingTop: 10,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  itemImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },

  itemName: {
    flex: 1,
    fontSize: 16,
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },

  totalText: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 5,
  },

  totalValor: {
    fontSize: 16,
    fontWeight: '700',
  },
});
