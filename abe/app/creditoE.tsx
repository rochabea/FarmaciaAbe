import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CartaoContext } from './parametros/CartaoContext';
import { createOrder } from '../lib/orders';
import { useCart } from './context/CartContext';

type Cartao = {
  id: string | number;
  nome: string;
  numero: string;
  codigo?: string;
  vencimento?: string;
  bandeira?: string;
};

export default function Credito() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cartoes } = useContext(CartaoContext);
  const { refresh } = useCart();
  const [cartaoSelecionado, setCartaoSelecionado] = useState<string | number | null>(null);
  const [subtotalValor, setSubtotalValor] = useState(0);
  const [freteValor, setFreteValor] = useState(0);

  useEffect(() => {
    if (params?.subtotal) {
      const valorConvertido = parseFloat(String(params.subtotal));
      if (!isNaN(valorConvertido)) {
        setSubtotalValor(valorConvertido);
      }
    }
    if (params?.frete) {
      const freteConvertido = parseFloat(String(params.frete));
      if (!isNaN(freteConvertido)) {
        setFreteValor(freteConvertido);
      }
    }
  }, [params]);

  const totalComFrete = subtotalValor + freteValor;

  const escolherCartao = async (cartao: Cartao) => {
    // marca qual card está carregando
    setLoadingEscolha(cartao.id);
    setCartaoSelecionado(cartao.id);

    try {
      const totalCents = Math.round(totalComFrete * 100);

      await createOrder(totalCents, 'entrega');
      await refresh();

      router.push('/compra-realizadaE');
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      alert(`Erro ao finalizar pedido: ${error.message || 'Erro desconhecido'}`);
    } finally {
      // garante que mesmo com erro o loading some
      setLoadingEscolha(null);
    }
  };


  const [loadingEscolha, setLoadingEscolha] = useState<string | number | null>(null);


  return (
    <View style={styles.container}>
      {/* Topo */}
      <View style={styles.topRect}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('../assets/images/seta-esquerda.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Cartões</Text>
        <TouchableOpacity style={styles.notification} onPress={() => router.push("/notificacao")}>
          <Image source={require('../assets/images/notificacaoB.png')} style={styles.notificationIcon} />
        </TouchableOpacity>
        <View style={styles.iconCircle}>
          <Image source={require('../assets/images/carA.png')} style={styles.cartIcon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Resumo do Pedido */}
        <View style={styles.resumoBox}>
          <Text style={styles.resumoTitle}>Resumo do Pedido</Text>
          <Text style={styles.resumoText}>Subtotal: R$ {subtotalValor.toFixed(2)}</Text>
          {freteValor > 0 && (
            <Text style={styles.resumoText}>Frete: R$ {freteValor.toFixed(2)}</Text>
          )}
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>R$ {totalComFrete.toFixed(2)}</Text>
          </View>
        </View>

        {cartoes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Você ainda não possui cartões cadastrados.
            </Text>
            <Text style={styles.emptySubtext}>
              Adicione um cartão para continuar com o pagamento.
            </Text>
          </View>
        ) : (
          cartoes.map((cartao: Cartao) => (
          <View key={cartao.id} style={[styles.cartaoBox, cartaoSelecionado === cartao.id && styles.cartaoSelecionado]}>
            <View>
              <Text style={styles.nomeCartao}>{cartao.nome}</Text>
              <Text style={styles.numeroCartao}>{cartao.numero}</Text>
            </View>
            <TouchableOpacity
              style={styles.btnEscolher}
              onPress={() => escolherCartao(cartao)}
              disabled={loadingEscolha === cartao.id}
            >
              {loadingEscolha === cartao.id ? (
                <Image
                  source={require('../assets/images/loading.gif')}
                  style={{ width: 28, height: 28 }}
                />
              ) : (
                <Text style={styles.escolherText}>Escolher</Text>
              )}
            </TouchableOpacity>

          </View>
          ))
        )}

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

  resumoBox: {
    backgroundColor: '#E9E9F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  resumoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#242760',
    marginBottom: 10,
  },
  resumoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#242760',
    marginBottom: 5,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#242760',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#242760',
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

  btnEscolher: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  backgroundColor: '#fff',
  borderRadius: 8,
},

});
