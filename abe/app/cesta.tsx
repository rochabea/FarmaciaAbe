import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Cesta() {
  const router = useRouter();

  // Itens da cesta
  const [itens, setItens] = useState([
    { id: 1, nome: 'Aspirina', preco: 10.99, quantidade: 1, imagem: require('../assets/images/remedio.png') },
    { id: 2, nome: 'Aspirina', preco: 10.99, quantidade: 1, imagem: require('../assets/images/remedio.png') },
  ]);

  // Funções para alterar quantidade
  const aumentarQuantidade = (id: number) => {
    setItens(itens.map(item => item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item));
  };

  const diminuirQuantidade = (id: number) => {
    setItens(itens.map(item => 
      item.id === id && item.quantidade > 1 ? { ...item, quantidade: item.quantidade - 1 } : item
    ));
  };

  const removerItem = (id: number) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + item.preco * item.quantidade, 0).toFixed(2);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>Cesta</Text>

        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image source={require('../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>

        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/carA.png')} style={styles.sacolaIcon} />
        </View>
      </View>

      <View style={{ height: 80 }} />

      {/* Vendedor */}
      <View style={styles.vendedorRow}>
        <Text style={styles.vendidoPor}>Vendido por Drogasil</Text>
        <TouchableOpacity onPress={() => setItens([])}>
          <Text style={styles.removerText}>Remover</Text>
        </TouchableOpacity>
      </View>

      {/* Itens da cesta */}
      <View style={styles.cestaBox}>
        {itens.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Image source={item.imagem} style={styles.itemImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.nome}</Text>
              <View style={styles.quantidadeRow}>
                <TouchableOpacity onPress={() => diminuirQuantidade(item.id)}>
                  <Text style={styles.qtdBtn}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantidade}>{item.quantidade}x</Text>
                <TouchableOpacity onPress={() => aumentarQuantidade(item.id)}>
                  <Text style={styles.qtdBtn}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.itemPrice}>R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={styles.totalBox}>
        <Text style={styles.subtotalText}>Subtotal</Text>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalValor}>R$ {calcularTotal()}</Text>
      </View>

      {/* Botão continuar */}
      <TouchableOpacity 
        style={styles.continuarBtn} 
        onPress={() => router.push(`/forma-entrega?subtotal=${calcularTotal()}`)}
      >
        <Text style={styles.continuarText}>Continuar</Text>
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
  vendedorRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  vendidoPor: {
    fontSize: 15,
    color: '#242760',
    fontWeight: '700',
  },
  removerText: {
    color: '#000000ff',
    fontWeight: '700',
  },
  cestaBox: {
    width: '90%',
    backgroundColor: '#F4F4F7',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantidadeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  qtdBtn: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: '#242760',
    fontWeight: '700',
  },
  quantidade: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#242760',
  },
  totalBox: {
    width: '90%',
    marginTop: 10,
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
    marginTop: 20,
  },
  continuarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
