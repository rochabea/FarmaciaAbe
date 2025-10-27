import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResumoRetirada() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [produtos, setProdutos] = useState([
    { id: 1, nome: 'Aspirina', quantidade: 1, preco: 10.99, imagem: require('../assets/images/remedio.png') },
    { id: 2, nome: 'Aspirina', quantidade: 1, preco: 10.99, imagem: require('../assets/images/remedio.png') },
  ]);

  const farmaciaNome = params.farmacia ? decodeURIComponent(params.farmacia as string) : '';
  const farmaciaKm = params.km ? params.km : '0 km';

  const calcularTotal = () => {
    return produtos.reduce((total, item) => total + item.preco * item.quantidade, 0).toFixed(2);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Resumo da Retirada</Text>

        <TouchableOpacity style={styles.notification}>
          <Image source={require('../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/carA.png')} style={styles.sacolaIcon} />
        </View>
      </View>

      <View style={{ height: 80 }} />
      <View style={styles.linhaTitulo}>
        <Text style={styles.tituloEntrega}>Farmácia para retirada:</Text>
      </View>

      {/* Dados da farmácia e produtos */}
      <View style={styles.caixaFarmacia}>
        <View style={styles.farmaciaHeader}>
          <Image source={require('../assets/images/retirada.png')} style={styles.iconeFarmacia} />
          <Text style={styles.farmaciaNome}>{farmaciaNome} - {farmaciaKm}</Text>
        </View>

        {/* Retirado por */}
        <View style={styles.retiradoPorRow}>
          <Text style={styles.retiradoPorLabel}>Retirado por:</Text>
          <Text style={styles.usuarioNome}>Ana Beatriz</Text>
        </View>

        {/* Produtos */}
        <Text style={styles.produtosLabel}>Produtos:</Text>
        {produtos.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Image source={item.imagem} style={styles.itemImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.nome}</Text>
              <Text style={styles.itemQuantidade}>{item.quantidade}x</Text>
            </View>
            <Text style={styles.itemPrice}>R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Subtotal e Total */}
      <View style={styles.totalBox}>
        <Text style={styles.subtotalText}>Subtotal</Text>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalValor}>R$ {calcularTotal()}</Text>
      </View>

      {/* Botão Confirmar Retirada */}
      <TouchableOpacity 
        style={styles.continuarBtn} 
        onPress={() => {
          const subtotal = produtos.reduce((total, item) => total + item.preco * item.quantidade, 0).toFixed(2);

          router.push({
            pathname: '/opcao-pagamentoR',
            params: {
              subtotal,
              farmacia: encodeURIComponent(farmaciaNome),
              km: farmaciaKm,
            },
          });
        }}
      >
        <Text style={styles.continuarText}>Confirmar Retirada</Text>
      </TouchableOpacity>
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
    fontSize: 28,
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
  sacolaIcon: {
    width: 70,
    height: 70,
  },
  linhaTitulo: {
    width: '90%',
    marginBottom: 20,
  },
  tituloEntrega: {
    fontSize: 18,
    fontWeight: '700',
    color: '#242760',
  },
  caixaFarmacia: {
    width: '90%',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  farmaciaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconeFarmacia: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  farmaciaNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  retiradoPorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  retiradoPorLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
    marginRight: 5,
  },
  usuarioNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760', 
  },
  produtosLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  itemQuantidade: {
    fontSize: 14,
    fontWeight: '500',
    color: '#242760',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#242760',
  },
  totalBox: {
    width: '90%',
    marginBottom: 30,
  },
  subtotalText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#242760',
    marginBottom: 5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    marginBottom: 5,
  },
  totalValor: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },
  continuarBtn: {
    backgroundColor: '#242760',
    width: '90%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  continuarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
