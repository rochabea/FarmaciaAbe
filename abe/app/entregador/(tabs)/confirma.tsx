import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HistoricoPedidosProtótipo() {
  const router = useRouter();

  // Pedidos de exemplo
  const pedidos = [
    {
      id: '1',
      cliente: 'Tana Nathanildia da Silva',
      endereco: 'Rua A, 123, Bairro Centro, Cidade Exemplo, Estado XYZ',
      itens: '3 itens: Remédio A, Remédio B, Remédio C',
      status: 'Entregue',
      data: '15/11/2025',
      total: 'R$ 120,00',
    },
    {
      id: '2',
      cliente: 'Carlos Eduardo Silva',
      endereco: 'Av. B, 456, Bairro Jardim, Cidade Exemplo, Estado XYZ',
      itens: '2 itens: Remédio D, Remédio E',
      status: 'Aguardando',
      data: '14/11/2025',
      total: 'R$ 80,00',
    },
    {
      id: '3',
      cliente: 'Maria Luiza Souza',
      endereco: 'Rua C, 789, Bairro Liberdade, Cidade Exemplo, Estado XYZ',
      itens: '5 itens: Remédio F, G, H, I, J',
      status: 'Cancelado',
      data: '13/11/2025',
      total: 'R$ 200,00',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregue': return '#228B22';
      case 'Aguardando': return '#242760';
      case 'Cancelado': return 'crimson';
      default: return '#666';
    }
  };

  const getEntregueColor = (status: string) => {
    if (status === 'Entregue') return '#228B22';
    if (status === 'Cancelado') return 'crimson';
    return '#242760';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../../../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.topTitleContainer}>
          <Text style={styles.topLine1}>Histórico de</Text>
          <Text style={styles.topLine2}>Entregas</Text>
        </View>

        <TouchableOpacity style={styles.notification} onPress={() => console.log('Cliquei na notificação')}>
          <Image source={require('../../../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../../../assets/images/sacolaA.png')} style={styles.sacolaIcon} />
        </View>
      </View>

      <View style={{ height: 80 }} />

      {pedidos.map((pedido) => (
        <TouchableOpacity
          key={pedido.id}
          style={styles.pedidoBox}
          onPress={() => console.log(`Clicou no pedido ${pedido.cliente}`)}
        >
          <Text style={[styles.entregueText, { color: getEntregueColor(pedido.status) }]}>
            Entregue em {pedido.data}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Status</Text>
          <Text style={[styles.infoText, { color: getStatusColor(pedido.status), fontWeight: '700' }]}>
            {pedido.status}
          </Text>

          <Text style={styles.label}>Cliente</Text>
          <Text style={[styles.infoText, styles.clienteText]}>{pedido.cliente}</Text>

          <Text style={styles.label}>Endereço</Text>
          <Text style={[styles.infoText, styles.enderecoText]}>{pedido.endereco}</Text>

          <Text style={styles.label}>Itens</Text>
          <Text style={[styles.infoText, styles.itensText]}>{pedido.itens}</Text>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.total}>{pedido.total}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', paddingBottom: 40 },

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
  topTitleContainer: { marginTop: 80, alignItems: 'center' },
  topLine1: { color: '#fff', fontSize: 28, fontWeight: '700' },
  topLine2: { color: '#fff', fontSize: 28, fontWeight: '700' },

  backButton: { position: 'absolute', left: 20, top: 98 },
  backIcon: { width: 34, height: 34 },
  notification: { position: 'absolute', right: 20, top: 92 },
  notificationIcon: { width: 34, height: 34 },
  iconCircle: { width: 144, height: 144, borderRadius: 72, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: -72, borderWidth: 3, borderColor: '#ffffffff' },
  sacolaIcon: { width: 80, height: 80 },

  // Pedido
  pedidoBox: {
    width: '90%',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entregueText: { fontWeight: '700', fontSize: 16, marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 10 },

  label: { fontWeight: '700', fontSize: 16, marginTop: 5 },
  infoText: { fontSize: 16, color: '#666', marginBottom: 5 },
  clienteText: { fontSize: 16 },
  enderecoText: { fontSize: 16 },
  itensText: { fontSize: 16 },

  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 },
  totalLabel: { fontSize: 16, fontWeight: '600', marginRight: 5 },
  total: { fontSize: 16, fontWeight: '700' },
});
