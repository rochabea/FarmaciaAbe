import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { CartaoContext } from './parametros/CartaoContext';

type Cartao = {
  id: number;
  nome: string;
  numero: string;
  codigo?: string;
  vencimento?: string;
  bandeira?: string;
};

export default function Credito() {
  const router = useRouter();
  const { cartoes } = useContext(CartaoContext);
  const [cartaoSelecionado, setCartaoSelecionado] = useState<number | null>(null);

  const escolherCartao = (cartao: Cartao) => {
    setCartaoSelecionado(cartao.id);
    router.push('/compra-realizadaR'); 
  };

  return (
    <View style={styles.container}>
      {/* Topo */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Cartões</Text>
        <TouchableOpacity style={styles.notification}>
          <Image source={require('../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>
        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/carA.png')} style={styles.cartIcon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cartoes.map((cartao: Cartao) => (
          <View key={cartao.id} style={[styles.cartaoBox, cartaoSelecionado === cartao.id && styles.cartaoSelecionado]}>
            <View>
              <Text style={styles.nomeCartao}>{cartao.nome}</Text>
              <Text style={styles.numeroCartao}>{cartao.numero}</Text>
            </View>
            <TouchableOpacity onPress={() => escolherCartao(cartao)}>
              <Text style={styles.escolherText}>Escolher</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.adicionarBtn} onPress={() => router.push('/novo-cartao')}>
          <Text style={styles.adicionarText}>Adicionar Cartão</Text>
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

  cartaoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E9E9F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },

  cartaoSelecionado: {
    borderWidth: 2,
    borderColor: '#242760',
  },

  nomeCartao: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242760',
  },

  numeroCartao: {
    fontSize: 14,
    fontWeight: '500',
    color: '#242760',
    marginTop: 5,
  },

  escolherText: {
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
});

